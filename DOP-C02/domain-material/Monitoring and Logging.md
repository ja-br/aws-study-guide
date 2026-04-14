## CloudWatch Metrics

Amazon CloudWatch provides metrics for every service in AWS. A metric is a variable representing a measurement—such as CPU utilization, network traffic, or disk I/O—collected at regular intervals over time. Metrics are organized into namespaces to separate metrics by service or application. Each metric carries a timestamp and can have up to 30 dimensions, which are attributes that break down a metric into different segments (for example, an instance ID or availability zone). Metrics enable you to visualize trends and performance through CloudWatch Dashboards, which display custom selections of metrics in a unified view.

### Custom Metrics

Create custom metrics to monitor application-specific data not provided by AWS services natively. Examples include memory usage, disk space consumption, number of logged-in users, or any custom application counter. Submit custom metrics using the `PutMetricData` API call.

Custom metrics support dimensions to segment data—for example, partitioning metrics by environment or host. The metric resolution (also called storage resolution) is an API parameter that controls the granularity at which the metric is stored. Standard resolution stores data at 1-minute intervals at no additional cost. High resolution stores data at 1-second, 5-second, 10-second, or 30-second intervals at higher cost, enabling detailed visualization and faster alerting on granular changes.

CloudWatch accepts data points dated up to two weeks in the past and up to two hours in the future, allowing for clock skew and backdated logging scenarios.

### Metric Streams

CloudWatch Metric Streams continually stream metrics to a destination with near-real-time delivery and low latency. Supported destinations include Amazon Kinesis Data Firehose, Datadog, Dynatrace, Splunk, and other third-party monitoring platforms. This capability decouples CloudWatch from your observability backend, allowing you to route metrics to multiple destinations simultaneously.

### Anomaly Detection

CloudWatch Anomaly Detection uses machine learning algorithms to continuously analyze metrics, determine normal baselines, and surface values that deviate from expected behavior. The service creates a model of each metric's expected values and highlights which values in graphs fall outside the normal range. You can create CloudWatch Alarms based on anomaly detection rather than fixed thresholds, allowing automatic alerting when behavior becomes abnormal even if thresholds are unknown. Anomaly Detection supports excluding specified time periods or events from training to prevent scheduled maintenance windows or known events from skewing the baseline model.

## CloudWatch Logs

CloudWatch Logs provides a central repository for log data from AWS services and applications. A log group is an arbitrary namespace that organizes related logs, while a log stream contains the actual log entries from a single instance, application, log file, or container. Log expiration policies automatically delete logs after a specified retention period, reducing storage costs for transient data.

CloudWatch Logs encrypts all data at rest by default using AWS-managed keys. For additional control, configure AWS Key Management Service (KMS) encryption with customer-managed keys to meet compliance requirements and enable audit trails through CloudTrail.

### Log Sources

CloudWatch Logs ingests data from multiple sources:

- **SDK and Agents**: Use the CloudWatch Logs SDK directly, the CloudWatch Logs Agent, or the unified CloudWatch Agent to send logs from any application or on-premises server.
- **Elastic Beanstalk**: Automatically collects logs from application deployments.
- **Amazon ECS**: Collects logs from containers running in ECS task definitions.
- **AWS Lambda**: Automatically captures function logs from stdout and stderr.
- **VPC Flow Logs**: Logs network traffic accepted or rejected by VPC security groups and network ACLs.
- **Amazon API Gateway**: Logs API requests and responses.
- **AWS CloudTrail**: Logs API calls and management events, optionally filtered.
- **Amazon Route 53**: Logs DNS queries.

### CloudWatch Logs Insights

CloudWatch Logs Insights is a query tool that searches and analyzes log data across single or multiple log groups. Write a query, specify a time frame, and receive results as a visualization that can be exported or added to a CloudWatch Dashboard. The service provides a purpose-built query language that automatically discovers fields from AWS services and JSON log events, allowing you to fetch specific fields, filter based on conditions, calculate aggregate statistics, sort and limit results. Saved queries can be reused and shared across teams.

Logs Insights supports querying multiple log groups across AWS accounts (with appropriate cross-account permissions) for centralized analysis. However, Logs Insights is not a real-time engine—queries reflect data written to CloudWatch Logs up to the query execution time.

### S3 Export

Export logs to Amazon S3 using the `CreateExportTask` API for batch processing and long-term archival. This operation is asynchronous and can take up to 12 hours to complete, making it unsuitable for real-time analysis but efficient for compliance retention and historical log analysis.

### Logs Subscriptions

Log Subscriptions enable real-time streaming of log events from a log group to a destination—Amazon Kinesis Data Streams, Amazon Kinesis Data Firehose, or AWS Lambda. A filter pattern can be applied to the subscription, so only matching log entries are sent to the destination, reducing data transfer and processing costs.

Subscriptions enable you to aggregate logs from different sources into a common destination within a single account, across multiple accounts, or across multiple regions. For cross-account log aggregation, use a CloudWatch Logs destination in the receiving account with an access policy that grants the source account permission to put events. Destination access policies control which accounts and principals are allowed to subscribe to a destination.

## CloudWatch Alarms

CloudWatch Alarms monitor a metric or log-based metric and trigger actions when the metric breaches a threshold. An alarm has three possible states: OK (metric is within threshold), ALARM (metric breached the threshold), and INSUFFICIENT_DATA (not enough data points to evaluate). Alarms evaluate metrics based on a statistic (average, sum, minimum, maximum, or count) and a comparison operator (greater than, less than, etc.) over a specified period.

