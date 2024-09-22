import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from app.ai.multi_step_engine import ConsultingWorkflow, Problem, SegmentOutput, AnalysisStep, MetaAnalysis
from llama_index.core import Document, VectorStoreIndex, QueryBundle

@pytest.fixture
def mock_problem():
    return Problem(id=1, title="Test Problem", description="This is a test problem", client="Test Client", status="New")

@pytest.fixture
def mock_llm():
    with patch('app.ai.multi_step_engine.OpenAI') as mock:
        yield mock.return_value

@pytest.fixture
def mock_embed_model():
    with patch('app.ai.multi_step_engine.OpenAIEmbedding') as mock:
        yield mock.return_value

@pytest.fixture
def mock_vector_store_index():
    with patch('app.ai.multi_step_engine.VectorStoreIndex') as mock:
        mock_index = MagicMock()
        mock.from_documents.return_value = mock_index
        yield mock_index

@pytest.mark.asyncio
async def test_consulting_workflow_initialization(mock_problem, mock_llm, mock_embed_model, mock_vector_store_index):
    workflow = ConsultingWorkflow(mock_problem)

    assert workflow.problem == mock_problem
    assert isinstance(workflow.llm, MagicMock)
    assert isinstance(workflow.embed_model, MagicMock)
    assert isinstance(workflow.index, MagicMock)

@pytest.mark.asyncio
async def test_generate_sub_questions(mock_problem, mock_llm, mock_embed_model, mock_vector_store_index):
    workflow = ConsultingWorkflow(mock_problem)

    mock_response = MagicMock()
    workflow.sub_question_engine.aquery = MagicMock(return_value=mock_response)

    result = await workflow.generate_sub_questions({"query": "Test query"})

    assert result == {"response": mock_response, "query": "Test query"}
    workflow.sub_question_engine.aquery.assert_called_once_with(QueryBundle("Test query"))

# Add more tests for process_sub_questions and perform_meta_analysis steps

@pytest.mark.asyncio
async def test_process_sub_questions(mock_problem, mock_llm, mock_embed_model, mock_vector_store_index):
    workflow = ConsultingWorkflow(mock_problem)

    mock_response = MagicMock()
    mock_response.source_nodes = [
        MagicMock(node=MagicMock(text="Sub question: Test\nResponse: Test response"))
    ]

    workflow.generate_structured_output_async = AsyncMock(return_value=SegmentOutput(
        key_findings=["Test finding"],
        relevant_data={},
        next_steps=["Test step"],
        confidence_score=0.8,
        critical_assumptions=["Test assumption"],
        required_data=["Test data"],
        external_review_required=False
    ))

    result = await workflow.process_sub_questions({"response": mock_response})

    assert "structured_steps" in result
    assert "final_response" in result
    assert len(result["structured_steps"]) == 1
    assert isinstance(result["structured_steps"][0], AnalysisStep)

@pytest.mark.asyncio
async def test_perform_meta_analysis(mock_problem, mock_llm, mock_embed_model, mock_vector_store_index):
    workflow = ConsultingWorkflow(mock_problem)

    mock_steps = [
        AnalysisStep(
            query="Test query",
            response="Test response",
            structured_output=SegmentOutput(
                key_findings=["Test finding"],
                relevant_data={},
                next_steps=["Test step"],
                confidence_score=0.8,
                critical_assumptions=["Test assumption"],
                required_data=["Test data"],
                external_review_required=False
            )
        )
    ]

    workflow.perform_meta_analysis_internal = MagicMock(return_value=MetaAnalysis(
        coherence_score=0.9,
        consistency_score=0.8,
        quality_score=0.85,
        improvement_suggestions=["Test suggestion"],
        critical_path=["Test critical step"]
    ))

    result = workflow.perform_meta_analysis({
        "structured_steps": mock_steps,
        "final_response": "Test final response"
    })

    assert "steps" in result
    assert "final_response" in result
    assert "meta_analysis" in result
    assert isinstance(result["meta_analysis"], dict)
    assert result["meta_analysis"]["coherence_score"] == 0.9

@pytest.mark.asyncio
async def test_run_consulting_workflow(mock_problem, mock_llm, mock_embed_model, mock_vector_store_index):
    with patch('app.ai.multi_step_engine.LlamaDeployClient') as mock_client:
        mock_session = AsyncMock()
        mock_session.arun.return_value = {"test": "result"}
        mock_client.return_value.create_session.return_value = mock_session

        result = await run_consulting_workflow(mock_problem, "Test query")

        assert result == {"test": "result"}
        mock_session.arun.assert_called_once_with("consulting_workflow", problem=mock_problem, query="Test query")