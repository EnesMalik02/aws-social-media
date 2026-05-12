from aws_cdk import Stack, aws_s3 as s3, RemovalPolicy, Duration
from constructs import Construct


class StorageStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        # S3 bucket to store user photos and media files
        self.media_bucket = s3.Bucket(
            self, "PixoraMedia",
            bucket_name="pixora-media-675715936315",
            removal_policy=RemovalPolicy.DESTROY,
            cors=[s3.CorsRule(
                allowed_methods=[s3.HttpMethods.GET, s3.HttpMethods.PUT],
                allowed_origins=["*"],  # restrict to your domain in production
                allowed_headers=["*"],
            )],
            block_public_access=s3.BlockPublicAccess(
                block_public_acls=False,
                block_public_policy=False,
                ignore_public_acls=False,
                restrict_public_buckets=False,
            ),
            public_read_access=True,
        )