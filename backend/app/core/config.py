import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Grocery Stockout System API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/inventory_db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = "../../.env"

settings = Settings()
