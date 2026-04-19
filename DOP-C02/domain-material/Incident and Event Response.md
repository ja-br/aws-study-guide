## EventBridge

Amazon EventBridge is a serverless event routing service that connects event sources to targets based on configurable rules. EventBridge sits between sources—such as AWS services, third-party applications, and custom applications—and routes events to appropriate destinations. Rules define event patterns to match incoming events and determine which targets receive them. When an event matches a rule's pattern, EventBridge sends the event as JSON to the specified target. EventBridge also supports scheduling actions via cron expressions, enabling time-based automation without external job schedulers.

### Event Sources and Targets

EventBridge accepts events from a wide range of sources:

- **AWS services**: Amazon EC2 instances, AWS CodeBuild, Amazon S3, AWS Trusted Advisor, AWS CloudTrail
- **Partner event sources**: Third-party applications such as Zendesk, Datadog, and Auth0
- **Custom applications**: Any application that can send events to EventBridge

EventBridge routes matched events to a variety of targets:

- **AWS services**: AWS Lambda, AWS Batch, Amazon ECS tasks, Amazon SQS, Amazon SNS, Amazon Kinesis Data Streams, AWS Step Functions, AWS CodePipeline, AWS CodeBuild, AWS Systems Manager (SSM), Amazon EC2 actions

### Event Buses

EventBridge organizes event routing through three types of event buses:

- **Default event bus**: Receives events from AWS services within the same AWS account and region.
- **Partner event buses**: Receive events from partner applications (such as Zendesk, Datadog, or Auth0) after authentication with the partner.
- **Custom event buses**: Receive events from custom applications you create and control.

Event buses can be accessed by other AWS accounts using resource-based policies. This enables cross-account event aggregation and allows external identities to publish events to a bus in a different account.

### Event Archiving and Replay

EventBridge can archive events sent to a bus for later analysis and replay. When creating a rule, configure an archive by specifying which events to capture (all events or a filtered subset) and how long to retain them (indefinitely or for a specified period). Archived events can be replayed to the same targets at any time, enabling you to reprocess events after fixing a bug or changing a target configuration.

### Schema Registry

EventBridge can analyze events flowing through a bus and automatically infer their schema. The Schema Registry stores these inferred schemas and allows you to generate code for your applications based on the detected event structure. This code generation eliminates the need to manually define event types and enables type-safe event handling. Developers can generate language-specific code bindings (Python, Java, TypeScript, etc.) that match the actual event format on the bus, reducing integration errors and development time.

Schemas can be versioned as event structures evolve, allowing applications to handle multiple schema versions and easing migrations as event formats change.

### Resource-Based Policy

Resource-based policies on event buses control which principals can access them. Policies can allow or deny events from other AWS accounts or AWS regions, enabling cross-account and cross-region event routing architectures.

A common use case is aggregating all events from your AWS organization into a single event bus in a central account and region. By attaching a resource-based policy to that central bus, member accounts can publish events to it without needing cross-account IAM roles or additional network configuration.

## S3 Event Notifications

Amazon S3 Event Notifications enable you to trigger automated workflows when objects in a bucket are created, deleted, restored, or replicated. When a qualifying event occurs on an object, S3 sends a notification to a specified destination, allowing you to respond to changes in real time. A common use case is automatically generating thumbnail images when photographs are uploaded to a bucket, enabling responsive image processing without polling or continuous monitoring.

### IAM Permissions

S3 Event Notifications send events directly to destination services without using IAM roles on the S3 bucket. Instead, attach a resource-based access policy to the destination service (Amazon SQS queue, Amazon SNS topic, or AWS Lambda function) that grants S3 permission to publish or invoke on that destination. This policy grants the S3 service itself permission to deliver events, decoupling the notification configuration from identity and access management.

### S3 Event Notifications with EventBridge

