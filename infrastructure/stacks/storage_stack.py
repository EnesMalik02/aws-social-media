from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
    Duration,
)
from constructs import Construct


class StorageStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        # Medya bucket — fotoğraflar buraya
        self.media_bucket = s3.Bucket(
            self, "PixoraMedia",
            bucket_name=f"pixora-media-675715936315",
            removal_policy=RemovalPolicy.DESTROY,
            cors=[s3.CorsRule(
                allowed_methods=[
                    s3.HttpMethods.GET,
                    s3.HttpMethods.PUT,
                    s3.HttpMethods.POST,
                ],
                allowed_origins=["*"],
                allowed_headers=["*"],
            )],
            lifecycle_rules=[
                s3.LifecycleRule(
                    id="delete-temp",
                    prefix="temp/",
                    expiration=Duration.days(1),
                )
            ],
        )