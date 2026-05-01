apicredit/
├── infrastructure/
│   └── cdk/                    ← AWS CDK (Python) — tüm infra kod olarak
│       ├── app.py
│       └── stacks/
│           ├── api_stack.py        (API GW + Lambda)
│           ├── data_stack.py       (DynamoDB tabloları)
│           ├── streaming_stack.py  (Kinesis + Lambda ETL)
│           ├── billing_stack.py    (Step Functions + SQS + SNS)
│           └── analytics_stack.py  (Glue + Athena + S3)
│
├── lambdas/
│   ├── authorizer/
│   │   └── handler.py          ← API key validation (kritik)
│   ├── endpoints/
│   │   ├── summarize.py        ← /v1/summarize (5 kredi)
│   │   ├── translate.py        ← /v1/translate  (3 kredi)
│   │   └── analyze.py          ← /v1/analyze    (2 kredi)
│   ├── billing/
│   │   ├── create_checkout.py
│   │   └── stripe_webhook.py
│   ├── step_functions/
│   │   ├── validate_payment.py
│   │   ├── add_credits.py
│   │   └── send_receipt.py
│   ├── etl/
│   │   └── kinesis_to_s3.py
│   └── notifier/
│       └── sqs_to_ses.py
│
├── glue_jobs/
│   └── usage_analytics_etl.py
│
└── shared/
    ├── models.py               ← DynamoDB tablo şemaları
    └── credits.py              ← Credit deduct helper