from llama_deploy import (
    deploy_workflow,
    WorkflowServiceConfig,
    ControlPlaneConfig,
)
from app.ai.multi_step_engine import ConsultingWorkflow
from app.models.consulting import Problem

async def deploy_consulting_workflow(problem: Problem):
    await deploy_workflow(
        workflow=ConsultingWorkflow(problem),
        workflow_config=WorkflowServiceConfig(
            host="127.0.0.1",  # Change this to the appropriate host for production
            port=8002,  # Adjust port as needed
            service_name="consulting_workflow"
        ),
        control_plane_config=ControlPlaneConfig(),
    )

# This function can be called to deploy the workflow
async def setup_workflow_deployment():
    # You might want to load a default problem or handle this differently
    default_problem = Problem(id=1, title="Default Problem", description="Default description")
    await deploy_consulting_workflow(default_problem)