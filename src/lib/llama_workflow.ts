import { Workflow, StartEvent, StopEvent, step } from 'llamaindex';
import { analyzeProblem, saveAnalysisResult } from '@/services/api';
import { AnalysisResult } from '@/types/problem';

export class ProblemDecompositionWorkflow extends Workflow {
  @step()
  async initialize(ev: StartEvent): Promise<{ problemId: string; query: string }> {
    return { problemId: ev.get('problemId'), query: ev.get('query') };
  }

  @step()
  async analyzeProblem(ev: { problemId: string; query: string }): Promise<AnalysisResult> {
    return await analyzeProblem(ev.problemId, ev.query);
  }

  @step()
  async saveResult(ev: AnalysisResult): Promise<StopEvent> {
    await saveAnalysisResult(ev);
    return new StopEvent({ result: ev });
  }
}