from llama_index.core import (
    VectorStoreIndex,
    Document,
    Settings,
    QueryBundle,
)
from llama_index.core.tools import QueryEngineTool
from llama_index.core.base.base_query_engine import BaseQueryEngine
from llama_index.core.question_gen.types import BaseQuestionGenerator, SubQuestion
from llama_index.core.callbacks import CallbackManager
from llama_index.core.question_gen import LLMQuestionGenerator
from llama_index.core.response_synthesizers import get_response_synthesizer
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.response_synthesizers import (
    BaseSynthesizer,
    get_response_synthesizer,)
from llama_index.core.workflow import Workflow, StartEvent, StopEvent, step, Event
from typing import List, Dict, Any, Optional, Sequence
import json
from pydantic import BaseModel, Field
from app.models.consulting import Segment, Problem
import os
from llama_deploy import LlamaDeployClient, ControlPlaneConfig
import numpy as np

class SegmentOutput(BaseModel):
    key_findings: List[str] = Field(..., description="Main insights or discoveries from this segment")
    relevant_data: Dict[str, Any] = Field(..., description="Structured data relevant to the segment's analysis")
    next_steps: List[str] = Field(..., description="Suggested actions or areas to explore next")
    confidence_score: float = Field(..., ge=0, le=1, description="Confidence level in the segment's analysis")
    critical_assumptions: List[str] = Field(..., description="Critical assumptions made during the analysis")
    required_data: List[str] = Field(..., description="Data required to validate or refine the analysis")
    external_review_required: bool = Field(..., description="Whether external review is required for this segment")

class AnalysisStep(BaseModel):
    query: str
    response: str
    structured_output: SegmentOutput

class MetaAnalysis(BaseModel):
    coherence_score: float = Field(..., ge=0, le=1, description="Score for overall coherence of the analysis")
    consistency_score: float = Field(..., ge=0, le=1, description="Score for consistency between segments")
    quality_score: float = Field(..., ge=0, le=1, description="Overall quality score of the analysis")
    improvement_suggestions: List[str] = Field(..., description="Suggestions for improving the analysis")
    critical_path: List[str] = Field(..., description="Identified critical path activities")

class ContextManager:
    def __init__(self, service_context):
        self.service_context = service_context
        self.memory_index = VectorStoreIndex([], service_context=service_context)
        self.running_summary = ""

    def update_context(self, segment_output: SegmentOutput):
        summary_prompt = f"Current summary: {self.running_summary}\n\nNew information: {segment_output.json()}\n\nProvide an updated summary incorporating the new information:"
        self.running_summary = self.service_context.llm.complete(summary_prompt)

        for finding in segment_output.key_findings:
            self.memory_index.insert(Document(text=finding))

    def get_relevant_context(self, query: str) -> str:
        relevant_docs = self.memory_index.as_query_engine().query(query)
        return f"Running summary: {self.running_summary}\n\nRelevant past findings: {relevant_docs}"

class SubQuestionQueryEngine(BaseQueryEngine):
    """Sub question query engine.

    A query engine that breaks down a complex query (e.g. compare and contrast) into
        many sub questions and their target query engine for execution.
        After executing all sub questions, all responses are gathered and sent to
        response synthesizer to produce the final response.

    Args:
        question_gen (BaseQuestionGenerator): A module for generating sub questions
            given a complex question and tools.
        response_synthesizer (BaseSynthesizer): A response synthesizer for
            generating the final response
        query_engine_tools (Sequence[QueryEngineTool]): Tools to answer the
            sub questions.
        verbose (bool): whether to print intermediate questions and answers.
            Defaults to True
        use_async (bool): whether to execute the sub questions with asyncio.
            Defaults to True
    """

    def __init__(
        self,
        question_gen: BaseQuestionGenerator,
        response_synthesizer: BaseSynthesizer,
        query_engine_tools: Sequence[QueryEngineTool],
        callback_manager: Optional[CallbackManager] = None,
        verbose: bool = True,
        use_async: bool = False,
    ) -> None:
        self._question_gen = question_gen
        self._response_synthesizer = response_synthesizer
        self._metadatas = [x.metadata for x in query_engine_tools]
        self._query_engines = {
            tool.metadata.name: tool.query_engine for tool in query_engine_tools
        }
        self._verbose = verbose
        self._use_async = use_async
        super().__init__(callback_manager)

    # ... (implement other methods as needed)

