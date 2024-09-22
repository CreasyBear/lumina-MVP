import json
import os

class ContextManager:
    # ... existing code ...

    def save_context(self, filename: str):
        context_data = {
            "running_summary": self.running_summary,
            "memory_index": self.memory_index.storage_context.to_dict()
        }
        with open(filename, 'w') as f:
            json.dump(context_data, f)

    def load_context(self, filename: str):
        if not os.path.exists(filename):
            raise FileNotFoundError(f"Context file {filename} not found")

        with open(filename, 'r') as f:
            context_data = json.load(f)

        self.running_summary = context_data["running_summary"]
        self.memory_index = VectorStoreIndex.from_dict(context_data["memory_index"])

    def generate_session_summary(self) -> str:
        prompt = f"""
        Based on the following running summary, generate a concise session summary:

        {self.running_summary}

        The summary should include:
        1. Key insights gained
        2. Major decisions made
        3. Open questions or areas requiring further investigation
        """
        return self.service_context.llm.complete(prompt)