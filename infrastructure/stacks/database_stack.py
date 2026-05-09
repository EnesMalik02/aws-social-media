from aws_cdk import Stack, aws_dynamodb as dynamodb, RemovalPolicy
from constructs import Construct


class DatabaseStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        # Single DynamoDB table for all data (users, posts, likes, follows)
        # PK = partition key, SK = sort key
        self.table = dynamodb.Table(
            self, "PixoraTable",
            table_name="pixora-main",
            partition_key=dynamodb.Attribute(name="PK", type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(name="SK", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,  # pay per request, no capacity planning
            removal_policy=RemovalPolicy.DESTROY,  # delete table when stack is destroyed (dev only)
        )

        # Secondary index to query users by username
        self.table.add_global_secondary_index(
            index_name="GSI1",
            partition_key=dynamodb.Attribute(name="GSI1PK", type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(name="GSI1SK", type=dynamodb.AttributeType.STRING),
        )