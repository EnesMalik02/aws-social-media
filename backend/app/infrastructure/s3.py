import boto3
from app.core.config import settings

s3 = boto3.client("s3", region_name=settings.AWS_REGION)


def generate_upload_url(key: str, content_type: str = "image/jpeg", expires_in: int = 300) -> str:
    return s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket":      settings.S3_BUCKET,
            "Key":         key,
            "ContentType": content_type,
        },
        ExpiresIn=expires_in,
    )