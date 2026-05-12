import boto3
from app.core.config import settings

s3 = boto3.client("s3", region_name=settings.AWS_REGION)


def generate_upload_url(key: str, expires_in: int = 300) -> str:
    """
    Generate a presigned URL for direct S3 upload from client.
    URL expires in 5 minutes by default.
    """
    return s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket":      settings.S3_BUCKET,
            "Key":         key,
            "ContentType": "image/jpeg",
        },
        ExpiresIn=expires_in,
    )