S3 can publish events directly to Amazon EventBridge, which offers more advanced routing and filtering capabilities than direct S3 notifications. Events flow from the S3 bucket into EventBridge, where rules define event patterns and route matched events to targets. EventBridge supports over 18 different destination services, enabling multi-destination fan-out and sophisticated workflows.

EventBridge integration unlocks advanced filtering options through JSON rules that match on metadata, object size, and object name patterns, giving you granular control over which events trigger which targets. Beyond filtering, EventBridge provides capabilities such as event archiving, replay, schema registry, and cross-account event routing, making it the preferred solution for complex event-driven architectures.

### Event Types and Delivery

S3 Event Notifications support the following event types:

- **s3:ObjectCreated**: Triggered when an object is uploaded or created.
- **s3:ObjectRemoved**: Triggered when an object is deleted.
- **s3:ObjectRestore**: Triggered when an object is restored from archival storage.
- **s3:Replication**: Triggered when an object is replicated to another bucket.

Additional event types may be available depending on your AWS region and S3 features. Object name filtering allows you to configure notifications only for objects matching specific key prefixes or suffix patterns, reducing unnecessary notifications.

S3 Event Notifications typically deliver events to their destinations within seconds, but latency can extend to a minute or longer depending on load and network conditions. Events are delivered to Amazon SQS queues, Amazon SNS topics, or AWS Lambda functions specified in the notification configuration.

### Object Integrity

Use checksums to validate the integrity of objects after upload. S3 supports multiple checksum algorithms to detect corruption or tampering:

- **MD5**: Legacy checksum algorithm; supported for backward compatibility.
- **SHA-1**: Cryptographic hash function providing stronger integrity guarantees than MD5.
- **SHA-256**: Cryptographic hash function with enhanced security properties.
- **CRC32**: Cyclic redundancy check optimized for fast computation.
- **CRC32C**: Castagnoli variant of CRC32 with improved error detection.

The **ETag** header represents a specific version of an object and is used to verify successful uploads. When an object is encrypted with server-side encryption using S3-managed keys (SSE-S3), the ETag value equals the MD5 hash of the object's content. For objects encrypted with other methods or as multipart uploads, the ETag is computed differently and may not correspond directly to an MD5 hash. Always verify which checksum algorithm your upload client uses and configure S3 to validate that checksum upon receipt.

## Health Dashboard

AWS Health Dashboard is a global service that provides visibility into the health and performance of AWS services and your AWS resources. The Health Dashboard maintains an event log of service events and displays alerts, remediation guidance, proactive notifications, and scheduled activities that may affect your infrastructure and operations.

### Service History

The AWS Service History Dashboard shows the current and historical health of all AWS regions and services. It displays how each service has behaved over time, including any issues that occurred, and maintains historical information for each day. The Service History also provides an RSS feed that allows you to subscribe to service health updates and receive notifications of changes in real time.

### Your Account

The AWS Account Health Dashboard provides alerts and remediation guidance when AWS is experiencing events that may impact your resources. It displays the general status of AWS services and gives a personalized view into the performance and availability of services underlying your AWS resources. The Account Health Dashboard surfaces relevant and timely information to help you manage in-progress events and provides proactive notifications that allow you to plan for scheduled activities.

The Account Health Dashboard aggregates data from your entire AWS organization, enabling you to track events affecting multiple accounts and services in a centralized dashboard. This organization-wide visibility ensures that operations teams can coordinate responses to widespread events and communicate status to stakeholders across your infrastructure.

## Health Event Notifications

Use Amazon EventBridge to react to changes in AWS Health events that affect your AWS account. The AWS Health Dashboard triggers EventBridge, which then routes those events to configured targets for automated response. Health Event Notifications work with both **account events** (events affecting resources in your AWS account) and **public events** (events about the regional availability of a service). Possible actions include sending notifications, capturing event information, and taking corrective action, among others.

## EC2 Instance Status Check

Amazon EC2 instances run automated status checks that continuously monitor the underlying host infrastructure and the instance itself. These checks identify hardware failures, software misconfigurations, and network issues that may prevent normal operation. When a status check fails, you can take corrective action to restore the instance to a healthy state.

