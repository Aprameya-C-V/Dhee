import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    app_name: str = "Dhee"
    groq_api_key: str | None = os.environ.get("GROQ_API_KEY")
    gemini_api_key: str | None = os.environ.get("GEMINI_API_KEY")

    # Defaults; can be overridden per-request
    llm_model: str = os.environ.get("LLM_MODEL", "moonshotai/kimi-k2-instruct")
    llm_temperature: float = float(os.environ.get("LLM_TEMPERATURE", 0.6))
    llm_max_tokens: int = int(os.environ.get("LLM_MAX_TOKENS", 4096))
    llm_top_p: float = float(os.environ.get("LLM_TOP_P", 1.0))


settings = Settings()
