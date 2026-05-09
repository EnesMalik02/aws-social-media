from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Pixora"
    DEBUG: bool = False
    
    # AWS Credentials
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""

    # JWT
    JWT_SECRET: str = "dev-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 1 gün
    
    # AWS
    AWS_REGION: str = "eu-central-1"
    DYNAMODB_TABLE: str = "pixora-main"
    S3_BUCKET: str = "pixora-media-675715936315"
    
    class ConfigDict:
        env_file = ".env"

settings = Settings()