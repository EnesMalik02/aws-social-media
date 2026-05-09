from aws_cdk import Stack, aws_sqs as sqs, aws_sns as sns, aws_sns_subscriptions as subs, Duration
from constructs import Construct


class MessagingStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        # Dead letter queue — failed messages land here instead of being lost
        dlq = sqs.Queue(
            self, "PixoraDLQ",
            queue_name="pixora-dlq",
        )

        # Main notification queue — holds notifications to be processed
        self.notification_queue = sqs.Queue(
            self, "PixoraNotificationQueue",
            queue_name="pixora-notifications",
            visibility_timeout=Duration.seconds(120),
            dead_letter_queue=sqs.DeadLetterQueue(max_receive_count=3, queue=dlq),
        )

        # SNS topic — publishes notifications to all subscribers (fan-out)
        self.notification_topic = sns.Topic(
            self, "PixoraNotificationTopic",
            topic_name="pixora-notifications",
        )

        # Connect SNS topic to SQS queue
        # When SNS receives a message, it forwards it to the queue
        self.notification_topic.add_subscription(
            subs.SqsSubscription(self.notification_queue)
        )