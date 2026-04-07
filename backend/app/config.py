from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost/stylesync"
    FRONTEND_URL: str = "http://localhost:3000"
    DEBUG: bool = False

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
