## AWS Lambda

Serverless compute service that runs code in response to events without requiring infrastructure management. Lambda automatically scales execution capacity based on demand and charges only for actual execution time.

### Versions and Aliases

When developing a Lambda function, you work on the `$LATEST` version. Publishing creates an immutable numbered version with locked code and environment variables. Each version receives its own Amazon Resource Name (ARN). This immutability ensures that code and configuration cannot be accidentally modified in production.

**Aliases** are pointers that map human-readable names (such as `prod` or `staging`) to specific function versions. Each alias has its own ARN and enables stable event source configuration without updating infrastructure. Aliases can only reference versions, not other aliases. This decoupling between alias and version number allows you to promote code by simply updating which version an alias points to.

### Environment Variables

Environment variables are key-value pairs that allow you to adjust function behavior without modifying code. They are accessible to your function at runtime and enable configuration management across environments. The Lambda service automatically provides its own system environment variables for runtime information.

Store sensitive values using AWS Key Management Service (KMS) encryption. You can encrypt using either the Lambda service key or a customer-managed key (CMK), giving you flexibility over encryption key management and audit trails.

### Concurrency

AWS Lambda enforces a default concurrency limit of 1,000 concurrent executions per AWS account per region. Without reserved concurrency, a single function can consume all available capacity and throttle other functions in the same account and region.

**Reserved Concurrency** guarantees a specific number of concurrent executions for a function, preventing resource starvation. Set reserved concurrency at the function level to ensure critical functions always have capacity. Request increases beyond the default limit through AWS Support.

For synchronous invocations, Lambda returns an HTTP 429 throttling error when concurrency is exceeded. For asynchronous invocations, Lambda automatically retries the event and sends it to the Dead Letter Queue (DLQ) if retries are exhausted. Automatic retries continue for up to 6 hours with exponential backoff starting at 1 second and increasing to a maximum of 5 minutes.

### Cold Starts and Provisioned Concurrency

A cold start occurs when a new Lambda execution environment is created and your function code is loaded. Any initialization code outside the handler executes during this phase, and expensive initialization logic introduces measurable latency. Requests served by newly created instances experience higher latency compared to warm instances already running.

**Provisioned Concurrency** pre-allocates execution capacity before invocation, eliminating cold start overhead. All invocations use warm environments with low latency. Application Auto Scaling can automatically manage provisioned concurrency based on schedules or target utilization metrics, balancing between cost and performance.

### File Systems Mounting

Lambda functions deployed in a VPC can access Amazon EFS (Elastic File System). Configure the Lambda function to mount EFS to a local directory during initialization and use EFS access points for proper authentication and isolation. Each Lambda instance maintains one connection to EFS, so be mindful of EFS connection limits and connection burst capacity.

### Storage Options for Lambda Functions

Lambda functions can persist data using several storage mechanisms, each with different characteristics for capacity, durability, and access patterns.

**Ephemeral Storage** provides 10 GB total capacity, with 512 MB included in the standard allocation. Data is temporary and deleted when the execution environment terminates, accessible only to that execution environment. Ephemeral storage supports any standard file system operation and offers the fastest retrieval speed. Use it for dynamic content generated during execution.

**Lambda Layers** provide up to 5 layers per function with 250 MB total uncompressed capacity. Layers persist across function versions and can be shared across invocations and functions. They are archived as ZIP files and included in Lambda pricing with no additional charge. Use layers for static content such as libraries and custom code.

**Amazon S3** offers elastic, virtually unlimited capacity for durable object storage. Data persists indefinitely and supports atomic operations and versioning. S3 is accessible across all Lambda invocations and charged for storage, requests, and data transfer. Use S3 for dynamic content requiring flexible scaling.

**Amazon EFS** provides elastic capacity that scales to demand, with durable data persisting beyond function execution. As a network file system, EFS supports any file system operation and is accessible across Lambda invocations and other EC2 instances in the VPC. Access is controlled via IAM permissions plus NFS-level security. Pricing is charged for storage, data transfer, and provisioned throughput. Use EFS when you need a shared file system across multiple compute resources.

### Cross-Account EFS Mounting

Mounting an EFS file system from a different AWS account requires coordinating networking, IAM trust, and EFS resource policies before Lambda can reach the mount target.

The Lambda function's VPC (in Account A) and the EFS mount target's VPC (in Account B) must be connected via a VPC peering connection or AWS Transit Gateway. Route tables in both VPCs must include routes directing traffic toward the peer CIDR, and security groups on both sides must permit NFS traffic on port 2049.

The Lambda function's execution role in Account A must carry permissions to call `elasticfilesystem:ClientMount`, `elasticfilesystem:ClientWrite`, and `elasticfilesystem:ClientRootAccess` (if root access is needed) against the EFS file system ARN in Account B. Without these permissions the mount attempt is rejected before the NFS handshake begins.

The EFS resource policy in Account B must explicitly grant the Lambda execution role or its owning account the same `elasticfilesystem:Client*` actions. This cross-account resource policy allows an identity from a foreign account to authenticate with EFS.

Use an EFS access point to enforce a specific POSIX user identity and root directory for the Lambda function. Specify the access point ARN directly in the Lambda VPC configuration alongside the local mount path. Access points also simplify the file system policy by scoping permissions to a single access point ARN rather than the whole file system.

Lambda resolves the EFS mount target by its DNS name (`fs-xxxxxxxx.efs.<region>.amazonaws.com`). Because the mount target exists in Account B's VPC, enable DNS resolution and DNS hostnames on the peering connection and ensure Route 53 Resolver or a custom resolver can return the correct private IP for that hostname from within Account A's VPC.

## API Gateway

Amazon API Gateway is a fully managed service for creating, publishing, and securing REST, HTTP, and WebSocket APIs at any scale. It proxies requests to backend integrations—most commonly Lambda functions—so that the combination of API Gateway and Lambda requires no infrastructure to manage. API Gateway handles versioning, multiple deployment environments, authentication and authorization, API key creation and enforcement, request and response transformation and validation, SDK generation, and response caching.

API Gateway supports three integration patterns. **Lambda integration** exposes a Lambda function as a REST or HTTP API backend, enabling true serverless architectures. **HTTP integration** fronts an existing HTTP endpoint and adds capabilities such as rate limiting, caching, user authentication, and API key management without modifying the backend. **AWS Service integration** directly invokes AWS APIs, allowing API Gateway to trigger Step Functions workflows, post messages to SQS, or interact with other services without an intermediate Lambda function.

API Gateway supports importing API definitions from Swagger or OpenAPI specifications, making it straightforward to generate client SDKs and publish API documentation alongside the deployed gateway.

### Endpoint Types

**Edge-Optimized** is the default endpoint type, designed for globally distributed clients. Requests are routed through the nearest CloudFront edge location before reaching the API Gateway, which itself resides in a single AWS region. This reduces latency for geographically dispersed consumers.

A **regional endpoint** serves clients located in the same AWS region as the gateway. You can manually combine a regional endpoint with your own CloudFront distribution to gain fine-grained control over caching and distribution behavior while still benefiting from CloudFront's global network.

A **private endpoint** is accessible only from within a VPC using an Interface VPC Endpoint powered by AWS PrivateLink. Access is controlled through a resource-based policy attached to the API, which defines which VPCs or VPC endpoints are permitted to invoke it.

### Security

API Gateway supports three mechanisms for controlling access. **IAM roles** use Signature Version 4 signing to authenticate callers, making them suitable for service-to-service calls within AWS. **Amazon Cognito User Pools** validate tokens issued to authenticated users, enabling browser and mobile client authentication without custom code. **Lambda authorizers** (custom authorizers) invoke a Lambda function with the incoming token or request context and return an IAM policy that API Gateway uses to allow or deny the request, supporting any custom authentication scheme.

API Gateway integrates with AWS Certificate Manager (ACM) to enforce HTTPS on custom domain names. For edge-optimized endpoints, the ACM certificate must be created in the `us-east-1` region, because CloudFront requires certificates in that region. For regional endpoints, the certificate must be in the same region as the API Gateway. After attaching a certificate, create a `CNAME` or `A` alias record in Route 53 to map the custom domain to the API Gateway domain name.

### Deployment

API changes do not take effect until they are explicitly deployed. Deployments are scoped to **stages**, which represent named snapshots of the API configuration. You can use any naming convention for stages (for example, `dev`, `test`, `prod`). Each stage maintains its own independent configuration parameters, including throttling settings, logging levels, and caching behavior.

API Gateway retains a deployment history for each stage, enabling rollback to any prior deployment if a new change introduces a regression. Each stage exposes its own unique invocation URL, so promoting between environments is a matter of updating the stage a client points to rather than changing the URL structure.

### Stage Variables

