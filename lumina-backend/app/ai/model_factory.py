from llama_index.llms import OpenAI, HuggingFaceLLM

class AIModelFactory:
    @staticmethod
    def get_model(model_name: str):
        if model_name == "gpt-4":
            return OpenAI(model="gpt-4")
        elif model_name == "claude-v1":
            return AnthropicLLM(model="claude-v1")
        elif model_name == "flan-t5":
            return HuggingFaceLLM(model_name="google/flan-t5-xxl")
        else:
            raise ValueError(f"Unsupported model: {model_name}")