### Status Check Types

EC2 provides three types of status checks, each targeting a different layer of the infrastructure:

- **System status checks** monitor the health of the AWS infrastructure underlying your instance, including the physical host, network connectivity, and power delivery. When a system check fails, the underlying host may be experiencing a hardware failure or maintenance event. Check the AWS Personal Health Dashboard for scheduled critical maintenance windows. Resolution typically involves migrating the instance to a new host, which can be triggered through instance recovery actions or by stopping and starting the instance.

- **Instance status checks** monitor the operating system and software configuration running on your instance, including kernel panics, file system issues, and network configuration problems. These checks verify that the instance can communicate with its network interface and that the OS is functioning correctly. Resolution involves rebooting the instance or adjusting configuration settings.

- **Attached EBS status checks** monitor the reachability and I/O availability of Amazon EBS volumes attached to the instance. These checks confirm that the instance can complete read and write operations to each attached volume. Resolution may require rebooting the instance or replacing the volume if it is unreachable.

### CloudWatch Metrics & Recovery

EC2 status checks emit the following CloudWatch metrics:

- **StatusCheckFailed_System** fires when a system status check fails.
- **StatusCheckFailed_Instance** fires when an instance status check fails.
- **StatusCheckFailed_AttachedEBS** fires when an attached EBS volume status check fails.
- **StatusCheckFailed** fires when any status check fails (a composite metric).

#### Recovery Options

Two primary approaches can automatically recover a failed instance:

**Option 1: CloudWatch Alarm with Instance Recovery** — Create a CloudWatch Alarm that monitors a status check metric and triggers instance recovery when the metric breaches the threshold. A recovered instance retains the same private IP address, public IP address, Elastic IP (EIP), instance metadata, and placement group assignment. The alarm can also send a notification to an Amazon SNS topic to alert operations teams of the failure and recovery action.

**Option 2: Auto Scaling Group** — Configure an Auto Scaling Group (ASG) with appropriate minimum, maximum, and desired capacity settings. When an instance fails a status check, the ASG automatically terminates the unhealthy instance and launches a replacement. Note that the replacement instance receives a new private IP address and does not inherit the original instance's Elastic IP or public IP.

## CloudTrail

AWS CloudTrail provides governance, compliance, and audit capabilities for your AWS account by recording a comprehensive history of API calls and events. CloudTrail is enabled by default and captures all events and API calls made within your account via the AWS Management Console, AWS SDK, AWS CLI, and AWS services themselves. Logs can be delivered to Amazon CloudWatch Logs or Amazon S3 for centralized analysis. A trail can be configured to apply to all AWS regions (the default) or to a single region. CloudTrail enables forensic analysis—for example, if an AWS resource is deleted, CloudTrail can tell you who deleted it and when.

Events are retained in the CloudTrail console for 90 days by default. To retain logs for longer periods, send them to Amazon CloudWatch Logs or Amazon S3, where they can be archived and analyzed over time using tools like Amazon Athena.

### Events

CloudTrail captures three types of events, each with different logging behavior and use cases:

- **Management Events** represent operations performed on AWS resources, such as configuring security groups, setting up routing rules, and enabling logging. Management events are logged by default and can be separated into read and write events for granular audit trails.

- **Data Events** are not logged by default and consist of S3 object-level activity and AWS Lambda function execution activity. When enabled, data events can also be separated into read and write operations to provide detailed visibility into data plane operations.

- **CloudTrail Insights Events** automatically detect unusual activity in your account, including inaccurate resource provisioning, service limits being exceeded, unusual AWS IAM actions, and gaps in periodic maintenance activity. CloudTrail Insights analyzes normal management events to establish a baseline of typical account behavior and continuously analyzes write events to identify patterns that deviate from the baseline.

### Retention