Stage variables function as environment variables for API Gateway stages, allowing you to change configuration values per stage without redeploying the API. They can be referenced in Lambda function ARNs, HTTP endpoint URLs, and mapping templates, making it straightforward to point each stage at a different backend without duplicating API definitions.

A common use case is configuring which HTTP endpoint a stage communicates with. When the integration target is a Lambda function, a stage variable can hold the function alias name, so a single API definition routes `dev` traffic to the `dev` alias and `prod` traffic to the `prod` alias—simply by changing the stage variable value rather than the API configuration itself.

Stage variables are accessible within Lambda through the `context` object and are referenced in API Gateway configuration using the syntax `${stageVariables.variableName}`.

### OpenAPI

OpenAPI is a standard way to define REST APIs as code, providing a machine-readable specification that API Gateway can import, export, and use to generate client SDKs. Import an existing OpenAPI specification directly into API Gateway to define your API structure without manually configuring each component in the console.

An OpenAPI specification defines the following core components:

- **Method** — HTTP verb and resource path
- **Method Request** — request parameters, headers, and payload schema that clients must provide
- **Integration Request** — how API Gateway transforms the incoming request before sending it to the backend
- **Integration Response** — how API Gateway transforms the backend response before returning it to the client
- **Method Response** — response status codes and schemas that the API returns to clients
- **API Extensions** — AWS-specific extensions for configuring gateway behavior and setup

Export your current API as an OpenAPI specification to document the deployed API, share it with clients, or import it into other tools. OpenAPI specifications can be formatted as YAML or JSON. Using OpenAPI, you can generate client SDKs for applications in multiple programming languages, reducing the effort to build and maintain client libraries.

#### Request Validation

Configure API Gateway to perform basic validation of incoming requests before proceeding to the integration request. If validation fails, API Gateway rejects the request with HTTP 400, reducing unnecessary backend calls and protecting downstream services from malformed input.

Request validation checks the following:

- Request parameters (path, query string)
- Headers
- Request payload (validated against a configured JSON schema if applicable)

Define validators using OpenAPI specification files, which specify JSON schemas for request and response structures. This declarative approach keeps validation rules version-controlled alongside API definitions.

### Caching Responses

Response caching reduces calls made to the backend, improving latency and reducing backend load. Configure cache settings per stage or override them per method for fine-grained control.

The default time-to-live (TTL) is 300 seconds, with a minimum of 0 and maximum of 3600 seconds. Caches are defined per stage, and you can override cache settings per method to cache some endpoints while leaving others uncached.

API Gateway supports encryption of cached data at rest. Choose cache capacity between 0.5 GB and 237 GB based on your expected throughput and payload sizes. Note that cache capacity is provisioned and charged separately from API Gateway usage, so evaluate cost-benefit for your use case.

#### Invalidation

Flush the entire cache immediately from the API Gateway console when you need to clear stale data without waiting for TTL expiration.

Clients can invalidate cache entries by sending the `Cache-Control: max-age=0` header with their request. However, without an `InvalidateCache` policy attached to the API, any client can invalidate the cache, potentially allowing unauthorized users to force cache misses and overload your backend. Attach an `InvalidateCache` policy to the API to restrict cache invalidation to authorized callers.

### Canary Deployments

Enable canary deployments on any stage to gradually roll out API changes to a subset of traffic while monitoring for issues. Configure the percentage of traffic the canary receives, allowing you to test changes on real traffic before full rollout.

Metrics and logs are kept separate between the canary deployment and the baseline traffic, enabling you to compare behavior and detect regressions. Canary deployments can override any stage variables, allowing the canary to use different backend configurations or feature flags than the baseline.

After validating the canary, promote it to become the baseline stage version, making the changes permanent for all traffic.

### Monitoring and Logging

#### CloudWatch

CloudWatch Logs record information about request and response bodies, allowing you to debug and audit API Gateway traffic. Enable CloudWatch logging at the stage level and configure the log level (ERROR, INFO, or DEBUG) to control verbosity. You can override logging settings on a per-method basis to apply different log levels to specific endpoints.

Execution logs contain information about the request and response flow. Access logs provide per-request records of who called the API and what happened. Both can be written to CloudWatch Logs for centralized observability.

#### X-Ray

Enable X-Ray tracing on a stage to get detailed visibility into requests flowing through API Gateway and downstream services. X-Ray provides end-to-end traces showing latency breakdowns at each step, including integration latency, Lambda execution duration, and time spent in downstream services. Traces automatically integrate with Lambda execution traces, giving you a complete view of the request lifecycle.

#### CloudWatch Metrics

API Gateway publishes metrics by stage, and you can enable detailed metrics for additional granularity. Key metrics include:

- **CacheHitCount** and **CacheMissCount** — efficiency of the response cache
- **Count** — total number of API requests in the period
- **IntegrationLatency** — time between when API Gateway relays the request to the backend and when it receives the response
- **Latency** — time between when the gateway receives a request from the client and when it returns a response to the client
- **4XXError** — client-side errors
- **5XXError** — server-side errors

The maximum time API Gateway can perform any request is 29 seconds; requests exceeding this timeout fail with a 504 Gateway Timeout error.

#### Gateway Throttling

API Gateway enforces account-level throttling limits to protect shared infrastructure. By default, API Gateway throttles at 10,000 requests per second (steady state) with a burst capacity of 10,000 requests per second across all APIs in the account. This is a soft limit that can be increased on request through AWS Support.

When throttling is triggered, API Gateway returns HTTP 429 (Too Many Requests), a retriable error that clients should handle with exponential backoff.

Set stage-level and method-level throttling limits to further control traffic to specific stages or methods and improve performance. Define **usage plans** to throttle and meter traffic on a per-customer basis, allowing you to enforce different rate limits for different API consumers. Usage plans work similarly to Lambda concurrency controls, enabling you to guarantee resources to premium customers while limiting resources for lower-tier consumers.

## Amazon ECS

Amazon Elastic Container Service (ECS) launches ECS tasks in ECS clusters.

### EC2 Launch Type

The EC2 launch type requires you to provision and maintain the underlying infrastructure. Each EC2 instance must run the ECS agent, which registers the instance in the ECS cluster. AWS handles starting and stopping containers on these instances.

### Fargate Launch Type

Fargate enables you to launch Docker containers on AWS without provisioning any infrastructure—it's fully serverless. You only need to create task definitions, and AWS runs the tasks based on CPU and memory requirements. Scale your application by increasing the number of tasks. Fargate is easier to manage than the EC2 launch type.

### IAM Roles for ECS

#### EC2 Instance Profile

The EC2 instance profile is used by the ECS agent and provides permissions to:

- Make API calls to the ECS service
- Send container logs to CloudWatch Logs
- Pull Docker images from Amazon ECR
- Reference sensitive data in AWS Secrets Manager or AWS Systems Manager Parameter Store

#### ECS Task Role

Both EC2 and Fargate launch types support ECS task roles. A task role allows each task to have its own specific IAM role, enabling different ECS services to have different permissions. The task role is defined in the task definition.

### Load Balancer Integrations

- **Application Load Balancer (ALB)**: Supported and works for most use cases.
- **Network Load Balancer (NLB)**: Recommended only for high-throughput or high-performance workloads, or when pairing with AWS PrivateLink.
- **Classic Load Balancer**: Supported but not recommended. Cannot link to Fargate launch type.

### Data Volumes (EFS)

You can mount an Amazon EFS file system directly onto ECS tasks. EFS is compatible with both EC2 and Fargate launch types. Tasks running in any Availability Zone can access the same EFS file system and share data. Combining Fargate with EFS provides a serverless, persistent, multi-Availability Zone shared storage solution for containers.

Note: S3 cannot be mounted as a file system; use EFS for this use case.

### AWS Application Auto Scaling

AWS Application Auto Scaling automatically increases or decreases the number of ECS tasks based on demand. Scaling policies can be based on CPU utilization, memory utilization, or ALB request count per target.

**Scaling Policies:**

- **Target Tracking**: Scales based on a target value for a CloudWatch metric.
- **Step Scaling**: Scales based on CloudWatch alarms with defined steps.
- **Scheduled Scaling**: Scales based on a specific date and time.

**Scaling Considerations:**

Scaling at the task level is different from scaling at the infrastructure level. Fargate auto-scaling is easier to set up because it is serverless. To accommodate ECS service scaling on EC2, you must add underlying EC2 instances to the cluster.

**Infrastructure Scaling Options:**

- **Auto Scaling Group Scaling**: Scale the Auto Scaling Group based on CPU utilization to add EC2 instances over time.
- **ECS Cluster Capacity Provider**: Automatically provisions and scales infrastructure for ECS tasks. The capacity provider is paired with an Auto Scaling Group and adds EC2 instances based on capacity needs.

### Tasks Invoked by EventBridge

[Content to be added]

