import { v4 as uuidv4 } from 'uuid';

export interface Event {
  type: string;
  [key: string]: any;
}

export interface Step {
  id: string;
  name: string;
  execute: (event: Event) => Promise<Event>;
}

export class Workflow {
  private steps: Step[] = [];

  addStep(name: string, execute: (event: Event) => Promise<Event>): void {
    this.steps.push({
      id: uuidv4(),
      name,
      execute,
    });
  }

  async run(initialEvent: Event): Promise<Event[]> {
    let currentEvent = initialEvent;
    const events: Event[] = [initialEvent];

    for (const step of this.steps) {
      currentEvent = await step.execute(currentEvent);
      events.push(currentEvent);
    }

    return events;
  }
}