import aws_cdk as cdk
from stacks.database_stack import DatabaseStack
from stacks.storage_stack import StorageStack
from stacks.compute_stack import ComputeStack
from stacks.messaging_stack import MessagingStack
from stacks.eks_stack import EksStack

app = cdk.App()

env = cdk.Environment(
    account="675715936315",
    region="eu-central-1"
)

db_stack      = DatabaseStack(app, "PixoraDatabase", env=env)
storage_stack = StorageStack(app, "PixoraStorage", env=env)
msg_stack     = MessagingStack(app, "PixoraMessaging", env=env)
compute_stack = ComputeStack(
    app, "PixoraCompute",
    db_stack=db_stack,
    storage_stack=storage_stack,
    messaging_stack=msg_stack,
    env=env
)
eks_stack = EksStack(app, "PixoraEks", env=env)


app.synth()