### ECS Logging with awslogs Driver

Containers can send application logs directly to CloudWatch Logs. You must enable the awslogs log driver and configure log configuration parameters in the task definition.

#### Fargate

Fargate launch type requires a task execution role. Supported logging drivers include awslogs, Splunk, and AWS FireLens.

#### EC2

On EC2, prevent logs from consuming disk space on container instances by using the CloudWatch Unified Agent and ECS container agent. Enable logging by setting the `ECS_AVAILABLE_LOGGING_DRIVERS` variable in `/etc/ecs/ecs.config`. Container instances must have the required IAM permissions.

### Logging with Sidecar Container

Use a second container alongside your application container that is responsible for finding logs and sending them to a log storage service.

## Amazon ECR

Amazon Elastic Container Registry (Amazon ECR) is a fully managed service that stores and manages Docker container images on AWS. It provides both private and public repositories, with a public gallery for discovering and sharing community images. Amazon ECR is fully integrated with Amazon ECS and backed by Amazon S3 for durable storage. Access is controlled through IAM policies, allowing fine-grained permission management across teams and services.

Amazon ECR supports image vulnerability scanning to identify security risks, image versioning and tagging for lifecycle management, and automated image retention policies to control storage and costs.

### Lifecycle Policies

Lifecycle policies automatically remove old or unused images based on age or count, reducing unnecessary storage costs. Each policy may contain one or more rules. All rules are evaluated at the same time and applied based on priority. Images that meet the expiration criteria are removed within 24 hours after the policy is triggered.

### Uniform Pipeline

Build Docker images using any programming language and deploy them directly from Amazon ECR. This enables a consistent, language-agnostic workflow for containerized applications.

## EKS

Amazon EKS (Elastic Kubernetes Service) is a managed Kubernetes service that provides a hosted Kubernetes cluster on AWS. Kubernetes is an open-source system for automatically deploying, scaling, and managing containerized applications. Unlike Amazon ECS, which uses its own orchestration API, EKS uses the standard Kubernetes API, making it a cloud-host-agnostic solution.

Amazon EKS supports two options for deploying worker nodes: Amazon EC2 instances or AWS Fargate for serverless container deployment.

### Managed Node Groups

Managed Node Groups automatically create and manage EC2 instances within the Amazon EKS cluster. The nodes are part of an Auto Scaling Group managed by Amazon EKS, and support both on-demand and spot instances for flexible capacity scaling.

### Nodes

#### Self-Managed Nodes

Self-managed nodes are EC2 instances that you create and register to an Amazon EKS cluster. These nodes are managed by an Auto Scaling Group that you control. You can use Amazon EKS-optimized AMIs as a prebuilt starting point. Self-managed nodes support both on-demand and spot instances.

#### Fargate

AWS Fargate eliminates the need to manage nodes. With Fargate, you run containers without provisioning or managing any underlying EC2 infrastructure.

### Data Volumes

Amazon EKS supports persistent storage through the Container Storage Interface (CSI), which is an industry-standard interface for container storage drivers. You must specify a StorageClass manifest on your cluster to define storage requirements.

Supported storage services include Amazon EBS, Amazon EFS, Amazon FSx for Lustre, and Amazon FSx for NetApp ONTAP.

### Logging

#### Control Plane

Amazon EKS control plane audit and diagnostic logs can be sent to CloudWatch Logs. Control plane log types include API server logs, audit logs, authenticator logs, controller manager logs, and scheduler logs. Amazon EKS provides native integration with CloudWatch Logs for centralized log management.

#### Nodes and Containers

Node, pod, and container logs can be captured and sent to CloudWatch Logs using the CloudWatch agent. You can also use Fluent Bit or Fluentd as log drivers to forward logs. Container logs are stored in the node directory at `/var/log/containers/`. CloudWatch Container Insights provides a comprehensive dashboard and monitoring solution for viewing metrics across nodes, pods, tasks, and services.

## Kinesis Data Streams

Amazon Kinesis Data Streams enables you to collect and store streaming data in real-time. It is designed to handle data generated by various sources, including clickstreams, IoT devices, application metrics, and logs.

### Architecture and Components

**Producers** send data to Kinesis Data Streams. You can use the Kinesis Agent as a producer to automatically forward data from your applications and systems.

**Consumers** process data from the stream in real-time. Common consumers include Lambda functions, Kinesis Data Firehose, and analytics services.

### Data Management and Security

- **Retention**: Data is retained for up to 365 days, allowing you to reprocess data at any time. Records are immutable and cannot be deleted until the retention period expires.
- **Throughput**: Kinesis Data Streams supports up to 10 MB per second ingestion.
- **Data Ordering**: Records with the same partition ID maintain ordering guarantees throughout the stream.
- **Security**: Data is encrypted at rest using AWS KMS and in transit using HTTPS.

### Optimization Libraries

The **Kinesis Producer Library (KPL)** provides an optimized way to write producer applications. The **Kinesis Client Library (KCL)** offers an optimized framework for building consumer applications.

### Capacity Modes

#### Provisioned Mode

In Provisioned Mode, you manually choose and manage the number of shards on your stream. A shard represents a unit of throughput capacity and serves as a partition for data. Each shard provides:
- **Ingress**: 1 MB/s or 1,000 records per second
- **Egress**: 2 MB/s

You can manually scale your stream by increasing or decreasing the number of shards. Pricing is based on the number of shards provisioned per hour.

#### On-Demand Mode

In On-Demand Mode, you do not need to provision or manage capacity. The stream automatically scales based on the observed throughput peak during the previous 30 days, with a default starting capacity of 4 MB/s ingress. Pricing is calculated per stream per hour plus data ingress and egress costs per GB.

## Amazon Kinesis Data Firehose

Amazon Kinesis Data Firehose (formerly Kinesis Data Firehose) is a fully managed service that delivers streaming data from sources to destinations with minimal operational overhead. It handles buffering, transformation, and batch delivery automatically, making it straightforward to load streaming data into data lakes, warehouses, and analytics platforms.

Firehose accepts records up to 1 MB each and accumulates them into buffers based on size or time thresholds. When a buffer reaches its trigger condition, Firehose performs a batch write to the configured destination. Supported destinations include Amazon S3, Amazon Redshift, Amazon OpenSearch, third-party services (such as Datadog, Splunk, and MongoDB), and custom HTTP endpoints.

### Capabilities

**Fully Managed and Serverless** — Firehose automatically scales to match your throughput, eliminating the need to provision or manage capacity. You pay only for the data ingested, with no charges for unused infrastructure.

**Near Real-Time Delivery** — Data reaches destinations with minimal latency through configurable buffering based on size (in megabytes) or time (in seconds). Choose tighter buffer thresholds for lower latency or larger buffers for better throughput efficiency.

**Data Transformation** — Optionally invoke an AWS Lambda function to transform each record before delivery. This enables format conversion, enrichment, filtering, or custom processing without requiring separate compute infrastructure.

**Format Support and Conversion** — Firehose supports ingestion and delivery of CSV, JSON, Parquet, Avro, raw text, and binary data. It can automatically convert records to Parquet or ORC formats and compress output using GZIP or Snappy, reducing storage costs and improving query performance.

**Backup and Error Handling** — Firehose can send all records or only failed records to an Amazon S3 backup location. This ensures no data is lost and provides an audit trail for troubleshooting.

### Firehose vs. Data Streams

Amazon Kinesis Data Streams and Kinesis Data Firehose serve different use cases:

| Feature | Data Streams | Firehose |
|---------|--------------|----------|
| **Purpose** | Real-time streaming data collection | Load streaming data into destinations |
| **Architecture** | Requires producer and consumer code | Fully managed delivery pipeline |
| **Latency** | Real-time | Near real-time with configurable buffering |
| **Capacity** | Provisioned (manual shards) or on-demand | Auto-scaling, fully managed |
| **Data Retention** | Up to 365 days (replayable) | No persistent storage (immediate delivery) |
| **Replay** | Supported | Not supported |
| **Use Case** | Custom processing, real-time analytics | Direct load into S3, Redshift, OpenSearch, third-party services |


## Managed Service for Apache Flink

Amazon Managed Service for Apache Flink (formerly known as Kinesis Data Analytics for Apache Flink) is a fully managed service for building and running real-time streaming applications. Apache Flink is a distributed framework for processing data streams using Java, Scala, or SQL. It offers powerful capabilities for stateful stream processing, windowing, event time semantics, and complex event correlation across multiple data streams.

Managed Service for Apache Flink allows you to deploy any Apache Flink application on an AWS-managed cluster without provisioning or managing underlying infrastructure. AWS automatically provisions compute capacity, manages parallel execution across multiple worker nodes, and scales resources to match your application's throughput demands. The service includes automatic checkpointing and snapshots for fault tolerance and application state recovery, ensuring your application can resume processing from the exact point of failure.

