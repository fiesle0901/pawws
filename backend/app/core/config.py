from pydantic_settings import SettingsConfigDict, BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pawws!"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/pawws"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
