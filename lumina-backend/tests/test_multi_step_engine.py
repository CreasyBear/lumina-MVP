import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.ai.multi_step_engine import (
    ConsultingWorkflow,
    Problem,
    SegmentOutput,
    AnalysisStep,
    MetaAnalysis,
    Event,
    SubQuestionQueryEngine
)
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core import VectorStoreIndex, Document

class Event:
    def __init__(self, payload):
        self.payload = payload

@pytest.fixture
def mock_problem():
    return Problem(id=1, title="Test Problem", description="This is a test problem", client="Test Client", status="New")

@pytest.fixture
async def consulting_workflow(mock_problem):
    with patch('app.ai.multi_step_engine.OpenAI') as mock_llm, \
         patch('app.ai.multi_step_engine.OpenAIEmbedding') as mock_embed_model, \
         patch('app.ai.multi_step_engine.VectorStoreIndex') as mock_vector_store_index:

        mock_llm.return_value = AsyncMock()
        mock_embed_model.return_value = AsyncMock()
        mock_vector_store_index.from_documents.return_value = MagicMock()

        workflow = ConsultingWorkflow(mock_problem)
        workflow.setup_engines = AsyncMock()  # Mock the setup_engines method
        await workflow.setup_engines()

        return workflow

@pytest.mark.asyncio
async def test_consulting_workflow_initialization(consulting_workflow, mock_problem):
    assert consulting_workflow.problem.id == mock_problem.id
    assert consulting_workflow.problem.title == mock_problem.title
    assert isinstance(consulting_workflow.llm, AsyncMock)
    assert isinstance(consulting_workflow.embed_model, AsyncMock)

@pytest.mark.asyncio
@patch.object(SubQuestionQueryEngine, 'aquery', new_callable=AsyncMock)
async def test_generate_sub_questions(mock_aquery, consulting_workflow):
    mock_response = MagicMock(
        source_nodes=[
            MagicMock(
                node=MagicMock(
                    text="Sub question: Test\nResponse: Test response"
                )
            )
        ]
    )
    mock_aquery.return_value = mock_response

    event = Event(payload={"query": "Test query"})
    result = await consulting_workflow.generate_sub_questions(event)

    assert isinstance(result, dict)
    assert "response" in result
    assert "query" in result
    assert result["query"] == "Test query"
    assert result["response"] == mock_response

@pytest.mark.asyncio
@patch.object(SubQuestionQueryEngine, 'aquery', new_callable=AsyncMock)
async def test_generate_sub_questions_error(mock_aquery, consulting_workflow):
    mock_aquery.side_effect = Exception("Test error")

    event = Event(payload={"query": "Test query"})
    with pytest.raises(Exception, match="Test error"):
        await consulting_workflow.generate_sub_questions(event)

@pytest.mark.asyncio
@patch.object(ConsultingWorkflow, 'generate_structured_output_async', new_callable=AsyncMock)
async def test_process_sub_questions(mock_generate_structured_output_async, consulting_workflow):
    mock_segment_output = SegmentOutput(
        key_findings=["Test finding"],
        relevant_data={"key": "value"},
        next_steps=["Test step"],
        confidence_score=0.8,
        critical_assumptions=["Test assumption"],
        required_data=["Test data"],
        external_review_required=False
    )

    mock_generate_structured_output_async.return_value = mock_segment_output
    consulting_workflow.context_manager = MagicMock()  # Mock the context manager

    mock_response = MagicMock(
        source_nodes=[
            MagicMock(
                node=MagicMock(
                    text="Sub question: Test\nResponse: Test response"
                )
            )
        ]
    )

    event = Event(payload={"response": mock_response})
    result = await consulting_workflow.process_sub_questions(event)

    assert isinstance(result, dict)
    assert "structured_steps" in result
    assert isinstance(result["structured_steps"], list)
    assert len(result["structured_steps"]) == 1
    assert "final_response" in result

@pytest.mark.asyncio
async def test_generate_structured_output_async_success(consulting_workflow):
    response = "Optimize routes and use multi-modal transportation to reduce costs."

    with patch.object(consulting_workflow.llm, 'acomplete', new_callable=AsyncMock) as mock_acomplete:
        mock_acomplete.return_value.text = '{"key_findings": ["Test finding"], "next_steps": ["Test step"], "confidence_score": 0.8}'
        result = await consulting_workflow.generate_structured_output_async(response)

    assert isinstance(result, SegmentOutput)
    assert len(result.key_findings) > 0
    assert len(result.next_steps) > 0
    assert result.confidence_score > 0

@pytest.mark.asyncio
async def test_meta_analysis_success(consulting_workflow):
    steps = [
        AnalysisStep(
            query="How to reduce transportation costs?",
            response="Optimize routes and use multi-modal transportation.",
            structured_output=SegmentOutput(
                key_findings=["Route optimization can significantly reduce costs"],
                next_steps=["Implement route optimization software"],
                confidence_score=0.8,
                relevant_data={},
                critical_assumptions=[],
                required_data=[],
                external_review_required=False
            )
        )
    ]

    with patch.object(consulting_workflow.llm, 'acomplete', new_callable=AsyncMock) as mock_acomplete:
        mock_acomplete.return_value.text = '{"coherence_score": 0.9, "consistency_score": 0.8, "quality_score": 0.85, "improvement_suggestions": ["Test suggestion"], "critical_path": ["Test critical step"]}'
        result = await consulting_workflow.meta_analysis(steps)

    assert isinstance(result, MetaAnalysis)
    assert result.coherence_score > 0
    assert result.consistency_score > 0
    assert result.quality_score > 0
    assert len(result.improvement_suggestions) > 0
    assert len(result.critical_path) > 0

# Add more tests for other methods as needed
