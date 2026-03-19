import { useState, useEffect, useCallback } from "react";

const CARDS = [
  // ── Domain 1: SDLC Automation ──
  { domain: 1, cat: "SDLC Automation", q: "What is AWS CodePipeline?", a: "A fully managed CI/CD orchestration service that defines stages (Source, Build, Test, Deploy, Approval) to automate your release process." },
  { domain: 1, cat: "SDLC Automation", q: "What file defines the build phases in CodeBuild?", a: "buildspec.yml — it defines install, pre_build, build, and post_build phases with commands and optional finally blocks." },
  { domain: 1, cat: "SDLC Automation", q: "How do cross-account CodePipeline deployments work?", a: "The pipeline account assumes an IAM role in the target account. The artifact S3 bucket's KMS key policy must allow the target account to decrypt." },
  { domain: 1, cat: "SDLC Automation", q: "What determines pass/fail in a CodeBuild phase?", a: "Process exit codes. Exit code 0 = success, any non-zero = failure (pipeline stops)." },
  { domain: 1, cat: "SDLC Automation", q: "Secrets Manager vs. Parameter Store for credentials?", a: "Secrets Manager: built-in auto-rotation, costs per secret/API call. Parameter Store: simpler/cheaper (free standard tier), but rotation must be custom-built. Use Secrets Manager for DB credentials needing rotation." },
  { domain: 1, cat: "SDLC Automation", q: "What is a Blue/Green deployment?", a: "Two identical environments run simultaneously. Traffic is switched from blue (old) to green (new). Enables fast rollback by switching traffic back." },
  { domain: 1, cat: "SDLC Automation", q: "What is a Canary deployment?", a: "A small percentage of traffic goes to the new version first. After validation, all traffic shifts. Enables gradual, risk-averse validation." },
  { domain: 1, cat: "SDLC Automation", q: "What is a Linear deployment?", a: "Traffic shifts in equal increments over time (e.g., 10% every 5 minutes). Provides more data points than canary for gradual rollback with control." },
  { domain: 1, cat: "SDLC Automation", q: "What deployment types does CodeDeploy support for Lambda?", a: "Canary, Linear, and All-at-Once. It shifts alias traffic between function versions. Pre/PostTraffic hooks are Lambda functions for validation." },
  { domain: 1, cat: "SDLC Automation", q: "What is the ECS blue/green deployment flow with CodeDeploy?", a: "New task set created → test traffic to test listener → pre-traffic hook validates → production traffic shifted → original task set terminated after bake time." },
  { domain: 1, cat: "SDLC Automation", q: "What is AWS CodeArtifact?", a: "A managed package repository service supporting npm, Maven, PyPI, and NuGet. Domains group repos, and upstream connections proxy public registries." },
  { domain: 1, cat: "SDLC Automation", q: "What is EC2 Image Builder?", a: "Automates creation of AMIs and container images via pipelines with build + test components. Produces golden images on a schedule or trigger." },
  { domain: 1, cat: "SDLC Automation", q: "What are ECR lifecycle policies?", a: "Rules that automatically clean up old or untagged container images in ECR. Critical for cost management." },
  { domain: 1, cat: "SDLC Automation", q: "What is CloudWatch Synthetics?", a: "Canary scripts that run on a schedule to monitor endpoints and APIs. Useful for post-deployment validation — detect issues before users do." },
  { domain: 1, cat: "SDLC Automation", q: "What is an Immutable deployment?", a: "New instances launch in a new ASG. Once healthy, traffic swaps to the new ASG. Rollback = terminate the new ASG. Full fleet replacement." },
  { domain: 1, cat: "SDLC Automation", q: "How do you build Docker images in CodeBuild?", a: "Enable privileged mode in the build environment. Use the aws/codebuild/standard image with Docker runtime. Authenticate to ECR with `aws ecr get-login-password` in pre_build phase." },
  { domain: 1, cat: "SDLC Automation", q: "What caching options does CodeBuild support?", a: "S3 caching (persists across builds, slower) and local caching (faster, per-build host — source, Docker layer, or custom cache). Use caching to speed up dependency installation and Docker layer reuse." },
  { domain: 1, cat: "SDLC Automation", q: "How does CodeBuild access resources in a VPC?", a: "Configure VPC settings (VPC ID, subnets, security groups) in the build project. CodeBuild creates ENIs in your subnets. Required for accessing private resources like RDS, ElastiCache, or internal APIs during builds." },
  { domain: 1, cat: "SDLC Automation", q: "What are CodePipeline manual approval actions?", a: "A pipeline stage action that pauses execution and sends an SNS notification. A designated IAM user must approve or reject before the pipeline continues. Used for production gate reviews." },
  { domain: 1, cat: "SDLC Automation", q: "How do CodePipeline cross-region actions work?", a: "Pipeline creates an artifact bucket in each target region. Actions like CloudFormation deploy or CodeDeploy can target resources in different regions. The pipeline replicates artifacts automatically." },
  { domain: 1, cat: "SDLC Automation", q: "What are CodePipeline execution modes?", a: "SUPERSEDED (default): newer execution replaces in-progress one. QUEUED: executions wait in order. PARALLEL: multiple executions run simultaneously. Choose based on deployment strategy needs." },
  { domain: 1, cat: "SDLC Automation", q: "What is an AppSpec file in CodeDeploy?", a: "YAML/JSON file defining deployment instructions. For EC2: specifies file mappings (source to destination) and lifecycle hook scripts. For Lambda/ECS: specifies task definition, traffic shifting, and validation hooks." },
  { domain: 1, cat: "SDLC Automation", q: "What is the EC2 CodeDeploy lifecycle hook order?", a: "ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService. BeforeBlockTraffic and AfterBlockTraffic wrap deregistration from the load balancer." },
  { domain: 1, cat: "SDLC Automation", q: "How do CodeDeploy rollbacks work?", a: "Automatic rollback triggers on deployment failure or CloudWatch alarm threshold breach. Rollback deploys the last known good revision as a NEW deployment — it does not restore old files in place." },

  // CodeCommit
  { domain: 1, cat: "CodeCommit", q: "What is AWS CodeCommit?", a: "Fully managed, private Git repositories hosted in AWS. Encrypted at rest with KMS and in transit via HTTPS/SSH. No size limits on repositories." },
  { domain: 1, cat: "CodeCommit", q: "What are the three main branching strategies?", a: "Trunk-based: all commits go directly to main; feature flags hide incomplete work. GitFlow: long-lived main/develop/feature/release/hotfix branches. Feature branch: short-lived branches merged via PR." },
  { domain: 1, cat: "CodeCommit", q: "How do CodeCommit approval rule templates work?", a: "Define how many approvers are required and which IAM principals (users, roles, groups) can approve. Can be per-repo or account-level templates that auto-apply to new repos matching a name filter." },
  { domain: 1, cat: "CodeCommit", q: "CodeCommit triggers vs. EventBridge — what's the difference?", a: "Triggers fire on push/branch/tag events and target SNS or Lambda only. EventBridge supports more event types (PR created/merged, comments, branch created/deleted) and is preferred for pipeline integration." },
  { domain: 1, cat: "CodeCommit", q: "How do you prevent direct pushes to a protected branch in CodeCommit?", a: "Use IAM policies or SCPs denying codecommit:GitPush on the protected branch refs. CodeCommit has no native branch protection UI — enforcement is entirely IAM/SCP-based." },
  { domain: 1, cat: "CodeCommit", q: "How is cross-account CodeCommit access granted?", a: "Developer in Account B assumes a cross-account IAM role in Account A, then uses the temporary credentials to clone/push. Alternative: attach a resource-based policy directly on the repository." },

  // CodeGuru
  { domain: 1, cat: "CodeGuru", q: "What does CodeGuru Reviewer do?", a: "ML-based automated code review for Java and Python. Detects resource leaks, concurrency bugs, input validation flaws, and hardcoded secrets. Integrates with CodeCommit, GitHub, and Bitbucket PRs." },
  { domain: 1, cat: "CodeGuru", q: "What does CodeGuru Profiler do?", a: "Identifies CPU and memory hotspots in running applications. Works on EC2, Lambda, ECS, and on-premises. Produces a flame graph showing where time is spent and estimates the cost of inefficiencies." },
  { domain: 1, cat: "CodeGuru", q: "What does the CodeGuru Secrets Detector find?", a: "Hardcoded credentials (API keys, passwords, connection strings) in code. Recommends moving them to AWS Secrets Manager. Can run on full repository scans in addition to PR diffs." },

  // CodeArtifact additional
  { domain: 1, cat: "CodeArtifact", q: "How does asset deduplication work in a CodeArtifact domain?", a: "Each unique package asset is stored once at the domain level regardless of how many repos reference it. Copying a package across repos is a metadata-only operation — no data is duplicated." },
  { domain: 1, cat: "CodeArtifact", q: "What happens to a cached package if its upstream repo is disconnected?", a: "The package is retained in the downstream repo. Cached packages persist even if the upstream connection is removed or the package is deleted upstream." },

  // SAM & CDK additional
  { domain: 1, cat: "SAM & CDK", q: "What does `sam build` do?", a: "Compiles Lambda functions and resolves dependencies into the .aws-sam/build/ directory, producing deployment-ready artifacts. Must run before sam deploy." },
  { domain: 1, cat: "SAM & CDK", q: "What makes CDK Pipelines 'self-mutating'?", a: "A SelfMutate stage runs cdk deploy on the pipeline stack itself before deploying the application. Adding a new stage to CDK code automatically updates the pipeline on the next commit — no manual intervention." },

  // CodeDeploy additional
  { domain: 1, cat: "CodeDeploy", q: "When should you use AllAtOnce vs. OneAtATime deployment configs?", a: "AllAtOnce: fastest, but causes downtime (all instances update simultaneously). OneAtATime: slowest, zero downtime (one instance at a time, rest stay healthy). HalfAtATime balances speed and availability." },
  { domain: 1, cat: "CodeDeploy", q: "How are the Green instances provisioned in a Blue/Green EC2 deployment?", a: "Either manually (you specify instances) or automatically (CodeDeploy copies the existing Auto Scaling Group). BlueInstanceTerminationOption then controls whether old Blue instances are terminated or kept after traffic shifts." },

  // AWS Amplify
  { domain: 1, cat: "AWS Amplify", q: "What is AWS Amplify Console?", a: "A CI/CD and hosting service for frontend web apps. Connects to GitHub/CodeCommit/Bitbucket/GitLab, auto-builds on push, deploys to a global CDN, and provisions per-branch backend environments." },
  { domain: 1, cat: "AWS Amplify", q: "What is amplify.yml used for?", a: "Custom build configuration for Amplify Console — defines build commands, artifact directories, and per-branch overrides when Amplify's automatic framework detection is insufficient." },

  // ── Domain 2: Config Management & IaC ──
  { domain: 2, cat: "Config & IaC", q: "What are CloudFormation StackSets?", a: "Deploy CloudFormation stacks across multiple accounts and regions simultaneously. Service-managed permissions (via Organizations) is recommended." },
  { domain: 2, cat: "Config & IaC", q: "What are CloudFormation Change Sets?", a: "Preview changes before executing a stack update. Shows which resources will be added, modified, or replaced — no surprises." },
  { domain: 2, cat: "Config & IaC", q: "What is CloudFormation Drift Detection?", a: "Identifies when actual resource configuration differs from the template definition. Detects manual changes made outside of CloudFormation." },
  { domain: 2, cat: "Config & IaC", q: "What is a CloudFormation DeletionPolicy?", a: "Controls what happens to resources when a stack is deleted. Options: Retain (keep it), Snapshot (take a snapshot first), or Delete (remove it)." },
  { domain: 2, cat: "Config & IaC", q: "What are cfn-init and cfn-signal?", a: "Helper scripts for EC2 configuration. cfn-signal with CreationPolicy/WaitCondition ensures instances are fully configured before being marked CREATE_COMPLETE." },
  { domain: 2, cat: "Config & IaC", q: "What is AWS CDK?", a: "Cloud Development Kit — write IaC in programming languages (TypeScript, Python, Java, C#). Synthesizes to CloudFormation templates. CDK Pipelines provide self-mutating CI/CD." },
  { domain: 2, cat: "Config & IaC", q: "What is AWS SAM?", a: "Serverless Application Model — a CloudFormation extension for serverless with simplified syntax for Lambda, API Gateway, DynamoDB, and Step Functions." },
  { domain: 2, cat: "Config & IaC", q: "What is AWS Organizations?", a: "A service for centrally managing multiple AWS accounts. Structure: Root → Organizational Units (OUs) → Accounts. The management account (formerly master) pays all bills (consolidated billing), creates accounts, and applies policies. Member accounts can be grouped into nested OUs for hierarchical policy application." },
  { domain: 2, cat: "Config & IaC", q: "What are the key features of AWS Organizations?", a: "Consolidated billing (volume discounts, single payer). Service Control Policies (SCPs) for permission guardrails. AWS service integrations: CloudTrail org trail, Config aggregator, GuardDuty org detector, Security Hub org, RAM resource sharing. Account Factory (via Control Tower) for automated provisioning." },
  { domain: 2, cat: "Config & IaC", q: "Management account vs. member accounts?", a: "Management account: creates the organization, invites/creates member accounts, manages SCPs, pays all bills, is NOT affected by SCPs. Best practice: use it only for billing and org management — never run workloads in it. Member accounts: subject to SCPs, host workloads, can be delegated administrators for specific services." },
  { domain: 2, cat: "Config & IaC", q: "What are Organizational Units (OUs)?", a: "Containers for grouping accounts within Organizations. Can be nested up to 5 levels deep. SCPs attached to an OU apply to all accounts and child OUs within it. Common OU design: Security, Infrastructure, Workloads (Prod/Dev/Staging), Sandbox. Enables applying different governance to different account groups." },
  { domain: 2, cat: "Config & IaC", q: "What are Service Control Policies (SCPs)?", a: "JSON policies that set maximum permissions for accounts in an OU. They don't grant permissions — they restrict what IAM policies can allow. Explicit deny overrides any allow." },
  { domain: 2, cat: "Config & IaC", q: "SCP allow-list vs. deny-list strategy?", a: "Deny-list (default): FullAWSAccess SCP attached by default, add explicit deny SCPs for what you want to block. Simpler, less restrictive. Allow-list: remove FullAWSAccess, explicitly allow only permitted services. More secure but harder to manage. Most orgs use deny-list with specific guardrails (e.g., deny leaving org, deny disabling CloudTrail)." },
  { domain: 2, cat: "Config & IaC", q: "Do SCPs affect service-linked roles?", a: "No. SCPs affect all users and roles (including root) EXCEPT service-linked roles." },
  { domain: 2, cat: "Config & IaC", q: "What is AWS Control Tower?", a: "Automates multi-account setup with best practices: Landing Zone, Guardrails (Preventive/Detective/Proactive), and Account Factory for provisioning new accounts." },
  { domain: 2, cat: "Config & IaC", q: "What is SSM Run Command?", a: "Execute commands remotely on managed instances without SSH. Requires SSM Agent and IAM instance profile with AmazonSSMManagedInstanceCore." },
  { domain: 2, cat: "Config & IaC", q: "What is SSM State Manager?", a: "Defines and enforces desired state configurations on managed instances on a recurring schedule." },
  { domain: 2, cat: "Config & IaC", q: "What is SSM AppConfig?", a: "Deploy application configuration with validation and rollback. Supports feature flags and gradual config deployments." },
  { domain: 2, cat: "Config & IaC", q: "What are AWS Config Rules?", a: "Managed or custom (Lambda-backed) rules that evaluate resource compliance continuously. Auto-remediation triggers SSM Automation documents to fix non-compliant resources." },
  { domain: 2, cat: "Config & IaC", q: "What is an AWS Config Aggregator?", a: "Collects Config data across multiple accounts and regions into a single view for centralized compliance monitoring." },
  { domain: 2, cat: "Config & IaC", q: "What are CloudFormation custom resources?", a: "Lambda-backed resources for logic CloudFormation doesn't natively support (e.g., empty S3 buckets on delete, look up AMI IDs). Triggered via SNS or Lambda. Must send SUCCESS/FAILED response to the pre-signed URL." },
  { domain: 2, cat: "Config & IaC", q: "What are CloudFormation stack policies?", a: "JSON policies that protect stack resources from unintended updates. By default, all resources can be updated. A stack policy can deny updates to specific resource types or logical IDs. Must be explicitly overridden during updates." },
  { domain: 2, cat: "Config & IaC", q: "When to use nested stacks vs. StackSets?", a: "Nested stacks: decompose a complex single-account deployment into reusable templates (parent-child). StackSets: deploy the same template across multiple accounts and regions. Different problems — composition vs. distribution." },
  { domain: 2, cat: "Config & IaC", q: "How does CloudFormation handle Auto Scaling group updates?", a: "UpdatePolicy attribute controls rolling updates: MinInstancesInService, MaxBatchSize, PauseTime, WaitOnResourceSignals. Ensures capacity during updates. Without it, all instances replace at once." },
  { domain: 2, cat: "Config & IaC", q: "What is CloudFormation resource import?", a: "Bring existing resources under CloudFormation management without recreating them. Add resource to template with DeletionPolicy: Retain, then import using the resource identifier. No disruption to running resources." },
  { domain: 2, cat: "Config & IaC", q: "What is SSM Patch Manager?", a: "Automates OS and application patching on managed instances. Uses patch baselines (rules for auto-approval), patch groups (instance targeting), and maintenance windows for scheduling." },
  { domain: 2, cat: "Config & IaC", q: "What is SSM Session Manager?", a: "Browser-based or CLI interactive shell access to instances without opening SSH ports or managing keys. All sessions are logged to S3/CloudWatch. Requires SSM Agent and IAM permissions." },
  { domain: 2, cat: "Config & IaC", q: "What are SSM Automation runbooks?", a: "Predefined or custom workflows that automate operational tasks (e.g., restart instance, create AMI, remediate Config findings). Can be triggered by Config rules, EventBridge, or manually. Support approval steps." },
  { domain: 2, cat: "Config & IaC", q: "How does SCP inheritance work in Organizations?", a: "SCPs are inherited down the OU hierarchy. Effective permissions = intersection of all SCPs from root to account. An allow at a child OU cannot override a deny at the parent. The management account is unaffected by SCPs." },
  { domain: 2, cat: "Config & IaC", q: "What is a delegated administrator in Organizations?", a: "A member account granted permissions to manage an AWS service (e.g., GuardDuty, Security Hub, Config) on behalf of the organization. Reduces the need to use the management account for day-to-day operations." },
  { domain: 2, cat: "Config & IaC", q: "What are the three types of Control Tower guardrails?", a: "Preventive: SCPs that block disallowed actions (e.g., deny region changes). Detective: AWS Config rules that monitor compliance. Proactive: CloudFormation hooks that check resources before provisioning." },
  { domain: 2, cat: "Config & IaC", q: "What are AWS Config conformance packs?", a: "Collections of Config rules and remediation actions packaged as a single entity. Deploy across accounts via Organizations. Use sample templates (e.g., S3 Operational Best Practices) or create custom packs." },

  // ── Domain 3: Resilient Cloud Solutions ──
  { domain: 3, cat: "Resilience", q: "What is RDS Multi-AZ?", a: "Synchronous standby replica in another AZ with automatic failover (60–90 sec). For HA only — NOT for read scaling. Use Read Replicas for reads." },
  { domain: 3, cat: "Resilience", q: "What is Aurora Global Database?", a: "Cross-region replication with typically <1 second lag. Up to 5 secondary regions. Enables low-latency global reads and disaster recovery." },
  { domain: 3, cat: "Resilience", q: "What are DynamoDB Global Tables?", a: "Multi-region, multi-active replication. Write to any region, <1 second replication. No application changes needed for multi-region writes." },
  { domain: 3, cat: "Resilience", q: "What does S3 Cross-Region Replication require?", a: "Versioning must be enabled on BOTH source and destination buckets. Replication is automatic and asynchronous." },
  { domain: 3, cat: "Resilience", q: "What is Target Tracking Auto Scaling?", a: "Maintains a metric at a target value (e.g., 'keep CPU at 50%'). Automatically adjusts capacity up and down. Simplest and most common scaling policy." },
  { domain: 3, cat: "Resilience", q: "What is Predictive Scaling?", a: "ML-based forecasting that proactively provisions capacity based on recurring traffic patterns. Best for workloads with predictable cycles." },
  { domain: 3, cat: "Resilience", q: "What are Auto Scaling Warm Pools?", a: "Pre-initialized instances in a stopped (or hibernated) state for faster scale-out. Reduces launch time vs. starting from scratch." },
  { domain: 3, cat: "Resilience", q: "What is ECS Capacity Providers?", a: "Managed scaling of underlying EC2 instances or Fargate. Automatically provisions compute to match task demand." },
  { domain: 3, cat: "Resilience", q: "What is Karpenter (EKS)?", a: "A flexible node provisioner for Kubernetes that selects the right instance type and size based on pod resource requirements. More flexible than Cluster Autoscaler." },
  { domain: 3, cat: "Resilience", q: "Backup & Restore DR strategy?", a: "Lowest cost, highest RTO/RPO (hours). Back up data, restore when needed. Acceptable when long recovery times are tolerable." },
  { domain: 3, cat: "Resilience", q: "Pilot Light DR strategy?", a: "Low cost, RTO in tens of minutes. Core services always running (e.g., DB replica). Scale up other components during disaster." },
  { domain: 3, cat: "Resilience", q: "Warm Standby DR strategy?", a: "Medium cost, RTO in minutes. A scaled-down but fully functional copy runs in the DR region. Scale up to full capacity during disaster." },
  { domain: 3, cat: "Resilience", q: "Multi-Site Active/Active DR strategy?", a: "Highest cost, near-zero RTO/RPO. Full production runs in multiple regions. Route 53 distributes traffic. Instant failover." },
  { domain: 3, cat: "Resilience", q: "What is AWS Elastic Disaster Recovery (DRS)?", a: "Block-level replication of on-premises or cloud servers to AWS. Continuous replication with sub-second RPO." },
  { domain: 3, cat: "Resilience", q: "What is Lambda Provisioned Concurrency?", a: "Pre-warms execution environments to eliminate cold starts. You pay for the provisioned capacity whether used or not." },
  { domain: 3, cat: "Resilience", q: "What is Lambda reserved concurrency?", a: "Guarantees a set number of concurrent executions for a function and caps it at that limit. Unlike provisioned concurrency, it doesn't pre-warm — cold starts still occur. Free to configure. Prevents one function from consuming all account concurrency." },
  { domain: 3, cat: "Resilience", q: "What are Lambda layers?", a: "ZIP archives containing libraries, runtimes, or other dependencies shared across functions. Up to 5 layers per function. Reduces deployment package size and promotes code reuse across teams." },
  { domain: 3, cat: "Resilience", q: "How does Lambda behave in a VPC?", a: "Lambda creates Hyperplane ENIs in your VPC subnets to access private resources. Requires subnets in multiple AZs for HA. Uses a NAT gateway for internet access (no public IP). IAM role needs ec2:CreateNetworkInterface permissions." },
  { domain: 3, cat: "Resilience", q: "Lambda@Edge vs. CloudFront Functions?", a: "CloudFront Functions: lightweight (viewer request/response only), sub-millisecond, JavaScript only, 10KB max. Lambda@Edge: full Lambda (all 4 trigger points), up to 30s timeout, any runtime, 50MB max. Use CloudFront Functions for simple header/URL manipulations." },
  { domain: 3, cat: "Resilience", q: "What is the difference between API Gateway REST API and HTTP API?", a: "HTTP API: lower cost (~70% cheaper), lower latency, simpler, supports OIDC/OAuth2 natively. REST API: more features — usage plans, API keys, request validation, WAF integration, caching, resource policies, private APIs. Use HTTP API unless you need REST-specific features." },
  { domain: 3, cat: "Resilience", q: "How does API Gateway caching work?", a: "REST API only. Caches endpoint responses for a specified TTL (default 300s, max 3600s). Per-stage configuration. Cache sizes from 0.5GB to 237GB. Reduces backend calls and improves latency. Invalidate with Cache-Control: max-age=0 header." },
  { domain: 3, cat: "Resilience", q: "How does API Gateway throttling work?", a: "Default: 10,000 requests/second account-wide, 5,000 burst. Per-stage and per-method throttling via usage plans. Returns 429 Too Many Requests when exceeded. Protects backends from traffic spikes." },
  { domain: 3, cat: "Resilience", q: "What is the difference between Kinesis Data Streams and Data Firehose?", a: "Data Streams: real-time (<200ms), custom consumers, manual scaling (shards), 1–365 day retention. Firehose: near-real-time (60s buffer), fully managed delivery to S3/Redshift/OpenSearch/Splunk, auto-scaling, built-in transformation. Use Streams for real-time processing, Firehose for delivery." },
  { domain: 3, cat: "Resilience", q: "What is a VPC?", a: "Virtual Private Cloud — a logically isolated virtual network in AWS. You control IP ranges (CIDR blocks), subnets, route tables, internet gateways, and NAT gateways. Default VPC exists in every region; custom VPCs are best practice for production." },
  { domain: 3, cat: "Resilience", q: "Public subnet vs. private subnet?", a: "Public subnet: route table has a route to an Internet Gateway (0.0.0.0/0 → IGW). Instances get public IPs. Private subnet: no IGW route. Instances reach the internet only through a NAT Gateway in a public subnet. Place databases and app tiers in private subnets." },
  { domain: 3, cat: "Resilience", q: "What is an Internet Gateway (IGW)?", a: "A horizontally scaled, redundant, HA VPC component that enables communication between your VPC and the internet. Attach one IGW per VPC. Performs 1:1 NAT for instances with public IPs. No bandwidth constraints. A subnet is 'public' only if its route table has 0.0.0.0/0 → IGW." },
  { domain: 3, cat: "Resilience", q: "What is a NAT Gateway?", a: "Managed, HA service that allows private subnet instances to initiate outbound internet traffic without accepting inbound connections. Deployed per-AZ in a public subnet. Scales automatically up to 100 Gbps. Preferred over self-managed NAT instances." },
  { domain: 3, cat: "Resilience", q: "NAT Gateway vs. NAT Instance?", a: "NAT Gateway: managed, auto-scales to 100 Gbps, HA within an AZ, no maintenance, no security groups. NAT Instance: self-managed EC2, limited by instance type bandwidth, must disable source/dest check, can use as bastion host, supports security groups and port forwarding. Always prefer NAT Gateway unless you need SG control or cost savings for low-traffic workloads." },
  { domain: 3, cat: "Resilience", q: "Gateway VPC Endpoint vs. Interface VPC Endpoint?", a: "Gateway endpoint: free, route-table entry, S3 and DynamoDB only. Interface endpoint (PrivateLink): ENI with private IP, costs per hour + per GB, supports 100+ AWS services and custom services. Both keep traffic on the AWS network (no internet traversal)." },
  { domain: 3, cat: "Resilience", q: "VPC Peering vs. Transit Gateway?", a: "VPC Peering: 1-to-1 connection, no transitive routing, works cross-region/cross-account, free intra-AZ. Transit Gateway: hub-and-spoke, supports transitive routing across thousands of VPCs and on-premises networks, route tables for segmentation. Use TGW when peering count becomes unmanageable." },
  { domain: 3, cat: "Resilience", q: "What are VPC Flow Logs?", a: "Capture IP traffic metadata (src/dst IP, ports, protocol, action, bytes) for a VPC, subnet, or ENI. Published to CloudWatch Logs, S3, or Kinesis Data Firehose. Used for troubleshooting connectivity, security analysis, and compliance. Do not capture packet payloads." },
  { domain: 3, cat: "Resilience", q: "How do you design a multi-AZ VPC?", a: "Create subnets in at least 2 AZs (3 recommended). Use public subnets for ALBs/NAT Gateways, private subnets for app/DB tiers. One NAT Gateway per AZ for HA. Route tables per subnet tier. This architecture survives a full AZ failure." },
  { domain: 3, cat: "Resilience", q: "What is Amazon Route 53?", a: "AWS's managed DNS service offering domain registration, DNS routing, and health checking. Supports public and private hosted zones. 100% SLA availability. Named after TCP/UDP port 53 (DNS)." },
  { domain: 3, cat: "Resilience", q: "What are the main Route 53 routing policies?", a: "Simple: single resource. Weighted: percentage-based traffic split (e.g., 70/30 for gradual migration). Latency-based: routes to lowest-latency region. Failover: active-passive with health checks. Geolocation: routes by user location. Geoproximity: routes by geographic distance with bias. Multivalue: up to 8 healthy records returned." },
  { domain: 3, cat: "Resilience", q: "How do Route 53 health checks enable failover?", a: "Health checks monitor endpoints (HTTP/HTTPS/TCP), other health checks (calculated), or CloudWatch alarms. Unhealthy records are removed from DNS responses. Failover routing uses health checks to switch from primary to secondary. Evaluators run from multiple global locations." },
  { domain: 3, cat: "Resilience", q: "Route 53 alias record vs. CNAME?", a: "Alias: AWS-native, free queries, works at zone apex (e.g., example.com), points to AWS resources (ALB, CloudFront, S3, etc.), returns the target's IP directly. CNAME: standard DNS, costs per query, CANNOT be used at zone apex, returns another domain name. Always prefer alias for AWS resources." },
  { domain: 3, cat: "Resilience", q: "What are Route 53 private hosted zones?", a: "DNS zones that resolve only within associated VPCs. Used for internal service discovery (e.g., db.internal.example.com). Must enable DNS hostnames and DNS resolution on the VPC. Can associate with VPCs across accounts using authorization." },
  { domain: 3, cat: "Resilience", q: "How does Route 53 support blue/green deployments?", a: "Use weighted routing to shift traffic gradually (e.g., 10% to green, then 50%, then 100%). Or use failover routing with health checks. Low TTL values (e.g., 60s) ensure clients pick up changes quickly. Alias records to ALBs or CloudFront make this seamless." },
  { domain: 3, cat: "Resilience", q: "What is Route 53 Resolver?", a: "Handles DNS resolution between VPCs and on-premises networks. Inbound endpoints: on-premises DNS forwards queries to Route 53. Outbound endpoints: Route 53 forwards queries to on-premises DNS. Resolver rules define which domains forward where. Essential for hybrid cloud DNS." },

  // ── Domain 4: Monitoring & Logging ──
  { domain: 4, cat: "Monitoring", q: "What EC2 metrics require the CloudWatch Agent?", a: "Memory utilization and disk space usage. Default EC2 metrics only cover CPU, Network, Disk I/O, and Status Checks." },
  { domain: 4, cat: "Monitoring", q: "What are CloudWatch Metric Filters?", a: "Extract metric values from log events using filter patterns. Create custom metrics and alarms from log data." },
  { domain: 4, cat: "Monitoring", q: "What are CloudWatch Composite Alarms?", a: "Combine multiple alarms with AND/OR logic to reduce alarm noise. Trigger only when multiple conditions are met simultaneously." },
  { domain: 4, cat: "Monitoring", q: "What is CloudWatch Anomaly Detection?", a: "ML-based bands that automatically detect metric anomalies without needing static thresholds. Adapts to normal patterns." },
  { domain: 4, cat: "Monitoring", q: "What are CloudWatch Subscription Filters?", a: "Real-time streaming of log data to Lambda, Kinesis Data Streams, Kinesis Data Firehose, or OpenSearch." },
  { domain: 4, cat: "Monitoring", q: "What is AWS X-Ray?", a: "Distributed tracing service. Traces end-to-end requests across services. Service maps show architecture and latency. Uses sampling rules to control volume." },
  { domain: 4, cat: "Monitoring", q: "What is CloudTrail?", a: "Records ALL API calls (console, CLI, SDK) across your AWS account. Management events logged by default. Data events must be explicitly enabled." },
  { domain: 4, cat: "Monitoring", q: "What is the CloudTrail delivery delay?", a: "~15 minutes to S3. For real-time processing, send events to CloudWatch Logs or EventBridge." },
  { domain: 4, cat: "Monitoring", q: "What is Amazon EventBridge?", a: "Serverless event bus for event-driven architecture. Pattern-based filtering, rule routing to targets (Lambda, SQS, SNS, Step Functions), cron/rate scheduling." },
  { domain: 4, cat: "Monitoring", q: "What is CloudWatch Logs Insights?", a: "A SQL-like query language purpose-built for analyzing CloudWatch log data interactively." },
  { domain: 4, cat: "Monitoring", q: "What is CloudWatch RUM?", a: "Real User Monitoring for web applications. Captures client-side performance data from actual users." },
  { domain: 4, cat: "Monitoring", q: "What are CloudWatch Metric Streams?", a: "Near-real-time streaming of CloudWatch metrics to S3 or third-party tools via Kinesis Data Firehose." },
  { domain: 4, cat: "Monitoring", q: "What is a Kinesis shard and how does it scale?", a: "Each shard provides 1 MB/s input, 2 MB/s output, 1,000 records/s write. Scale by splitting (increase) or merging (decrease) shards. On-demand mode auto-scales. Partition key determines shard routing — hot keys cause hot shards." },
  { domain: 4, cat: "Monitoring", q: "What is Kinesis enhanced fan-out?", a: "Dedicated 2 MB/s throughput per consumer per shard (vs. shared 2 MB/s across all consumers). Uses SubscribeToShard (push, HTTP/2). Use when you have multiple consumers or need sub-200ms latency." },
  { domain: 4, cat: "Monitoring", q: "What types of EventBridge event buses exist?", a: "Default bus: receives events from AWS services automatically. Custom bus: receives events from your applications via PutEvents. Partner bus: receives events from SaaS partners (Datadog, Zendesk, etc.). Rules route events from buses to targets." },
  { domain: 4, cat: "Monitoring", q: "What is the EventBridge Schema Registry?", a: "Automatically discovers and stores event schemas from your event bus. Generates code bindings (Java, Python, TypeScript) for strongly-typed event handling. Supports OpenAPI 3 and JSONSchema Draft4 formats." },

  // ── Domain 5: Incident & Event Response ──
  { domain: 5, cat: "Incident Response", q: "What is the SNS fan-out pattern?", a: "SNS topic → multiple SQS queues or Lambda functions. Each subscriber gets a copy of every message. Enables parallel, independent processing." },
  { domain: 5, cat: "Incident Response", q: "What is a Dead-Letter Queue (DLQ)?", a: "Captures messages that fail processing after a specified number of attempts (maxReceiveCount). Used on SQS queues and Lambda event source mappings for failure analysis." },
  { domain: 5, cat: "Incident Response", q: "How does automated GuardDuty remediation work?", a: "GuardDuty finding → EventBridge rule (matches finding type) → Lambda function remediates (e.g., isolate instance) → SNS notifies the team." },
  { domain: 5, cat: "Incident Response", q: "What is AWS Config Auto-Remediation?", a: "Config rule detects non-compliance → triggers an SSM Automation document to automatically fix the resource. Example: auto-enable S3 encryption." },
  { domain: 5, cat: "Incident Response", q: "What is EC2 Auto Recovery?", a: "A CloudWatch alarm triggers EC2 recovery on system status check failure. Preserves instance ID, private IP, Elastic IP, and EBS volumes." },
  { domain: 5, cat: "Incident Response", q: "What is AWS Step Functions?", a: "Serverless orchestration for complex workflows with branching, retries, error handling, and parallel execution. Supports many task types beyond Lambda." },
  { domain: 5, cat: "Incident Response", q: "Where are CodeDeploy logs on EC2?", a: "/var/log/aws/codedeploy-agent/ — check here for deployment lifecycle hook failures." },
  { domain: 5, cat: "Incident Response", q: "What is AWS Fault Injection Simulator (FIS)?", a: "Chaos engineering service for running controlled fault injection experiments on AWS resources to test resilience." },
  { domain: 5, cat: "Incident Response", q: "What are common ECS task failure causes?", a: "OOM kills, Docker image pull failures, port conflicts, task role permission issues. Check stopped task reasons in ECS console." },
  { domain: 5, cat: "Incident Response", q: "What is DynamoDB Streams?", a: "Captures item-level changes in a DynamoDB table. Can trigger Lambda functions for event-driven processing (CQRS/Event Sourcing pattern)." },
  { domain: 5, cat: "Incident Response", q: "What is EventBridge archive and replay?", a: "Archive stores events indefinitely or for a retention period. Replay re-sends archived events to an event bus for reprocessing. Useful for debugging, testing, or recovering from downstream failures." },
  { domain: 5, cat: "Incident Response", q: "What are Lambda destinations for async invocations?", a: "Route successful or failed async invocation results to SQS, SNS, Lambda, or EventBridge without custom code. More flexible than DLQ — captures both success and failure with full invocation context." },
  { domain: 5, cat: "Incident Response", q: "What is Kinesis Client Library (KCL) checkpointing?", a: "KCL tracks processing progress per shard using a DynamoDB checkpoint table. If a consumer fails, another picks up from the last checkpoint. Prevents duplicate processing and ensures at-least-once delivery with proper checkpoint management." },

  // ── Domain 6: Security & Compliance ──
  { domain: 6, cat: "Security", q: "What is the IAM policy evaluation order?", a: "1) Explicit Deny always wins. 2) Explicit Allow. 3) Implicit Deny (default). SCPs, permission boundaries, and session policies further restrict effective permissions." },
  { domain: 6, cat: "Security", q: "What are IAM Permission Boundaries?", a: "Set the maximum permissions an IAM entity can have. Even if an identity policy grants broader access, the boundary caps it. Used for safe delegation." },
  { domain: 6, cat: "Security", q: "What is an IAM trust policy?", a: "A JSON policy attached to an IAM role that defines WHO can assume it (the trusted principal). Specifies Principal (account, service, user, or federated identity), Action (sts:AssumeRole, sts:AssumeRoleWithSAML, etc.), and optional Conditions (e.g., ExternalId, source IP, MFA). Without a trust policy, no one can assume the role." },
  { domain: 6, cat: "Security", q: "Identity-based vs. resource-based policies?", a: "Identity-based: attached to IAM users/roles/groups, define what that identity can do. Resource-based: attached to resources (S3 bucket, SQS queue, KMS key, Lambda), define who can access that resource. Resource-based policies enable cross-account access without role assumption. Both are evaluated together for same-account access." },
  { domain: 6, cat: "Security", q: "Inline policies vs. managed policies?", a: "Managed policies: standalone, reusable, attachable to multiple entities. AWS managed (maintained by AWS) or customer managed (you maintain). Inline policies: embedded directly in a single user/role/group, deleted with the entity. Best practice: use customer managed policies for reuse; inline only for strict 1:1 relationships." },
  { domain: 6, cat: "Security", q: "What are IAM policy condition keys?", a: "Conditions add fine-grained control. Common keys: aws:SourceIp (restrict by IP), aws:MultiFactorAuthPresent (require MFA), aws:PrincipalOrgID (restrict to Organization), aws:RequestedRegion (restrict regions), aws:CalledVia (require access through specific service), sts:ExternalId (prevent confused deputy). Use StringEquals, ArnLike, IpAddress operators." },
  { domain: 6, cat: "Security", q: "How does effective IAM permission calculation work?", a: "Effective permissions = intersection of all policy types. For same-account: identity-based policies UNION resource-based policies, then INTERSECT with SCPs, permission boundaries, and session policies. Any explicit deny at any layer wins. For cross-account: identity-based AND resource-based must BOTH allow (no union)." },
  { domain: 6, cat: "Security", q: "What is IAM Identity Center (SSO)?", a: "Central identity management for all AWS accounts. Integrates with AD, SAML 2.0, built-in store. Permission sets define access. Recommended for human access." },
  { domain: 6, cat: "Security", q: "OIDC Identity Providers vs. SAML in IAM?", a: "OIDC: for machine identity (GitHub Actions, Kubernetes) — short-lived tokens, no stored credentials. SAML: legacy approach for human federation." },
  { domain: 6, cat: "Security", q: "How does KMS key policy work?", a: "The PRIMARY access control for KMS keys. Even if IAM grants access, the key policy must also allow it. For cross-account use, the key policy must explicitly allow the external account." },
  { domain: 6, cat: "Security", q: "Security Groups vs. NACLs?", a: "SGs: instance-level, stateful, allow only, all rules evaluated. NACLs: subnet-level, stateless, allow + deny, rules evaluated in numbered order (first match). Use SGs as primary defense; NACLs as a secondary subnet-wide guardrail (e.g., blocking known malicious IPs)." },
  { domain: 6, cat: "Security", q: "What is a Network ACL (NACL)?", a: "A stateless firewall at the subnet level. Each rule has a number, protocol, port range, source/destination CIDR, and allow/deny. Rules are evaluated in ascending number order — first match wins, remaining rules are skipped. Every subnet must be associated with exactly one NACL." },
  { domain: 6, cat: "Security", q: "Default NACL vs. custom NACL?", a: "Default NACL: allows ALL inbound and outbound traffic (created with the VPC). Custom NACL: denies ALL traffic by default until you add rules. Subnets not explicitly associated use the default NACL. Best practice: use custom NACLs for explicit control." },
  { domain: 6, cat: "Security", q: "Why must NACLs allow ephemeral ports?", a: "NACLs are stateless — return traffic is NOT automatically allowed. Clients use ephemeral ports (1024–65535) for responses. Outbound NACL rules must allow ephemeral ports for inbound request responses, and inbound rules must allow them for outbound request responses. Forgetting this is the #1 NACL troubleshooting issue." },
  { domain: 6, cat: "Security", q: "How should NACL rules be numbered?", a: "Use increments of 100 (e.g., 100, 200, 300) to leave room for inserting rules later. Lower numbers are evaluated first. Rule 100 deny overrides rule 200 allow. The implicit rule * denies everything not matched. Plan numbering carefully since order determines behavior." },
  { domain: 6, cat: "Security", q: "What is AWS WAF?", a: "Web Application Firewall protecting ALB, CloudFront, API Gateway, AppSync, and Cognito. Filters HTTP/HTTPS requests at Layer 7 using Web ACLs containing rules. Supports managed rule groups, custom rules, rate-based rules, and IP reputation lists." },
  { domain: 6, cat: "Security", q: "What are the components of an AWS WAF Web ACL?", a: "A Web ACL contains rules evaluated in priority order (lowest number first). Each rule has a statement (match condition), action (Allow/Block/Count/CAPTCHA/Challenge), and optional labels. Default action applies when no rule matches. Capacity units (WCUs) cap complexity at 5,000 per Web ACL." },
  { domain: 6, cat: "Security", q: "What are AWS WAF managed rule groups?", a: "Pre-built rule sets maintained by AWS or AWS Marketplace sellers. AWS managed: Core Rule Set (CRS), Known Bad Inputs, SQL Injection, IP Reputation, Bot Control, Account Takeover Prevention (ATP). Can override individual rule actions to Count for testing before blocking." },
  { domain: 6, cat: "Security", q: "What are WAF rate-based rules?", a: "Automatically block IPs exceeding a request threshold within a 5-minute window. Configurable from 100–20,000,000 requests. Can scope by URI, header, query string, or country. Use for DDoS mitigation, brute-force prevention, and API throttling." },
  { domain: 6, cat: "Security", q: "How do WAF rules and labels work together?", a: "Rules can add labels to matching requests without taking an action (or with Count). Downstream rules can match on those labels. Enables multi-stage evaluation — e.g., label requests from a specific country, then only rate-limit labeled requests hitting /login." },
  { domain: 6, cat: "Security", q: "How do you test and deploy WAF rules safely?", a: "1) Set new rules to Count mode (no blocking). 2) Analyze sampled requests and CloudWatch metrics. 3) Use WAF logging (Kinesis Firehose, S3, or CloudWatch Logs) to inspect matched requests. 4) Switch to Block once confident. Managed rule overrides let you count individual rules within a group." },
  { domain: 6, cat: "Security", q: "Where can WAF logs be sent?", a: "Three destinations: CloudWatch Logs (log group prefix aws-waf-logs-*), S3 bucket (prefix aws-waf-logs-*), or Kinesis Data Firehose (stream prefix aws-waf-logs-*). Logs include full request headers, matched rules, labels, and action taken. Use log filtering to reduce volume." },
  { domain: 6, cat: "Security", q: "What is AWS WAF Bot Control?", a: "Managed rule group that detects and manages bot traffic. Two levels: Common (signature-based, detects scrapers/crawlers) and Targeted (advanced ML-based, detects evasive bots). Can allow verified bots (Googlebot, etc.) while blocking or rate-limiting others. CAPTCHA/Challenge actions verify human users." },
  { domain: 6, cat: "Security", q: "What is AWS Shield?", a: "DDoS protection service in two tiers. Shield Standard: free, automatic Layer 3/4 protection for all AWS resources. Shield Advanced: paid ($3,000/mo), enhanced DDoS protection for EC2, ELB, CloudFront, Global Accelerator, Route 53 with DDoS cost protection, 24/7 DRT access, and advanced metrics." },
  { domain: 6, cat: "Security", q: "Shield Standard vs. Shield Advanced?", a: "Standard: free, auto-enabled, protects against common L3/L4 attacks (SYN floods, UDP reflection). Advanced: adds real-time attack visibility, DDoS Response Team (DRT) access, cost protection (credits for scaling during attacks), health-based detection, automatic application-layer mitigation, and WAF/Firewall Manager at no extra cost." },
  { domain: 6, cat: "Security", q: "What is Shield Advanced health-based detection?", a: "Associates Route 53 health checks with protected resources. Enables faster, more accurate DDoS detection by using application health as a signal. Can detect smaller attacks that affect your app even if they wouldn't normally trigger Shield thresholds. Reduces false positives." },
  { domain: 6, cat: "Security", q: "What is the Shield Advanced DDoS Response Team (DRT)?", a: "24/7 AWS security engineers who can help during active DDoS attacks. Can create WAF rules on your behalf, analyze attack patterns, and recommend mitigations. Proactive engagement available — DRT contacts you when Shield detects an attack affecting resource health. Requires Business or Enterprise Support plan." },
  { domain: 6, cat: "Security", q: "What is Shield Advanced cost protection?", a: "Provides credits for scaling charges incurred during a DDoS attack. Covers EC2, ELB, CloudFront, Global Accelerator, and Route 53 cost spikes caused by DDoS. Must file a credit request through AWS Support after the attack. Prevents attackers from causing financial damage through volumetric attacks." },
  { domain: 6, cat: "Security", q: "How do WAF, Shield, and CloudFront work together for DDoS protection?", a: "CloudFront absorbs volumetric attacks at edge locations globally. Shield Standard/Advanced protects the CloudFront distribution at L3/L4. WAF on CloudFront filters application-layer (L7) attacks like HTTP floods and slowloris. Together: Shield handles network-layer, WAF handles app-layer, CloudFront distributes and absorbs traffic." },
  { domain: 6, cat: "Security", q: "What is AWS Firewall Manager?", a: "Central management of WAF rules, Shield Advanced protections, Security Groups, Network Firewall, and Route 53 Resolver DNS Firewall across all accounts in an AWS Organization. Uses security policies that auto-apply to new resources. Requires AWS Organizations and a Firewall Manager administrator account." },
  { domain: 6, cat: "Security", q: "What is AWS GuardDuty?", a: "Intelligent threat detection using ML on CloudTrail, VPC Flow Logs, and DNS logs. Integrates with EventBridge, Security Hub, and Detective." },
  { domain: 6, cat: "Security", q: "What is Amazon Inspector?", a: "Automated vulnerability scanning for EC2 instances, Lambda functions, and ECR container images. Scan-on-push for ECR. Integrates with Security Hub." },
  { domain: 6, cat: "Security", q: "What is AWS Security Hub?", a: "Centralized security findings from GuardDuty, Inspector, Macie, IAM Access Analyzer, Config. Runs compliance checks (CIS, PCI DSS, AWS Best Practices)." },
  { domain: 6, cat: "Security", q: "What is Amazon Macie?", a: "ML-based service to discover and classify sensitive data (PII, financial data) in S3 buckets." },
  { domain: 6, cat: "Security", q: "What is AWS CloudHSM?", a: "Dedicated hardware security modules. Use when FIPS 140-2 Level 3 compliance or full key control is required." },
  { domain: 6, cat: "Security", q: "What is IAM Access Analyzer?", a: "Identifies resources shared externally (e.g., S3 buckets, IAM roles with cross-account trust). Also validates IAM policies for errors." },
  { domain: 6, cat: "Security", q: "Lambda execution role vs. resource policy?", a: "Execution role = what Lambda CAN DO (permissions to other services). Resource policy = WHO CAN INVOKE Lambda (e.g., allow API Gateway or another account)." },
  { domain: 6, cat: "Security", q: "Parameter Store: Standard vs. Advanced?", a: "Standard: free, 10,000 params, 4KB max. Advanced: paid, 100,000 params, 8KB max, parameter policies for expiration/notification." },
  { domain: 6, cat: "Security", q: "What is IAM Roles Anywhere?", a: "Allows on-premises workloads to obtain temporary AWS credentials using X.509 certificates from a trusted Certificate Authority (CA). Eliminates long-term access keys for hybrid environments. Uses trust anchors and profiles." },
  { domain: 6, cat: "Security", q: "How does cross-account IAM role assumption work?", a: "Account A creates a role with a trust policy allowing Account B. Account B's user/role calls sts:AssumeRole. Returns temporary credentials scoped to the role's permissions. Always use external ID condition for third-party access to prevent confused deputy attacks." },
  { domain: 6, cat: "Security", q: "What is KMS envelope encryption?", a: "KMS generates a data key. Encrypt data locally with the plaintext data key, store the encrypted data key alongside the ciphertext, then discard the plaintext key. Decrypt by calling KMS to decrypt the data key first. Avoids sending large payloads to KMS." },
  { domain: 6, cat: "Security", q: "How does KMS automatic key rotation work?", a: "Symmetric KMS keys only. Rotates key material annually (configurable 90–2560 days). The key ID and ARN stay the same — old key material is retained for decryption. Asymmetric and imported keys must be rotated manually via alias swapping." },
  { domain: 6, cat: "Security", q: "What are KMS multi-Region keys?", a: "Primary key replicated to other regions as replica keys. Same key ID and material in all regions — ciphertext encrypted in one region can be decrypted in another. Useful for cross-region disaster recovery and global applications." },
  { domain: 6, cat: "Security", q: "What are the S3 server-side encryption options?", a: "SSE-S3: AWS manages keys entirely (AES-256, default since Jan 2023). SSE-KMS: uses KMS keys — you control key policy, rotation, and get CloudTrail audit of key usage. SSE-C: you provide your own key with every request, AWS never stores it. DSSE-KMS: dual-layer encryption with KMS for compliance requiring two layers." },
  { domain: 6, cat: "Security", q: "SSE-S3 vs. SSE-KMS — when to use which?", a: "SSE-S3: simplest, no KMS costs, no API throttling, sufficient when you don't need key-level access control or audit trails. SSE-KMS: required when you need separate key permissions (key policy controls who can decrypt), CloudTrail logging of every decrypt call, automatic key rotation, or cross-account access control via key grants." },
  { domain: 6, cat: "Security", q: "What are the KMS API throttling implications for SSE-KMS?", a: "Every S3 GET/PUT on an SSE-KMS object calls GenerateDataKey or Decrypt against KMS. KMS has per-region request quotas (5,500–30,000 req/sec depending on region). High-throughput workloads can hit throttling. Mitigations: S3 Bucket Keys (reduces KMS calls by up to 99%), request a quota increase, or use SSE-S3 if KMS features aren't needed." },
  { domain: 6, cat: "Security", q: "What are S3 Bucket Keys?", a: "A cost and performance optimization for SSE-KMS. S3 generates a short-lived bucket-level key from KMS, then uses it to encrypt objects locally. Reduces KMS API calls by up to 99% and lowers KMS costs. Trade-off: CloudTrail shows the bucket ARN instead of the object ARN for KMS events. Enabled per-bucket or per-object." },
  { domain: 6, cat: "Security", q: "What is SSE-C and when would you use it?", a: "Server-Side Encryption with Customer-Provided Keys. You send the encryption key with every PUT/GET request over HTTPS (required). AWS encrypts/decrypts server-side but never stores your key — only an HMAC hash for validation. Use when you must manage keys outside AWS entirely (regulatory requirement). Cannot use with S3 console, must use API/CLI." },
  { domain: 6, cat: "Security", q: "How do you enforce encryption on S3 buckets?", a: "Default encryption setting: all new objects auto-encrypted with chosen method (SSE-S3 or SSE-KMS). Bucket policy with condition aws:kms or aws:s3 on s3:PutObject denies unencrypted uploads. Since Jan 2023, SSE-S3 is applied automatically even without a policy — but bucket policies still needed to enforce SSE-KMS specifically." },
  { domain: 6, cat: "Security", q: "What is S3 client-side encryption?", a: "Application encrypts data before sending to S3. AWS never sees plaintext. Two approaches: AWS Encryption SDK (envelope encryption with KMS or custom master keys) or S3 Encryption Client. You manage the entire encryption lifecycle. Use when data must be encrypted in transit AND at rest with keys you fully control end-to-end." },
  { domain: 6, cat: "Security", q: "How does encryption work for S3 cross-region replication?", a: "SSE-S3: replicated seamlessly, destination re-encrypts with its own SSE-S3 key. SSE-KMS: must specify a destination KMS key in the replication config, and the replication role needs kms:Decrypt on the source key and kms:Encrypt on the destination key. SSE-C objects: not replicated by default (no key available). Multi-Region KMS keys simplify cross-region encryption." },
  { domain: 6, cat: "Security", q: "How does encryption work for other AWS services?", a: "EBS: SSE with KMS (aws/ebs default key or CMK). RDS: SSE with KMS, must be set at creation. DynamoDB: SSE with AWS owned key (free), AWS managed key, or CMK. EFS: SSE with KMS. SQS: SSE-KMS or SSE-SQS. SNS: SSE-KMS. Kinesis: SSE-KMS. Most services use envelope encryption under the hood." },
  { domain: 6, cat: "Security", q: "How does Secrets Manager automatic rotation work?", a: "Rotation Lambda function creates new credentials on a schedule (e.g., every 30 days). Four steps: createSecret, setSecret, testSecret, finishSecret. Native integration for RDS, Redshift, DocumentDB. Custom Lambda for other secret types." },
  { domain: 6, cat: "Security", q: "What are Secrets Manager multi-Region secrets?", a: "Replicate a secret to multiple AWS regions. One primary and multiple replica secrets kept in sync. Replica can be promoted to standalone if needed. Enables cross-region disaster recovery for applications that need secrets." },
  { domain: 6, cat: "Security", q: "What data sources does GuardDuty analyze?", a: "CloudTrail management and data events, VPC Flow Logs, DNS logs, S3 data events, EKS audit logs, RDS login events, Lambda network activity, and EBS volume data (malware scanning). All analyzed without enabling these services separately." },
  { domain: 6, cat: "Security", q: "What are GuardDuty finding types and suppression rules?", a: "Findings categorized by resource: EC2 (crypto mining, C2), S3 (public access, policy changes), IAM (credential compromise). Severity: Low/Medium/High. Suppression rules auto-archive expected findings (e.g., known pentest IPs) to reduce noise." },
  { domain: 6, cat: "Security", q: "What are API Gateway authorizer types?", a: "IAM authorizer: SigV4 signed requests, best for AWS service-to-service. Cognito authorizer: validates JWT tokens from Cognito User Pools. Lambda authorizer: custom auth logic (token-based or request-based), returns IAM policy. REST API also supports resource policies." },
];