Alarms can trigger notifications to Amazon Simple Notification Service (SNS) topics, invoke AWS Lambda functions, or trigger Auto Scaling actions. Composite alarms combine the results of multiple alarms using AND or OR logic to create sophisticated alerting rules that reduce false positives.

## CloudWatch Dashboards

CloudWatch Dashboards provide visual representations of metrics and logs. Create custom dashboards by selecting metrics, setting visualization parameters (line graph, stacked area, number widget, etc.), and arranging widgets in a grid layout. Dashboards enable operational visibility, making it easy for teams to monitor application health, infrastructure utilization, and business metrics in one place.

## X-Ray

AWS X-Ray traces distributed requests across microservices and serverless applications to identify performance bottlenecks and debug errors. X-Ray instruments Lambda functions, EC2 instances, Elastic Beanstalk, API Gateway, and other services automatically or through explicit SDK calls.

A trace is a collection of segments and subsegments that represent the end-to-end path of a request through your application. Each segment records timing, error information, and custom metadata. The X-Ray console visualizes traces as service maps showing dependencies between services, call latency, error rates, and throughput.

Sampling policies control which requests X-Ray instruments to balance cost and observability. By default, X-Ray samples the first request per second and 5% of additional requests. Customize sampling rules to instrument requests matching specific criteria (for example, all requests to a critical API endpoint) while ignoring routine traffic.

## EventBridge and CloudTrail

Amazon EventBridge routes events from AWS services, third-party applications, and custom applications to targets such as Lambda functions, SNS topics, SQS queues, or CloudWatch Logs. Define rules using event pattern matching to route specific events to appropriate handlers.

AWS CloudTrail logs all API calls and management events in your AWS account, creating an audit trail for compliance and forensic analysis. CloudTrail stores logs in Amazon S3 by default and can send them to CloudWatch Logs for real-time analysis. Enable CloudTrail logging for all regions to capture activity across your entire AWS footprint.

## CloudWatch Agent

By default, logs from EC2 instances do not flow to CloudWatch automatically. Deploy the CloudWatch Agent on your EC2 instances to push local log files to CloudWatch Logs. The EC2 instance must have an IAM role attached that grants permissions to send logs. The CloudWatch Agent can also be deployed on on-premises servers to centralize logging across your hybrid infrastructure.

### CloudWatch Logs Agent

The legacy CloudWatch Logs Agent sends only logs to CloudWatch Logs. It has been superseded by the unified CloudWatch Agent but remains available for backward compatibility.

### Unified CloudWatch Agent

The unified CloudWatch Agent collects system-level metrics and logs in a single deployment. It gathers CPU, disk, disk I/O, memory (RAM), network statistics (netstat), running processes, and swap space directly from the operating system. Agent configuration is centralized using AWS Systems Manager Parameter Store, allowing you to push configuration changes across a fleet of instances without manual updates. The unified agent sends both logs and metrics to CloudWatch, providing comprehensive observability from a single data collection point.

## CloudWatch Synthetics Canary

CloudWatch Synthetics Canary runs configurable scripts from CloudWatch to continuously monitor APIs, URLs, and websites. Define a script that reproduces the actions your customers perform—such as submitting a form or navigating a workflow—and Canary executes it regularly to surface issues before end users encounter them. Canaries check endpoint availability and latency, measure page load times, capture UI screenshots, and integrate with CloudWatch Alarms to alert on failures.

Canaries can be written in Node.js or Python and have access to a headless Chrome browser for realistic browser-based testing. Configure Canaries to run once on demand or on a recurring schedule.

### Canary Blueprints

CloudWatch provides pre-built canary blueprints to accelerate setup: heartbeat monitor (simple endpoint health check), API canary (validate API responses), broken link checker (scan for dead links), visual monitoring (compare screenshots for visual regression), canary recorder (capture and replay user interactions), and GUI workflow builder (no-code canary creation).

## Amazon Athena

Amazon Athena is a serverless query service that analyzes data stored in Amazon S3 using SQL. Athena uses a query engine built on Presto and supports multiple data formats: CSV, JSON, ORC, Avro, and Parquet. Pricing is $5 per terabyte of data scanned, with no upfront costs or infrastructure management. Athena integrates with Amazon QuickSight for creating reports and dashboards directly from S3 data.

### Query Performance Optimization

Optimize Athena query performance and reduce costs using the following strategies:

- **Columnar Formats**: Use columnar data formats such as Parquet or ORC to dramatically reduce scan size compared to row-based formats like CSV. AWS Glue can automate format conversion.
- **Data Compression**: Compress data files using bzip2, gzip, snappy, zlib, or zstd to reduce retrieval size without additional scan charges.
- **S3 Partitioning**: Partition your S3 dataset to enable Athena to prune partitions during query execution, scanning only relevant data. Partitions are exposed as virtual columns for filtering.
- **File Size**: Use larger files (greater than 128 MB) to minimize the overhead of file opening and closing operations per query.

### Federated Query

Athena Federated Query allows you to write SQL that runs across data in relational databases, non-relational data stores, object storage, and custom data sources using data source connectors. Connectors run on AWS Lambda and handle the translation between SQL and the underlying data source's query language, enabling unified queries across heterogeneous data sources.