Use Apache Flink's rich ecosystem of libraries and programming features to implement complex transformations, aggregations, joins, and enrichments on streaming data. Note that Flink consumes data from Kinesis Data Streams and other sources, but does not read directly from Amazon Kinesis Data Firehose.

## Route 53

Amazon Route 53 is a highly available, scalable, fully managed, and authoritative DNS service. Route 53 gives you the ability to update DNS records and functions as a domain registrar. It provides health checking capabilities to monitor resource availability. Route 53 is the only AWS service with a 100% availability SLA.

### Records

Route 53 records define how to route traffic for a domain. Each record contains a domain or subdomain name, record type, value, routing policy, and TTL (Time to Live). Route 53 supports the following record types: A, AAAA, CNAME, and NS.

#### Record Types

- **A**: Maps a hostname to an IPv4 address.
- **AAAA**: Maps a hostname to an IPv6 address.
- **CNAME**: Maps a hostname to another hostname. You cannot create a CNAME record for the top node (apex) of a namespace.
- **NS**: A name server record that controls how traffic is routed for the domain within a hosted zone.

### Hosted Zones

A hosted zone is a container for records that define how to route traffic to a domain and its subdomains.

- **Public Hosted Zones**: Contain records that specify how to route traffic on the internet.
- **Private Hosted Zones**: Contain records that route traffic within a VPC.

Each hosted zone costs $0.50 per month.

### Routing Policies

#### Weighted Routing Policy

The weighted routing policy controls the percentage of requests that go to each resource. You assign each record a weight value. Weights do not need to sum to 100. DNS records must have the same name and type to use weighted routing. Weighted routing can be associated with health checks.

Common use cases include load balancing and testing new application versions. A weight of 0 stops sending traffic to that resource. If all records have a weight of 0, traffic is distributed equally among all records.

#### Latency-Based Routing Policy

The latency-based routing policy redirects traffic to the resource with the least latency. Latency is measured based on the connection time to the AWS region associated with each record. This policy can be associated with health checks and provides failover capability.

#### Failover Routing Policy

In a failover configuration, a primary record is associated with a health check. If the health check determines that the primary resource is unhealthy, Route 53 automatically fails over to a secondary resource. Failover routing supports only one primary and one secondary resource.

## RDS Read Replicas vs Multi AZ

Read Replicas scale read operations by distributing database read traffic. You can create up to 15 read replicas per database instance within the same Availability Zone, across multiple Availability Zones, or across regions. Replication is asynchronous, which means read replicas are eventually consistent with the primary database. Read replicas can be promoted to become independent databases that accept both read and write operations. Applications must update their connection strings to leverage read replicas for read-heavy workloads.

A common use case is scaling reporting applications: create a read replica of your production database to run reporting queries without affecting production workloads. Read replicas handle SELECT statements only and do not accept write operations while in replica mode.

### Cross-Region Read Replicas

Replicating read replicas within the same region incurs no fee. Replication across regions to different AWS regions incurs a data transfer fee.

### Multi-AZ Deployments

Multi-AZ (Disaster Recovery) deployments provide synchronous replication to a standby database in a different Availability Zone. The standby instance replicates all changes synchronously with the primary database. With Multi-AZ, applications connect using a single DNS name, and Amazon RDS automatically fails over to the standby instance if the primary becomes unavailable due to loss of the Availability Zone, network failure, or storage failure. No manual intervention is required; the standby is automatically promoted to the primary role during a failover. Multi-AZ deployments increase availability but are not designed for scaling read capacity. Read replicas can be configured with Multi-AZ enabled for additional protection.

#### Converting Single AZ to Multi-AZ

Converting a single-Availability Zone database to Multi-AZ is a zero-downtime operation that does not require stopping the database. To enable Multi-AZ, modify the database instance and select the Multi-AZ option. Amazon RDS takes a snapshot of the primary database, restores it in a new Availability Zone, and then establishes synchronous replication between the two instances.

## Aurora

Amazon Aurora is a fully managed, MySQL- and PostgreSQL-compatible relational database engine built by AWS. Aurora separates compute from storage, storing data across three Availability Zones in six copies regardless of how many database instances are running. The storage layer is self-healing: Aurora continuously scans data blocks and disks for errors and repairs them automatically. Aurora is designed to deliver up to five times the throughput of standard MySQL and three times the throughput of standard PostgreSQL at a fraction of the cost of commercial databases.

An Aurora **cluster** consists of one primary instance that accepts reads and writes and up to 15 Aurora Replicas that serve read traffic. All instances in the cluster share the same underlying cluster volume, so replicas do not need to replicate data independently — they read from the same distributed storage. This architecture means a replica can be promoted to primary in typically under 30 seconds.

### High Availability and Failover

Aurora stores six copies of your data across three Availability Zones — four copies are required for write availability and three copies for read availability. Aurora can tolerate the loss of up to two copies of data without affecting write availability and up to three copies without affecting read availability. The cluster volume automatically grows in 10 GB increments up to 128 TiB, with no storage provisioning required.

Aurora automatically fails over to an Aurora Replica in the event of a primary instance failure. Failover priority is determined by the tier assigned to each replica (tier 0 is highest priority). If multiple replicas share the same tier, Aurora promotes the one with the largest instance size. If no replica exists, Aurora attempts to create a new primary instance in the same Availability Zone; if that fails, it tries a different Availability Zone. All applications connect through the **cluster endpoint**, a DNS name that automatically resolves to the current primary instance — no connection string changes are required after a failover.

The **reader endpoint** load-balances connections across all available Aurora Replicas, distributing read traffic evenly. The reader endpoint automatically adjusts as replicas are added or removed. Individual replica endpoints are also available for cases where you need to direct traffic to a specific instance.

### Replicas

Aurora Replicas serve two purposes simultaneously: they handle read traffic to scale read capacity, and they act as automatic failover targets for the primary instance. Up to 15 Aurora Replicas can be created in a single Aurora cluster across multiple Availability Zones. Replication from the primary to all replicas is synchronous at the storage layer with minimal replica lag, typically in the single-digit milliseconds range.

Each Aurora Replica can be assigned a failover priority tier (0–15) and a promotion weight. During an automated failover, Aurora selects the replica with the highest priority tier. If you do not want a particular replica to be a failover candidate, assign it the lowest tier.

**Auto Scaling for Aurora Replicas** allows the cluster to automatically add or remove replicas in response to changes in read traffic. Define an Application Auto Scaling policy targeting average CPU utilization or average connections per instance. Aurora adds replicas when demand increases and removes them when demand subsides, subject to the minimum and maximum replica count you configure. Auto scaling uses a cooldown period to prevent rapid scaling oscillations.

### Backups and Point-in-Time Recovery

Aurora automatically backs up the cluster volume continuously to Amazon S3. Automated backups are always enabled and cannot be disabled. The backup retention period ranges from 1 to 35 days. Unlike RDS, Aurora does not take periodic snapshots of entire instances; instead, the continuous backup captures every change at the storage level, enabling point-in-time recovery to any second within the retention period.

Manual DB cluster snapshots can be taken at any time and are retained indefinitely until explicitly deleted. Snapshots are stored in S3 and can be used to restore to a new cluster. Sharing snapshots across AWS accounts and copying them across regions are both supported for cross-account and cross-region restore workflows.

Restoring from a snapshot creates a new Aurora cluster; you cannot restore in-place to the existing cluster. Point-in-time restore also creates a new cluster, leaving the original cluster intact, which enables you to recover from accidental data modification without disrupting the running database.

**Aurora Backtrack** is a MySQL-compatible Aurora feature that allows you to rewind the cluster to a prior point in time without restoring from a backup. Backtrack operates on the live cluster and completes in seconds, making it far faster than a point-in-time restore. You configure a backtrack window of up to 72 hours. Backtrack is useful for quickly recovering from accidental DML operations such as unintended deletes or updates. Note that Backtrack is not a substitute for backups — it modifies the running cluster state — and it is not available for Aurora PostgreSQL.

### Aurora Serverless

**Aurora Serverless v2** automatically scales database capacity in fine-grained increments based on actual application demand, measured in Aurora Capacity Units (ACUs). Capacity scales up within milliseconds to handle sudden traffic spikes and scales down during idle periods to minimize cost. You define a minimum and maximum ACU range, and Aurora Serverless v2 manages scaling within those bounds continuously.

Aurora Serverless v2 supports all Aurora features, including Multi-AZ deployments, Aurora Replicas, global databases, and read replicas. It is suitable for development environments, variable workloads, multi-tenant applications, and any workload where predicting peak capacity is difficult. Aurora Serverless v2 runs in your VPC and supports all Aurora security features including encryption, VPC isolation, and IAM authentication.

