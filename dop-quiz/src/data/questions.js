export const QUESTIONS = [
  /* -- CodeCommit (7) -- */
  {
    domain: 1,
    service: "CodeCommit",
    q: "What encryption algorithm does CodeCommit use for repositories at rest?",
    options: [
      "AWS KMS (customer or AWS-managed CMK)",
      "AES-256 with a CodeCommit-managed key",
      "RSA-2048 applied at the object level",
      "TLS 1.3 with per-repo certificates"
    ],
    explanation: "CodeCommit integrates with AWS KMS to encrypt repository data at rest using an AWS-managed key by default, or a customer-managed CMK. TLS is used for in-transit encryption—it is a separate concern from at-rest encryption."
  },
  {
    domain: 1,
    service: "CodeCommit",
    q: "Which branching strategy involves committing directly to `main` and using feature flags instead of long-lived branches?",
    options: [
      "Trunk-based development",
      "GitFlow",
      "GitHub Flow",
      "Release branching"
    ],
    explanation: "Trunk-based development means developers commit small, frequent changes directly to `main` (the trunk) and use feature flags to hide incomplete work, avoiding the integration pain of long-lived feature branches."
  },
  {
    domain: 1,
    service: "CodeCommit",
    q: "CodeCommit repository triggers can invoke which two target types?",
    options: [
      "SNS topics and Lambda functions",
      "SQS queues and DynamoDB streams",
      "EventBridge rules and Step Functions",
      "CodePipeline stages and CodeBuild projects"
    ],
    explanation: "CodeCommit repository triggers natively support two target types: SNS topics (for fan-out notifications) and Lambda functions (for custom automation). EventBridge events are separate from repository triggers and configured differently."
  },
  {
    domain: 1,
    service: "CodeCommit",
    q: "What is the correct mechanism to prevent direct pushes to a protected branch in CodeCommit?",
    options: [
      "SCPs and IAM policies (CodeCommit has no native push-blocking feature)",
      "Enable 'branch protection' in repository settings",
      "Use a pre-receive hook in the CodeCommit console",
      "Configure a CodePipeline approval action on the branch"
    ],
    explanation: "CodeCommit has no native branch protection UI. To block direct pushes you must use IAM policies that deny `codecommit:GitPush` on specific branch refs, or SCPs to enforce this org-wide. Pre-receive hooks and branch protection settings don't exist in CodeCommit."
  },
  {
    domain: 1,
    service: "CodeCommit",
    q: "When using CodeCommit as a CodePipeline source, which detection method is recommended over polling?",
    options: [
      "EventBridge rule on repository state change",
      "Webhook",
      "Periodic polling every 1 minute",
      "SNS notification to CodePipeline"
    ],
    explanation: "AWS recommends an EventBridge rule that triggers on CodeCommit repository state changes. EventBridge delivers events near-instantly and avoids the up-to-1-minute latency of periodic polling, which also wastes API calls."
  },
  {
    domain: 1,
    service: "CodeCommit",
    q: "CodeCommit approval rule templates define approvers using which format?",
    options: [
      "IAM principals: users, roles, or groups",
      "Email addresses of IAM users",
      "GitHub-style CODEOWNERS file entries",
      "LDAP group distinguished names"
    ],
    explanation: "CodeCommit approval rule templates reference approvers using IAM principal ARNs—users, roles, or groups. Email addresses, CODEOWNERS files, and LDAP groups are not valid formats for CodeCommit approval rules."
  },
  {
    domain: 1,
    service: "CodeCommit",
    q: "What is the correct approach for granting a developer in Account B read-only access to a CodeCommit repository in Account A?",
    options: [
      "Have the developer assume a cross-account IAM role in Account A",
      "Share the HTTPS clone URL; IAM credentials are global",
      "Create a CodeCommit mirror in Account B",
      "Enable VPC peering and use SSH keys"
    ],
    explanation: "Cross-account CodeCommit access is granted via a cross-account IAM role in Account A that the developer in Account B assumes. They then use temporary credentials from that role to clone/pull the repository. IAM credentials are account-scoped, not global."
  },
  /* -- CodePipeline (8) -- */
  {
    domain: 1,
    service: "CodePipeline",
    q: "How does CodePipeline store and pass artifacts between stages?",
    options: [
      "S3 bucket (ZIP files), optionally encrypted with KMS",
      "ECR images tagged per pipeline execution",
      "EFS share mounted by each action provider",
      "DynamoDB item per artifact with S3 reference"
    ],
    explanation: "CodePipeline stores all inter-stage artifacts as ZIP files in a designated S3 artifact bucket. You can encrypt this bucket with a KMS key—required for cross-account pipelines so target account principals can decrypt the artifacts."
  },
  {
    domain: 1,
    service: "CodePipeline",
    q: "Which CodePipeline V2 feature lets you start a pipeline only when changes occur in specific file paths or branches (e.g., only src/**)?",
    options: [
      "Pipeline triggers with glob-pattern filters on file paths and branches",
      "Stage conditions with file-path expressions",
      "EventBridge content filtering on CodeCommit push events",
      "A Lambda Invoke action that checks changed files before proceeding"
    ],
    explanation: "CodePipeline V2 introduced trigger filters that accept glob patterns (e.g., `src/**`, `*.tf`) on file paths and branches. The pipeline only starts when a push matches the patterns, avoiding spurious executions from unrelated changes."
  },
  {
    domain: 1,
    service: "CodePipeline",
    q: "Which action type pauses a pipeline execution and can send a notification for human review?",
    options: [
      "Manual Approval",
      "Invoke (Lambda)",
      "Deploy (CloudFormation CHANGE_SET_EXECUTE)",
      "Test (CodeBuild)"
    ],
    explanation: "The Manual Approval action halts the pipeline and optionally sends an SNS notification to reviewers. The pipeline only resumes once an authorized user approves or rejects it in the console or via the API, making it ideal as a gate before production deployments."
  },
  {
    domain: 1,
    service: "CodePipeline",
    q: "CodePipeline supports three pipeline execution modes. Which mode cancels the in-progress execution when a newer one arrives?",
    options: [
      "SUPERSEDED",
      "PARALLEL",
      "QUEUED",
      "SEQUENTIAL"
    ],
    explanation: "SUPERSEDED mode cancels the currently in-progress execution when a newer commit triggers the pipeline, ensuring the latest code always runs without waiting. QUEUED serializes executions; PARALLEL runs all concurrently."
  },
  {
    domain: 1,
    service: "CodePipeline",
    q: "Which two action providers does the CodePipeline 'Invoke' action category support?",
    options: [
      "Lambda and Step Functions",
      "CodeBuild and CodeDeploy",
      "ECS and Fargate",
      "SNS and SQS"
    ],
    explanation: "The Invoke action category supports Lambda functions and Step Functions state machines. CodeBuild belongs to the Build category and CodeDeploy to the Deploy category—each has its own dedicated action category."
  },
  {
    domain: 1,
    service: "CodePipeline",
    q: "What is a CodePipeline webhook used for?",
    options: [
      "Allowing external systems to trigger a pipeline via an HTTP endpoint",
      "Sending notifications when a stage fails",
      "Forwarding artifacts to an external S3 bucket",
      "Polling a GitHub repo for changes every 30 seconds"
    ],
    explanation: "A CodePipeline webhook exposes an HTTPS endpoint that external systems (e.g., GitHub, Bitbucket) can call to trigger a pipeline execution on push events, enabling event-driven CI/CD from external source control providers."
  },
  {
    domain: 1,
    service: "CodePipeline",
    q: "What must you provision in each additional AWS Region when adding cross-region actions to a pipeline?",
    options: [
      "A separate S3 artifact bucket in that region",
      "A CodePipeline pipeline replica",
      "A Transit Gateway attachment",
      "An IAM role with AmazonCodePipelineFullAccess"
    ],
    explanation: "Cross-region actions require a pre-created S3 artifact bucket in each target region. CodePipeline automatically copies artifacts from the primary bucket to the regional bucket before executing the cross-region action."
  },
  {
    domain: 1,
    service: "CodePipeline",
    q: "Which CloudFormation pipeline action creates a change set for review WITHOUT executing it?",
    options: [
      "CREATE_OR_REPLACE_CHANGE_SET",
      "EXECUTE_CHANGE_SET",
      "UPDATE_STACK",
      "DEPLOY_STACK_SET"
    ],
    explanation: "CREATE_OR_REPLACE_CHANGE_SET computes and stores what CloudFormation would change without applying it. This allows a Manual Approval step before EXECUTE_CHANGE_SET actually applies the changes to the stack."
  },
  /* -- CodeBuild (7) -- */
  {
    domain: 1,
    service: "CodeBuild",
    q: "What file does CodeBuild look for by default to determine build phases and commands?",
    options: [
      "buildspec.yml",
      "Dockerfile",
      ".buildconfig.json",
      "pipeline.yaml"
    ],
    explanation: "CodeBuild looks for `buildspec.yml` in the source root by default. This YAML file defines build phases (install, pre_build, build, post_build), commands, environment variables, artifacts, and cache settings."
  },
  {
    domain: 1,
    service: "CodeBuild",
    q: "To run Docker commands (docker build, docker push) inside a CodeBuild project, which setting must be enabled?",
    options: [
      "Privileged mode",
      "Enhanced networking mode",
      "Docker daemon flag in buildspec",
      "VPC attachment with NAT"
    ],
    explanation: "Docker requires privileged access to the host kernel's namespaces and cgroups. Enabling privileged mode in the CodeBuild environment configuration grants the build container those capabilities, allowing the Docker daemon to run."
  },
  {
    domain: 1,
    service: "CodeBuild",
    q: "A CodeBuild project is placed in a VPC. How does it reach public internet endpoints (e.g., npm registry)?",
    options: [
      "Route outbound traffic through a NAT Gateway",
      "Attach an Internet Gateway to the VPC",
      "Use a public subnet with an auto-assigned public IP",
      "Enable VPC endpoint for CodeBuild"
    ],
    explanation: "When placed in a VPC, CodeBuild instances run in private subnets and have no direct internet access. A NAT Gateway in a public subnet provides outbound internet access for private subnet resources without exposing them to inbound traffic."
  },
  {
    domain: 1,
    service: "CodeBuild",
    q: "Which CodeBuild local cache type specifically accelerates Docker image layer reuse between builds?",
    options: [
      "LOCAL_DOCKER_LAYER_CACHE",
      "LOCAL_SOURCE_CACHE",
      "LOCAL_CUSTOM_CACHE",
      "LOCAL_ARTIFACT_CACHE"
    ],
    explanation: "LOCAL_DOCKER_LAYER_CACHE stores Docker image layers on the build host between runs. Subsequent builds that use the same base image skip re-downloading unchanged layers, significantly reducing build time for Docker-heavy workflows."
  },
  {
    domain: 1,
    service: "CodeBuild",
    q: "What test report format does CodeBuild natively parse for the Test Reports feature?",
    options: [
      "JUnit XML (and Cucumber XML)",
      "TAP (Test Anything Protocol)",
      "xUnit .NET format only",
      "JSON from pytest-json-report"
    ],
    explanation: "CodeBuild Test Reports natively parse JUnit XML and Cucumber JSON/XML files, displaying pass/fail counts and test durations in the console. Other formats must be converted before CodeBuild can process them."
  },
  {
    domain: 1,
    service: "CodeBuild",
    q: "What does enabling secondary sources in a CodeBuild project allow?",
    options: [
      "Pulling from up to 12 additional repositories during a build",
      "Triggering two build projects in parallel",
      "Running builds across two Availability Zones simultaneously",
      "Caching artifacts to a secondary S3 bucket"
    ],
    explanation: "Secondary sources allow a CodeBuild project to clone up to 12 additional repositories during a single build, each mounted at a configurable path. This is useful for monorepos or builds that depend on shared library repositories."
  },
  {
    domain: 1,
    service: "CodeBuild",
    q: "In buildspec.yml, under which block do you reference an AWS Secrets Manager secret by ARN?",
    options: [
      "env.secrets-manager",
      "env.variables",
      "env.parameter-store",
      "phases.pre_build.secrets"
    ],
    explanation: "The `env.secrets-manager` block in buildspec.yml maps environment variable names to Secrets Manager secret ARNs or names (with optional JSON key). CodeBuild fetches and injects the secret value before any build phase runs."
  },
  /* -- CodeDeploy (8) -- */
  {
    domain: 1,
    service: "CodeDeploy",
    q: "What file does CodeDeploy require in the application bundle to define deployment lifecycle hooks and file mappings?",
    options: [
      "appspec.yml",
      "deployspec.yml",
      "buildspec.yml",
      "taskdef.json"
    ],
    explanation: "`appspec.yml` (Application Specification) is required in the deployment bundle root. It maps source files to destination paths on the instance and defines lifecycle event hooks (scripts to run at each deployment phase)."
  },
  {
    domain: 1,
    service: "CodeDeploy",
    q: "What is the correct order of lifecycle event hooks for an EC2 in-place deployment?",
    options: [
      "ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService",
      "BeforeInstall → DownloadBundle → Install → ApplicationStart → ValidateService",
      "DownloadBundle → BeforeInstall → AfterInstall → ApplicationStart → ValidateService",
      "ApplicationStop → BeforeInstall → Install → AfterInstall → ApplicationStart"
    ],
    explanation: "The correct EC2 in-place order is: ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService. The agent first stops the old app, then downloads and installs the new revision, and finally validates it."
  },
  {
    domain: 1,
    service: "CodeDeploy",
    q: "When CodeDeploy performs a traffic-shifting Lambda deployment, what does it actually manipulate to move traffic from the old version to the new one?",
    options: [
      "The alias routing weights between two function versions",
      "The Lambda function's reserved concurrency allocation",
      "The API Gateway stage variable pointing to the function",
      "The Lambda layer version attached to each function"
    ],
    explanation: "CodeDeploy shifts Lambda traffic by updating the weighted routing on a Lambda alias—gradually moving traffic from the old version to the new one. This enables canary and linear traffic shifting strategies without changing the invoking code."
  },
  {
    domain: 1,
    service: "CodeDeploy",
    q: "What two events can automatically trigger a CodeDeploy rollback?",
    options: [
      "Deployment failure or CloudWatch Alarm breach",
      "Deployment timeout and low ELB throughput",
      "SNS notification and manual pipeline stop",
      "EC2 instance health check failure and ASG scale-in"
    ],
    explanation: "CodeDeploy can automatically roll back when a deployment fails (e.g., a lifecycle hook script exits non-zero) or when a configured CloudWatch Alarm enters ALARM state during or after deployment, indicating the new version is degraded."
  },
  {
    domain: 1,
    service: "CodeDeploy",
    q: "In a Blue/Green EC2 deployment, which AWS resource routes traffic between the blue and green environments?",
    options: [
      "ALB or NLB target group switching",
      "Route 53 weighted routing policy",
      "CloudFront origin group failover",
      "AWS Global Accelerator endpoint group"
    ],
    explanation: "CodeDeploy Blue/Green on EC2 uses an ALB or NLB to switch traffic. It registers the green (new) instances with the load balancer target group and deregisters the blue (old) ones, enabling fast cutover without DNS changes."
  },
  {
    domain: 1,
    service: "CodeDeploy",
    q: "Unlike EC2 deployments that use shell scripts, what technology implements ECS deployment lifecycle hooks?",
    options: [
      "Lambda functions",
      "AWS Systems Manager Run Command scripts",
      "ECS task definition overrides",
      "Docker ENTRYPOINT scripts"
    ],
    explanation: "ECS deployment lifecycle hooks (BeforeInstall, AfterInstall, AfterAllowTestTraffic, BeforeAllowTraffic, AfterAllowTraffic) invoke Lambda functions. There's no instance to run shell scripts on, so Lambda provides the hook execution environment."
  },
  {
    domain: 1,
    service: "CodeDeploy",
    q: "The CodeDeploy predefined Canary10Percent* deployment configurations deploy to what percentage of instances (or traffic weight) first?",
    options: [
      "10% first, 90% after",
      "25% first, 75% after",
      "50% first, 50% after",
      "1% first, 99% after"
    ],
    explanation: "The predefined Canary10Percent* configurations deploy to 10% of instances (or traffic weight) first, wait for a configurable interval, then shift the remaining 90%. Note: the percentage is configurable in custom deployment configurations. Linear deployments move in equal increments on a schedule instead."
  },
  {
    domain: 1,
    service: "CodeDeploy",
    q: "A deployment fails at the AllowTraffic lifecycle event with no error in the application logs. What is the most likely cause?",
    options: [
      "Misconfigured ELB health checks causing the target to fail",
      "The CodeDeploy agent is not running on the instance",
      "The appspec.yml file is missing the AllowTraffic hook",
      "The IAM role lacks s3:GetObject on the artifact bucket"
    ],
    explanation: "AllowTraffic is controlled by the ELB health check, not by appspec scripts—so there's no application log entry when it fails. If the health check port, path, or threshold is misconfigured, the load balancer never marks the target healthy and the deployment stalls."
  },
  /* -- CodeArtifact (6) -- */
  {
    domain: 1,
    service: "CodeArtifact",
    q: "What is the maximum number of upstream repositories a single CodeArtifact repository can have?",
    options: [
      "10",
      "5",
      "20",
      "Unlimited"
    ],
    explanation: "A single CodeArtifact repository can have up to 10 upstream repositories. Package resolution cascades through the upstream chain until the package is found or all upstreams (including external connections) are exhausted."
  },
  {
    domain: 1,
    service: "CodeArtifact",
    q: "What CodeArtifact configuration links a repository to a public package registry such as npmjs.com?",
    options: [
      "External connection",
      "Upstream repository pointing to a public domain",
      "Public gateway endpoint",
      "Cross-domain replication rule"
    ],
    explanation: "An external connection links a CodeArtifact repository to a supported public package registry (npmjs, PyPI, Maven Central, NuGet, etc.), enabling fetch-and-cache of packages on first request."
  },
  {
    domain: 1,
    service: "CodeArtifact",
    q: "What is a CodeArtifact domain?",
    options: [
      "A logical grouping of repositories that can span multiple accounts",
      "A DNS alias for the CodeArtifact package endpoint",
      "A per-package namespace within a single repository",
      "An IAM permission boundary for CodeArtifact access"
    ],
    explanation: "A CodeArtifact domain is a logical container that groups repositories, potentially across multiple AWS accounts. It provides a single administrative boundary for resource policies, KMS encryption, and cross-account package sharing."
  },
  {
    domain: 1,
    service: "CodeArtifact",
    q: "How many external connections (e.g., to npmjs.com) can a single CodeArtifact repository have?",
    options: [
      "1",
      "3",
      "5",
      "10"
    ],
    explanation: "Each CodeArtifact repository supports exactly one external connection. To proxy multiple public registries, create separate repositories (one per registry) and chain them as upstreams behind a single gateway repository."
  },
  {
    domain: 1,
    service: "CodeArtifact",
    q: "How is cross-account access to a CodeArtifact repository granted?",
    options: [
      "Resource-based policy on the repository",
      "VPC endpoint policy allowing the remote account's VPC",
      "AWS RAM share of the CodeArtifact domain",
      "IAM identity federation with the target account"
    ],
    explanation: "Cross-account access to CodeArtifact is granted via a resource-based policy attached to the repository or domain, allowing principals from other accounts to perform specific actions like reading packages."
  },
  {
    domain: 1,
    service: "CodeArtifact",
    q: "Which EventBridge event type does CodeArtifact publish when a new package version is added?",
    options: [
      "aws.codeartifact > PackageVersionStateChange",
      "aws.codeartifact > PackageVersionApproved",
      "aws.codeartifact > RepositorySynced",
      "aws.codeartifact > DomainPackageAdded"
    ],
    explanation: "CodeArtifact publishes `PackageVersionStateChange` events to EventBridge when a package version's status changes (e.g., Published, Unfinished, Archived, Deleted). EventBridge rules can trigger downstream automation like security scanning or pipeline promotion."
  },
  /* -- SAM & CDK Pipelines (5) -- */
  {
    domain: 1,
    service: "SAM & CDK Pipelines",
    q: "Which SAM CLI command both packages the application and deploys it to CloudFormation in a single step?",
    options: [
      "sam deploy",
      "sam package && sam deploy (two commands required)",
      "sam build",
      "sam publish"
    ],
    explanation: "`sam deploy` handles both packaging (uploading local artifacts like Lambda code to S3) and deployment (creating/updating the CloudFormation stack) in one command. `sam package` only packages without deploying."
  },
  {
    domain: 1,
    service: "SAM & CDK Pipelines",
    q: "After running `sam deploy --guided`, what file is written to store deployment configuration for future runs?",
    options: [
      "samconfig.toml",
      ".aws-sam/build.toml",
      "template.config.json",
      "cdk.context.json"
    ],
    explanation: "`sam deploy --guided` prompts for stack name, region, S3 bucket, capabilities, and other parameters, then saves them to `samconfig.toml`. Subsequent `sam deploy` runs read this file automatically, skipping the interactive prompts."
  },
  {
    domain: 1,
    service: "SAM & CDK Pipelines",
    q: "What property makes CDK Pipelines 'self-mutating'?",
    options: [
      "A SelfMutate stage that updates the pipeline definition before deploying the application",
      "It rebuilds the CDK app from source on every run",
      "CloudFormation drift detection runs before each stage",
      "The pipeline re-synthesizes the CDK stack on each commit"
    ],
    explanation: "CDK Pipelines includes a SelfMutate stage early in the pipeline that runs `cdk deploy` on the pipeline stack itself. Adding a new stage to your CDK code automatically updates the pipeline on the next run—no manual pipeline update needed."
  },
  {
    domain: 1,
    service: "SAM & CDK Pipelines",
    q: "Which CDK Pipelines construct allows multiple deployment stages to run in parallel across accounts or regions?",
    options: [
      "Wave",
      "StageGroup",
      "ParallelDeployment",
      "ConcurrentStage"
    ],
    explanation: "A `Wave` in CDK Pipelines groups multiple `Stage` deployments to run concurrently. Stages within the same wave deploy in parallel; waves themselves execute sequentially, enabling controlled multi-account and multi-region rollouts."
  },
  {
    domain: 1,
    service: "SAM & CDK Pipelines",
    q: "What command must be run once in each target account before CDK cross-account deployments can work?",
    options: [
      "cdk bootstrap --trust <tooling-account-id>",
      "cdk deploy --trust <pipeline-account-id>",
      "aws sts assume-role --role-arn <cdk-role>",
      "cdk synth --context cross-account=true"
    ],
    explanation: "`cdk bootstrap --trust <tooling-account-id>` creates the CDK bootstrap stack in the target account and configures a trust policy so the tooling account's pipeline role can assume cross-account deployment roles. Without this, deployments fail with access denied."
  },
  /* -- Cross-Account & Multi-Region (5) -- */
  {
    domain: 1,
    service: "Cross-Account & Multi-Region",
    q: "In a cross-account CodePipeline pattern, which account hosts the pipeline infrastructure?",
    options: [
      "A dedicated tooling (pipeline) account",
      "The production target account",
      "The development account where code is committed",
      "The AWS Organizations management account"
    ],
    explanation: "Best practice is to host the pipeline in a dedicated tooling account, isolating CI/CD infrastructure from development and production accounts. The pipeline's IAM role then assumes cross-account deployment roles in target accounts."
  },
  {
    domain: 1,
    service: "Cross-Account & Multi-Region",
    q: "For a cross-account CodePipeline to deploy artifacts to a target account, what must the KMS key policy include?",
    options: [
      "Grant decrypt permissions to the target account's principals",
      "Allow CodePipeline to self-sign artifacts before delivery",
      "Allow the target account to generate new data keys",
      "Enable automatic key rotation in the target account"
    ],
    explanation: "The KMS key encrypting the S3 artifact bucket must grant `kms:Decrypt` (and `kms:DescribeKey`) to the target account's deployment role. Without this, the cross-account role cannot read the artifact ZIP files."
  },
  {
    domain: 1,
    service: "Cross-Account & Multi-Region",
    q: "The cross-account IAM role in the target account needs permissions for which set of services to support a CodePipeline deployment?",
    options: [
      "CodeDeploy, CloudFormation, S3 (read), and KMS (decrypt)",
      "Only IAM and CloudFormation",
      "EC2, ECS, Lambda, and S3 (write)",
      "CodePipeline, CodeBuild, and CloudWatch Logs"
    ],
    explanation: "The cross-account deployment role needs to read artifacts from S3 (s3:GetObject + kms:Decrypt) and execute the deployment action—typically CloudFormation or CodeDeploy. CodePipeline itself stays in the tooling account and orchestrates via the assumed role."
  },
  {
    domain: 1,
    service: "Cross-Account & Multi-Region",
    q: "What does CodePipeline do automatically to support cross-region actions that deploy to a different AWS Region?",
    options: [
      "Replicates artifacts to an S3 bucket in the target region (one bucket required per region)",
      "Replicates the pipeline definition to the target region",
      "Creates an ECR mirror in the target region",
      "Provisions a VPN connection between regions"
    ],
    explanation: "For cross-region actions, CodePipeline automatically copies artifacts from the primary artifact bucket to the per-region artifact bucket you pre-create. The action provider in the target region then reads from the regional bucket."
  },
  {
    domain: 1,
    service: "Cross-Account & Multi-Region",
    q: "What property do you set on a CodePipeline action to target a different AWS Region?",
    options: [
      "Region",
      "CrossRegion: true",
      "TargetRegion",
      "DeployRegion"
    ],
    explanation: "You set the `region` property on a CodePipeline action configuration to specify a different target region. CodePipeline handles artifact replication to the regional bucket automatically before executing the action."
  },
  /* -- CodeGuru (5) -- */
  {
    domain: 1,
    service: "CodeGuru",
    q: "Which programming languages does CodeGuru Reviewer support for automated code analysis?",
    options: [
      "Java and Python",
      "JavaScript and TypeScript",
      "Go and Ruby",
      "C# and Java"
    ],
    explanation: "CodeGuru Reviewer supports Java and Python. It uses ML models trained on millions of code reviews to detect issues like resource leaks, concurrency bugs, input validation problems, and security vulnerabilities in these two languages."
  },
  {
    domain: 1,
    service: "CodeGuru",
    q: "What does the CodeGuru Reviewer Secrets Detector feature do?",
    options: [
      "Identifies hardcoded credentials in code and recommends moving them to Secrets Manager",
      "Scans IAM policies for overly permissive statements",
      "Monitors CloudTrail logs for secret access anomalies",
      "Rotates database passwords stored in Parameter Store"
    ],
    explanation: "The Secrets Detector scans code for hardcoded credentials—API keys, passwords, database connection strings—and recommends moving them to AWS Secrets Manager. This prevents accidental credential exposure in source control."
  },
  {
    domain: 1,
    service: "CodeGuru",
    q: "CodeGuru Reviewer can automatically review pull requests on which source control platforms?",
    options: [
      "GitHub, Bitbucket, and CodeCommit",
      "GitLab, Azure DevOps, and CodeCommit",
      "GitHub Enterprise only",
      "CodeCommit only"
    ],
    explanation: "CodeGuru Reviewer integrates with GitHub (including GitHub Enterprise), Bitbucket, and AWS CodeCommit for automatic pull request reviews. GitLab and Azure DevOps are not natively supported."
  },
  {
    domain: 1,
    service: "CodeGuru",
    q: "In CodeGuru Profiler, what does the heap summary visualization display?",
    options: [
      "Object allocation patterns showing which types consume heap memory",
      "Total RAM consumed by the EC2 instance over time",
      "GC pause durations and frequency per JVM thread",
      "Network socket buffer utilization"
    ],
    explanation: "The heap summary shows which object types are consuming heap memory and their allocation rates over time, helping identify memory leaks and inefficient object creation patterns. It's not a raw RAM meter or GC log."
  },
  {
    domain: 1,
    service: "CodeGuru",
    q: "How can you add CodeGuru Profiler instrumentation to a Lambda function without modifying application code?",
    options: [
      "Attach the CodeGuru Profiler agent as a Lambda Layer",
      "Enable X-Ray active tracing — it integrates automatically",
      "Set the CODEGURU_PROFILER_ENABLED environment variable",
      "Use a Lambda@Edge function to inject the profiler"
    ],
    explanation: "The CodeGuru Profiler agent is distributed as a Lambda Layer. Attach the layer and set the required environment variables (profiler group name, region)—no application code changes required. X-Ray is a separate tracing service."
  },
  /* -- EC2 Image Builder (5) -- */
  {
    domain: 1,
    service: "EC2 Image Builder",
    q: "What is the cost model for using EC2 Image Builder itself?",
    options: [
      "Free; you only pay for the underlying EC2 instances and S3 storage used during builds",
      "$0.01 per image pipeline execution",
      "Charged per component execution minute",
      "Included in the EC2 AMI storage cost"
    ],
    explanation: "EC2 Image Builder has no service charge. You pay only for the EC2 instances launched during build and test phases, plus S3 storage for AMI snapshots and logs. The orchestration itself is free."
  },
  {
    domain: 1,
    service: "EC2 Image Builder",
    q: "How do you share an AMI produced by EC2 Image Builder with other AWS accounts?",
    options: [
      "Enable AMI sharing in the EC2 Image Builder distribution settings using AWS RAM",
      "Configure a CodePipeline stage to copy the AMI cross-account",
      "Use AWS Resource Access Manager (RAM) to share the image recipe",
      "Modify the AMI launch permissions to add the target account IDs"
    ],
    explanation: "AMI distribution is configured in the Image Builder pipeline's distribution settings, where you specify target accounts and regions. AWS RAM is used under the hood to share the AMI, making it launchable in target accounts without copying."
  },
  {
    domain: 1,
    service: "EC2 Image Builder",
    q: "Which AWS service feature is commonly used to store and reference the latest AMI ID produced by Image Builder for use in downstream pipelines?",
    options: [
      "SSM Parameter Store (using a StringParameter with the AMI ID)",
      "AWS Config rule evaluation result",
      "CloudFormation Exports",
      "EventBridge event archive"
    ],
    explanation: "Image Builder can automatically publish the new AMI ID to an SSM Parameter Store parameter after a successful build. CloudFormation stacks and pipelines can reference this parameter to always use the latest golden AMI without hardcoding IDs."
  },
  {
    domain: 1,
    service: "EC2 Image Builder",
    q: "After the builder EC2 instance finishes applying components, what does Image Builder launch next in the pipeline?",
    options: [
      "A test EC2 instance that runs validation test components",
      "A Lambda function to run unit tests against the AMI",
      "An ECS task executing a container-based test suite",
      "A CodeBuild project with the test buildspec"
    ],
    explanation: "After the builder instance creates the AMI, Image Builder launches a separate test instance from that exact AMI and runs test components (shell scripts or AWSTOE documents). Only after tests pass is the AMI marked available for distribution."
  },
  {
    domain: 1,
    service: "EC2 Image Builder",
    q: "In a pattern where a new AMI triggers pipeline execution, what service notifies a Lambda function when Image Builder finishes?",
    options: [
      "EventBridge rule on Image Builder state change",
      "CloudTrail event forwarded to Lambda directly",
      "SNS notification published by Image Builder on completion",
      "SQS queue polled by a Lambda trigger"
    ],
    explanation: "Image Builder publishes state-change events to EventBridge (e.g., IMAGE_STATE_CHANGED with state AVAILABLE). An EventBridge rule can trigger a Lambda function to kick off downstream actions like updating Launch Templates or starting a CodePipeline."
  },
  /* -- AWS Amplify (5) -- */
  {
    domain: 1,
    service: "AWS Amplify",
    q: "Which AWS CDN service does Amplify Console use to globally distribute frontend applications?",
    options: [
      "CloudFront",
      "AWS Global Accelerator",
      "API Gateway Edge-Optimized endpoint",
      "Elastic Load Balancing with geo-routing"
    ],
    explanation: "Amplify Hosting distributes frontend assets globally through CloudFront, AWS's CDN. This provides low-latency delivery from edge locations worldwide and includes automatic HTTPS via ACM certificates."
  },
  {
    domain: 1,
    service: "AWS Amplify",
    q: "When you connect a Git branch to an Amplify app, how many deployed environments does that branch get?",
    options: [
      "One per branch (each branch maps to one environment)",
      "One per commit (each commit is a separate deployment URL)",
      "One shared environment across all branches",
      "Two: staging and production per branch"
    ],
    explanation: "Each Git branch connected to Amplify gets its own deployed environment with a unique URL (e.g., `branch-name.app-id.amplifyapp.com`). This enables branch-based preview deployments for pull requests and feature branches."
  },
  {
    domain: 1,
    service: "AWS Amplify",
    q: "Which Amplify component lets you provision backend AWS resources (Auth, API, Storage) without writing CloudFormation directly?",
    options: [
      "Amplify Backend (Amplify CLI)",
      "Amplify Studio visual designer",
      "Amplify Hosting build settings",
      "AWS AppRunner with Amplify integration"
    ],
    explanation: "The Amplify CLI (`amplify add auth`, `amplify add api`, etc.) provisions backend AWS resources through a category-based wizard, generating and deploying CloudFormation stacks under the hood without you writing raw CFN templates."
  },
  {
    domain: 1,
    service: "AWS Amplify",
    q: "Which source control providers can Amplify Console connect to for automatic branch deployments?",
    options: [
      "GitHub, CodeCommit, Bitbucket, GitLab, or manual ZIP upload",
      "GitHub and Bitbucket only",
      "GitHub, GitLab, and Azure DevOps",
      "Any Git provider via a webhook URL"
    ],
    explanation: "Amplify Console supports connecting to GitHub, AWS CodeCommit, Bitbucket, and GitLab for automatic deployments. It also supports manual ZIP file uploads for providers not natively supported. Azure DevOps is not natively integrated."
  },
  {
    domain: 1,
    service: "AWS Amplify",
    q: "When Amplify Backend provisions a GraphQL API, which AWS service powers it?",
    options: [
      "AppSync",
      "API Gateway HTTP API with Lambda resolvers",
      "API Gateway REST API with VTL mapping templates",
      "EventBridge API Destinations"
    ],
    explanation: "When you run `amplify add api` and choose GraphQL, Amplify provisions an AWS AppSync API with DynamoDB data sources and auto-generated resolvers. AppSync handles GraphQL queries, mutations, and real-time subscriptions."
  },
  /* -- CloudFormation (38) -- */
  {
    domain: 2,
    service: "CloudFormation",
    q: "Which is the only required section in a CloudFormation template?",
    options: [
      "Resources",
      "Parameters",
      "Outputs",
      "Mappings"
    ],
    explanation: "The Resources section is the only mandatory section in a CloudFormation template. All other sections — Parameters, Mappings, Conditions, Outputs, Metadata, and Transform — are optional."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What does AWS Infrastructure Composer provide for CloudFormation?",
    options: [
      "A visual drag-and-drop canvas for designing templates",
      "A CLI tool that validates templates against best practices",
      "An AI service that auto-generates templates from descriptions",
      "A managed service that deploys templates across accounts"
    ],
    explanation: "Infrastructure Composer (formerly Application Composer) provides a visual drag-and-drop canvas where you can design CloudFormation templates graphically. It generates and syncs the underlying YAML/JSON template in real time."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What does `!Ref` return for most resources, compared to `!GetAtt`?",
    options: [
      "`Ref` returns the physical resource ID; `GetAtt` returns a specific named attribute",
      "`Ref` returns the ARN; `GetAtt` returns the physical ID",
      "`Ref` returns the logical ID; `GetAtt` returns the physical ID",
      "They return the same value but `GetAtt` allows nested lookups"
    ],
    explanation: "`!Ref` typically returns the physical ID of a resource (e.g., an EC2 instance ID or S3 bucket name). `!GetAtt` retrieves a specific attribute of the resource, such as `MyELB.DNSName` or `MyInstance.PrivateIp`."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "When should you use Mappings instead of Parameters in a CloudFormation template?",
    options: [
      "When values are known in advance and fixed per key (e.g., AMI IDs per region)",
      "When values must be entered by the user at deploy time",
      "When values need to be validated with AllowedPattern",
      "When values are exported from another stack"
    ],
    explanation: "Mappings are lookup tables for values known at authoring time that vary by key (e.g., region-specific AMI IDs). Parameters are for values that must be supplied or chosen by the user at deploy time. Use Mappings for fixed, predictable values; Parameters for user input."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What does the `NoEcho` property do on a CloudFormation parameter?",
    options: [
      "Prevents the parameter from appearing in stack events and console output",
      "Encrypts the parameter value at rest using KMS",
      "Hides the parameter from the Outputs section",
      "Prevents the parameter from being passed to nested stacks"
    ],
    explanation: "`NoEcho: true` masks the parameter value with asterisks in the console, CLI output, and CloudTrail logs. It does NOT encrypt the value — it only prevents it from being displayed. For true secret management, use dynamic references to Secrets Manager or SSM SecureString."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "Which pseudo-parameter returns a value that effectively removes a property when used with `Fn::If`?",
    options: [
      "AWS::NoValue",
      "AWS::StackName",
      "AWS::AccountId",
      "AWS::URLSuffix"
    ],
    explanation: "`AWS::NoValue` is used with `Fn::If` to conditionally remove a property entirely from a resource definition. When the condition is false, returning `AWS::NoValue` tells CloudFormation to act as if the property was never specified."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "Which parameter constraint enforces a regular expression pattern on user input?",
    options: [
      "AllowedPattern",
      "AllowedValues",
      "ConstraintDescription",
      "MaxLength"
    ],
    explanation: "`AllowedPattern` accepts a regular expression that the parameter value must match. `AllowedValues` provides an explicit list of permitted values. `ConstraintDescription` only customizes the error message shown when validation fails."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What happens when you try to delete a stack whose outputs are imported by another stack?",
    options: [
      "The deletion fails with an error",
      "The importing stack's resources are automatically updated",
      "The export is silently removed and the importing stack keeps the last known value",
      "The importing stack enters UPDATE_ROLLBACK_FAILED state"
    ],
    explanation: "CloudFormation prevents deletion of a stack if any of its exported outputs are currently imported by another stack. You must first remove the import references from all consuming stacks before deleting the exporting stack."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the uniqueness scope for CloudFormation export names?",
    options: [
      "Unique per region within the account",
      "Unique per stack",
      "Unique per account",
      "Globally unique across all AWS accounts"
    ],
    explanation: "Export names must be unique within a given region in the same AWS account. Two stacks in the same account and region cannot use the same export name. Different regions can reuse the same export name."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "How do you conditionally set a resource property to one value or another in CloudFormation?",
    options: [
      "Use `Fn::If` referencing a condition name",
      "Use `Fn::Select` with a condition index",
      "Use `Condition:` directly inside the property",
      "Use `Fn::Equals` inline in the property value"
    ],
    explanation: "`Fn::If` takes a condition name and two values — it returns the first value if the condition is true, or the second if false. Conditions themselves are defined in the Conditions section using functions like `Fn::Equals`, but `Fn::If` is what applies them to property values."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the maximum number of conditions that `Fn::And` and `Fn::Or` can evaluate?",
    options: [
      "10",
      "2",
      "5",
      "Unlimited"
    ],
    explanation: "`Fn::And` and `Fn::Or` accept between 2 and 10 conditions. If you need to evaluate more than 10, you must nest multiple `Fn::And` or `Fn::Or` calls."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "For complex string interpolation in CloudFormation, which function is preferred over `Fn::Join`?",
    options: [
      "Fn::Sub",
      "Fn::Select",
      "Fn::Split",
      "Fn::Transform"
    ],
    explanation: "`Fn::Sub` supports inline variable substitution with `${Variable}` syntax, making complex strings far more readable than chaining `Fn::Join` with `Ref` and `GetAtt` calls. It can reference parameters, resource attributes, and pseudo-parameters directly."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is `Fn::Base64` most commonly used for in CloudFormation templates?",
    options: [
      "Encoding EC2 UserData scripts",
      "Encrypting sensitive parameter values",
      "Hashing resource names for uniqueness",
      "Converting binary files for S3 upload"
    ],
    explanation: "EC2 UserData must be base64-encoded. `Fn::Base64` is almost always used to encode the UserData property of EC2 instances, typically wrapping a `Fn::Sub` or `Fn::Join` call that builds the startup script."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What dependency relationship does `Fn::ImportValue` create between stacks?",
    options: [
      "A hard dependency that prevents the exporting stack from being deleted",
      "A soft reference that resolves only at creation time",
      "No dependency — values are copied at import time",
      "A bidirectional dependency between both stacks"
    ],
    explanation: "`Fn::ImportValue` creates a cross-stack dependency. The exporting stack cannot be deleted or have its export modified as long as any other stack imports that value. You must remove the import references first."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "Which API call is used to resolve a stack stuck in UPDATE_ROLLBACK_FAILED state?",
    options: [
      "continue-update-rollback",
      "cancel-update-stack",
      "rollback-stack",
      "delete-stack with --force"
    ],
    explanation: "`continue-update-rollback` resumes the rollback process after you've manually fixed whatever caused the original rollback to fail. You can optionally skip specific resources that cannot be restored using the `--resources-to-skip` parameter."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the default behavior when a CloudFormation stack creation fails?",
    options: [
      "All successfully created resources are rolled back and deleted automatically",
      "The stack enters CREATE_FAILED state and resources are left in place for debugging",
      "Only the failed resource is removed; others remain",
      "The stack pauses and waits for manual intervention"
    ],
    explanation: "By default, CloudFormation performs an automatic rollback on creation failure — it deletes all resources that were successfully created and the stack enters ROLLBACK_COMPLETE state. You can disable this behavior to preserve resources for debugging."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What IAM permission does a user need to assign a service role to CloudFormation?",
    options: [
      "iam:PassRole",
      "iam:CreateRole",
      "iam:AssumeRole",
      "cloudformation:SetServiceRole"
    ],
    explanation: "To assign a service role to CloudFormation, the user needs `iam:PassRole` permission for that specific role. This lets the user delegate permissions to CloudFormation without needing the underlying resource permissions themselves."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the key benefit of using a CloudFormation service role?",
    options: [
      "Users don't need direct permissions on the resources being created",
      "It encrypts all stack resources automatically",
      "It allows CloudFormation to deploy faster by parallelizing API calls",
      "It enables cross-account deployments without StackSets"
    ],
    explanation: "With a service role, CloudFormation uses the role's permissions instead of the calling user's permissions to create, update, and delete resources. This means users only need permission to call CloudFormation and pass the role, not direct access to every resource type."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "When is `CAPABILITY_NAMED_IAM` required instead of `CAPABILITY_IAM`?",
    options: [
      "When IAM resources have custom/explicit names",
      "When creating any IAM resource",
      "When IAM policies reference other accounts",
      "When creating IAM roles with admin privileges"
    ],
    explanation: "`CAPABILITY_NAMED_IAM` is required when your template creates IAM resources with explicit custom names (e.g., `RoleName: MyCustomRole`). Named IAM resources pose a higher risk because they could replace existing resources. `CAPABILITY_IAM` suffices for IAM resources without explicit names."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What error occurs when deploying a SAM template without acknowledging the required capabilities?",
    options: [
      "InsufficientCapabilitiesException",
      "ValidationError",
      "AccessDeniedException",
      "TemplateValidationError"
    ],
    explanation: "SAM templates include a `Transform` that creates IAM roles (e.g., Lambda execution roles). Deploying without `--capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND` raises `InsufficientCapabilitiesException`. The `CAPABILITY_AUTO_EXPAND` is needed for the SAM transform macro."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "Which AWS resource types support `DeletionPolicy: Snapshot`?",
    options: [
      "RDS, EBS, ElastiCache, Redshift, and Neptune",
      "EC2, S3, and DynamoDB",
      "All resource types that store data",
      "Only RDS and DynamoDB"
    ],
    explanation: "`DeletionPolicy: Snapshot` is supported by RDS DB instances/clusters, EBS volumes, ElastiCache clusters, Redshift clusters, and Neptune DB clusters. It creates a final snapshot before the resource is deleted. S3 and DynamoDB do not support this policy."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "Why might deleting a stack with an S3 bucket set to `DeletionPolicy: Delete` still fail?",
    options: [
      "The bucket still has objects in it — CloudFormation cannot delete a non-empty bucket",
      "S3 buckets cannot use DeletionPolicy: Delete",
      "The IAM role lacks s3:DeleteBucket permission",
      "DeletionPolicy: Delete is the default and requires explicit confirmation"
    ],
    explanation: "CloudFormation cannot delete an S3 bucket that still contains objects. Even with `DeletionPolicy: Delete`, you must first empty the bucket. A common pattern is using a custom resource backed by Lambda to empty the bucket before stack deletion."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the default behavior once any stack policy is applied to a stack?",
    options: [
      "All resources are protected (deny updates) unless explicitly allowed",
      "All resources are unprotected unless explicitly denied",
      "Only IAM resources are protected by default",
      "The policy has no effect until activated via a separate API call"
    ],
    explanation: "Once a stack policy is set, the implicit default is to deny updates to ALL resources. You must explicitly allow updates for each resource or resource type you want to be updatable. This is a secure-by-default design."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "Stack policies protect resources against which type of operation?",
    options: [
      "Updates only",
      "Creation and deletion",
      "All stack operations including creation, updates, and deletion",
      "Drift detection and remediation"
    ],
    explanation: "Stack policies only apply to update operations. They do not prevent stack creation or deletion. To prevent stack deletion, use termination protection. To prevent resource deletion during updates, use `DeletionPolicy: Retain`."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What can back a CloudFormation custom resource?",
    options: [
      "Lambda function or SNS topic",
      "Step Functions state machine or SQS queue",
      "Any AWS service with an API endpoint",
      "Only Lambda functions"
    ],
    explanation: "Custom resources can be backed by a Lambda function (`Custom::MyResource` or `AWS::CloudFormation::CustomResource` with a Lambda ARN) or an SNS topic. Lambda is far more common. CloudFormation sends lifecycle events (Create/Update/Delete) to the backing service."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the classic exam scenario for using a CloudFormation custom resource?",
    options: [
      "Emptying an S3 bucket before stack deletion",
      "Creating an EC2 instance with a specific AMI",
      "Setting up VPC peering across regions",
      "Deploying Lambda functions with dependencies"
    ],
    explanation: "The most common exam scenario is using a custom resource backed by Lambda to empty an S3 bucket before deletion. Since CloudFormation cannot delete non-empty buckets, the custom resource's Delete handler invokes a Lambda that removes all objects first."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the correct syntax for a dynamic reference to retrieve a Secrets Manager secret in a CloudFormation template?",
    options: [
      "`{{resolve:secretsmanager:my-secret:SecretString:password}}`",
      "`!Ref AWS::SecretsManager::MySecret`",
      "`Fn::ImportValue: secrets-manager-my-secret`",
      "`!GetAtt SecretsManager.MySecret.Value`"
    ],
    explanation: "Dynamic references use the `{{resolve:secretsmanager:secret-id:SecretString:json-key:version-stage:version-id}}` syntax. This resolves the secret value at deploy time without exposing it in the template. Only `SecretString` is supported (not `SecretBinary`)."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What does setting `ManageMasterUserPassword: true` on an RDS instance in CloudFormation do?",
    options: [
      "Auto-generates the master password and manages it in Secrets Manager",
      "Requires the password to be passed as a parameter",
      "Disables password authentication in favor of IAM auth",
      "Encrypts the password with a CloudFormation-managed KMS key"
    ],
    explanation: "`ManageMasterUserPassword: true` tells RDS to auto-generate a strong master password and store/rotate it in Secrets Manager automatically. This is the recommended approach — it avoids hardcoding passwords in templates or parameters."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the correct execution order for cfn-init configsets?",
    options: [
      "Packages, Groups, Users, Sources, Files, Commands, Services",
      "Commands, Files, Packages, Services, Users, Groups, Sources",
      "Files, Packages, Commands, Services, Sources, Users, Groups",
      "The order is random and determined at runtime"
    ],
    explanation: "cfn-init always processes config keys in this fixed order: Packages, Groups, Users, Sources, Files, Commands, Services. This ensures dependencies are met — e.g., packages are installed before config files are written and services are started last."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What does cfn-signal do?",
    options: [
      "Sends a success or failure signal back to CloudFormation for a WaitCondition or CreationPolicy",
      "Triggers a stack update when instance configuration changes",
      "Signals other EC2 instances in the same Auto Scaling group",
      "Notifies SNS when cfn-init completes"
    ],
    explanation: "cfn-signal sends a signal (success or failure) back to CloudFormation to indicate whether instance bootstrapping completed successfully. It works with CreationPolicy or WaitCondition resources. If the signal isn't received within the timeout, the resource creation fails."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the purpose of cfn-hup?",
    options: [
      "It detects metadata changes on the resource and re-runs cfn-init",
      "It monitors CloudFormation stack events and logs them locally",
      "It periodically signals CloudFormation that the instance is healthy",
      "It cleans up temporary files created by cfn-init"
    ],
    explanation: "cfn-hup is a daemon that runs on the EC2 instance and polls for changes to the resource metadata. When it detects a change (e.g., after a stack update), it can re-run cfn-init to apply the new configuration without replacing the instance."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the key difference between nested stacks and cross-stack references?",
    options: [
      "Nested stacks share a lifecycle (tight coupling); cross-stack references allow independent lifecycles (value sharing)",
      "Nested stacks are faster to deploy; cross-stack references are more reliable",
      "Cross-stack references can only be used within the same account; nested stacks work cross-account",
      "There is no functional difference — they are interchangeable approaches"
    ],
    explanation: "Nested stacks are managed as part of the parent stack and share its lifecycle — they're best for reusable component templates. Cross-stack references (Export/ImportValue) let independent stacks share values while maintaining separate lifecycles — best for loosely coupled infrastructure."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "When is an explicit `DependsOn` attribute required on a CloudFormation resource?",
    options: [
      "When a dependency exists that isn't expressed through `!Ref` or `!GetAtt`",
      "Always — CloudFormation cannot infer dependencies",
      "Only when resources are in different stacks",
      "Only for resources that take more than 5 minutes to create"
    ],
    explanation: "CloudFormation automatically infers dependencies when you use `!Ref` or `!GetAtt` between resources. `DependsOn` is only needed for implicit dependencies that aren't captured by these references — for example, an app server that requires an internet gateway to be attached before it can reach the internet."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What do CloudFormation StackSets enable?",
    options: [
      "Deploying a single template across multiple accounts and regions",
      "Deploying a stack across multiple Availability Zones",
      "Creating stack templates from existing resources",
      "Grouping related stacks for bulk update operations"
    ],
    explanation: "StackSets let you deploy a single CloudFormation template across multiple AWS accounts and regions from a single management operation. They're essential for organizations that need consistent infrastructure across their account landscape."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What are the two permission models for CloudFormation StackSets?",
    options: [
      "Self-managed (IAM roles) and service-managed (AWS Organizations)",
      "IAM-based and resource-based policies",
      "Account-level and organization-level",
      "Push-based and pull-based deployment"
    ],
    explanation: "Self-managed StackSets require you to create IAM admin and execution roles in each account manually. Service-managed StackSets use AWS Organizations for automatic trust — CloudFormation creates the necessary roles and can auto-deploy to new accounts."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What is the key limitation of CloudFormation ChangeSets?",
    options: [
      "They show what changes will be made but cannot predict whether the update will succeed",
      "They cannot be used with nested stacks",
      "They require the stack to be in a healthy state before creation",
      "They expire after 24 hours if not executed"
    ],
    explanation: "ChangeSets show you exactly which resources will be added, modified, or replaced, but they cannot guarantee the update will succeed. For example, a ChangeSet won't tell you if a new instance type is unavailable in your AZ or if you'll hit a service limit."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "What are the four possible drift detection status values for a resource?",
    options: [
      "IN_SYNC, DRIFTED, NOT_CHECKED, DELETED",
      "COMPLIANT, NON_COMPLIANT, UNKNOWN, ERROR",
      "MATCHING, CHANGED, PENDING, REMOVED",
      "STABLE, MODIFIED, UNSCANNED, MISSING"
    ],
    explanation: "CloudFormation drift detection reports four statuses: IN_SYNC (matches template), DRIFTED (has been modified outside CloudFormation), NOT_CHECKED (drift detection hasn't been run), and DELETED (resource was deleted outside CloudFormation)."
  },
  {
    domain: 2,
    service: "CloudFormation",
    q: "A CloudFormation template works in us-east-1 but fails in eu-west-1 with a resource creation error. What is the most likely cause?",
    options: [
      "Hardcoded AMI IDs that are region-specific",
      "The template uses a feature not available in eu-west-1",
      "Different IAM permissions in the two regions",
      "CloudFormation API version mismatch between regions"
    ],
    explanation: "AMI IDs are region-specific — an AMI ID valid in us-east-1 does not exist in eu-west-1. The fix is to use a Mappings section that maps region names to the correct AMI IDs, or use SSM Parameter Store dynamic references to resolve the latest AMI per region."
  },
  /* -- Service Catalog (6) -- */
  {
    domain: 2,
    service: "Service Catalog",
    q: "How are products defined in AWS Service Catalog?",
    options: [
      "As CloudFormation templates managed by administrators",
      "As Docker container images stored in ECR",
      "As AMIs registered in the product registry",
      "As Terraform modules uploaded to S3"
    ],
    explanation: "Service Catalog products are defined using CloudFormation templates. Administrators create these templates, organize them into portfolios, and configure IAM permissions so end users can launch approved resources without needing direct AWS permissions."
  },
  {
    domain: 2,
    service: "Service Catalog",
    q: "What is a launch constraint in AWS Service Catalog?",
    options: [
      "An IAM role assigned to a product so users can launch it without broad AWS permissions",
      "A limit on how many products a user can launch per day",
      "A rule that restricts product launches to specific Availability Zones",
      "A budget threshold that blocks launches when spending exceeds a limit"
    ],
    explanation: "A launch constraint is an IAM role attached to a product. When a user launches the product, Service Catalog assumes this role to provision resources. The user only needs Service Catalog permissions, not direct permissions on the underlying AWS services like EC2 or RDS."
  },
  {
    domain: 2,
    service: "Service Catalog",
    q: "A company wants to restrict which AWS accounts and regions a Service Catalog product can be deployed to. Which constraint type should they use?",
    options: [
      "Stack Set constraint",
      "Launch constraint",
      "Notification constraint",
      "Template constraint"
    ],
    explanation: "Stack Set constraints configure product deployment options using CloudFormation StackSets. They allow administrators to restrict deployments by specific AWS accounts and regions, and require an IAM StackSet Administrator role for managing target accounts."
  },
  {
    domain: 2,
    service: "Service Catalog",
    q: "What IAM permissions are required for a Service Catalog launch constraint role?",
    options: [
      "CloudFormation full access, permissions for services in the template, and S3 read access to the template bucket",
      "Only Service Catalog and IAM permissions",
      "AdministratorAccess managed policy",
      "Only CloudFormation and S3 permissions"
    ],
    explanation: "The launch constraint role needs CloudFormation full access (to create/manage stacks), permissions for every AWS service referenced in the CloudFormation template, and S3 read access to the bucket containing the template. Missing any of these causes launch failures."
  },
  {
    domain: 2,
    service: "Service Catalog",
    q: "How can Service Catalog products be kept in sync with a version control repository?",
    options: [
      "Create a Git-synced product using an AWS CodeStar Connection to GitHub, GitHub Enterprise, or Bitbucket, so Service Catalog automatically creates a new product version on each commit",
      "Service Catalog natively polls GitHub every 5 minutes for changes",
      "Products auto-sync with S3 versioned buckets without additional configuration",
      "AWS Config rules detect template drift and update the catalog automatically"
    ],
    explanation: "Service Catalog supports Git-synced products via AWS CodeStar Connections. You authorize a one-time connection to GitHub, GitHub Enterprise, or Bitbucket, specify the repository, branch, and template file path, and Service Catalog automatically detects commits and creates new product versions. This eliminates the need for custom CI/CD pipelines or Lambda functions."
  },
  {
    domain: 2,
    service: "Service Catalog",
    q: "What is the primary benefit of AWS Service Catalog for an organization with strict compliance requirements?",
    options: [
      "It ensures users can only deploy pre-approved, standardized infrastructure defined by administrators",
      "It automatically encrypts all provisioned resources with customer-managed KMS keys",
      "It generates compliance reports for auditors automatically",
      "It blocks all manual resource creation in the AWS account"
    ],
    explanation: "Service Catalog enables governance and compliance by restricting users to launching only pre-approved products from curated portfolios. Administrators define exactly what can be deployed and how, ensuring consistency. It does not block manual creation or auto-encrypt resources."
  },
  /* -- Elastic Beanstalk (7) -- */
  {
    domain: 2,
    service: "Elastic Beanstalk",
    q: "What problem does Elastic Beanstalk primarily solve for development teams?",
    options: [
      "It abstracts common web app infrastructure (ALB + ASG) so developers focus on code rather than provisioning",
      "It provides a serverless runtime that eliminates all infrastructure management",
      "It replaces the need for CI/CD pipelines by deploying code directly from IDEs",
      "It provides a container orchestration platform similar to ECS"
    ],
    explanation: "Elastic Beanstalk handles capacity provisioning, load balancing, auto-scaling, health monitoring, and instance configuration for common web application architectures. It is not serverless (it uses EC2 instances) and does not replace CI/CD pipelines."
  },
  {
    domain: 2,
    service: "Elastic Beanstalk",
    q: "Which Elastic Beanstalk deployment mode is recommended for production workloads?",
    options: [
      "High Availability mode with a load balancer and auto-scaling group",
      "Single Instance mode with an Elastic IP",
      "Multi-region mode with Route 53 failover",
      "Serverless mode using Lambda behind API Gateway"
    ],
    explanation: "High Availability mode with a load balancer deploys multiple EC2 instances behind an ALB with auto-scaling, providing fault tolerance for production. Single Instance mode (no load balancer) is intended for dev/test environments only."
  },
  {
    domain: 2,
    service: "Elastic Beanstalk",
    q: "How does the Elastic Beanstalk worker tier process jobs?",
    options: [
      "It uses SQS queues for asynchronous processing and supports periodic tasks via cron.yaml",
      "It polls an SNS topic for messages and processes them on EC2 instances",
      "It runs AWS Step Functions workflows triggered by EventBridge events",
      "It uses a dedicated Lambda function pool for background task execution"
    ],
    explanation: "The worker tier uses SQS queues to receive and process messages asynchronously on EC2 instances. It also supports scheduled/periodic tasks defined in a cron.yaml file. SNS topics and Step Functions are not part of the worker tier architecture."
  },
  {
    domain: 2,
    service: "Elastic Beanstalk",
    q: "What is the relationship between an Elastic Beanstalk application, application version, and environment?",
    options: [
      "An application contains versioned code iterations, and an environment runs a specific version on provisioned AWS resources",
      "An application contains environments, each running a different AWS service",
      "An application version is a snapshot of the entire environment including infrastructure state",
      "An environment can run multiple application versions simultaneously using weighted routing"
    ],
    explanation: "An EB application is a logical container. Application versions are specific iterations of your code. An environment is a collection of AWS resources (EC2, ALB, ASG, etc.) running one particular application version. You can have multiple environments (dev, staging, prod) running different versions."
  },
  {
    domain: 2,
    service: "Elastic Beanstalk",
    q: "What are the two environment tiers available in Elastic Beanstalk?",
    options: [
      "Web server tier and worker tier",
      "Compute tier and storage tier",
      "Frontend tier and backend tier",
      "Public tier and private tier"
    ],
    explanation: "Elastic Beanstalk offers a web server tier (handles HTTP requests via a load balancer) and a worker tier (processes background jobs from SQS queues). These tiers use different architectures optimized for their respective workload patterns."
  },
  {
    domain: 2,
    service: "Elastic Beanstalk",
    q: "How does Elastic Beanstalk integrate with Amazon EventBridge?",
    options: [
      "EventBridge receives notifications about environment operation status, resource changes, managed updates, and health status",
      "EventBridge replaces Elastic Beanstalk's built-in health monitoring system",
      "EventBridge triggers Elastic Beanstalk deployments when code is pushed to CodeCommit",
      "EventBridge is required for Elastic Beanstalk worker tier cron job scheduling"
    ],
    explanation: "Elastic Beanstalk emits events to EventBridge covering environment operations, resource changes, managed updates, and health status changes. This allows you to build automated responses to environment events. Cron jobs use cron.yaml, not EventBridge."
  },
  {
    domain: 2,
    service: "Elastic Beanstalk",
    q: "What do you pay for when using Elastic Beanstalk?",
    options: [
      "Only the underlying AWS resources (EC2, ALB, etc.) — Elastic Beanstalk itself is free",
      "A monthly platform fee plus the cost of underlying resources",
      "A per-deployment charge based on the number of application versions",
      "An hourly fee based on the number of environments running"
    ],
    explanation: "Elastic Beanstalk is a free service. You only pay for the underlying AWS resources it provisions (EC2 instances, load balancers, RDS databases, etc.). There are no additional charges for the Beanstalk management layer itself."
  },
  /* -- SAM (7) -- */
  {
    domain: 2,
    service: "SAM",
    q: "What does the `Transform: 'AWS::Serverless-2016-10-31'` header in a SAM template indicate?",
    options: [
      "The template contains SAM-specific resource types that CloudFormation will transform into standard resources",
      "The template uses the SAM CLI version 2016-10-31",
      "The template is restricted to services available before October 2016",
      "The template requires the Serverless Application Repository for deployment"
    ],
    explanation: "The Transform header tells CloudFormation to process SAM-specific resource types (like AWS::Serverless::Function) and expand them into standard CloudFormation resources. Without this header, CloudFormation would not recognize SAM resource types."
  },
  {
    domain: 2,
    service: "SAM",
    q: "Which SAM resource type creates a Lambda function?",
    options: [
      "AWS::Serverless::Function",
      "AWS::Serverless::Lambda",
      "AWS::Lambda::Serverless",
      "AWS::SAM::Function"
    ],
    explanation: "AWS::Serverless::Function is the SAM resource type for Lambda functions. AWS::Serverless::Api maps to API Gateway, and AWS::Serverless::SimpleTable maps to DynamoDB. These SAM types are transformed into their full CloudFormation equivalents during deployment."
  },
  {
    domain: 2,
    service: "SAM",
    q: "What is the correct order of the SAM deployment process?",
    options: [
      "Write code + SAM YAML → Transform to CloudFormation → Zip and upload to S3 → Execute CloudFormation changeset",
      "Write code → Upload to S3 → Create Lambda → Attach API Gateway",
      "Write code → Push to CodeCommit → SAM auto-detects and deploys → CloudWatch monitors",
      "Write SAM YAML → CDK synthesizes → Deploy via CodePipeline → Validate with Config"
    ],
    explanation: "SAM deployment follows: author code and SAM template, SAM transforms it into a CloudFormation template, packages and uploads artifacts to S3, then creates and executes a CloudFormation changeset. Each step builds on the previous one."
  },
  {
    domain: 2,
    service: "SAM",
    q: "A team wants to validate that a new Lambda version works correctly before shifting all traffic to it. Which SAM feature supports this?",
    options: [
      "AutoPublishAlias with CodeDeploy deployment preferences (Canary/Linear) and pre/post-traffic hooks",
      "SAM Accelerate with --watch flag",
      "SAM local invoke with test event payloads",
      "AWS::Serverless::SimpleTable with conditional writes"
    ],
    explanation: "SAM integrates with CodeDeploy through AutoPublishAlias, which auto-creates new Lambda versions and aliases. Deployment preferences (Canary, Linear, AllAtOnce) control traffic shifting, and pre/post-traffic hooks run Lambda functions to validate the deployment. CloudWatch alarms can trigger automatic rollback."
  },
  {
    domain: 2,
    service: "SAM",
    q: "What does `sam sync --code` do differently from `sam sync`?",
    options: [
      "`sam sync --code` syncs only code changes and skips infrastructure updates, while `sam sync` syncs both",
      "`sam sync --code` deploys to production while `sam sync` deploys to staging",
      "`sam sync --code` compiles the code before uploading while `sam sync` uploads source directly",
      "`sam sync --code` uses CodeDeploy for deployment while `sam sync` uses CloudFormation"
    ],
    explanation: "sam sync updates both infrastructure and code through CloudFormation. The --code flag skips infrastructure changes and syncs only code, making it faster for iterative development. You can further narrow it with --resource to target a specific function."
  },
  {
    domain: 2,
    service: "SAM",
    q: "Which SAM capability allows developers to test Lambda functions and API Gateway endpoints on their local machine?",
    options: [
      "SAM local development (sam local invoke, sam local start-api)",
      "SAM Accelerate",
      "SAM CodeDeploy integration",
      "SAM CloudFormation preview"
    ],
    explanation: "SAM provides local development commands like sam local invoke (run a function once with an event) and sam local start-api (start a local API Gateway). These run Lambda functions and API Gateway in a local Docker container, enabling rapid development without deploying to AWS."
  },
  {
    domain: 2,
    service: "SAM",
    q: "What triggers an automatic rollback during a SAM/CodeDeploy Lambda deployment?",
    options: [
      "CloudWatch alarms defined in the deployment configuration breaching their thresholds",
      "A failed unit test in the source repository",
      "The Lambda function exceeding its memory limit during the first invocation",
      "A CodePipeline approval action being rejected"
    ],
    explanation: "SAM's CodeDeploy integration uses CloudWatch alarms to monitor the deployment. If an alarm breaches its threshold during traffic shifting, CodeDeploy automatically rolls back to the previous Lambda version. Pre/post-traffic hooks can also trigger rollback if they return a failure."
  },
  /* -- CDK (5) -- */
  {
    domain: 2,
    service: "CDK",
    q: "What is the output of running `cdk synth`?",
    options: [
      "A CloudFormation template generated from the CDK code",
      "A compiled binary that deploys resources directly via AWS APIs",
      "A Terraform plan showing proposed infrastructure changes",
      "A SAM template ready for local testing"
    ],
    explanation: "cdk synth (synthesize) converts CDK code written in a programming language into a standard CloudFormation template. This is the bridge between programmatic infrastructure definition and CloudFormation's declarative deployment model."
  },
  {
    domain: 2,
    service: "CDK",
    q: "What is a key advantage of CDK over SAM for infrastructure definition?",
    options: [
      "CDK supports all AWS services with programming language type safety, while SAM is focused on serverless resources",
      "CDK is free while SAM requires a license",
      "CDK deploys faster because it bypasses CloudFormation",
      "CDK templates are smaller and simpler than SAM templates"
    ],
    explanation: "CDK supports defining any AWS service using full programming languages with type safety that catches errors at development time. SAM is specifically designed for serverless applications (Lambda, API Gateway, DynamoDB). Both ultimately deploy through CloudFormation."
  },
  {
    domain: 2,
    service: "CDK",
    q: "How can CDK and SAM be used together for local Lambda testing?",
    options: [
      "Run `cdk synth` to generate a CloudFormation template, then use `sam local invoke` to test locally",
      "SAM converts CDK constructs into testable Python scripts",
      "CDK imports SAM layers to enable local execution",
      "SAM Accelerate embeds CDK constructs at runtime"
    ],
    explanation: "CDK and SAM integrate by using cdk synth to produce a CloudFormation template, which sam local invoke can then use to run Lambda functions locally in a Docker container. This combines CDK's programmatic power with SAM's local testing capabilities."
  },
  {
    domain: 2,
    service: "CDK",
    q: "What are constructs in the AWS CDK?",
    options: [
      "High-level, reusable cloud components that encapsulate one or more AWS resources",
      "IAM policies that govern resource creation permissions",
      "Build scripts that compile CDK code into machine-readable templates",
      "Validation rules that check CDK code against AWS best practices"
    ],
    explanation: "Constructs are the basic building blocks of CDK applications. They are reusable components that can represent a single AWS resource or a higher-level abstraction combining multiple resources with sensible defaults. This is what makes CDK code concise and reusable."
  },
  {
    domain: 2,
    service: "CDK",
    q: "Which programming languages does AWS CDK support for defining infrastructure?",
    options: [
      "JavaScript, TypeScript, Python, Java, and .NET",
      "Only TypeScript and Python",
      "Any language that compiles to WebAssembly",
      "Go, Rust, Ruby, and PHP"
    ],
    explanation: "CDK supports JavaScript, TypeScript, Python, Java, and .NET (C#/F#). TypeScript is the most commonly used and was the first supported language. Each language gets full IDE support including autocompletion and type checking."
  },
  /* -- Step Functions (7) -- */
  {
    domain: 2,
    service: "Step Functions",
    q: "Which Step Functions state type allows conditional branching based on input values?",
    options: [
      "Choice",
      "Pass",
      "Map",
      "Parallel"
    ],
    explanation: "The Choice state evaluates conditions against the input and routes execution to different branches based on the results. Pass simply transfers input to output. Map iterates over arrays. Parallel executes multiple branches concurrently."
  },
  {
    domain: 2,
    service: "Step Functions",
    q: "A workflow needs to process each item in an array independently. Which Step Functions state type should be used?",
    options: [
      "Map",
      "Parallel",
      "Choice",
      "Task with a loop"
    ],
    explanation: "The Map state iterates over an array in the input and runs a set of steps for each element. Parallel runs fixed branches concurrently regardless of input data. Map is dynamic (driven by the array), while Parallel is static (fixed branch count defined at authoring time)."
  },
  {
    domain: 2,
    service: "Step Functions",
    q: "What is the difference between the Parallel and Map state types in Step Functions?",
    options: [
      "Parallel executes a fixed set of branches concurrently, while Map iterates over a dynamic array running the same steps for each element",
      "Parallel processes items sequentially while Map processes them concurrently",
      "Parallel is for Lambda invocations only, while Map supports any AWS service",
      "There is no difference — they are aliases for the same state type"
    ],
    explanation: "Parallel runs multiple predefined branches at the same time (the branches are fixed at design time). Map dynamically iterates over an array, executing the same sub-workflow for each element. Use Parallel when you have distinct concurrent tasks; use Map when processing a collection."
  },
  {
    domain: 2,
    service: "Step Functions",
    q: "Which Step Functions state type is used to invoke a Lambda function or interact with AWS services like DynamoDB and SQS?",
    options: [
      "Task",
      "Pass",
      "Choice",
      "Wait"
    ],
    explanation: "The Task state performs work by invoking Lambda functions, running Batch jobs, calling ECS tasks, or interacting directly with services like DynamoDB, SNS, and SQS. It also supports Activities for long-running work on external compute resources."
  },
  {
    domain: 2,
    service: "Step Functions",
    q: "How can a Step Functions workflow introduce a delay before proceeding to the next state?",
    options: [
      "Use a Wait state with a duration or timestamp",
      "Use a Pass state with a timer parameter",
      "Use a Task state that invokes a sleep Lambda function",
      "Use a Choice state with a timeout condition"
    ],
    explanation: "The Wait state pauses execution for a specified duration (e.g., 10 seconds) or until a specific timestamp. This is a native capability — there is no need to invoke a Lambda function just to sleep, which would waste compute and cost money."
  },
  {
    domain: 2,
    service: "Step Functions",
    q: "What are the ways to trigger a Step Functions state machine execution?",
    options: [
      "AWS SDK, API Gateway, EventBridge, and CLI",
      "Only through the AWS Console and CLI",
      "Only through EventBridge rules",
      "Lambda invocation, S3 events, and DynamoDB Streams"
    ],
    explanation: "Step Functions can be started via the AWS SDK (programmatically), API Gateway (HTTP endpoint), EventBridge (event-driven), and the AWS CLI. S3 events and DynamoDB Streams cannot directly start a state machine — they would need to trigger a Lambda or EventBridge rule first."
  },
  {
    domain: 2,
    service: "Step Functions",
    q: "What does the Pass state do in a Step Functions workflow?",
    options: [
      "Passes input to output without performing work, optionally injecting fixed data",
      "Skips the current execution and moves to the next scheduled run",
      "Passes control to a nested state machine",
      "Marks the current branch as passed for error handling purposes"
    ],
    explanation: "The Pass state transfers its input directly to its output without doing any work. It can optionally inject fixed data using the Result field. It is commonly used for testing, mocking, or data transformation within a workflow."
  },
  /* -- AppConfig (8) -- */
  {
    domain: 2,
    service: "AppConfig",
    q: "What is the primary advantage of AppConfig over deploying configuration changes through code deployments?",
    options: [
      "AppConfig deploys configuration independently of code without requiring application restarts",
      "AppConfig stores configuration in a blockchain for immutability",
      "AppConfig encrypts all configuration with customer-managed KMS keys by default",
      "AppConfig configuration changes bypass all approval workflows for speed"
    ],
    explanation: "AppConfig enables dynamic configuration deployment separate from code releases. Applications pick up new configuration without restarting, which is critical for feature flags, rate limiting, and other settings that need to change frequently without full deployments."
  },
  {
    domain: 2,
    service: "AppConfig",
    q: "Which deployment strategy gradually increases the percentage of targets receiving a new configuration (1%, 2%, 4%, 8%...)?",
    options: [
      "Exponential",
      "AllAtOnce",
      "Linear",
      "Canary"
    ],
    explanation: "Exponential deployment grows the percentage of targets exponentially (1% -> 2% -> 4% -> 8%...). Linear deploys a fixed percentage at fixed intervals (e.g., 20% every 6 minutes). AllAtOnce deploys to all targets immediately. Canary is not a native AppConfig deployment strategy."
  },
  {
    domain: 2,
    service: "AppConfig",
    q: "How does AppConfig handle automatic rollback of a bad configuration deployment?",
    options: [
      "CloudWatch alarms trigger automatic rollback, with FinalBakeTimeInMinutes providing a monitoring window after 100% deployment",
      "It compares checksums of the old and new configuration files",
      "It rolls back automatically if any application instance reports an HTTP 500 error",
      "Users must manually trigger rollback through the AppConfig console"
    ],
    explanation: "AppConfig uses CloudWatch alarms to detect problems during deployment and automatically rolls back. FinalBakeTimeInMinutes defines a monitoring window after the configuration reaches 100% of targets, providing additional safety before the deployment is considered complete."
  },
  {
    domain: 2,
    service: "AppConfig",
    q: "What are the two types of configuration validation that AppConfig supports?",
    options: [
      "Syntactic validation (JSON Schema) and semantic validation (Lambda functions)",
      "Unit validation and integration validation",
      "Format validation (regex) and content validation (DynamoDB lookup)",
      "Static validation (CloudFormation) and dynamic validation (Step Functions)"
    ],
    explanation: "Syntactic validation uses JSON Schema to verify the configuration structure is valid. Semantic validation invokes a Lambda function that can run custom business logic to verify the configuration values make sense (e.g., a rate limit is within an acceptable range)."
  },
  {
    domain: 2,
    service: "AppConfig",
    q: "Which configuration sources can AppConfig pull from?",
    options: [
      "Hosted Configuration Store, SSM Parameter Store, SSM Documents, and S3",
      "Only the AppConfig Hosted Configuration Store",
      "S3, DynamoDB, and Secrets Manager",
      "CodeCommit, GitHub, and Bitbucket repositories"
    ],
    explanation: "AppConfig supports four configuration sources: its own Hosted Configuration Store (native JSON/YAML/feature flags), SSM Parameter Store, SSM Documents, and S3 buckets. Each is referenced through a configuration profile."
  },
  {
    domain: 2,
    service: "AppConfig",
    q: "How does AppConfig integrate with Lambda functions for configuration retrieval?",
    options: [
      "The AppConfig Lambda Extension is added as a layer that caches and retrieves configuration",
      "Lambda functions call the AppConfig API directly on each invocation",
      "Configuration is injected as Lambda environment variables at deploy time",
      "AppConfig triggers Lambda functions whenever configuration changes"
    ],
    explanation: "Lambda uses the AppConfig Lambda Extension, added as a layer. The extension runs as a sidecar process that caches configuration locally, reducing latency and API calls. For EC2, ECS, and EKS, an AppConfig Agent runs as a sidecar or daemon instead."
  },
  {
    domain: 2,
    service: "AppConfig",
    q: "When should you use AppConfig instead of SSM Parameter Store for application configuration?",
    options: [
      "When you need gradual rollout, validation, automatic rollback, and feature flag capabilities",
      "When you need simple key-value storage with immediate get/put operations",
      "When you need to store secrets encrypted with KMS",
      "When you need to reference configuration values in CloudFormation templates"
    ],
    explanation: "AppConfig is designed for dynamic configuration that benefits from gradual deployment, validation (syntactic and semantic), automatic rollback on alarms, and native feature flag support. Parameter Store is better for simple key-value pairs with immediate reads and writes."
  },
  {
    domain: 2,
    service: "AppConfig",
    q: "What is the purpose of AppConfig extensions?",
    options: [
      "They provide pre-deployment and post-deployment hooks via Lambda, SQS, SNS, or EventBridge",
      "They extend the maximum configuration file size beyond 1MB",
      "They allow AppConfig to support additional file formats beyond JSON and YAML",
      "They extend the deployment timeout window from 2 hours to 24 hours"
    ],
    explanation: "AppConfig extensions enable custom actions at various points in the configuration lifecycle. They can invoke Lambda functions, send messages to SQS/SNS, or emit EventBridge events before or after a deployment, enabling workflows like notifications, auditing, or additional validation."
  },
  /* -- Systems Manager (8) -- */
  {
    domain: 2,
    service: "Systems Manager",
    q: "What are the prerequisites for managing an EC2 instance with AWS Systems Manager?",
    options: [
      "Install the SSM Agent (pre-installed on Amazon Linux 2) and attach an IAM role with SSM permissions to the instance",
      "Install the CloudWatch agent and attach a VPC endpoint",
      "Enable SSH access and configure security groups to allow SSM traffic on port 443",
      "Register the instance in AWS Config and enable AWS Inspector"
    ],
    explanation: "Systems Manager requires the SSM Agent running on the instance (pre-installed on Amazon Linux 2 and some other AMIs) and an IAM instance profile with permissions to communicate with the SSM service. No SSH access or special security group rules are needed."
  },
  {
    domain: 2,
    service: "Systems Manager",
    q: "How does Session Manager improve security compared to traditional SSH access?",
    options: [
      "It provides shell access without needing SSH keys, open inbound ports, or bastion hosts, with full audit logging to S3/CloudWatch and CloudTrail",
      "It encrypts traffic with a stronger cipher than SSH",
    "It restricts commands to a predefined allowlist approved by administrators",
      "It requires multi-factor authentication for every session"
    ],
    explanation: "Session Manager eliminates the need for SSH keys, bastion hosts, and inbound port 22 in security groups. All sessions are logged to S3 or CloudWatch Logs, and CloudTrail captures StartSession events. Access is controlled through IAM policies and tags."
  },
  {
    domain: 2,
    service: "Systems Manager",
    q: "What is the difference between the Standard and Advanced tiers of SSM Parameter Store?",
    options: [
      "Standard allows 4KB values with up to 10,000 free parameters; Advanced allows 8KB values at $0.05/parameter/month",
      "Standard supports encryption while Advanced does not",
      "Standard is for dev/test environments only; Advanced is required for production",
      "Standard uses shared infrastructure; Advanced uses dedicated hardware"
    ],
    explanation: "Standard tier supports up to 4KB per parameter and is free for up to 10,000 parameters. Advanced tier supports 8KB values and costs $0.05 per parameter per month. Both tiers support KMS encryption, version tracking, and IAM-based access control."
  },
  {
    domain: 2,
    service: "Systems Manager",
    q: "How does SSM Patch Manager determine which patches to apply to a group of instances?",
    options: [
      "Patch baselines define approved and rejected patches, and patch groups (via the `patch-group` tag) link instances to specific baselines",
      "It applies all available patches regardless of severity",
      "Administrators manually select patches from a list for each instance",
      "It uses machine learning to predict which patches are safe to apply"
    ],
    explanation: "Patch baselines define rules for which patches are approved or rejected (default baselines cover critical and security patches only). Instances are assigned to patch groups using the `patch-group` tag. Each instance can belong to only one patch group, and each group maps to one baseline."
  },
  {
    domain: 2,
    service: "Systems Manager",
    q: "A company needs to execute a shell script across 500 EC2 instances without using SSH. Which Systems Manager capability should they use?",
    options: [
      "Run Command",
      "State Manager",
      "Automation",
      "Session Manager"
    ],
    explanation: "Run Command executes commands across instances via the SSM Agent without SSH. It supports targeting by tags, resource groups, or instance IDs, with rate and error controls. State Manager enforces ongoing desired state. Automation runs multi-step runbooks. Session Manager provides interactive shell access."
  },
  {
    domain: 2,
    service: "Systems Manager",
    q: "What is the purpose of SSM State Manager?",
    options: [
      "It maintains consistent instance configuration through associations that define documents, targets, and schedules to enforce desired state and correct drift",
      "It monitors and reports the current state of all AWS resources in the account",
      "It manages the lifecycle state of EC2 instances (running, stopped, terminated)",
      "It stores and versions the state of CloudFormation stacks"
    ],
    explanation: "State Manager uses associations (a document + targets + schedule) to enforce a desired configuration state on instances. It automatically corrects drift by re-applying the configuration on schedule. Common uses include bootstrapping instances, keeping agents updated, and maintaining security configs."
  },
  {
    domain: 2,
    service: "Systems Manager",
    q: "How are on-premises servers identified differently from EC2 instances in Systems Manager?",
    options: [
      "On-premises servers use the `mi-` prefix while EC2 instances use the `i-` prefix",
      "On-premises servers use the `op-` prefix while EC2 uses the `ec2-` prefix",
      "There is no difference — both use the same instance ID format",
      "On-premises servers are identified by hostname while EC2 uses instance IDs"
    ],
    explanation: "On-premises managed instances receive the `mi-` (managed instance) prefix, while EC2 instances use the standard `i-` prefix. On-premises servers are registered through Hybrid Activations, which provide an activation code and ID to install and register the SSM Agent."
  },
  {
    domain: 2,
    service: "Systems Manager",
    q: "How can a company access Systems Manager from EC2 instances in a private subnet without internet access?",
    options: [
      "Use VPC endpoints (PrivateLink) for the SSM service",
      "Configure a NAT Gateway in the private subnet",
      "Install a proxy server in the public subnet to relay SSM traffic",
      "Enable SSM Agent offline mode which queues commands locally"
    ],
    explanation: "VPC endpoints (AWS PrivateLink) allow instances in private subnets to reach the SSM service without a NAT Gateway or internet gateway. This is the recommended approach for environments that require strict network isolation. A NAT Gateway would also work but requires internet routing."
  }
];