class ConsultingWorkflow(Workflow):
    def __init__(self, problem: Problem):
        super().__init__()
        self.problem = problem
        self.llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"), model="gpt-4", temperature=0.7)
        self.embed_model = OpenAIEmbedding()
        self.context_manager = ContextManager(Settings)

    async def setup_engines(self):
        Settings.llm = self.llm
        Settings.embed_model = self.embed_model
        Settings.callback_manager = CallbackManager([])

        self.index = self._create_index()

        self.query_engine_tools = [
            QueryEngineTool.from_defaults(
                query_engine=self.index.as_query_engine(),
                name="problem_context",
                description="Provides context about the consulting problem"
            ),
        ]

        self.question_generator = LLMQuestionGenerator.from_defaults()
        self.response_synthesizer = get_response_synthesizer(response_mode="compact")

        self.sub_question_engine = SubQuestionQueryEngine(
            question_gen=self.question_generator,
            response_synthesizer=self.response_synthesizer,
            query_engine_tools=self.query_engine_tools,
            verbose=True,
            use_async=True
        )

    def _create_index(self):
        documents = [Document(text=self.problem.description)]
        for review in self.problem.literature_reviews:
            documents.append(Document(text=f"Literature Review: {review.title}\n\n{review.content}"))
        return VectorStoreIndex.from_documents(documents)

    @step()
    async def generate_sub_questions(self, ev: Event) -> Dict[str, Any]:
        query_str = ev.payload.get("query")
        query_bundle = QueryBundle(query_str)
        response = await self.sub_question_engine.aquery(query_bundle)
        return {"response": response, "query": query_str}

    @step()
    async def process_sub_questions(self, ev: Event) -> Dict[str, Any]:
        response = ev.payload["response"]
        structured_steps = []
        for sq in response.source_nodes:
            structured_output = await self.generate_structured_output_async(sq.node.text)
            step = AnalysisStep(
                query=sq.node.text.split("\n")[0].replace("Sub question: ", ""),
                response=sq.node.text.split("\n")[1].replace("Response: ", ""),
                structured_output=structured_output
            )
            structured_steps.append(step)
            self.context_manager.update_context(structured_output)
        return {"structured_steps": structured_steps, "final_response": str(response)}

    @step()
    def perform_meta_analysis(self, ev: Event) -> Dict[str, Any]:
        structured_steps = ev.payload["structured_steps"]
        final_response = ev.payload["final_response"]
        meta_analysis = self.perform_meta_analysis_internal(structured_steps, final_response)
        return {
            "steps": [step.dict() for step in structured_steps],
            "final_response": final_response,
            "meta_analysis": meta_analysis.dict()
        }

    async def generate_structured_output_async(self, response: str) -> SegmentOutput:
        try:
            prompt = f"""
            Based on the following analysis response, generate a structured output:
            {response}

            The output should be in JSON format and include the following fields:
            - key_findings: List of main insights or discoveries
            - relevant_data: Structured data relevant to the segment's analysis
            - next_steps: Suggested actions or areas to explore next
            - confidence_score: Confidence level in the segment's analysis (0 to 1)
            - critical_assumptions: List of critical assumptions made during the analysis
            - required_data: List of data required to validate or refine the analysis
            - external_review_required: Whether external review is required for this segment (true/false)
            """
            structured_output_str = await self.llm.acomplete(prompt)
            return SegmentOutput.parse_raw(structured_output_str)
        except Exception as e:
            raise ValueError(f"Failed to generate structured output: {e}")

    def perform_meta_analysis_internal(self, steps: List[AnalysisStep], final_response: str) -> MetaAnalysis:
        prompt = f"""
        Evaluate the following multi-step analysis for coherence, consistency, and overall quality.
        Provide scores between 0 and 1 for each aspect, suggest improvements, and identify the critical path activities.

        Steps:
        {json.dumps([step.dict() for step in steps], indent=2)}

        Final Response:
        {final_response}

        Output your evaluation as a JSON object matching the MetaAnalysis schema.
        """
        meta_analysis_str = self.llm.complete(prompt)
        return MetaAnalysis.parse_raw(meta_analysis_str)

async def run_consulting_workflow(problem: Problem, query: str):
    client = LlamaDeployClient(ControlPlaneConfig())
    session = client.create_session()
    workflow = ConsultingWorkflow(problem)
    await workflow.setup_engines()  # Ensure engines are set up
    result = await session.arun(workflow, query=query)
    return result

# This function can be called from your API endpoint
async def analyze_problem(problem: Problem, query: str):
    return await run_consulting_workflow(problem, query)