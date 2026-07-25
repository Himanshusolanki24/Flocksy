from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "focksy-ai-core"
    openai_api_key: Optional[str] = None
    use_llm_provider: str = "stub"
    disease_mcp_url: str = "http://127.0.0.1:8101"
    medicine_mcp_url: str = "http://127.0.0.1:8102"
    feed_mcp_url: str = "http://127.0.0.1:8103"
    environment_mcp_url: str = "http://127.0.0.1:8104"
    safety_mcp_url: str = "http://127.0.0.1:8105"
    memory_mcp_url: str = "http://127.0.0.1:8106"
    vision_model_path: str = "../ml/training/artifacts-cpu-real/best_poultry_disease_cnn.pt"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