The original **Aurora Serverless v1** scales in coarser increments and pauses completely during inactivity (cold starts on resume). v1 has significant feature limitations compared to v2 and is considered the legacy option. New deployments should use Aurora Serverless v2.

### Security

Aurora integrates with AWS KMS for encryption at rest. Enabling encryption at cluster creation encrypts the underlying storage, automated backups, snapshots, and replicas. Encryption cannot be enabled on an existing unencrypted cluster; instead, take a snapshot, copy it with encryption enabled, and restore a new encrypted cluster from that snapshot.

Encryption in transit is enforced via SSL/TLS. Aurora supports IAM database authentication, which generates short-lived tokens using AWS credentials and eliminates the need to store long-lived database passwords in application configuration. IAM authentication is available for both MySQL- and PostgreSQL-compatible Aurora clusters.

Network isolation is provided through VPC placement. Security groups control inbound and outbound access to Aurora instances. Aurora integrates with AWS Secrets Manager for automatic rotation of database credentials without requiring application downtime.

### Monitoring and Events

Aurora publishes CloudWatch metrics at the instance and cluster level, including CPU utilization, database connections, freeable memory, read and write IOPS, replica lag, and storage consumed. For Aurora Serverless v2, ACU utilization metrics allow you to evaluate whether the configured ACU range is appropriate.

**Enhanced Monitoring** publishes OS-level metrics to CloudWatch Logs at granularities as fine as one second, providing visibility into CPU, memory, file system, and disk I/O at the operating system layer rather than the hypervisor layer.

**Performance Insights** provides a dashboard for analyzing database load by wait events, SQL statements, hosts, and users. The default retention period is seven days; extending it to two years is available at additional cost. Performance Insights is valuable for identifying slow queries and locking contention without the overhead of query profiling at the application level.

**Aurora Events** are published to Amazon EventBridge and can be subscribed to through Amazon SNS. Event categories include failover, maintenance, notification, and configuration change. Subscribing to failover events allows automation, such as triggering Lambda functions to notify on-call engineers or update DNS records, when a failover occurs.

### Global

Aurora Global Database and Aurora Cross-Region Read Replicas are the two mechanisms for deploying Aurora data across multiple AWS regions. They serve similar goals — cross-region read scaling and disaster recovery — but differ significantly in replication mechanism, failover capability, and recovery time objectives.

#### Aurora Cross-Region Read Replicas

Aurora Cross-Region Read Replicas use logical replication to replicate data from a primary Aurora cluster to an Aurora cluster in a different region. Each cross-region replica is a standalone Aurora cluster with its own cluster volume. Replication is asynchronous; the replica lag can range from seconds to minutes depending on replication volume and network conditions.

Cross-region read replicas are appropriate for serving read traffic to users in a distant region, reducing read latency by directing those queries to a geographically closer cluster. They also provide a DR option: a cross-region read replica can be manually promoted to a standalone read-write cluster during a regional disaster, but promotion requires manual action and the replica lag at the time of failure determines the recovery point objective (RPO).

Replication uses the MySQL or PostgreSQL binary log mechanism, which consumes I/O resources on the primary cluster. Data transfer charges apply for replication traffic across regions.

#### Aurora Global Database (recommended)

Aurora Global Database replicates at the storage layer rather than through logical replication. Writes committed to the primary region are replicated to up to five secondary regions with typical latency under one second. Secondary regions contain read-only Aurora clusters that serve low-latency reads from the replicated storage. The entire replication path operates below the database engine, placing no additional I/O or CPU burden on the primary cluster.

Aurora Global Database enables a recovery time objective (RTO) of typically under one minute and a recovery point objective (RPO) of five seconds or less — far stronger guarantees than cross-region read replicas. During a regional disaster, you perform a **managed failover** (or **detach and promote** for unplanned outages) to promote a secondary region to become the new primary. After promotion, the secondary cluster accepts writes and all remaining secondary clusters redirect replication to the new primary.

**Planned managed failover** is the preferred operation for routine DR drills or controlled region migrations. Aurora coordinates the failover so that all pending transactions in the primary region are flushed to the secondary before the switch, ensuring zero data loss. The operation takes approximately one minute to complete.

For RPO-critical workloads, **Aurora Global Database write forwarding** allows read-only secondary clusters to forward write operations to the primary region transparently. This simplifies application architecture by allowing connections to the secondary cluster to issue writes without the application needing to detect or redirect to the primary endpoint.

Aurora Global Database supports Aurora Serverless v2, Aurora Replicas, and all standard Aurora security and monitoring features in each region. Choose Aurora Global Database over cross-region read replicas whenever near-zero RPO, fast automated failover, or minimal replication overhead on the primary cluster is required.


## ElastiCache

ElastiCache manages Redis or Memcached, in-memory databases that provide high performance and low latency. They reduce load on relational databases during read-intensive workloads and enable applications to become stateless by storing session state and application state in the cache. AWS handles all infrastructure maintenance, patching, optimizations, setup, configuration, monitoring, failover, and backups. However, using ElastiCache requires significant application code changes to query the cache before or after querying the database.

### Architecture

ElastiCache operates through a cache-aside pattern:

1. **Cache Hit**: The application queries ElastiCache first. If the query result is cached, the application retrieves the data from the cache, saving a trip to the database.
2. **Cache Miss**: If the data is not in the cache, the application fetches it from the database, then writes the data back to the cache.
3. **Cache Invalidation**: A cache invalidation strategy must be implemented to ensure the cached data remains current.

A common use case is a user session store, where the application writes session data to ElastiCache. Users remain logged in if their requests are routed to another instance of the application, since the session data is persisted in the cache rather than in the instance's local memory.

### Redis vs. Memcached

**Redis** is a single-threaded, in-memory data structure store with the following capabilities:

- Multi-Availability Zone support with automatic failover
- Read replicas to scale read performance and provide high availability
- Data durability using AOF (Append-Only File) persistence
- Backup and restore functionality
- Support for complex data structures including sets and sorted sets

**Memcached** is a simpler, multithreaded caching system designed for distributed scenarios:

- Multinode architecture for partitioning data across nodes (sharding)
- No built-in high availability or failover
- No persistence—data is lost if the node restarts
- Backup and restore available only for the serverless version
- Multithreaded architecture for better performance in highly concurrent scenarios

### Replication: Cluster Mode Disabled

In cluster mode disabled, ElastiCache uses a single shard containing one primary node and up to five read-only replica nodes. All nodes hold a copy of the entire dataset.

- **Replication**: Asynchronous replication from the primary to replicas
- **Read/Write Operations**: The primary node handles all read and write operations; replica nodes are read-only
- **High Availability**: Multi-Availability Zone is enabled by default, providing failover capability if the primary node fails
- **Data Loss Protection**: Replicas guard against data loss in the event of a node failure
- **Read Scaling**: Replicas allow horizontal scaling of read performance

#### Horizontal Scaling

Scale read performance by adding or removing read replicas without downtime.

#### Vertical Scaling

Scale the cluster up or down by changing to a larger or smaller node type. ElastiCache internally creates a new node group, replicates data, and updates the DNS records to point to the new nodes.

### Replication: Cluster Mode Enabled

In cluster mode enabled, ElastiCache partitions data across multiple shards, allowing both read and write scaling:

- **Data Partitioning**: Each shard holds a subset of the data, enabling horizontal scaling of write capacity
- **High Availability**: Each shard has a primary node and up to five replica nodes; Multi-Availability Zone is enabled by default
- **Cluster Size**: The cluster supports up to 500 nodes with various shard configurations:
  - 500 shards with a single master each (1,500 nodes total with replicas)
  - 250 shards with one master and one replica each
  - 83 shards with one master and five replicas each

### Auto Scaling

ElastiCache can automatically increase or decrease the number of shards and replicas based on performance metrics. Auto scaling supports both tracking-based policies (respond to current metrics) and scheduled policies (scale at specific times). This feature is available only for Redis with cluster mode enabled.

### Redis Connection Endpoints

ElastiCache provides different endpoint types depending on the cluster configuration:

- **Standalone Node**: One endpoint for both read and write operations
- **Cluster Mode Disabled**: Two endpoints—a primary endpoint for read and write operations, and a reader endpoint that distributes read operations across all replica nodes
- **Cluster Mode Enabled**: A cluster configuration endpoint for all read and write operations that support cluster-aware commands, and node endpoints for read-only operations on individual nodes

## DynamoDB

Amazon DynamoDB is a fully managed NoSQL database service with high availability through multi-Availability Zone replication. As a cloud-native, AWS-proprietary service with transaction support, DynamoDB scales to massive workloads, supporting millions of requests per second with the capacity to store trillions of rows and hundreds of terabytes of data. It integrates with AWS Identity and Access Management (IAM) for security, offers low cost through pay-as-you-go pricing, and requires no maintenance while providing always-on availability. DynamoDB supports both Standard and Infrequent Access table classes for cost optimization.