const DOMAIN_COLORS = {
  1: { bg: "#0F4C75", accent: "#3282B8", light: "#BBE1FA" },
  2: { bg: "#1A535C", accent: "#4ECDC4", light: "#C7F9EE" },
  3: { bg: "#6B2D5B", accent: "#D64292", light: "#F8D5E8" },
  4: { bg: "#3D405B", accent: "#81B29A", light: "#D5EDE1" },
  5: { bg: "#9B2226", accent: "#E76F51", light: "#FDDEC0" },
  6: { bg: "#2B2D42", accent: "#EF233C", light: "#FFD6DA" },
};

const DOMAIN_NAMES = {
  1: "SDLC Automation",
  2: "Config & IaC",
  3: "Resilience",
  4: "Monitoring",
  5: "Incident Response",
  6: "Security",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [mode, setMode] = useState("menu");
  const [selectedDomains, setSelectedDomains] = useState(new Set([1,2,3,4,5,6]));
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [learning, setLearning] = useState([]);
  const [animDir, setAnimDir] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const startGame = useCallback(() => {
    const filtered = CARDS.filter(c => selectedDomains.has(c.domain));
    if (filtered.length === 0) return;
    setDeck(shuffle(filtered));
    setIdx(0);
    setFlipped(false);
    setKnown([]);
    setLearning([]);
    setAnimDir(null);
    setMode("play");
  }, [selectedDomains]);

  const toggleDomain = (d) => {
    setSelectedDomains(prev => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d); else next.add(d);
      return next;
    });
  };

  const handleMark = useCallback((type) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const card = deck[idx];
    setAnimDir(type === "know" ? "right" : "left");

    setTimeout(() => {
      if (type === "know") setKnown(p => [...p, card]);
      else setLearning(p => [...p, card]);

      if (idx + 1 < deck.length) {
        setIdx(i => i + 1);
        setFlipped(false);
      } else {
        setMode("results");
      }
      setAnimDir(null);
      setIsAnimating(false);
    }, 350);
  }, [deck, idx, isAnimating]);

  const reStudyLearning = () => {
    if (learning.length === 0) return;
    setDeck(shuffle(learning));
    setIdx(0);
    setFlipped(false);
    setKnown([]);
    setLearning([]);
    setAnimDir(null);
    setMode("play");
  };

  useEffect(() => {
    const handler = (e) => {
      if (mode !== "play") return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped(f => !f); }
      if (e.key === "ArrowRight" && flipped) handleMark("know");
      if (e.key === "ArrowLeft" && flipped) handleMark("learn");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, flipped, handleMark]);

  const card = deck[idx];
  const colors = card ? DOMAIN_COLORS[card.domain] : DOMAIN_COLORS[1];
  const progress = deck.length > 0 ? ((idx + 1) / deck.length) * 100 : 0;

  // ── MENU SCREEN ──
  if (mode === "menu") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a0e17 0%, #131a2e 40%, #1a1f35 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: 20,
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0a0e17; }
          .domain-chip { 
            padding: 12px 20px; border-radius: 12px; cursor: pointer; transition: all 0.25s;
            border: 2px solid transparent; display: flex; align-items: center; gap: 10px;
            user-select: none;
          }
          .domain-chip:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
          .start-btn {
            padding: 18px 48px; border-radius: 14px; border: none; cursor: pointer;
            font-size: 18px; font-weight: 700; letter-spacing: 0.5px;
            background: linear-gradient(135deg, #3282B8, #4ECDC4); color: #fff;
            transition: all 0.3s; box-shadow: 0 6px 24px rgba(50,130,184,0.4);
          }
          .start-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(50,130,184,0.5); }
          .start-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }
        `}</style>
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 13, letterSpacing: 4,
              color: "#4ECDC4", marginBottom: 12, textTransform: "uppercase",
            }}>AWS Certified</div>
            <h1 style={{
              fontSize: 38, fontWeight: 700, color: "#fff",
              lineHeight: 1.15, marginBottom: 8,
            }}>DevOps Engineer<br/>
              <span style={{ color: "#4ECDC4" }}>Flash Cards</span>
            </h1>
            <p style={{ color: "#8892a4", fontSize: 15, marginTop: 12 }}>
              {CARDS.length} cards across all 6 exam domains • DOP-C02
            </p>
          </div>

          <div style={{ marginBottom: 36 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
            }}>
              <span style={{ color: "#c8cdd5", fontSize: 14, fontWeight: 500 }}>Select domains to study</span>
              <button
                onClick={() => {
                  if (selectedDomains.size === 6) setSelectedDomains(new Set());
                  else setSelectedDomains(new Set([1,2,3,4,5,6]));
                }}
                style={{
                  background: "none", border: "1px solid #3a4156", borderRadius: 8,
                  color: "#8892a4", padding: "6px 14px", fontSize: 12, cursor: "pointer",
                }}
              >{selectedDomains.size === 6 ? "Deselect All" : "Select All"}</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[1,2,3,4,5,6].map(d => {
                const active = selectedDomains.has(d);
                const c = DOMAIN_COLORS[d];
                const count = CARDS.filter(card => card.domain === d).length;
                return (
                  <div key={d} className="domain-chip" onClick={() => toggleDomain(d)} style={{
                    background: active ? c.bg : "rgba(255,255,255,0.04)",
                    borderColor: active ? c.accent : "rgba(255,255,255,0.08)",
                    opacity: active ? 1 : 0.5,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: active ? c.accent : "#555",
                      boxShadow: active ? `0 0 8px ${c.accent}` : "none",
                    }} />
                    <div>
                      <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>D{d}: {DOMAIN_NAMES[d]}</div>
                      <div style={{ color: active ? c.light : "#666", fontSize: 11 }}>{count} cards</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button className="start-btn" disabled={selectedDomains.size === 0} onClick={startGame}>
              Study {CARDS.filter(c => selectedDomains.has(c.domain)).length} Cards
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS SCREEN ──
  if (mode === "results") {
    const total = known.length + learning.length;
    const pct = total > 0 ? Math.round((known.length / total) * 100) : 0;
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a0e17 0%, #131a2e 40%, #1a1f35 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: 20,
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .result-btn {
            padding: 14px 32px; border-radius: 12px; border: none; cursor: pointer;
            font-size: 15px; font-weight: 600; transition: all 0.25s;
          }
          .result-btn:hover { transform: translateY(-2px); }
        `}</style>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{
            width: 120, height: 120, borderRadius: "50%", margin: "0 auto 28px",
            background: `conic-gradient(#4ECDC4 ${pct}%, #1e2538 ${pct}%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 96, height: 96, borderRadius: "50%", background: "#131a2e",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 700, color: "#4ECDC4",
            }}>{pct}%</div>
          </div>

          <h2 style={{ color: "#fff", fontSize: 28, marginBottom: 8 }}>Session Complete!</h2>
          <p style={{ color: "#8892a4", fontSize: 15, marginBottom: 32 }}>{total} cards reviewed</p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 40 }}>
            <div style={{
              background: "rgba(78,205,196,0.12)", borderRadius: 14, padding: "20px 32px", flex: 1,
            }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#4ECDC4" }}>{known.length}</div>
              <div style={{ color: "#8892a4", fontSize: 13, marginTop: 4 }}>Got It</div>
            </div>
            <div style={{
              background: "rgba(231,111,81,0.12)", borderRadius: 14, padding: "20px 32px", flex: 1,
            }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#E76F51" }}>{learning.length}</div>
              <div style={{ color: "#8892a4", fontSize: 13, marginTop: 4 }}>Still Learning</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {learning.length > 0 && (
              <button className="result-btn" onClick={reStudyLearning} style={{
                background: "linear-gradient(135deg, #E76F51, #D64292)", color: "#fff",
                boxShadow: "0 4px 16px rgba(231,111,81,0.3)",
              }}>Re-study {learning.length} Missed Cards</button>
            )}
            <button className="result-btn" onClick={startGame} style={{
              background: "linear-gradient(135deg, #3282B8, #4ECDC4)", color: "#fff",
              boxShadow: "0 4px 16px rgba(50,130,184,0.3)",
            }}>Shuffle &amp; Restart</button>
            <button className="result-btn" onClick={() => setMode("menu")} style={{
              background: "rgba(255,255,255,0.06)", color: "#c8cdd5",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>Back to Menu</button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAY SCREEN ──
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0e17 0%, #131a2e 40%, #1a1f35 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "20px 20px 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fc-card {
          width: 100%; max-width: 560px; min-height: 340px; border-radius: 20px;
          cursor: pointer; position: relative; perspective: 1000px;
          transition: transform 0.35s ease;
        }
        .fc-card.slide-right { transform: translateX(120%) rotate(8deg); opacity: 0; }
        .fc-card.slide-left { transform: translateX(-120%) rotate(-8deg); opacity: 0; }
        .fc-inner {
          width: 100%; min-height: 340px; position: relative;
          transform-style: preserve-3d; transition: transform 0.5s ease;
        }
        .fc-inner.flipped { transform: rotateY(180deg); }
        .fc-front, .fc-back {
          position: absolute; top: 0; left: 0; width: 100%; min-height: 340px;
          backface-visibility: hidden; border-radius: 20px; padding: 36px 32px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .fc-back { transform: rotateY(180deg); }
        .mark-btn {
          padding: 14px 28px; border-radius: 14px; border: none; cursor: pointer;
          font-size: 15px; font-weight: 600; transition: all 0.2s; display: flex;
          align-items: center; gap: 8px;
        }
        .mark-btn:hover { transform: translateY(-2px); }
        .mark-btn:active { transform: scale(0.97); }
        .kbd { 
          display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px;
          font-family: 'Space Mono', monospace; border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.4); margin-left: 4px;
        }
      `}</style>

      {/* ── Top Bar ── */}
      <div style={{
        width: "100%", maxWidth: 560, display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 12,
      }}>
        <button onClick={() => setMode("menu")} style={{
          background: "none", border: "none", color: "#8892a4", cursor: "pointer",
          fontSize: 14, display: "flex", alignItems: "center", gap: 6,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Menu
        </button>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#8892a4",
        }}>{idx + 1} / {deck.length}</div>
      </div>

      {/* ── Progress Bar ── */}
      <div style={{
        width: "100%", maxWidth: 560, height: 4, borderRadius: 2,
        background: "rgba(255,255,255,0.06)", marginBottom: 24, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 2, width: `${progress}%`,
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.light})`,
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* ── Domain Badge ── */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: colors.bg, padding: "6px 16px", borderRadius: 20,
        marginBottom: 20,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%", background: colors.accent,
          boxShadow: `0 0 6px ${colors.accent}`,
        }} />
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11, color: colors.light,
          letterSpacing: 1.5, textTransform: "uppercase",
        }}>Domain {card.domain}: {card.cat}</span>
      </div>

      {/* ── Card ── */}
      <div
        className={`fc-card ${animDir === "right" ? "slide-right" : animDir === "left" ? "slide-left" : ""}`}
        onClick={() => !isAnimating && setFlipped(f => !f)}
      >
        <div className={`fc-inner ${flipped ? "flipped" : ""}`}>
          {/* Front */}
          <div className="fc-front" style={{
            background: `linear-gradient(145deg, ${colors.bg}, #131a2e)`,
            border: `1px solid ${colors.accent}33`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 ${colors.accent}22`,
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, color: colors.accent,
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 20,
            }}>Question</div>
            <p style={{
              color: "#fff", fontSize: 20, lineHeight: 1.55, fontWeight: 500,
            }}>{card.q}</p>
            <div style={{
              marginTop: "auto", paddingTop: 24, color: "#556", fontSize: 12, textAlign: "center",
            }}>
              Tap to reveal <span className="kbd">Space</span>
            </div>
          </div>

          {/* Back */}
          <div className="fc-back" style={{
            background: `linear-gradient(145deg, #131a2e, ${colors.bg}55)`,
            border: `1px solid ${colors.accent}55`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 ${colors.accent}33`,
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, color: colors.accent,
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 20,
            }}>Answer</div>
            <p style={{
              color: "#e0e4ea", fontSize: 17, lineHeight: 1.65,
            }}>{card.a}</p>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div style={{
        display: "flex", gap: 16, marginTop: 28, opacity: flipped ? 1 : 0.25,
        pointerEvents: flipped ? "auto" : "none", transition: "opacity 0.3s",
      }}>
        <button className="mark-btn" onClick={() => handleMark("learn")} style={{
          background: "rgba(231,111,81,0.15)", color: "#E76F51",
          border: "1px solid rgba(231,111,81,0.25)",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          Still Learning <span className="kbd" style={{ borderColor: "rgba(231,111,81,0.3)", color: "rgba(231,111,81,0.5)" }}>&larr;</span>
        </button>
        <button className="mark-btn" onClick={() => handleMark("know")} style={{
          background: "rgba(78,205,196,0.15)", color: "#4ECDC4",
          border: "1px solid rgba(78,205,196,0.25)",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Got It <span className="kbd" style={{ borderColor: "rgba(78,205,196,0.3)", color: "rgba(78,205,196,0.5)" }}>&rarr;</span>
        </button>
      </div>

      {/* ── Score Strip ── */}
      <div style={{
        display: "flex", gap: 24, marginTop: 24, fontSize: 13,
        fontFamily: "'Space Mono', monospace",
      }}>
        <span style={{ color: "#4ECDC4" }}>{known.length} known</span>
        <span style={{ color: "#556" }}>|</span>
        <span style={{ color: "#E76F51" }}>{learning.length} learning</span>
      </div>
    </div>
  );
}
