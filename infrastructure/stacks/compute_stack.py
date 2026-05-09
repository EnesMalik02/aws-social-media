from aws_cdk import (
    Stack,
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_ecr as ecr,
    aws_iam as iam,
    aws_ecs_patterns as ecs_patterns,
    aws_logs as logs,
)
from constructs import Construct


class ComputeStack(Stack):
    def __init__(self, scope, construct_id, db_stack, storage_stack, messaging_stack, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        # Virtual network where our containers will run
        self.vpc = ec2.Vpc(
            self, "PixoraVPC",
            max_azs=2,
            nat_gateways=0,  # no NAT gateway to save cost
            subnet_configuration=[
                ec2.SubnetConfiguration(name="public", subnet_type=ec2.SubnetType.PUBLIC)
            ]
        )

        # ECS cluster — logical grouping of Fargate containers
        self.cluster = ecs.Cluster(self, "PixoraCluster", vpc=self.vpc, cluster_name="pixora-cluster")

        # Reference existing ECR repository where our Docker image is stored
        self.repository = ecr.Repository.from_repository_name(self, "PixoraRepo", repository_name="pixora-backend")

        # IAM role — defines what AWS services our container can access
        task_role = iam.Role(self, "PixoraTaskRole", assumed_by=iam.ServicePrincipal("ecs-tasks.amazonaws.com"))

        # Allow container to read/write DynamoDB
        task_role.add_to_policy(iam.PolicyStatement(
            actions=["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem", "dynamodb:Query", "dynamodb:Scan"],
            resources=[db_stack.table.table_arn, f"{db_stack.table.table_arn}/index/*"]
        ))

        # Allow container to read/write S3
        task_role.add_to_policy(iam.PolicyStatement(
            actions=["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
            resources=[f"{storage_stack.media_bucket.bucket_arn}/*"]
        ))

        # Fargate service — runs our Docker container behind a load balancer
        self.fargate_service = ecs_patterns.ApplicationLoadBalancedFargateService(
            self, "PixoraService",
            cluster=self.cluster,
            service_name="pixora-backend-service",
            cpu=256,            # 0.25 vCPU
            memory_limit_mib=512,
            desired_count=1,    # run 1 container
            assign_public_ip=True,
            task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(
                image=ecs.ContainerImage.from_ecr_repository(self.repository, tag="latest"),
                container_name="pixora-backend",
                container_port=8000,
                task_role=task_role,
                environment={
                    "AWS_REGION":     "eu-central-1",
                    "DYNAMODB_TABLE": db_stack.table.table_name,
                    "S3_BUCKET":      storage_stack.media_bucket.bucket_name,
                },
                log_driver=ecs.LogDrivers.aws_logs(
                    stream_prefix="pixora",
                    log_retention=logs.RetentionDays.ONE_DAY,  # keep logs for 1 week
                ),
            ),
            public_load_balancer=True,
        )