### Table Structure

DynamoDB is organized as a collection of tables. Each table requires a primary key, defined at creation time, and can store an unlimited number of items. Each item is a collection of attributes that can be added over time and may be null. The maximum item size is 400 KB. DynamoDB supports scalar types, document types, and set types, allowing the schema to rapidly evolve without pre-defining all attributes.

### Read/Write Capacity Modes

#### Provisioned Mode (Default)

In provisioned mode, you specify the number of read and write capacity units (RCU and WCU) per second based on planned capacity. You pay for every provisioned RCU and WCU, whether consumed or not. This mode works well when your workload is predictable.

#### On-Demand Mode

In On-Demand mode, read and write capacity automatically scales with your workload without requiring planning or specifying RCU and WCU limits. You pay only for what you use, making this mode more expensive for consistent, predictable workloads. On-Demand is ideal for unpredictable workloads, workloads with traffic spikes, or applications with only a few transactions per day.

### DynamoDB Accelerator (DAX)

DynamoDB Accelerator (DAX) is a fully managed, highly available, seamless in-memory cache for DynamoDB that solves read congestion by caching frequently accessed data. It delivers microsecond latency for cached data and is compatible with DynamoDB APIs, requiring no application logic changes. DAX has a default TTL of 5 minutes.

### DAX versus ElastiCache

DAX placed in front of DynamoDB is helpful for caching individual objects and query or scan results. ElastiCache is better suited for storing aggregation results and other application-level caching scenarios that do not directly depend on DynamoDB.

### Stream Processing

DynamoDB Streams provide an ordered stream of item-level modifications in a table. Streams allow you to capture and process changes to your data in real-time.

#### DynamoDB Streams

DynamoDB Streams provide 24-hour retention of ordered change records with support for limited consumers. Process stream events using Lambda triggers or the DynamoDB Streams Kinesis Adapter, which bridges DynamoDB Streams to Kinesis Data Streams for additional flexibility.

#### Kinesis Data Streams

Kinesis Data Streams offer 1-year retention and support more consumers than DynamoDB Streams. Process events using Lambda, AWS Glue streaming ETLs, Amazon Kinesis Data Analytics, Amazon Kinesis Data Firehose, and other AWS services for real-time data processing at scale.

### Global Tables

Global Tables enable two-way replication, making a DynamoDB table accessible with low latency across multiple AWS regions. This active-active replication model allows applications to read and write to the table in any region. You must enable DynamoDB Streams on the table to use Global Tables.

### Time To Live (TTL)

DynamoDB can automatically delete items after a specified expiration timestamp using the Time To Live (TTL) feature. Add an attribute to hold the expiration time, and DynamoDB will immediately expire and delete items past that timestamp. TTL is useful for keeping only the most current items, meeting regulatory requirements, or managing web session data.

### Disaster Recovery

#### Continuous Backups with Point-in-Time Recovery (PITR)

Enable continuous backups with point-in-time recovery (PITR) to create snapshots of your table over time. PITR is optionally enabled for the last 35 days of history, allowing you to restore the table to any point within the backup window. The recovery process creates a new table with the recovered data.

#### On-Demand Backups

Create full, long-term backups on demand without affecting read or write performance or latency. Configure and manage on-demand backups using AWS Backup with optional cross-region replication. Recovery from an on-demand backup creates a new table.

### S3 Integration

#### Exporting Tables to Amazon S3

You can export a DynamoDB table to Amazon S3 for analytics and archival. Enable PITR on your table, and you can export any snapshot from the last 35 days. The export does not consume read capacity or affect performance. Exports enable you to perform analysis on top of DynamoDB data, retain snapshots for auditing, run ETL pipelines on the exported data, and choose export formats including JSON or Amazon Ion.

#### Importing Tables from Amazon S3

Import data from CSV, DynamoDB JSON, or Amazon Ion formats stored in S3 to create a new DynamoDB table. The import process does not consume write capacity. Import errors are logged in CloudWatch Logs for troubleshooting.

## Database Migration Service

AWS Database Migration Service (DMS) enables quick and secure migration of databases to AWS. The service is resilient and self-healing, allowing the source database to remain available during the migration. DMS supports both homogeneous migrations (same database engine) and heterogeneous migrations (different database engines). It performs continuous data replication using Change Data Capture (CDC). To perform replication tasks, DMS requires an EC2 instance to host the replication engine.

### Sources

DMS can migrate data from a broad range of source databases:

- On-premises and EC2 instances: Oracle, Microsoft SQL Server, MySQL, MariaDB, PostgreSQL, MongoDB, SAP, and IBM Db2
- Azure SQL Database
- Amazon S3
- Amazon RDS
- Amazon DocumentDB

### Targets

DMS can migrate data to the following AWS and non-AWS targets:

- On-premises and EC2 instances
- Amazon RDS
- Amazon Redshift, Amazon DynamoDB, Amazon S3
- Amazon Kinesis Data Streams
- Amazon OpenSearch Service
- Apache Kafka
- Amazon DocumentDB and Amazon Neptune
- Amazon ElastiCache for Redis and Babelfish

### Schema Conversion Tool (SCT)

The Schema Conversion Tool (SCT) converts database schemas from one database engine to another. SCT is not required when migrating to the same database engine.

#### Continuous Replication

### Multi-AZ Deployment

When Multi-AZ deployment is enabled, DMS provisions and maintains a synchronous standby replica in a different Availability Zone. This provides data redundancy, eliminates I/O freezes, and minimizes latency spikes.

### Replication Task Monitoring

Replication tasks can be monitored through several indicators:

- **Task status** indicates the condition of the replication task (creating, running, stopped, etc.)
- **Task status bar** provides an estimate of the task's progress
- **Table state** shows the current state of each table (before load, table completed, etc.)
- **Operation counts** track the number of inserts, deletions, and updates for each table

### CloudWatch Metrics

DMS publishes detailed metrics to CloudWatch for monitoring replication tasks. These metrics fall into three categories:

#### Host Metrics

Performance and utilization statistics for the replication instance host, including:

- `CPUUtilization`
- `FreeableMemory`
- `FreeStorageSpace`
- `WriteIOPS`

#### Replication Task Metrics

Statistics for the replication task, including:

- Incoming and committed changes
- Latency between the host and source database
- Latency between the host and target database
- `FullLoadThroughputRowsSource`
- `FullLoadThroughputRowsTarget`
- `CDCThroughputRowsSource`
- `CDCThroughputRowsTarget`

#### Table Metrics

Statistics for tables that are in the process of being migrated, including:

- Number of INSERT, UPDATE, DELETE, and DDL statements completed


## S3 Replication (CRR & SRR)

Amazon S3 Replication enables asynchronous copying of objects between Amazon S3 buckets. Versioning must be enabled on both the source and destination buckets to use replication.

**Replication Types:**
- **Cross-Region Replication (CRR)**: Copies objects to a bucket in a different AWS region
- **Same-Region Replication (SRR)**: Copies objects to a bucket in the same region

**Key Characteristics:**
- Replication is asynchronous — objects are copied after they are written to the source bucket
- Source and destination buckets can reside in different AWS accounts
- Proper IAM permissions must be configured to allow the replication service to read from the source and write to the destination

**Use Cases:**
- **CRR**: Compliance and data residency requirements, reduced latency for geographically distributed users, disaster recovery, cross-account replication for organizational separation
- **SRR**: Log aggregation across environments, live replication between production and test accounts for testing and validation


## Storage Gateway

AWS Storage Gateway is a hybrid cloud service that bridges on-premises infrastructure with cloud infrastructure by exposing Amazon S3 data and storage capabilities to on-premises applications. The service uses Amazon EBS, Amazon S3, and Amazon S3 Glacier as backend storage.

### File Gateway *NEEDS REVIEW*

File Gateway allows on-premises applications to access Amazon S3 objects through a cached file share interface. The cache is automatically maintained by Storage Gateway, but consistency between the cache and the actual S3 bucket must be managed carefully.

**Cache Consistency Behavior:**
- When files are written to the File Gateway, they are cached locally
- Files uploaded directly to Amazon S3 (bypassing the gateway) will not automatically appear in the on-premises file share cache
- Connected clients may see stale files until the cache is refreshed

**Refreshing the Cache:**
The RefreshCache API can be invoked in two ways to ensure on-premises clients see the latest objects:
- **On-Demand**: Call the RefreshCache API directly when an update is needed
- **Scheduled**: Use AWS Lambda to invoke RefreshCache periodically, or trigger it automatically in response to Amazon S3 events via Amazon EventBridge

#### Automated Cache Refresh

