## AWS Lambda

Serverless compute service that runs code in response to events without requiring infrastructure management. Lambda automatically scales execution capacity based on demand and charges only for actual execution time.

### Versions and Aliases

**Versions** — When developing a Lambda function, you work on the `$LATEST` version. When ready to publish, you create an immutable version with a fixed version number. Versions are immutable—code and environment variables are locked and cannot be changed. Each version receives its own Amazon Resource Name (ARN), and each version comprises both code and configuration bundled together. Publishing increments the version number sequentially.

**Aliases** — Aliases are pointers that reference specific Lambda function versions and enable you to map human-readable names (such as `prod` or `staging`) to version numbers. Aliases are immutable and receive their own ARNs. Aliases enable stable configuration of event sources and destinations without updating infrastructure, but they can only reference versions, not other aliases.

### Environment Variables

Environment variables are defined as key-value pairs in string form and allow you to adjust function behavior without modifying code. Environment variables are accessible to your Lambda function code at runtime, and the Lambda service automatically provides its own system environment variables.

**Secrets Management** — Store sensitive values using AWS Key Management Service (KMS) encryption. Secrets can be encrypted using either the Lambda service key or a customer-managed key (CMK).

### Concurrency

**Default Limits** — AWS Lambda has a default concurrency limit of 1,000 concurrent executions per AWS account per region. If you do not reserve concurrency, one application can consume all available concurrency and throttle other functions.

**Reserved Concurrency** — Set reserved concurrency at the function level to guarantee a specific number of concurrent executions. This prevents one function from starving other functions of available concurrency. To increase limits beyond the default, request an increase from AWS via support ticket.

**Throttling Behavior** — Each invocation that exceeds the concurrency limit triggers a throttle error. For synchronous invocations, Lambda returns a throttling error (HTTP 429). For asynchronous invocations, Lambda automatically retries the event and then sends it to the Dead Letter Queue (DLQ) if retries are exhausted.

**Concurrency and Asynchronous Invocations** — If a function lacks sufficient available concurrency to process all events, additional requests are throttled. Lambda returns throttling errors (HTTP 429) and system errors (HTTP 500s) to the queue for retry. Automatic retry attempts continue for up to 6 hours, with retry intervals using exponential backoff that starts at 1 second and increases to a maximum of 5 minutes.

### Cold Starts and Provisioned Concurrency

**Cold Starts** — A cold start occurs when a new Lambda execution environment is created and your function code is loaded. Code outside the handler function executes during initialization, and if initialization logic is computationally expensive, this process can introduce latency. Requests served by newly created instances experience higher latency compared to warm instances that are already running.

**Provisioned Concurrency** — Pre-allocate concurrency before the function is invoked to eliminate cold starts. All invocations benefit from low latency when concurrency is provisioned, and Application Auto Scaling can automatically manage provisioned concurrency based on schedules or target utilization metrics.

### File Systems Mounting

Lambda functions can access Amazon EFS (Elastic File System) when deployed in a VPC. Configure the Lambda function to mount EFS to a local directory during initialization and leverage EFS access points for proper authentication and isolation. **Limitations** — Each Lambda instance maintains one connection to EFS, so be aware of EFS connection limits and connection burst limits.

### Storage Options for Lambda Functions

Lambda functions can persist data using several storage mechanisms, each with different characteristics for capacity, durability, and access patterns.

**Ephemeral Storage** — Ephemeral storage provides 10 GB total capacity (with 512 MB included with standard Lambda). Data stored here is temporary and deleted when the execution environment terminates. Ephemeral storage is accessible only to the function's execution environment, supports any standard file system operation, and offers the fastest retrieval speed among storage options. Use ephemeral storage for dynamic content generated during execution.

**Lambda Layers** — Layers provide up to 5 layers per function with 250 MB total uncompressed capacity. Layers are durable—they persist across function versions and can be shared across invocations and functions. Layers are archived as ZIP files and are included in Lambda pricing with no additional charge. Use layers for static content such as libraries and custom code.

**Amazon S3** — S3 provides elastic, virtually unlimited capacity and durable object storage where data persists indefinitely. S3 supports atomic operations and versioning, is accessible across all Lambda invocations, and is charged for storage, requests, and data transfer. Use S3 for dynamic content that requires flexible scaling.

**Amazon EFS** — EFS provides elastic capacity that scales to meet demand, with durable data that persists beyond function execution. EFS is a network file system that supports any file system operation, is accessible across Lambda invocations and other EC2 instances in the VPC, and offers IAM permissions plus NFS-level security for access control. Pricing is charged for storage, data transfer, and provisioned throughput. Use EFS when you need a shared file system across multiple compute resources.