import { Workflow, Event } from '../lib/workflow';
import { analyzeProblem, saveAnalysisResult } from '@/services/api';

export function createProblemDecompositionWorkflow(): Workflow {
  const workflow = new Workflow();

  workflow.addStep('Initialize', async (event: Event) => {
    return { type: 'ANALYSIS_STARTED', problemId: event.problemId, query: event.query };
  });

  workflow.addStep('Analyze Problem', async (event: Event) => {
    const result = await analyzeProblem(event.problemId, event.query);
    return { type: 'ANALYSIS_COMPLETED', result };
  });

  workflow.addStep('Save Result', async (event: Event) => {
    await saveAnalysisResult(event.result);
    return { type: 'RESULT_SAVED', result: event.result };
  });

  return workflow;
}