Automated Cache Refresh is a built-in File Gateway feature that eliminates the need to manually invoke the `RefreshCache` API or configure external automation. You set a cache refresh interval (TTL) on the file share, and the gateway automatically polls Amazon S3 for changes at that interval. When the gateway detects new or modified objects, it updates its local cache so that on-premises clients see the latest data without manual intervention.

## Auto Scaling Group Scaling Policies

Auto Scaling Groups support multiple scaling strategies to adjust capacity based on demand, schedules, or predicted load. Each strategy offers different benefits for various use cases.

### Dynamic Scaling

Dynamic scaling automatically adjusts capacity in response to real-time demand signals.

**Target Tracking Scaling** is the simplest approach to configure. You define a target metric value (such as 50% CPU utilization), and the Auto Scaling Group automatically scales out to increase capacity or scales in to decrease capacity to maintain that target. This strategy is easy to set up and works well for most applications.

**Step Scaling** and **Simple Scaling** trigger scaling actions when CloudWatch alarms breach defined thresholds. Step scaling supports multiple step adjustments with different capacity changes depending on how far the metric exceeds the threshold, while simple scaling applies a single adjustment when the alarm triggers.

### Scheduled Scaling

Scheduled scaling allows you to anticipate scaling needs based on predictable usage patterns. You specify a schedule (for example, scale up every morning at 8 AM or every weekday at 9 AM) to pre-position capacity before demand arrives, reducing the time to serve requests and improving application responsiveness.

### Predictive Scaling

Predictive scaling continuously analyzes historical metrics and forecasts future load using machine learning. The Auto Scaling Group automatically schedules scaling actions ahead of predicted demand spikes, combining the benefits of proactive capacity planning with data-driven accuracy.

### Scaling Metrics

The Auto Scaling Group can scale based on several standard CloudWatch metrics or any custom metric:

- **CPU Utilization**: The average CPU usage across all instances in the group
- **Request Count Per Target**: The number of requests per EC2 instance, useful for maintaining stable request distribution
- **Average Network In or Out**: Network throughput across the group
- **Custom Metrics**: Any metric pushed to CloudWatch by your application or monitoring systems

### Scaling Cooldown

After a scaling activity completes, the Auto Scaling Group enters a cooldown period (default 300 seconds) during which it will not launch or terminate additional instances. This prevents rapid, redundant scaling actions in response to the same metric change.

To reduce the cooldown period, use pre-built Amazon Machine Images (AMIs) with your application and dependencies already configured. Instances launched from optimized AMIs start serving requests faster, reducing the time needed before capacity stabilizes and the cooldown can be safely shortened.

### Lifecycle Hooks

Lifecycle hooks allow you to perform custom actions during instance launch and termination, giving your application time to initialize properly or shut down gracefully.

By default, instances transition to "in service" immediately when launched in the Auto Scaling Group. With lifecycle hooks, you can place new instances in a "pending" state, run initialization scripts or perform validation checks, and then signal the Auto Scaling Group to proceed when ready.

Similarly, when instances are terminated, lifecycle hooks place them in a "terminating" state, allowing your application time to drain connections, save state, or perform cleanup before the instance is destroyed. You can signal the Auto Scaling Group to proceed immediately or wait for your custom logic to complete.

Lifecycle hooks integrate with Amazon EventBridge, Amazon SNS, and Amazon SQS, enabling automated notification and handling of scaling events across your infrastructure.

### Event Notifications

The Auto Scaling Group can send notifications via Amazon SNS for instance launch, launch errors, termination, and termination errors. Using Amazon EventBridge, you can create rules that match Auto Scaling Group events and trigger downstream actions:

- Instance launch and launch success/failure
- Instance termination and termination success/failure
- Refresh checkpoint reached
- Refresh started, succeeded, failed, or cancelled

### Termination Policies

Termination policies determine which instances are terminated first during scale-in operations, instance refresh cycles, or Availability Zone rebalancing. You can apply one or more policies in a specified evaluation order, and you can define custom termination policies backed by AWS Lambda.

**Default Policy** selects the Availability Zone with the most instances, then terminates the instance with the oldest launch template or launch configuration. If multiple instances use the same launch template, it terminates the instance closest to the next billing hour, minimizing wasted compute costs.

**Allocation Strategy** terminates instances to align the remaining capacity with your configured allocation strategy for balanced distribution.

**Oldest Launch Template** terminates the instance with the oldest launch template first.

**Oldest Launch Configuration** terminates the instance with the oldest launch configuration first.

**Closest to Next Instance Hour** terminates the instance closest to the end of its billing hour.

**Newest Instance** terminates the most recently launched instance first.

**Oldest Instance** terminates the instance that has been running the longest.

### Warm Pools

When an Auto Scaling Group scales out, it attempts to launch instances as fast as possible. However, some applications require significant initialization time before they can serve requests. Over-provisioning to absorb unexpected demand quickly increases costs without necessarily improving performance.

Warm pools reduce scale-out latency by maintaining a pool of pre-initialized instances in a low-cost state. When a scale-out event occurs, the Auto Scaling Group pulls instances from the warm pool instead of launching new ones, dramatically reducing the time to add capacity.

**Warm Pool Configuration:**
- **Minimum Pool Size**: The minimum number of instances to maintain in the pool
- **Maximum Prepared Capacity**: The maximum capacity of pooled instances; defaults to the Auto Scaling Group's maximum capacity or a custom value you specify
- **Instance State**: Pooled instances can run at full capacity (running), be in a low-cost stopped state (stopped), or use hibernation (hibernated) for fast startup with minimal cost

Instances in the warm pool do not contribute to Auto Scaling Group metrics that affect scaling policies, ensuring that pooled capacity does not trigger unwanted scale-in actions.

**Cost Optimization:** When instances are in a stopped state, you pay only for attached Amazon EBS volumes, providing significant cost savings compared to running instances. Lifecycle hooks are required to properly initialize instances as they transition from the warm pool to in-service state.

### Instance States

Pooled instances can operate in three states, each with different startup performance and cost characteristics:

| State | Startup Delay | Cost |
|-------|---------------|------|
| Running | Fastest | Highest |
| Stopped | Medium | Lower |
| Hibernated | Slower | Lowest |

### Instance Reuse Policy

By default, when an Auto Scaling Group scales in, it terminates instances and launches new replacement instances from the warm pool when needed. The instance reuse policy modifies this behavior to return instances to the warm pool on scale-in instead of terminating them. This reduces launch latency and costs by reusing existing instances rather than destroying and recreating them.

## Application Auto Scaling

Application Auto Scaling monitors your applications and automatically adjusts capacity to maintain steady, predictable performance at the lowest cost. This service allows you to set up scaling for multiple resources across multiple AWS services from a single unified console, eliminating the need to navigate across different service interfaces.

**Core Features:**

- **Centralized Resource Selection** — Point to your application and select the services and resources to scale without needing to configure individual alarms and scaling actions
- **Resource Discovery** — Search for and identify resources across services using CloudFormation stacks, resource tags, or EC2 Auto Scaling Groups
- **Scaling Plans** — Create scaling plans that automatically add or remove capacity based on demand
- **Scaling Policy Types** — Supports target tracking, step scaling, and scheduled scaling policies to match different workload patterns

## NAT Gateway

NAT Gateway is an AWS-managed Network Address Translation service that provides high bandwidth, high availability, and zero administrative overhead. You pay per hour plus data transfer charges. Each NAT Gateway is provisioned in a specific Availability Zone and uses an Elastic IP address for outbound traffic.

**Key Characteristics:**

- **Cannot be used by EC2 instances in the same subnet** — The originating subnet cannot use the NAT Gateway for its outbound traffic
- **Traffic Flow** — Traffic from private subnets routes through a NAT Gateway, which then forwards the traffic to an Internet Gateway for external connectivity
- **Scalable Bandwidth** — Starts at 5 Gbps with automatic scaling up to 100 Gbps without manual intervention
- **No Security Group Management** — Unlike NAT instances, NAT Gateways do not require security group configuration

### High Availability

NAT Gateway is resilient within a single Availability Zone but is not resilient across Availability Zones. To achieve fault tolerance across multiple Availability Zones, you must provision separate NAT Gateways in each Availability Zone. Each Availability Zone can independently manage its outbound traffic through its own NAT Gateway, eliminating the need for cross-Availability Zone failover if a single zone becomes unavailable.

## Multi-AZ Architecture

### Manual Multi-AZ Enablement

Several AWS services require you to manually configure Multi-AZ support:

