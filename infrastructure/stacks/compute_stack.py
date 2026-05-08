from aws_cdk import (
    Stack,
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_ecr as ecr,
    aws_iam as iam,
)
from constructs import Construct


class ComputeStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        db_stack,
        storage_stack,
        messaging_stack,
        **kwargs
    ):
        super().__init__(scope, construct_id, **kwargs)

        # VPC
        self.vpc = ec2.Vpc(
            self, "PixoraVPC",
            max_azs=2,
            nat_gateways=1,
        )

        # ECS Cluster
        self.cluster = ecs.Cluster(
            self, "PixoraCluster",
            vpc=self.vpc,
            cluster_name="pixora-cluster",
        )

        # ECR Repository — Docker image buraya push edilecek
        self.repository = ecr.Repository(
            self, "PixoraRepository",
            repository_name="pixora-backend",
        )