CloudTrail events are stored for 90 days in the CloudTrail console. To retain logs beyond this period, send them to Amazon S3 and use Amazon Athena to analyze them over the long term. This approach provides durable, long-term compliance storage and enables sophisticated queries without significant cost.

### EventBridge Integration

CloudTrail can integrate with Amazon EventBridge to intercept API calls and route them as events into EventBridge. Rules in EventBridge can match specific API calls and trigger automated responses, such as sending notifications to Amazon SNS topics or invoking AWS Lambda functions. This integration enables reactive workflows where specific AWS API activity can automatically trigger remediation or alerting.

## SQS Dead Letter Queue

A Dead Letter Queue (DLQ) is a specialized Amazon SQS queue that receives messages that cannot be successfully processed by a consumer. When a consumer fails to process a message within the visibility timeout, the message is returned to the source queue for redelivery. You can set a threshold to limit how many times a message is redelivered before it is moved to the DLQ. This threshold is controlled by the `maxReceiveCount` attribute. Once a message has been returned to the queue and received more times than the `maxReceiveCount` value specifies, the message is automatically sent to the Dead Letter Queue for investigation and remediation.

Dead Letter Queues enforce strict queue type matching: the DLQ for a FIFO queue must also be FIFO, and the DLQ for a standard queue must also be standard. This ensures consistency in message ordering and delivery semantics between the source queue and its DLQ.

### Redrive to Source

**Redrive to Source** is a feature that enables you to consume messages from a DLQ to understand why processing failed. After identifying and fixing the bug in your consumer code, you can redrive messages from the DLQ back to the source queue in batches for reprocessing. This capability avoids the need to manually replay or reconstruct messages, streamlining the recovery workflow.

#### Redrive Policy

A **Redrive Policy** is a JSON object that configures the relationship between a source queue and its Dead Letter Queue. The policy references the Amazon Resource Name (ARN) of the DLQ. Redrive policies can also be attached at the Amazon SNS subscription level, allowing SNS messages that cannot be delivered to a subscriber to be routed to a DLQ for inspection and debugging.


## X-Ray

AWS X-Ray traces distributed requests across microservices and serverless applications to identify performance bottlenecks and debug errors. X-Ray integrates with multiple AWS services to capture trace data automatically or through explicit SDK instrumentation. A trace is a collection of segments and subsegments that represent the end-to-end path of a request through your application. Each segment records timing, error information, and custom metadata. The X-Ray console visualizes traces as service maps showing dependencies between services, call latency, error rates, and throughput.

The X-Ray agent (or the services themselves) must have AWS IAM permissions to write trace data to X-Ray. This requirement applies across all integration points, whether the agent runs separately or the service integrates natively.

### Integrations

AWS X-Ray integrates with the following services:

- **Amazon EC2**: Deploy the X-Ray agent on EC2 instances to collect and send trace data.
- **Amazon ECS**: Run the X-Ray agent as a separate task or deploy it as a Docker sidecar container alongside your application.
- **AWS Lambda**: X-Ray integrates natively with Lambda functions without requiring a separate agent.
- **AWS Elastic Beanstalk**: The X-Ray agent can be automatically installed and configured on the environment.
- **Amazon API Gateway**: X-Ray integrates natively with API Gateway to trace incoming requests.

### Beanstalk

AWS Elastic Beanstalk includes the X-Ray daemon by default. The daemon can be enabled via a console option or configured to run automatically through configuration files such as `.ebextensions`. The EC2 instance profile used by the Beanstalk environment must have IAM permissions that allow the X-Ray daemon to write trace data.

The application code deployed to Elastic Beanstalk must be instrumented with the X-Ray SDK to capture traces. The SDK instruments your application's code to send segment and subsegment data to the X-Ray daemon.

For multi-container Docker environments on Elastic Beanstalk, the X-Ray daemon is not provided automatically. You must run the daemon yourself—typically as a separate container in your Docker Compose configuration or as part of your deployment strategy.