- **Amazon EFS** — Requires explicit Availability Zone assignment
- **Elastic Load Balancing (ALB/NLB)** — Must be configured to use multiple Availability Zones
- **Auto Scaling Groups** — Require Availability Zone assignment for scaling operations
- **AWS Elastic Beanstalk** — Requires Availability Zone configuration
- **Amazon RDS** — Can be configured with a standby instance in a different Availability Zone for automatic failover
- **Amazon ElastiCache** — Supports Multi-AZ replication for failover capability
- **Aurora** — Data is automatically replicated across multiple Availability Zones, but instances must be explicitly configured for Multi-AZ deployment
- **Amazon OpenSearch (Managed)** — Can be deployed with multi-master configuration across Availability Zones
- **Self-Deployed Jenkins** — Multi-master deployments must be configured manually across Availability Zones

### Implicit Multi-AZ Support

The following AWS services are inherently Multi-AZ and require no configuration:

- **Amazon S3** — Objects are automatically replicated across multiple Availability Zones within a region
- **Amazon DynamoDB** — Tables are automatically distributed across Availability Zones
- **AWS Proprietary Services** — Services like AWS Lambda, Amazon SQS, and similar fully managed services operate across Availability Zones transparently

## Blue/Green Architecture

Blue/green deployments enable zero-downtime application updates by running two identical production environments and switching traffic between them. AWS provides multiple strategies depending on your application architecture:

### Application Load Balancer with Weighted Target Groups

A single Application Load Balancer can route traffic to two target groups simultaneously using weight-based distribution. The blue target group initially receives 100% of traffic, while the green target group is deployed alongside it. You can gradually shift traffic by adjusting weights (for example, 90% to blue and 10% to green), or switch all traffic at once by swapping target groups. This approach provides instant traffic cutover because the ALB controls routing directly without client-side caching.

### Route 53 DNS Switching

When using separate Application Load Balancers for blue and green environments, you switch between them using Route 53 DNS records. Route 53 allows you to point a single DNS name to either the blue or green ALB. However, DNS-based switching is slower than ALB-based switching because clients cache DNS query results. The switchover happens gradually as clients refresh their cached DNS records, making it less suitable for instantaneous cutovers and reducing your control over the exact moment when all traffic migrates.

### API Gateway Canary Deployments

API Gateway supports canary deployment stages that connect to new Lambda function versions. You deploy a canary stage pointing to the new function (for example, version 2) while the production stage continues using the current function (version 1). Internal routing mechanisms gradually send small amounts of traffic to the canary stage for validation. Once the canary stage behaves properly, you can promote it to production, giving you full control over traffic switching without modifying the API Gateway configuration or requiring client-side changes.

### Lambda Alias Traffic Shifting

A single API Gateway stage can use Lambda aliases to manage traffic distribution between function versions without any modifications to the API Gateway or client applications. The Lambda alias points to the current function version (v1), and you deploy a new version (v2). The alias then gradually shifts traffic between the two versions, allowing you to control the speed and volume of the migration while the API Gateway remains unchanged.

## Multi-Region Architecture

### Route 53 Health Checks for Automated DNS Failover

Route 53 uses health checks to enable automated DNS failover across multiple AWS regions. Health checks can monitor three types of resources:

1. **Endpoint Health Checks** — Monitor HTTP(S) endpoints such as application servers. Implement a `/health` route in your application that returns an HTTP 200 status code when healthy. Route 53 periodically calls this endpoint and removes the endpoint from DNS records if it fails.

2. **Calculated Health Checks** — Combine the results of multiple health checks using logical operators to create complex health evaluation rules.

3. **CloudWatch Alarm–Based Health Checks** — Link health checks directly to CloudWatch alarms, enabling you to trigger failover based on custom metrics or AWS service metrics. For example, you can monitor DynamoDB throttles or custom application metrics and automatically mark a region as unhealthy when the alarm is triggered.

Health check status itself is exposed as CloudWatch metrics, allowing you to monitor whether health checks are passing or failing.

### Multi-Region Deployment with Route 53 and DynamoDB Global Tables

Deploy identical application architecture across multiple regions and use Route 53 latency-based routing to direct users to the geographically closest region. In each region, run API Gateway and Lambda functions as the application tier. For the data layer, configure a DynamoDB Global Table to replicate the table across all regions. This ensures that Lambda functions in each region have low-latency local access to data, reducing application latency and improving resilience.

### Complex Routing with Nested Failover and Latency Records

Route 53 supports nested routing policies to combine failover and latency optimization:

1. Create regional failover records such as `us.example.com` with primary endpoint in the US region and secondary endpoint in a backup region, and similarly create `eu.example.com` with primary in the EU region and secondary in the US.

2. Create a top-level domain record `example.com` as a latency-based alias that points to both `us.example.com` and `eu.example.com`. This configuration routes requests to the closest regional endpoint while maintaining resilience through per-region failover. If the primary endpoint in any region fails, Route 53 automatically fails over to the secondary, and users are routed to the next-closest region by latency.

## Disaster Recovery

Disaster recovery addresses events that negatively impact business continuity or financial operations. Recovery strategies vary by deployment model: **on-premises to on-premises** (traditional, high cost), **on-premises to cloud** (hybrid), and **cloud region to cloud region** (full cloud).

### Recovery Point Objective and Recovery Time Objective

Two key metrics drive disaster recovery architecture:

**Recovery Point Objective (RPO)** measures the maximum acceptable data loss, determined by backup frequency. RPO of one hour means hourly backups, so a disaster results in up to one hour of data loss. RPO values range from minutes to days depending on business requirements.

**Recovery Time Objective (RTO)** is the maximum acceptable downtime after a disaster strikes. RTO can range from 24 hours to minutes depending on application criticality. Lower RPO and RTO requirements increase cost due to more frequent backups, redundant infrastructure, and failover automation.

### Disaster Recovery Strategies

Strategies are ranked by RTO and cost, from lowest to highest:

#### Backup and Restore
High RPO, high RTO, lowest cost. Data is backed up to S3 or Glacier using **AWS Storage Gateway** for on-premises data or **AWS Snowball** for large bulk transfers. Cloud resources (EBS volumes, RDS databases, Redshift) have scheduled snapshots. On disaster, infrastructure is recreated from **Amazon Machine Images (AMIs)** and snapshots are restored. Only cost is backup storage; no running standby infrastructure required.

#### Pilot Light
Lower RPO and RTO than Backup and Restore at moderate cost. Critical core systems (typically databases) continuously replicate to the cloud via **RDS replication** and remain running. Non-critical systems (EC2 instances) are not active. On disaster, **Route 53** DNS failover directs traffic to the cloud, and non-critical systems are provisioned on demand. Faster recovery than Backup and Restore because critical data is already current.

#### Warm Standby
Lower RPO and RTO at higher cost. Full system infrastructure runs in the cloud at minimum capacity: **Elastic Load Balancer (ELB)**, **EC2 Auto Scaling Group** at minimum capacity, and **RDS secondary** database with continuous replication. On disaster, Route 53 fails over DNS, and Auto Scaling immediately scales to production load.

#### Multi-Site / Hot Site (Active-Active)
Lowest RTO (minutes or seconds), highest cost. Full production-scale systems run simultaneously in two locations. **Route 53** distributes traffic to both on-premises and cloud resources. For all-cloud deployments, **Aurora Global Database** provides cross-region replication with both regions active. Failover requires minimal traffic redirection since both sites are already serving requests.

### Disaster Recovery Best Practices

**Backups**
- Use **EBS snapshots**, **RDS automated backups**, and schedule regular snapshots for **Redshift**
- Push backups to **S3** with **lifecycle policies** to migrate to **Glacier** for cost optimization
- Implement **cross-region replication** to ensure backups exist in multiple regions
- Use **AWS Snowball** for bulk on-premises data transfer and **Storage Gateway** for continuous hybrid backup

**High Availability**
- **Route 53 health checks** enable automated DNS failover across regions with failover, latency-based, or geoproximity routing policies
- Enable **RDS Multi-AZ** for automatic database failover
- Enable **ElastiCache Multi-AZ** and replicate across availability zones
- **Amazon EFS** and **S3** provide inherent multi-AZ redundancy
- Use **Site-to-Site VPN** as backup network connectivity if **Direct Connect** fails

**Replication**
- **RDS cross-region replication** asynchronously replicates data to standby databases
- **Aurora Global Database** synchronously replicates across regions with read-replica capability
- Third-party database replication software bridges on-premises databases to **RDS**
- **Storage Gateway** replicates on-premises data to AWS

**Automation**
- **CloudFormation** and **Elastic Beanstalk** quickly recreate complete environments from templates
- **CloudWatch alarms** trigger automatic EC2 instance recovery when health checks fail
- **AWS Lambda** automates custom recovery workflows and infrastructure orchestration

**Chaos Testing**
Proactively test disaster recovery by introducing controlled failures. Netflix uses **Simian Army** and **Chaos Monkey** to randomly terminate EC2 instances in production, validating infrastructure resilience under failure conditions. This approach ensures systems survive unexpected component failures and validates failover mechanisms.