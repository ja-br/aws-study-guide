// Convention: options[0] is always the correct answer.
// Future questions may set correctAnswer: <index> to override.
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
  },

  /* -- Domain 3: Resilient Cloud Solutions -- */

  /* -- Lambda (10) -- */
  {
    domain: 3,
    service: "Lambda",
    q: "A development team deploys Lambda function updates by publishing new versions and switching the `prod` alias. During a production incident, they need to instantly revert to the previous version. What is the fastest way to roll back?",
    options: [
      "Update the prod alias to point to the previous version number",
      "Redeploy the previous code package to the $LATEST version and publish a new version",
      "Delete the current version so the alias automatically falls back",
      "Modify the function's environment variables to trigger a redeployment of the old code"
    ],
    explanation: "Aliases are pointers to specific version numbers. Updating the alias to point to the previous version is instantaneous and requires no redeployment. Deleting a version does not cause an alias to fall back automatically."
  },
  {
    domain: 3,
    service: "Lambda",
    q: "An application experiences intermittent throttling on a critical Lambda function while other functions in the same account remain idle. What should the team configure to guarantee capacity for the critical function?",
    options: [
      "Reserved concurrency on the critical function",
      "Provisioned concurrency on the critical function",
      "Increase the account-level concurrency limit through AWS Support",
      "Deploy the critical function in a dedicated VPC to isolate its capacity"
    ],
    explanation: "Reserved concurrency guarantees a set number of concurrent executions for a specific function, preventing other functions from consuming its share. Provisioned concurrency eliminates cold starts but does not reserve capacity from the account pool in the same way. Increasing the account limit helps all functions, not just the critical one."
  },
  {
    domain: 3,
    service: "Lambda",
    q: "A financial trading application uses a synchronous Lambda function and requires consistently low latency with no cold start delays. Which feature should the team enable?",
    options: [
      "Provisioned concurrency with Application Auto Scaling",
      "Reserved concurrency set to the expected peak",
      "A CloudFront distribution in front of the Lambda function URL",
      "A larger memory allocation to speed up initialization"
    ],
    explanation: "Provisioned concurrency pre-allocates execution environments so every invocation uses a warm instance, eliminating cold starts. Application Auto Scaling can adjust provisioned concurrency based on schedule or utilization. Reserved concurrency guarantees capacity but does not pre-warm environments."
  },
  {
    domain: 3,
    service: "Lambda",
    q: "A Lambda function invoked asynchronously by S3 event notifications occasionally fails. The team wants failed events to be retained for later analysis. What should they configure?",
    options: [
      "A Dead Letter Queue (DLQ) on the Lambda function to capture events after retries are exhausted",
      "S3 event notification retry settings to increase the retry count to 10",
      "A CloudWatch alarm that triggers a second Lambda to re-read the S3 object",
      "Synchronous invocation so the caller can handle the error directly"
    ],
    explanation: "For asynchronous invocations, Lambda automatically retries failed events twice and then sends them to a configured DLQ (SQS or SNS). This preserves the event payload for debugging or reprocessing. S3 event notifications do not have configurable retry counts."
  },
  {
    domain: 3,
    service: "Lambda",
    q: "Multiple Lambda functions in a data processing pipeline need to share a 2 GB reference dataset that changes weekly. Which storage option is most appropriate?",
    options: [
      "Mount an Amazon EFS file system accessible to all functions in the VPC",
      "Package the dataset as a Lambda layer shared across all functions",
      "Store the dataset in the /tmp ephemeral storage of each function",
      "Embed the dataset in the function deployment package"
    ],
    explanation: "EFS provides shared, persistent storage accessible by multiple Lambda functions simultaneously and supports datasets up to petabytes. Lambda layers are limited to 250 MB total uncompressed, and /tmp is limited to 10 GB per function and is not shared across functions."
  },
  {
    domain: 3,
    service: "Lambda",
    q: "A Lambda function in Account A needs to mount an EFS file system owned by Account B. Which combination of configurations is required?",
    options: [
      "VPC peering between accounts, cross-account EFS resource policy, and an EFS access point ARN in the Lambda configuration",
      "An S3 cross-account bucket policy and Lambda environment variable pointing to the EFS DNS name",
      "AWS RAM resource share for the EFS file system and a Lambda layer containing the NFS client",
      "A Transit Gateway with a shared VPC and IAM role chaining between accounts"
    ],
    explanation: "Cross-account EFS mounting requires network connectivity (VPC peering or Transit Gateway), a resource policy on the EFS file system granting the Lambda execution role access, and an EFS access point for identity enforcement. S3 bucket policies are unrelated to EFS access."
  },
  {
    domain: 3,
    service: "Lambda",
    q: "A team stores sensitive API keys in Lambda environment variables. Which approach provides the strongest security for these values?",
    options: [
      "Encrypt environment variables using a customer-managed KMS key (CMK)",
      "Store them as plaintext environment variables since Lambda encrypts at rest by default",
      "Embed the keys directly in the function code and deploy a new version for each rotation",
      "Use Lambda layers to store the keys separately from the function code"
    ],
    explanation: "While Lambda encrypts environment variables at rest with a service key by default, using a customer-managed KMS key gives you full control over key rotation, access policies, and audit trails via CloudTrail. Plaintext variables offer weaker control, and embedding keys in code is a security anti-pattern."
  },
  {
    domain: 3,
    service: "Lambda",
    q: "A Lambda function needs to process large video files and requires 8 GB of temporary scratch space during execution. Where should it store intermediate files?",
    options: [
      "The /tmp ephemeral storage configured up to 10 GB",
      "A Lambda layer with the files pre-loaded",
      "The function's deployment package directory",
      "An in-memory buffer using the function's allocated RAM"
    ],
    explanation: "Lambda ephemeral storage (/tmp) can be configured up to 10 GB total, making it suitable for temporary scratch space. Lambda layers are for static content like libraries (250 MB max), and the deployment package is read-only at runtime."
  },
  {
    domain: 3,
    service: "Lambda",
    q: "After a Lambda function is published as version 3, a developer accidentally modifies the $LATEST code and wants to recover version 3's exact configuration. What is true about published versions?",
    options: [
      "Published versions are immutable — version 3's code and configuration are unchanged regardless of edits to $LATEST",
      "Published versions inherit changes from $LATEST automatically after 24 hours",
      "Published versions must be manually locked through the console to prevent drift",
      "Published versions share environment variables with $LATEST but retain their own code"
    ],
    explanation: "Publishing a Lambda version creates an immutable snapshot of the code and all configuration including environment variables. Changes to $LATEST never affect published versions."
  },
  {
    domain: 3,
    service: "Lambda",
    q: "An asynchronous Lambda function is being throttled and events are being lost. The retry behavior shows exponential backoff up to 5 minutes. How long does Lambda continue retrying before sending the event to the DLQ?",
    options: [
      "Up to 6 hours",
      "Up to 1 hour",
      "Up to 24 hours",
      "Up to 15 minutes"
    ],
    explanation: "For asynchronous invocations, Lambda retries with exponential backoff starting at 1 second up to a maximum interval of 5 minutes, continuing for up to 6 hours before the event is sent to the DLQ (if configured) or discarded."
  },

  /* -- API Gateway (10) -- */
  {
    domain: 3,
    service: "API Gateway",
    q: "A company serves a global user base through a REST API. They want to minimize latency for all users without managing their own CDN. Which API Gateway endpoint type should they choose?",
    options: [
      "Edge-optimized endpoint, which routes through CloudFront edge locations automatically",
      "Regional endpoint with manual CloudFront distribution in each region",
      "Private endpoint accessible through VPC peering from each region",
      "Regional endpoint with Route 53 latency-based routing to multiple gateway deployments"
    ],
    explanation: "Edge-optimized is the default endpoint type that automatically routes requests through CloudFront edge locations, reducing latency for globally distributed clients. The API Gateway itself remains in one region, but edge routing is handled transparently."
  },
  {
    domain: 3,
    service: "API Gateway",
    q: "A team uses a single API Gateway definition with dev, staging, and prod stages. Each stage must invoke a different Lambda function alias. How should they configure this without duplicating the API?",
    options: [
      "Use stage variables to hold the Lambda alias name and reference them in the integration URI",
      "Create three separate API Gateway APIs, one per environment",
      "Use API Gateway canary deployments to split traffic between aliases",
      "Configure Lambda event source mappings to route based on the API stage name"
    ],
    explanation: "Stage variables act as environment variables for API Gateway stages. By setting a stage variable to the alias name (e.g., dev, prod), the integration URI dynamically resolves to the correct Lambda alias without duplicating the API definition."
  },
  {
    domain: 3,
    service: "API Gateway",
    q: "An API Gateway REST API returns a 504 error to clients intermittently. The backend Lambda function processes data from DynamoDB. What is the most likely cause?",
    options: [
      "The Lambda function execution exceeds the API Gateway 29-second integration timeout",
      "The DynamoDB table is throttling read requests",
      "The API Gateway cache has expired and is returning stale error responses",
      "The Lambda function's reserved concurrency is set to zero"
    ],
    explanation: "API Gateway has a hard maximum timeout of 29 seconds. If the backend takes longer, API Gateway returns a 504 Gateway Timeout. DynamoDB throttling would cause the Lambda to receive errors, but those would surface as 5XX from Lambda, not a timeout from the gateway."
  },
  {
    domain: 3,
    service: "API Gateway",
    q: "A DevOps engineer needs to validate that incoming API requests include a required JSON body field before the request reaches the backend Lambda function. What should they configure?",
    options: [
      "Request validation with a JSON schema model on the method request",
      "A Lambda authorizer that parses the body and rejects invalid payloads",
      "An API Gateway WAF rule to inspect request bodies",
      "A response mapping template that filters invalid requests"
    ],
    explanation: "API Gateway can validate request bodies against a JSON schema model before the integration is invoked. Invalid requests receive an HTTP 400 response immediately, reducing unnecessary Lambda invocations. A Lambda authorizer is for authentication, not payload validation."
  },
  {
    domain: 3,
    service: "API Gateway",
    q: "An API Gateway stage has caching enabled with the default TTL. A client sends a request with the header `Cache-Control: max-age=0`. What happens if no InvalidateCache policy is attached to the API?",
    options: [
      "Any client can invalidate the cache because there is no policy restricting invalidation",
      "The cache-control header is ignored and the cached response is returned",
      "API Gateway returns a 403 Forbidden error to the client",
      "The cache entry is refreshed but the stale response is still returned to the client"
    ],
    explanation: "Without an InvalidateCache policy, API Gateway allows any client to invalidate cache entries by sending Cache-Control: max-age=0. This can be exploited to force cache misses and overload the backend. Attaching an InvalidateCache policy restricts who can invalidate."
  },
  {
    domain: 3,
    service: "API Gateway",
    q: "A company wants to expose an internal microservice only to applications within their VPC, with no internet exposure. Which API Gateway endpoint type and access control mechanism should they use?",
    options: [
      "Private endpoint with a VPC endpoint (PrivateLink) and a resource policy restricting access to the VPC",
      "Regional endpoint with a security group allowing only VPC CIDR ranges",
      "Edge-optimized endpoint with IAM authentication and a VPN connection",
      "Regional endpoint with a Network Load Balancer in front of the gateway"
    ],
    explanation: "Private API Gateway endpoints are accessible only from within a VPC through an Interface VPC Endpoint (PrivateLink). A resource policy on the API restricts which VPCs or endpoints can invoke it. API Gateway does not support security groups directly."
  },
  {
    domain: 3,
    service: "API Gateway",
    q: "A team is rolling out a new backend version for their API and wants to send 10% of production traffic to the new version while monitoring metrics separately. Which API Gateway feature should they use?",
    options: [
      "Canary deployment on the production stage with 10% traffic allocation",
      "A weighted Route 53 record splitting traffic between two API Gateway stages",
      "Two separate APIs with an Application Load Balancer routing traffic by percentage",
      "Lambda alias traffic shifting configured at 10% for the new version"
    ],
    explanation: "API Gateway canary deployments allow you to send a configurable percentage of stage traffic to a canary release while keeping metrics and logs separate. This enables safe validation before promoting the canary to the full stage."
  },
  {
    domain: 3,
    service: "API Gateway",
    q: "An API Gateway receives a burst of 15,000 requests per second across all APIs in the account. Some clients receive HTTP 429 errors. What is happening?",
    options: [
      "The account-level throttle of 10,000 requests per second has been exceeded",
      "The individual API has a method-level throttle that is too low",
      "The backend Lambda functions are returning 429 errors that API Gateway passes through",
      "The API Gateway cache is full and rejecting new requests"
    ],
    explanation: "API Gateway enforces a default account-level steady-state limit of 10,000 requests per second with a burst of 10,000. Exceeding this returns HTTP 429 to clients. This is a soft limit that can be increased through AWS Support."
  },
  {
    domain: 3,
    service: "API Gateway",
    q: "A mobile application authenticates users through Amazon Cognito. The team wants API Gateway to validate tokens without custom code. Which authorization mechanism should they use?",
    options: [
      "Amazon Cognito User Pool authorizer on the API Gateway method",
      "A Lambda authorizer that calls the Cognito API to validate the token",
      "IAM authorization with Cognito identity pool federated credentials",
      "API key validation with a usage plan linked to the Cognito user pool"
    ],
    explanation: "API Gateway natively integrates with Cognito User Pools as an authorizer, validating tokens directly without custom Lambda code. A Lambda authorizer would work but adds unnecessary complexity and latency when Cognito integration is available."
  },
  {
    domain: 3,
    service: "API Gateway",
    q: "A team needs to attach a custom domain name with HTTPS to their edge-optimized API Gateway. In which region must the ACM certificate be created?",
    options: [
      "us-east-1, because CloudFront requires certificates in that region",
      "The same region as the API Gateway deployment",
      "Any region, since ACM certificates are global resources",
      "The region closest to the majority of API consumers"
    ],
    explanation: "Edge-optimized API Gateway endpoints use CloudFront under the hood, and CloudFront requires ACM certificates to be in us-east-1 (N. Virginia). For regional endpoints, the certificate must be in the same region as the API Gateway."
  },

  /* -- ECS (7) -- */
  {
    domain: 3,
    service: "ECS",
    q: "A company wants to run containers without managing EC2 instances and needs persistent shared storage across tasks in multiple Availability Zones. Which launch type and storage combination should they use?",
    options: [
      "Fargate launch type with Amazon EFS mounted on ECS tasks",
      "Fargate launch type with Amazon S3 mounted as a file system on tasks",
      "EC2 launch type with instance store volumes shared across tasks",
      "Fargate launch type with Amazon EBS volumes attached to each task"
    ],
    explanation: "Fargate with EFS provides serverless containers with persistent, multi-AZ shared storage. S3 cannot be mounted as a file system on ECS tasks. EBS volumes are per-instance and not shared, and instance stores are ephemeral."
  },
  {
    domain: 3,
    service: "ECS",
    q: "An ECS service running on EC2 instances needs to pull images from ECR and write logs to CloudWatch. Which IAM role provides these permissions?",
    options: [
      "The EC2 instance profile attached to the container instances",
      "The ECS task role defined in the task definition",
      "The ECS service-linked role created automatically by AWS",
      "An IAM user with access keys embedded in the container environment"
    ],
    explanation: "The EC2 instance profile is used by the ECS agent running on container instances. It needs permissions to pull images from ECR, send logs to CloudWatch, and interact with the ECS service. The task role provides permissions for the application code inside the container, not the agent."
  },
  {
    domain: 3,
    service: "ECS",
    q: "An ECS task running on Fargate needs to read objects from an S3 bucket that belongs to a different project team. Where should the IAM permissions be configured?",
    options: [
      "In the ECS task role defined in the task definition",
      "In the ECS task execution role used by the Fargate agent",
      "In the Fargate platform IAM role managed by AWS",
      "In a Lambda function that proxies S3 requests for the container"
    ],
    explanation: "The ECS task role grants permissions to the application running inside the container. Each task definition can specify a different task role, enabling different services to have different permissions. The task execution role is for the Fargate agent (pulling images, pushing logs), not application-level access."
  },
  {
    domain: 3,
    service: "ECS",
    q: "An ECS service needs to automatically scale the number of tasks based on the average CPU utilization staying near 70%. Which scaling policy type should the team configure?",
    options: [
      "Target tracking scaling policy targeting 70% average CPU utilization",
      "Step scaling policy with a CloudWatch alarm at 70% CPU",
      "Scheduled scaling policy to add tasks during peak hours",
      "Manual scaling by updating the desired count in the ECS service"
    ],
    explanation: "Target tracking is the simplest scaling policy — you set a target metric value and Application Auto Scaling automatically adjusts task count to maintain it. Step scaling requires manually defining alarm thresholds and step adjustments, adding unnecessary complexity for this use case."
  },
  {
    domain: 3,
    service: "ECS",
    q: "An ECS cluster running on EC2 instances frequently runs out of capacity when new tasks are scheduled. The team wants the cluster to automatically add EC2 instances when tasks cannot be placed. What should they configure?",
    options: [
      "An ECS Cluster Capacity Provider paired with an Auto Scaling Group",
      "A step scaling policy on the ECS service to add more tasks",
      "A Lambda function triggered by ECS task placement failures that launches EC2 instances",
      "An Auto Scaling Group with a fixed desired capacity equal to the maximum task count"
    ],
    explanation: "ECS Cluster Capacity Providers automatically manage the underlying EC2 infrastructure. When paired with an Auto Scaling Group, the capacity provider adds instances when tasks cannot be placed due to insufficient capacity, bridging the gap between task-level and infrastructure-level scaling."
  },
  {
    domain: 3,
    service: "ECS",
    q: "A team needs to send application logs from Fargate tasks to a third-party log aggregation service. The awslogs driver only supports CloudWatch. What approach should they use?",
    options: [
      "Use a sidecar container running a log forwarder like Fluentd or FireLens alongside the application container",
      "Install a CloudWatch agent inside the Fargate task to forward logs",
      "Configure the ECS task execution role to send logs directly to the third-party service",
      "Mount an EFS volume and have a separate EC2 instance read and forward the log files"
    ],
    explanation: "Fargate supports the FireLens log driver, which runs a sidecar container (Fluentd or Fluent Bit) alongside the application container. The sidecar collects logs and forwards them to any supported destination, including third-party services like Splunk or Datadog."
  },
  {
    domain: 3,
    service: "ECS",
    q: "An ECS service must handle both HTTP and TCP traffic. The HTTP traffic requires path-based routing while the TCP traffic requires ultra-low latency. Which load balancer configuration should the team use?",
    options: [
      "An ALB for the HTTP service and an NLB for the TCP service",
      "A single ALB configured with both HTTP and TCP listeners",
      "A Classic Load Balancer with both HTTP and TCP listeners",
      "An NLB for both services since it supports HTTP path-based routing"
    ],
    explanation: "ALBs support HTTP/HTTPS with path-based routing but not raw TCP. NLBs support TCP with ultra-low latency but not path-based routing. Using both load balancers for their respective strengths is the correct architecture. Classic Load Balancer is not recommended and cannot be used with Fargate."
  },

  /* -- ECR (3) -- */
  {
    domain: 3,
    service: "ECR",
    q: "A company's ECR repository accumulates hundreds of unused images, driving up storage costs. They want to automatically remove images older than 30 days while retaining the 5 most recent tagged images. What should they configure?",
    options: [
      "An ECR lifecycle policy with rules for age-based and count-based image expiration",
      "A Lambda function triggered by EventBridge on a daily schedule to delete old images",
      "An S3 lifecycle policy on the underlying ECR storage bucket",
      "Manual deletion of old images during each sprint retrospective"
    ],
    explanation: "ECR lifecycle policies support rules that expire images based on age or count. Multiple rules can be combined with priority ordering. Images matching the criteria are removed within 24 hours. ECR manages its own storage — S3 lifecycle policies cannot be applied directly."
  },
  {
    domain: 3,
    service: "ECR",
    q: "A CI/CD pipeline builds Docker images in CodeBuild and pushes them to ECR. The team wants to ensure no images with critical vulnerabilities reach production. Which ECR feature supports this?",
    options: [
      "ECR image vulnerability scanning triggered on push, with pipeline logic to block deployment of images with critical findings",
      "ECR lifecycle policies that automatically delete images with vulnerabilities",
      "AWS WAF integration that scans container images during pull operations",
      "ECR repository permissions that reject images without a signed manifest"
    ],
    explanation: "ECR supports image vulnerability scanning that can be triggered automatically on push. The scan results can be checked by CI/CD pipeline logic to gate deployments. Lifecycle policies manage image retention, not security scanning."
  },
  {
    domain: 3,
    service: "ECR",
    q: "A development team uses multiple programming languages and wants a consistent container deployment workflow. How does ECR facilitate this?",
    options: [
      "ECR stores Docker images regardless of the language used to build them, enabling a uniform build-push-deploy pipeline",
      "ECR automatically compiles source code into container images for any supported language",
      "ECR provides language-specific registries optimized for each runtime",
      "ECR converts container images to Lambda deployment packages for serverless deployment"
    ],
    explanation: "ECR is a language-agnostic Docker image registry. Any application that can be containerized — regardless of programming language — follows the same build, push, and deploy workflow through ECR, providing a uniform pipeline across the organization."
  },

  /* -- EKS (5) -- */
  {
    domain: 3,
    service: "EKS",
    q: "A company runs EKS and wants AWS to manage the EC2 instances used as worker nodes, including patching and Auto Scaling Group management. Which node type should they use?",
    options: [
      "Managed Node Groups",
      "Self-managed nodes with a custom AMI",
      "Fargate profiles for all workloads",
      "EC2 instances registered manually to the EKS cluster"
    ],
    explanation: "Managed Node Groups are created and managed by EKS. AWS handles provisioning EC2 instances, registering them with the cluster, and managing the Auto Scaling Group. Self-managed nodes require you to handle all of this yourself. Fargate eliminates nodes entirely but does not provide EC2 instance management."
  },
  {
    domain: 3,
    service: "EKS",
    q: "An EKS cluster needs persistent block storage for a stateful database workload. Which Kubernetes mechanism and AWS service should the team use?",
    options: [
      "Container Storage Interface (CSI) driver with Amazon EBS volumes and a StorageClass manifest",
      "HostPath volumes pointing to the EC2 instance's local disk",
      "ConfigMaps storing database files as key-value pairs",
      "Amazon S3 mounted as a POSIX file system using s3fs"
    ],
    explanation: "EKS supports persistent storage through the Container Storage Interface (CSI). Amazon EBS provides persistent block storage suitable for databases. A StorageClass manifest defines the storage requirements. HostPath volumes are not persistent across node failures."
  },
  {
    domain: 3,
    service: "EKS",
    q: "A team running EKS wants to send pod and container logs to CloudWatch for centralized monitoring. What is the recommended approach?",
    options: [
      "Deploy Fluent Bit or Fluentd as a DaemonSet to forward logs from /var/log/containers/ to CloudWatch Logs",
      "Configure each pod to write logs directly to CloudWatch using the AWS SDK",
      "Enable EKS control plane logging, which automatically captures all pod logs",
      "Mount an EFS volume and use a Lambda function to periodically read and ship logs"
    ],
    explanation: "Container logs are stored on nodes at /var/log/containers/. Deploying Fluent Bit or Fluentd as a DaemonSet on each node captures and forwards these logs to CloudWatch. EKS control plane logging only covers API server, audit, and scheduler logs — not application pod logs."
  },
  {
    domain: 3,
    service: "EKS",
    q: "An EKS cluster needs to run both cost-sensitive batch jobs and latency-sensitive web services. Which node configuration supports both workloads cost-effectively?",
    options: [
      "Managed Node Groups with on-demand instances for web services and spot instances for batch jobs",
      "A single Managed Node Group using only spot instances for all workloads",
      "Fargate profiles for all workloads with different CPU and memory configurations",
      "Self-managed nodes with reserved instances for all workloads"
    ],
    explanation: "Managed Node Groups support both on-demand and spot instances. Using on-demand for latency-sensitive web services ensures availability, while spot instances significantly reduce costs for interruptible batch workloads."
  },
  {
    domain: 3,
    service: "EKS",
    q: "A company migrating from on-premises Kubernetes to AWS wants to minimize changes to their existing kubectl scripts and Helm charts. Why is EKS a good fit compared to ECS?",
    options: [
      "EKS uses the standard Kubernetes API, so existing kubectl and Helm workflows work without modification",
      "EKS automatically converts Kubernetes manifests to ECS task definitions",
      "EKS provides a proprietary API that is backward-compatible with Kubernetes 1.0",
      "EKS runs containers on Fargate by default, eliminating all infrastructure management"
    ],
    explanation: "EKS is a managed Kubernetes service that uses the standard Kubernetes API. Existing tools like kubectl, Helm, and Kubernetes manifests work unchanged. ECS uses a proprietary orchestration API, requiring significant rework of existing Kubernetes configurations."
  },

  /* -- Kinesis (6) -- */
  {
    domain: 3,
    service: "Kinesis",
    q: "A company ingests clickstream data into Kinesis Data Streams and needs to reprocess events from 48 hours ago after fixing a bug in the consumer application. Is this possible?",
    options: [
      "Yes — Kinesis Data Streams retains records for up to 365 days, and consumers can reprocess by resetting the shard iterator",
      "No — Kinesis Data Streams deletes records immediately after all consumers acknowledge them",
      "Yes, but only if the stream is in on-demand mode with extended retention enabled",
      "No — records older than 24 hours are automatically moved to S3 and must be reprocessed from there"
    ],
    explanation: "Kinesis Data Streams retains records for up to 365 days (configurable). Records are immutable and cannot be deleted until retention expires. Consumers can reprocess data by resetting their shard iterator to any point within the retention window."
  },
  {
    domain: 3,
    service: "Kinesis",
    q: "A real-time analytics application processes events from Kinesis Data Streams and must maintain strict ordering for events from the same user. How should the producer ensure ordering?",
    options: [
      "Use the user ID as the partition key so all events from the same user go to the same shard",
      "Enable FIFO ordering on the Kinesis stream configuration",
      "Send all events to a single shard to guarantee global ordering",
      "Set a sequence number on each record that the consumer uses to reorder events"
    ],
    explanation: "Kinesis guarantees ordering within a shard for records with the same partition key. Using the user ID as the partition key ensures all events for a given user are written to the same shard and processed in order. Kinesis does not have a FIFO mode like SQS."
  },
  {
    domain: 3,
    service: "Kinesis",
    q: "A team needs to load streaming IoT sensor data into Amazon S3 in Parquet format with minimal operational overhead. Which service should they use?",
    options: [
      "Amazon Kinesis Data Firehose with format conversion enabled",
      "Amazon Kinesis Data Streams with a Lambda consumer that converts to Parquet",
      "Amazon Managed Service for Apache Flink writing directly to S3",
      "A custom EC2 application consuming from Kinesis and writing Parquet files to S3"
    ],
    explanation: "Kinesis Data Firehose is a fully managed delivery pipeline that supports automatic format conversion to Parquet or ORC. It handles buffering, batching, and delivery to S3 with no consumer code required, providing the lowest operational overhead."
  },
  {
    domain: 3,
    service: "Kinesis",
    q: "A Kinesis Data Streams consumer application is falling behind because read throughput is insufficient. The stream has 10 provisioned shards. What is the maximum read throughput?",
    options: [
      "20 MB/s (2 MB/s per shard across 10 shards)",
      "10 MB/s (1 MB/s per shard across 10 shards)",
      "100 MB/s (10 MB/s per shard across 10 shards)",
      "Unlimited, since Kinesis scales reads automatically"
    ],
    explanation: "Each provisioned shard supports 2 MB/s egress (read) throughput. With 10 shards, total read capacity is 20 MB/s. If consumers need more read throughput, you can add shards or use enhanced fan-out for dedicated throughput per consumer."
  },
  {
    domain: 3,
    service: "Kinesis",
    q: "A startup with unpredictable traffic patterns wants to use Kinesis Data Streams without managing shard capacity. Which capacity mode should they choose?",
    options: [
      "On-demand mode, which automatically scales based on observed throughput",
      "Provisioned mode with auto-scaling enabled via CloudWatch alarms",
      "On-demand mode with a fixed shard count to control costs",
      "Provisioned mode starting with the maximum number of shards"
    ],
    explanation: "On-demand mode automatically scales shards based on the observed throughput peak from the previous 30 days, starting at 4 MB/s ingress. There is no need to provision or manage shards. On-demand mode does not have a fixed shard count — that is a provisioned mode concept."
  },
  {
    domain: 3,
    service: "Kinesis",
    q: "A team needs to choose between Kinesis Data Streams and Kinesis Data Firehose for a use case that requires replaying historical data during incident investigation. Which service supports this?",
    options: [
      "Kinesis Data Streams, because it retains records and supports replay from any point in the retention window",
      "Kinesis Data Firehose, because it maintains a backup of all delivered records in S3",
      "Both services support replay equally through their respective retention mechanisms",
      "Neither service supports replay — a separate S3 archive must be maintained"
    ],
    explanation: "Kinesis Data Streams retains records for up to 365 days and supports replaying from any point. Firehose does not retain records — it delivers data immediately to destinations. While Firehose can back up records to S3, that is not the same as stream replay."
  },

  /* -- ElastiCache (8) -- */
  {
    domain: 3,
    service: "ElastiCache",
    q: "A web application stores user session data in local instance memory. When the Auto Scaling Group terminates an instance, users lose their sessions. How should the team make sessions persistent across instance changes?",
    options: [
      "Store session data in an ElastiCache Redis cluster so any instance can retrieve it",
      "Configure sticky sessions on the Application Load Balancer",
      "Write session data to an EBS volume that persists after instance termination",
      "Replicate session data across all instances using a peer-to-peer gossip protocol"
    ],
    explanation: "ElastiCache Redis provides a shared, in-memory session store accessible by all application instances. When an instance is terminated, sessions persist in Redis and are available to the replacement instance. Sticky sessions only work while the original instance is running."
  },
  {
    domain: 3,
    service: "ElastiCache",
    q: "A team must choose between Redis and Memcached for a caching layer. The application requires data persistence, complex data structures (sorted sets), and automatic failover. Which should they choose?",
    options: [
      "Redis, because it supports persistence, complex data types, and Multi-AZ failover",
      "Memcached, because its multithreaded architecture provides better performance for complex operations",
      "Redis, but only if cluster mode is enabled since standalone Redis lacks persistence",
      "Memcached, because it supports automatic failover through its sharding architecture"
    ],
    explanation: "Redis supports AOF persistence, complex data structures including sorted sets, and Multi-AZ automatic failover with read replicas. Memcached is simpler — it is multithreaded and supports sharding but lacks persistence, complex data types, and automatic failover."
  },
  {
    domain: 3,
    service: "ElastiCache",
    q: "An ElastiCache Redis cluster with cluster mode disabled needs to handle increasing read traffic. How should the team scale read capacity?",
    options: [
      "Add read replicas to the shard (up to 5 replicas) to distribute read traffic",
      "Enable cluster mode to shard data across multiple primary nodes",
      "Increase the node type to a larger instance size for more read throughput",
      "Add another primary node to the single shard for read load balancing"
    ],
    explanation: "In cluster mode disabled, the cluster has one shard with one primary and up to 5 read replicas. Adding replicas scales read capacity horizontally. Enabling cluster mode would require migration and is for scaling write capacity through sharding."
  },
  {
    domain: 3,
    service: "ElastiCache",
    q: "A company's ElastiCache Redis cluster uses cluster mode disabled and the team needs to change to a larger node type. What happens during vertical scaling?",
    options: [
      "ElastiCache creates a new node group, replicates data, and updates DNS to point to the new nodes",
      "The existing nodes are resized in place with a brief restart",
      "A completely new cluster must be created and data manually migrated",
      "Vertical scaling is not supported — only horizontal scaling via replicas is available"
    ],
    explanation: "During vertical scaling, ElastiCache internally provisions a new node group with the larger instance type, replicates data from the existing nodes, and updates the DNS endpoints to point to the new nodes. The process is managed by AWS."
  },
  {
    domain: 3,
    service: "ElastiCache",
    q: "An application queries DynamoDB frequently for the same items. The team wants to cache individual item lookups with microsecond latency. Should they use DAX or ElastiCache?",
    options: [
      "DAX, because it is a DynamoDB-native cache that caches individual objects and query results with no code changes",
      "ElastiCache Redis, because it provides lower latency than DAX for DynamoDB items",
      "ElastiCache Memcached, because its multithreaded architecture handles DynamoDB caching more efficiently",
      "Either DAX or ElastiCache — they are functionally equivalent for DynamoDB caching"
    ],
    explanation: "DAX is purpose-built for DynamoDB and caches individual items and query/scan results with microsecond latency. It is API-compatible with DynamoDB, requiring no application logic changes. ElastiCache is better for aggregation results and application-level caching not directly tied to DynamoDB."
  },
  {
    domain: 3,
    service: "ElastiCache",
    q: "An ElastiCache Redis cluster with cluster mode enabled needs to automatically scale the number of shards based on CPU utilization. Is this possible?",
    options: [
      "Yes — ElastiCache auto scaling supports scaling shards and replicas for Redis with cluster mode enabled",
      "No — ElastiCache does not support auto scaling; shard changes require manual intervention",
      "Yes, but only for replicas — shards must be scaled manually",
      "Yes, but only through custom CloudWatch alarms triggering Lambda functions"
    ],
    explanation: "ElastiCache supports auto scaling for Redis with cluster mode enabled. It can automatically adjust the number of shards and replicas based on tracking-based or scheduled policies. This feature is not available for cluster mode disabled."
  },
  {
    domain: 3,
    service: "ElastiCache",
    q: "A Redis cluster with cluster mode disabled exposes two endpoints. What are they used for?",
    options: [
      "A primary endpoint for read and write operations, and a reader endpoint that distributes reads across replicas",
      "A cluster configuration endpoint for all operations, and individual node endpoints for debugging",
      "A write endpoint for the primary node, and separate endpoints for each replica",
      "A public endpoint for internet clients, and a private endpoint for VPC clients"
    ],
    explanation: "Cluster mode disabled provides two endpoints: a primary endpoint that always points to the current primary node for read/write operations, and a reader endpoint that load-balances read requests across all replica nodes."
  },
  {
    domain: 3,
    service: "ElastiCache",
    q: "A development team implements a cache-aside pattern with ElastiCache. After updating a record in the database, users sometimes see stale data from the cache. What must the team implement?",
    options: [
      "A cache invalidation strategy that deletes or updates the cache entry when the database record changes",
      "A lower TTL on all cache entries so stale data expires faster",
      "Read-through caching where ElastiCache automatically detects database changes",
      "A write-through pattern where the database writes to the cache on every commit"
    ],
    explanation: "In the cache-aside pattern, the application is responsible for maintaining cache consistency. When database records change, the application must invalidate or update the corresponding cache entry. ElastiCache does not automatically detect database changes — the invalidation strategy is application-driven."
  },

  /* -- DynamoDB (8) -- */
  {
    domain: 3,
    service: "DynamoDB",
    q: "A SaaS application serves multiple tenants with highly variable traffic patterns. Some tenants spike unpredictably while others have steady, low usage. Which DynamoDB capacity mode is most appropriate?",
    options: [
      "On-demand mode, which automatically scales with the workload without capacity planning",
      "Provisioned mode with auto scaling configured for each table",
      "Provisioned mode with reserved capacity for cost savings",
      "On-demand mode with a maximum throughput limit to control costs"
    ],
    explanation: "On-demand mode automatically handles unpredictable and spiky workloads without requiring capacity planning. You pay per request. Provisioned mode with auto scaling can handle variability but requires configuring minimum and maximum capacity and responds more slowly to sudden spikes."
  },
  {
    domain: 3,
    service: "DynamoDB",
    q: "A company needs their DynamoDB table to be accessible with low latency from application regions in US, Europe, and Asia. What feature should they enable?",
    options: [
      "DynamoDB Global Tables for active-active multi-region replication",
      "DynamoDB Streams with Lambda consumers in each region writing to local tables",
      "Cross-region read replicas configured through AWS DMS",
      "DynamoDB Accelerator (DAX) clusters deployed in each region"
    ],
    explanation: "Global Tables provide active-active replication across multiple regions. Applications in any region can read and write to their local table with low latency, and changes are replicated bidirectionally. DynamoDB Streams must be enabled to use Global Tables."
  },
  {
    domain: 3,
    service: "DynamoDB",
    q: "A DynamoDB table stores user session data that should be automatically deleted 24 hours after creation. How should the team implement this?",
    options: [
      "Add a TTL attribute with the expiration timestamp and enable Time To Live on the table",
      "Create a Lambda function on a scheduled EventBridge rule to scan and delete expired items",
      "Configure a DynamoDB Stream that triggers a Lambda to delete items older than 24 hours",
      "Set the table's default item retention period to 24 hours in the table settings"
    ],
    explanation: "DynamoDB TTL automatically deletes items after their expiration timestamp passes. You add an attribute containing the epoch timestamp when the item should expire, and DynamoDB handles deletion at no additional cost. There is no built-in table-level retention setting."
  },
  {
    domain: 3,
    service: "DynamoDB",
    q: "A team needs to export their DynamoDB table data to S3 for analytics without impacting production read capacity. What is the correct approach?",
    options: [
      "Enable PITR on the table and use the DynamoDB export to S3 feature, which does not consume read capacity",
      "Use a DynamoDB Scan operation to read all items and write them to S3 via Lambda",
      "Configure DynamoDB Streams to replicate all items to S3 via Kinesis Data Firehose",
      "Take an on-demand backup and convert it to S3-compatible format using AWS Glue"
    ],
    explanation: "The DynamoDB export to S3 feature requires PITR to be enabled and exports data without consuming any read capacity or affecting table performance. It supports JSON and Ion formats. A Scan operation would consume RCUs and potentially throttle production traffic."
  },
  {
    domain: 3,
    service: "DynamoDB",
    q: "A DynamoDB table with provisioned capacity is experiencing throttling during peak hours but is over-provisioned during off-peak. What should the team configure?",
    options: [
      "Auto scaling policies on the table to adjust RCU and WCU based on utilization",
      "Switch to on-demand mode permanently for automatic scaling",
      "Increase provisioned capacity to handle peak load and accept higher costs during off-peak",
      "Add a DAX cluster to absorb all read traffic during peaks"
    ],
    explanation: "Auto scaling for provisioned capacity tables adjusts RCU and WCU based on utilization targets, scaling up during peaks and down during off-peak. This balances cost and performance. Switching to on-demand is an option but may be more expensive for workloads with predictable patterns."
  },
  {
    domain: 3,
    service: "DynamoDB",
    q: "A team wants to trigger a Lambda function whenever an item is inserted or modified in a DynamoDB table. The function needs both the old and new versions of the item. What should they configure?",
    options: [
      "Enable DynamoDB Streams with the NEW_AND_OLD_IMAGES stream view type and add a Lambda trigger",
      "Enable DynamoDB Streams with the KEYS_ONLY view type and have Lambda read the full item",
      "Configure an EventBridge rule for DynamoDB PutItem events",
      "Use a DAX write-through cache that calls Lambda on every write"
    ],
    explanation: "DynamoDB Streams with NEW_AND_OLD_IMAGES captures both the previous and updated item state for every modification. A Lambda trigger processes these stream records in near real-time. KEYS_ONLY would only include the primary key, requiring an additional read."
  },
  {
    domain: 3,
    service: "DynamoDB",
    q: "After an accidental bulk delete, a team needs to restore their DynamoDB table to its state from 2 hours ago. PITR is enabled. What happens during the restore?",
    options: [
      "A new table is created with the data as it existed at the specified point in time",
      "The existing table is rolled back in place to the specified point in time",
      "The deleted items are reinserted into the existing table while preserving current data",
      "A backup file is generated in S3 that must be manually imported"
    ],
    explanation: "DynamoDB PITR restores to a new table, not in-place. The original table remains unchanged. This allows the team to verify the restored data before swapping application endpoints. PITR supports restoring to any second within the 35-day backup window."
  },
  {
    domain: 3,
    service: "DynamoDB",
    q: "A DynamoDB table needs to send change events to multiple downstream consumers including Lambda, Kinesis Data Firehose, and a Flink application. DynamoDB Streams supports only a limited number of consumers. What is a better approach?",
    options: [
      "Stream DynamoDB changes to Kinesis Data Streams, which supports more consumers and longer retention",
      "Create multiple DynamoDB Streams on the same table for each consumer",
      "Enable DynamoDB Global Tables to replicate changes to consumer-specific tables",
      "Use EventBridge to fan out DynamoDB change events to multiple targets"
    ],
    explanation: "DynamoDB can stream changes to Kinesis Data Streams, which supports more consumers and up to 1 year of retention. This is the recommended approach when you need to fan out change events to multiple downstream services. DynamoDB Streams only supports 2 consumers per shard."
  },

  /* -- Aurora & RDS (7) -- */
  {
    domain: 3,
    service: "Aurora & RDS",
    q: "A production Aurora MySQL cluster experienced a primary instance failure. The cluster has three Aurora Replicas in different AZs with tiers 0, 1, and 2. Which replica is promoted?",
    options: [
      "The replica with tier 0 (highest priority) is promoted automatically",
      "The replica with the lowest current CPU utilization is promoted",
      "The replica in the same AZ as the failed primary is promoted",
      "Aurora randomly selects one of the three replicas for promotion"
    ],
    explanation: "Aurora selects the failover target based on priority tier — tier 0 is highest priority. If multiple replicas share the same tier, Aurora promotes the one with the largest instance size. This typically completes in under 30 seconds."
  },
  {
    domain: 3,
    service: "Aurora & RDS",
    q: "An RDS MySQL database needs to serve a reporting application that runs heavy analytical queries. The team wants to avoid impacting production write performance. What should they create?",
    options: [
      "An RDS read replica that the reporting application queries directly",
      "A Multi-AZ standby instance configured for read access",
      "A DynamoDB table with data synced from RDS via DMS",
      "An ElastiCache cluster that caches all database queries"
    ],
    explanation: "Read replicas receive asynchronous replication from the primary and can serve read queries independently. The reporting application connects to the read replica, leaving the primary instance free for production writes. Multi-AZ standby instances do not serve read traffic."
  },
  {
    domain: 3,
    service: "Aurora & RDS",
    q: "A team needs to convert their single-AZ RDS instance to Multi-AZ for disaster recovery. Will this operation cause downtime?",
    options: [
      "No — Multi-AZ conversion is a zero-downtime operation that creates a standby from a snapshot",
      "Yes — the database must be stopped and restarted with Multi-AZ enabled",
      "No, but only if the instance is running Aurora; standard RDS requires downtime",
      "Yes — a new Multi-AZ instance must be created and data migrated manually"
    ],
    explanation: "Converting single-AZ to Multi-AZ is zero-downtime. RDS takes a snapshot of the primary, restores it in another AZ, and establishes synchronous replication — all while the database remains available."
  },
  {
    domain: 3,
    service: "Aurora & RDS",
    q: "An Aurora cluster needs cross-region disaster recovery with an RPO of 5 seconds or less and an RTO under one minute. Which feature should they use?",
    options: [
      "Aurora Global Database with storage-layer replication to a secondary region",
      "Aurora cross-region read replicas using logical replication",
      "RDS automated backups with cross-region backup replication",
      "AWS DMS continuous replication from the primary to a secondary region Aurora cluster"
    ],
    explanation: "Aurora Global Database replicates at the storage layer with typical latency under 1 second, providing RPO of 5 seconds or less and RTO under 1 minute. Cross-region read replicas use logical replication with higher lag (seconds to minutes), resulting in weaker RPO guarantees."
  },
  {
    domain: 3,
    service: "Aurora & RDS",
    q: "A developer accidentally ran a DELETE statement that removed critical rows from an Aurora MySQL cluster 10 minutes ago. They need the fastest possible recovery. Which Aurora feature should they use?",
    options: [
      "Aurora Backtrack to rewind the cluster to a point before the DELETE statement",
      "Point-in-time restore to create a new cluster with data from 10 minutes ago",
      "Restore from the most recent automated backup snapshot",
      "Failover to an Aurora Replica that may not have replicated the DELETE yet"
    ],
    explanation: "Aurora Backtrack (MySQL-compatible only) rewinds the live cluster to a previous point in time in seconds, without creating a new cluster. It is far faster than point-in-time restore, which creates an entirely new cluster. The backtrack window can be configured up to 72 hours."
  },
  {
    domain: 3,
    service: "Aurora & RDS",
    q: "An Aurora cluster's existing storage is unencrypted. The security team requires encryption at rest. How should the team enable encryption?",
    options: [
      "Take a snapshot, copy it with encryption enabled, and restore a new encrypted cluster from the copy",
      "Enable encryption on the existing cluster through a configuration change",
      "Add a KMS key to the cluster and Aurora will encrypt existing data in the background",
      "Create an encrypted read replica and promote it to a standalone encrypted cluster"
    ],
    explanation: "Aurora encryption must be enabled at cluster creation time and cannot be added to an existing unencrypted cluster. The migration path is to snapshot the cluster, copy the snapshot with encryption, and restore a new encrypted cluster from that copy."
  },
  {
    domain: 3,
    service: "Aurora & RDS",
    q: "An Aurora cluster experiences variable read traffic — high during business hours and minimal overnight. The team wants the number of read replicas to adjust automatically. What should they configure?",
    options: [
      "Aurora Auto Scaling with a target tracking policy on average CPU utilization or connections",
      "A scheduled Lambda function that adds and removes replicas based on time of day",
      "An Aurora Serverless v2 cluster that scales compute automatically",
      "Multiple read replicas with a minimum count equal to peak demand"
    ],
    explanation: "Aurora Replica Auto Scaling uses Application Auto Scaling with target tracking policies to add or remove replicas based on metrics like CPU utilization or average connections. It scales up during high demand and scales down during quiet periods."
  },

  /* -- DMS (4) -- */
  {
    domain: 3,
    service: "DMS",
    q: "A company is migrating an on-premises Oracle database to Amazon Aurora PostgreSQL. Since the database engines differ, which additional tool is required alongside DMS?",
    options: [
      "AWS Schema Conversion Tool (SCT) to convert the Oracle schema to PostgreSQL-compatible format",
      "AWS DataSync to transfer the Oracle data files to S3 before loading into Aurora",
      "AWS Glue ETL jobs to transform Oracle data into PostgreSQL format",
      "Amazon Redshift Spectrum to query Oracle data and load it into Aurora"
    ],
    explanation: "When migrating between different database engines (heterogeneous migration), SCT converts the source schema, stored procedures, and application SQL to the target engine format. SCT is not needed for same-engine (homogeneous) migrations."
  },
  {
    domain: 3,
    service: "DMS",
    q: "A DMS replication task must continue replicating changes from the source database to the target even after the initial full load is complete. Which replication method should the team select?",
    options: [
      "Full load plus Change Data Capture (CDC) for ongoing replication",
      "Full load only with a scheduled re-run every 24 hours",
      "CDC only without an initial full load",
      "Full load with parallel threads and no ongoing replication"
    ],
    explanation: "DMS supports full load plus CDC, which performs the initial data migration and then continuously captures and replicates ongoing changes from the source. CDC-only assumes the target already has the data and only captures changes from that point forward."
  },
  {
    domain: 3,
    service: "DMS",
    q: "A DMS replication instance is experiencing high latency between the source and target databases. Which CloudWatch metric category should the team monitor to diagnose this?",
    options: [
      "Replication task metrics, including source and target latency",
      "Host metrics, including CPUUtilization and FreeableMemory only",
      "Table metrics, including INSERT and UPDATE counts",
      "Network metrics from the VPC flow logs"
    ],
    explanation: "DMS replication task metrics include latency measurements between the replication host and both source and target databases, as well as CDC and full load throughput metrics. These are the primary indicators for diagnosing replication performance issues."
  },
  {
    domain: 3,
    service: "DMS",
    q: "A team needs their DMS replication instance to survive an Availability Zone failure without data loss. What should they enable?",
    options: [
      "Multi-AZ deployment, which provisions a synchronous standby replica in a different AZ",
      "Cross-region replication to a secondary DMS instance in another region",
      "Automated backups with a 5-minute backup interval",
      "A second replication task running in parallel from the same source"
    ],
    explanation: "DMS Multi-AZ deployment maintains a synchronous standby in a different AZ. If the primary AZ fails, DMS automatically fails over, providing data redundancy and minimizing latency spikes. Cross-region replication is not a DMS feature."
  },

  /* -- Route 53 (5) -- */
  {
    domain: 3,
    service: "Route 53",
    q: "A company runs identical application stacks in US and EU regions. They want users to be automatically routed to the region with the lowest network latency. Which Route 53 routing policy should they use?",
    options: [
      "Latency-based routing policy",
      "Weighted routing policy with equal weights for both regions",
      "Geolocation routing policy mapping US users to US and EU users to EU",
      "Simple routing policy with both endpoints listed"
    ],
    explanation: "Latency-based routing measures the network latency from the user to each AWS region and routes to the lowest-latency endpoint. Weighted routing distributes traffic by percentage, not latency. Geolocation routes by geographic location, which does not always correlate with lowest latency."
  },
  {
    domain: 3,
    service: "Route 53",
    q: "A primary web application in us-east-1 must automatically fail over to a standby in eu-west-1 if the primary becomes unhealthy. Which Route 53 configuration achieves this?",
    options: [
      "Failover routing policy with the us-east-1 endpoint as primary and eu-west-1 as secondary, with a health check on the primary",
      "Weighted routing policy with 100% weight on us-east-1 and 0% on eu-west-1",
      "Latency-based routing with health checks on both endpoints",
      "Simple routing policy with both endpoints and Route 53 automatic failover"
    ],
    explanation: "Failover routing is designed for active-passive setups. The primary record has a health check, and Route 53 automatically routes traffic to the secondary when the primary fails. Weighted routing with 0% weight would never send traffic to eu-west-1 even if us-east-1 fails."
  },
  {
    domain: 3,
    service: "Route 53",
    q: "A team wants to gradually shift 10% of production DNS traffic to a new application version for testing. Which Route 53 routing policy supports this?",
    options: [
      "Weighted routing policy with the new version receiving weight 10 and the current version weight 90",
      "Failover routing with the new version as the secondary endpoint",
      "Latency-based routing with the new version in a closer region",
      "Multivalue answer routing returning both endpoints randomly"
    ],
    explanation: "Weighted routing distributes traffic based on assigned weights. Setting weights of 10 and 90 sends approximately 10% of traffic to the new version. The weights do not need to sum to 100 — Route 53 calculates percentages from the total weight."
  },
  {
    domain: 3,
    service: "Route 53",
    q: "A Route 53 health check monitors an HTTP endpoint. The endpoint begins returning HTTP 500 errors. What happens to DNS resolution for the associated record?",
    options: [
      "Route 53 marks the endpoint as unhealthy and stops returning it in DNS responses if a failover or health-check-aware policy is configured",
      "Route 53 continues returning the endpoint but adds a warning header to DNS responses",
      "Route 53 automatically redirects the DNS record to a default AWS error page",
      "Route 53 deletes the DNS record after three consecutive failed health checks"
    ],
    explanation: "When a health check fails, Route 53 marks the endpoint as unhealthy. For routing policies that support health checks (failover, weighted, latency), Route 53 removes unhealthy endpoints from DNS responses. Route 53 never deletes records based on health checks."
  },
  {
    domain: 3,
    service: "Route 53",
    q: "A team configures a Route 53 calculated health check that combines three individual endpoint health checks. They want the calculated check to report unhealthy only if all three endpoints fail. Which threshold should they set?",
    options: [
      "Set the health threshold to 1 — report healthy if at least 1 of 3 child checks passes",
      "Set the health threshold to 3 — report healthy only if all 3 child checks pass",
      "Use an OR logical operator across the three health checks",
      "Set the health threshold to 0 to allow any number of failures"
    ],
    explanation: "Calculated health checks use a threshold: the parent is healthy if at least N child checks are healthy. Setting the threshold to 1 means the parent is healthy as long as at least one endpoint is up — it only reports unhealthy when all three fail."
  },

  /* -- Storage Gateway (3) -- */
  {
    domain: 3,
    service: "Storage Gateway",
    q: "An on-premises application accesses files through a Storage Gateway File Gateway. A separate process uploads files directly to the backing S3 bucket. On-premises users report that newly uploaded S3 files are not visible in the file share. What should the team do?",
    options: [
      "Invoke the RefreshCache API to update the gateway's local cache with the latest S3 objects",
      "Restart the Storage Gateway appliance to force a full cache synchronization",
      "Enable S3 versioning so the gateway detects new object versions automatically",
      "Increase the gateway cache disk size to accommodate more objects"
    ],
    explanation: "File Gateway caches files locally. Objects uploaded directly to S3 (bypassing the gateway) are not reflected in the cache until it is refreshed. The RefreshCache API can be called on-demand or automated via Lambda triggered by S3 events."
  },
  {
    domain: 3,
    service: "Storage Gateway",
    q: "A company wants their File Gateway cache to automatically detect new objects in S3 without manual API calls or Lambda automation. Which feature should they enable?",
    options: [
      "Automated Cache Refresh with a TTL interval on the file share",
      "S3 Event Notifications configured to send updates to the gateway",
      "CloudWatch alarms that trigger a cache refresh when S3 object count changes",
      "S3 Inventory reports processed by the gateway daily"
    ],
    explanation: "Automated Cache Refresh is a built-in File Gateway feature. You configure a TTL interval on the file share, and the gateway automatically polls S3 for changes, updating its cache without manual RefreshCache API calls or external automation."
  },
  {
    domain: 3,
    service: "Storage Gateway",
    q: "A disaster recovery plan uses Storage Gateway to replicate on-premises file data to AWS. Which AWS storage services does Storage Gateway use as backend storage?",
    options: [
      "Amazon S3, Amazon EBS, and Amazon S3 Glacier",
      "Amazon S3 only",
      "Amazon EFS and Amazon S3",
      "Amazon EBS and Amazon FSx"
    ],
    explanation: "Storage Gateway uses Amazon S3, Amazon EBS, and Amazon S3 Glacier as backend storage depending on the gateway type. File Gateway uses S3, Volume Gateway uses EBS snapshots, and Tape Gateway uses S3 and S3 Glacier."
  },

  /* -- Auto Scaling (5) -- */
  {
    domain: 3,
    service: "Auto Scaling",
    q: "An Auto Scaling Group frequently launches instances that take 10 minutes to initialize before passing health checks. During this time, the ASG launches additional unnecessary instances. What should the team configure to prevent this?",
    options: [
      "A lifecycle hook that holds instances in Pending state until initialization completes and signals readiness",
      "A longer health check grace period equal to 15 minutes",
      "A step scaling policy with a higher threshold to delay additional launches",
      "A scheduled scaling action that pre-launches instances before peak hours"
    ],
    explanation: "Lifecycle hooks pause instances in a Pending:Wait state during launch, allowing initialization scripts to complete before the instance transitions to InService. The ASG can be signaled to proceed only when initialization is complete, preventing premature scaling reactions."
  },
  {
    domain: 3,
    service: "Auto Scaling",
    q: "An application requires instances with pre-loaded ML models that take 15 minutes to download. During scale-out events, the delay is unacceptable. Which Auto Scaling feature minimizes this delay?",
    options: [
      "Warm pools with pre-initialized instances in a stopped state ready to serve traffic quickly",
      "Predictive scaling that launches instances 15 minutes before predicted demand",
      "A launch template with a larger instance type that downloads models faster",
      "Scheduled scaling that maintains peak capacity at all times"
    ],
    explanation: "Warm pools maintain pre-initialized instances in stopped (or running/hibernated) state. When a scale-out occurs, instances are pulled from the pool already initialized, dramatically reducing time to serve traffic. You only pay for EBS volumes when instances are stopped."
  },
  {
    domain: 3,
    service: "Auto Scaling",
    q: "An Auto Scaling Group scales in during low-traffic periods. The team wants terminated instances to be returned to the warm pool instead of being destroyed, so they can be reused during the next scale-out. What should they configure?",
    options: [
      "An instance reuse policy on the warm pool to return instances on scale-in",
      "A lifecycle hook on termination that moves instances to a stopped state",
      "A custom termination policy that prevents instance termination",
      "A minimum warm pool size equal to the ASG maximum capacity"
    ],
    explanation: "By default, scale-in terminates instances. The instance reuse policy modifies this behavior to return instances to the warm pool instead, avoiding the cost of destroying and recreating them. This reduces launch latency on subsequent scale-out events."
  },
  {
    domain: 3,
    service: "Auto Scaling",
    q: "An e-commerce company knows traffic spikes every weekday at 9 AM and drops at 6 PM. They also experience unpredictable flash sales. Which combination of scaling policies best handles both patterns?",
    options: [
      "Scheduled scaling for the daily pattern combined with target tracking for unexpected spikes",
      "Predictive scaling only, relying on ML to detect both patterns",
      "Step scaling with aggressive thresholds to react to all traffic changes",
      "Manual scaling by an operations team monitoring dashboards"
    ],
    explanation: "Scheduled scaling pre-positions capacity for known patterns (9 AM ramp-up, 6 PM scale-down), while target tracking dynamically adjusts for unexpected spikes like flash sales. Combining both provides proactive and reactive scaling."
  },
  {
    domain: 3,
    service: "Auto Scaling",
    q: "An Auto Scaling Group uses the default termination policy. The group spans two AZs — AZ-A has 5 instances and AZ-B has 3 instances. A scale-in event removes one instance. Which AZ loses an instance?",
    options: [
      "AZ-A, because the default policy first selects the AZ with the most instances to maintain balance",
      "AZ-B, because the default policy terminates the oldest instance across all AZs",
      "The AZ with the instance closest to its next billing hour",
      "A random AZ selected by the Auto Scaling service"
    ],
    explanation: "The default termination policy first selects the AZ with the most instances to maintain balance across AZs. Within that AZ, it terminates the instance with the oldest launch template/configuration, and if tied, the one closest to the next billing hour."
  },

  /* -- S3 Replication (2) -- */
  {
    domain: 3,
    service: "S3 Replication",
    q: "A company must replicate S3 objects to a bucket in a different region for compliance. What prerequisite must be met on both source and destination buckets?",
    options: [
      "Versioning must be enabled on both the source and destination buckets",
      "Server-side encryption must be enabled on both buckets",
      "Both buckets must be in the same AWS account",
      "S3 Transfer Acceleration must be enabled on the source bucket"
    ],
    explanation: "S3 replication (both CRR and SRR) requires versioning to be enabled on both source and destination buckets. Buckets can be in different accounts. Encryption and Transfer Acceleration are separate features not required for replication."
  },
  {
    domain: 3,
    service: "S3 Replication",
    q: "A team needs to replicate production S3 data to a test bucket in the same region for validation. Which replication type should they use?",
    options: [
      "Same-Region Replication (SRR)",
      "Cross-Region Replication (CRR) to a bucket in the same region",
      "S3 Batch Replication triggered by a Lambda function",
      "S3 Transfer Acceleration with a replication rule"
    ],
    explanation: "Same-Region Replication (SRR) copies objects to another bucket in the same region. Use cases include log aggregation and live replication between production and test environments. CRR is specifically for cross-region scenarios."
  },

  /* -- Disaster Recovery (4) -- */
  {
    domain: 3,
    service: "Disaster Recovery",
    q: "A company has a strict RTO of under 1 minute and RPO of near zero. They can justify significant infrastructure costs. Which disaster recovery strategy meets these requirements?",
    options: [
      "Multi-site / hot site (active-active) with Route 53 distributing traffic to both sites",
      "Warm standby with an Auto Scaling Group at minimum capacity",
      "Pilot light with only the database running in the DR region",
      "Backup and restore with hourly snapshots to S3"
    ],
    explanation: "Multi-site (active-active) runs full production infrastructure in both locations simultaneously. Both sites serve traffic, so failover is near-instantaneous with minimal data loss. It is the most expensive strategy but provides the lowest RTO and RPO."
  },
  {
    domain: 3,
    service: "Disaster Recovery",
    q: "A startup wants the cheapest disaster recovery strategy and can tolerate up to 24 hours of downtime and several hours of data loss. Which strategy should they implement?",
    options: [
      "Backup and restore, storing EBS snapshots and RDS backups in S3 with Glacier lifecycle policies",
      "Pilot light with a continuously running database replica in the DR region",
      "Warm standby with minimum-capacity EC2 instances in the DR region",
      "Multi-site active-active with Aurora Global Database"
    ],
    explanation: "Backup and restore is the cheapest strategy — you only pay for backup storage with no running infrastructure in the DR region. Recovery involves recreating infrastructure from AMIs and restoring from snapshots, which takes hours but meets the stated tolerances."
  },
  {
    domain: 3,
    service: "Disaster Recovery",
    q: "A pilot light disaster recovery setup has RDS replication running continuously to the DR region. When a disaster is declared, what additional steps are needed to bring the DR environment online?",
    options: [
      "Update Route 53 DNS to point to the DR region and provision EC2 instances from AMIs for the application tier",
      "Simply update Route 53 DNS — all infrastructure is already running at full capacity",
      "Restore the database from the latest S3 backup and then launch application servers",
      "Scale down the primary region and scale up the DR region using Auto Scaling"
    ],
    explanation: "In pilot light, only critical systems (typically the database) run continuously. During failover, Route 53 redirects DNS, and non-critical infrastructure (application servers, load balancers) must be provisioned on demand. This is faster than backup/restore because the database is already current."
  },
  {
    domain: 3,
    service: "Disaster Recovery",
    q: "A warm standby DR environment runs an ELB, an Auto Scaling Group at minimum capacity, and an RDS secondary database. What is the primary advantage of warm standby over pilot light?",
    options: [
      "The full application stack is already running, so failover only requires scaling up — no infrastructure provisioning delay",
      "Warm standby costs less because it uses reserved instances",
      "Warm standby provides synchronous replication while pilot light uses asynchronous",
      "Warm standby supports multi-region active-active traffic distribution"
    ],
    explanation: "Warm standby runs the complete application stack at minimum capacity. During failover, the ASG scales up to production load — no time is spent provisioning new infrastructure. Pilot light requires launching application servers from scratch, adding delay."
  },

  /* -- VPC & Networking (2) -- */
  {
    domain: 3,
    service: "VPC & Networking",
    q: "A company deploys NAT Gateways only in AZ-A. When AZ-A experiences an outage, instances in AZ-B lose internet access. How should they architect for high availability?",
    options: [
      "Deploy a separate NAT Gateway in each Availability Zone so each AZ independently routes outbound traffic",
      "Use a single NAT Gateway with an Elastic IP that automatically fails over between AZs",
      "Replace the NAT Gateway with a NAT instance that supports Multi-AZ deployment",
      "Configure a VPN connection as automatic failover for the NAT Gateway"
    ],
    explanation: "NAT Gateways are resilient within a single AZ but not across AZs. For fault tolerance, deploy one NAT Gateway per AZ with corresponding route table entries. Each AZ then independently handles its outbound traffic without cross-AZ dependency."
  },
  {
    domain: 3,
    service: "VPC & Networking",
    q: "A blue/green deployment uses two separate ALBs — one for blue and one for green. Traffic is switched using Route 53 DNS records. Compared to using a single ALB with weighted target groups, what is the main disadvantage of DNS-based switching?",
    options: [
      "DNS responses are cached by clients, so traffic migration is gradual and less controllable",
      "Route 53 cannot perform health checks on ALB endpoints",
      "DNS-based switching requires manual certificate rotation between the two ALBs",
      "Route 53 does not support pointing DNS records to ALB endpoints"
    ],
    explanation: "DNS-based traffic switching is slower because clients cache DNS responses based on TTL. The switchover happens gradually as caches expire, giving less control over the exact cutover moment. A single ALB with weighted target groups provides instant traffic control."
  },

  /* -- CloudWatch Metrics (6) -- */
  {
    domain: 4,
    service: "CloudWatch Metrics",
    q: "An application team needs to track memory usage on EC2 instances, which is not a metric natively reported by EC2. How should they publish this data to CloudWatch?",
    options: [
      "Publish the value as a custom metric using the PutMetricData API call",
      "Enable detailed monitoring on the EC2 instance to expose memory metrics",
      "Create a CloudWatch Alarm on the AWS/EC2 namespace for the MemoryUtilization metric",
      "Stream the metric through a CloudWatch Metric Stream to generate the value"
    ],
    explanation: "Application-specific data such as memory usage is not provided by AWS services natively; you submit it as a custom metric using PutMetricData. Detailed monitoring only increases frequency of built-in EC2 metrics, and there is no AWS/EC2 MemoryUtilization metric. Metric Streams export existing metrics, not create new ones."
  },
  {
    domain: 4,
    service: "CloudWatch Metrics",
    q: "A trading application needs CloudWatch to store a custom latency metric at 10-second granularity so alarms can react quickly to spikes. Which storage resolution must be specified on PutMetricData?",
    options: [
      "High resolution, which supports 1, 5, 10, or 30 second intervals at higher cost",
      "Standard resolution, which stores data at 1-minute intervals",
      "Detailed resolution, which automatically stores metrics every 10 seconds",
      "Extended resolution, enabled by setting a custom dimension on the metric"
    ],
    explanation: "High-resolution custom metrics support 1-, 5-, 10-, or 30-second intervals and cost more than standard resolution. Standard resolution is 1-minute granularity. There is no 'detailed' or 'extended' resolution parameter for CloudWatch metrics."
  },
  {
    domain: 4,
    service: "CloudWatch Metrics",
    q: "A batch job attempts to publish a custom metric with a timestamp from 20 days ago after a backdated log import. What happens?",
    options: [
      "CloudWatch rejects the data point because metrics accept timestamps only up to two weeks in the past",
      "CloudWatch accepts the data point but marks it as delayed and excludes it from alarms",
      "CloudWatch automatically rewrites the timestamp to the current time",
      "CloudWatch stores the data point but only makes it available to Logs Insights, not to metric graphs"
    ],
    explanation: "CloudWatch accepts data points dated up to two weeks in the past and up to two hours in the future. A timestamp 20 days old falls outside this window and the data point is rejected. CloudWatch does not silently rewrite timestamps or route metric data to Logs Insights."
  },
  {
    domain: 4,
    service: "CloudWatch Metrics",
    q: "A company wants CloudWatch metrics delivered in near-real-time to both Datadog and Splunk simultaneously for their observability pipeline. Which feature supports this?",
    options: [
      "CloudWatch Metric Streams, which continuously stream metrics to destinations like Kinesis Data Firehose, Datadog, Dynatrace, and Splunk",
      "CloudWatch Logs subscription filters sending metrics through Kinesis Data Streams",
      "A scheduled EventBridge rule that calls GetMetricData and forwards the results",
      "CloudWatch Contributor Insights exporting metrics to third-party tools"
    ],
    explanation: "Metric Streams are purpose-built to continuously stream CloudWatch metrics with low latency to destinations like Datadog, Dynatrace, Splunk, and Kinesis Data Firehose. Subscription filters apply to Logs, not Metrics. Polling via EventBridge/GetMetricData is not near-real-time and does not scale like Metric Streams."
  },
  {
    domain: 4,
    service: "CloudWatch Metrics",
    q: "An operations team wants CloudWatch to alert whenever request latency deviates from normal behavior, but they don't know what threshold to set because traffic patterns vary by time of day and day of week. Which CloudWatch feature addresses this?",
    options: [
      "CloudWatch Anomaly Detection, which builds a machine learning baseline and alerts when values fall outside the expected range",
      "Composite alarms that combine multiple static thresholds with AND/OR logic",
      "Metric math using the RATE function to detect changes in the underlying metric",
      "CloudWatch Contributor Insights, which identifies the top contributors to a metric"
    ],
    explanation: "Anomaly Detection uses ML to learn a metric's normal seasonality and triggers alarms when values deviate — ideal when a fixed threshold isn't known. Composite alarms still rely on underlying static thresholds. Metric math and Contributor Insights do not build adaptive baselines."
  },
  {
    domain: 4,
    service: "CloudWatch Metrics",
    q: "A team uses CloudWatch Anomaly Detection to alarm on error rates, but every Sunday maintenance window skews the learned baseline and causes false alarms the following week. How should they fix this?",
    options: [
      "Configure Anomaly Detection to exclude the maintenance time periods from training",
      "Switch the alarm to a static threshold during the maintenance window only",
      "Delete and recreate the anomaly detector after each maintenance event",
      "Increase the alarm evaluation period to absorb the abnormal data"
    ],
    explanation: "Anomaly Detection supports excluding specified time periods or events from training so scheduled maintenance doesn't skew the learned baseline. Static thresholds defeat the purpose of anomaly detection, and recreating the detector each week is operationally brittle."
  },

  /* -- CloudWatch Logs (7) -- */
  {
    domain: 4,
    service: "CloudWatch Logs",
    q: "A compliance team requires that all log data in CloudWatch Logs be encrypted with a customer-managed key so KMS key usage can be audited through CloudTrail. What should be configured?",
    options: [
      "Configure KMS encryption on the log group using a customer-managed key",
      "Rely on the default AWS-managed key, which already records audit events in CloudTrail",
      "Export logs to S3 with SSE-KMS and disable CloudWatch Logs encryption",
      "Enable CloudTrail data events on CloudWatch Logs to audit encryption"
    ],
    explanation: "CloudWatch Logs encrypts at rest by default with AWS-managed keys, but customer-managed KMS keys are required when you need auditable key usage through CloudTrail and tighter access control. Exporting to S3 doesn't protect data in CloudWatch Logs, and CloudTrail data events don't apply here."
  },
  {
    domain: 4,
    service: "CloudWatch Logs",
    q: "An engineer needs to query the last 24 hours of application logs across several log groups to find requests where the duration field exceeded 2 seconds, grouped by user ID. Which tool is purpose-built for this?",
    options: [
      "CloudWatch Logs Insights with a query spanning multiple log groups",
      "Athena after exporting the log groups to S3",
      "Log subscription filters that extract matching events",
      "CloudWatch Metric Filters converting the duration field to a metric"
    ],
    explanation: "Logs Insights offers a purpose-built query language that auto-discovers JSON fields, supports filtering, aggregation, and multi-log-group queries — exactly the scenario described. Athena would require exporting data first, subscription filters only route events, and metric filters extract metrics but don't support ad-hoc exploration."
  },
  {
    domain: 4,
    service: "CloudWatch Logs",
    q: "A team calls CreateExportTask to move log data from CloudWatch Logs to S3 for long-term retention. A stakeholder asks if this can power a real-time analytics dashboard. What's the correct response?",
    options: [
      "No — S3 export is asynchronous and can take up to 12 hours, so it is unsuitable for real-time use",
      "Yes — CreateExportTask streams logs continuously to S3 with sub-second latency",
      "Yes — as long as a subscription filter is attached to the export task",
      "No — but export tasks can be chained every minute to approximate real-time"
    ],
    explanation: "S3 export via CreateExportTask is an asynchronous batch operation that can take up to 12 hours. It's appropriate for compliance archival and historical analysis, not real-time dashboards. For real-time streaming, use subscription filters to Kinesis/Firehose/Lambda."
  },
  {
    domain: 4,
    service: "CloudWatch Logs",
    q: "A team wants only log events containing the string ERROR to be streamed in real time to a Lambda function for alerting. How should they configure this?",
    options: [
      "Create a subscription filter on the log group with a filter pattern matching ERROR and Lambda as the destination",
      "Export the log group to S3 every minute and trigger Lambda on new objects",
      "Configure a CloudWatch Alarm on the log group to invoke Lambda on each ERROR line",
      "Enable Logs Insights real-time mode and target the query output at Lambda"
    ],
    explanation: "Subscription filters stream log events in real time to Lambda, Kinesis Data Streams, or Kinesis Data Firehose, and a filter pattern limits delivery to matching events — reducing cost and processing. S3 export is batch, alarms don't fire per log line, and Logs Insights is not a real-time engine."
  },
  {
    domain: 4,
    service: "CloudWatch Logs",
    q: "Multiple AWS accounts need to aggregate logs into a central security account in real time. How should this be architected?",
    options: [
      "Create a CloudWatch Logs destination in the central account with an access policy allowing source accounts to put events, then configure subscription filters in each source account",
      "Enable cross-account CloudTrail and rely on its built-in log aggregation to the central account",
      "Use S3 export tasks in every account writing to a shared bucket owned by the central account",
      "Install the CloudWatch Agent in every account pointing at the central account's log group ARN"
    ],
    explanation: "Cross-account log aggregation uses a CloudWatch Logs destination in the receiver account whose access policy grants source accounts permission to put events; source accounts then attach subscription filters targeting that destination. CloudTrail does not aggregate CloudWatch Logs, S3 export is not real-time, and the agent cannot cross account boundaries directly."
  },
  {
    domain: 4,
    service: "CloudWatch Logs",
    q: "A team wants network traffic accepted or rejected by security groups and network ACLs delivered to CloudWatch Logs. Which log source do they enable?",
    options: [
      "VPC Flow Logs with CloudWatch Logs as the destination",
      "CloudTrail management events filtered by service=ec2",
      "Route 53 DNS query logs",
      "The CloudWatch Agent running on every EC2 instance in the VPC"
    ],
    explanation: "VPC Flow Logs capture traffic accepted or rejected by security groups and network ACLs and can deliver to CloudWatch Logs. CloudTrail logs API calls, not packet flows. Route 53 logs DNS queries. The CloudWatch Agent collects OS-level data, not VPC network flow records."
  },
  {
    domain: 4,
    service: "CloudWatch Logs",
    q: "A log group contains short-lived debug logs that incur growing storage costs. What is the simplest way to automatically remove logs older than 30 days?",
    options: [
      "Set a log retention policy of 30 days on the log group",
      "Create an EventBridge rule that deletes log streams older than 30 days",
      "Export logs to S3 daily and delete the CloudWatch log group each month",
      "Use a Lambda function triggered by CloudWatch Alarms on storage metrics"
    ],
    explanation: "CloudWatch Logs supports per-log-group retention policies (expiration) that automatically delete data after the configured period. The other approaches are more complex, fragile, or cost more than the built-in feature."
  },

  /* -- CloudWatch Alarms (5) -- */
  {
    domain: 4,
    service: "CloudWatch Alarms",
    q: "A CloudWatch Alarm has just been created, but no metric data has been collected yet. Which alarm state is reported?",
    options: [
      "INSUFFICIENT_DATA, meaning not enough data points exist to evaluate the threshold",
      "ALARM, because missing data is treated as breaching by default",
      "OK, because no breach has been observed yet",
      "PENDING, a transitional state until the first evaluation completes"
    ],
    explanation: "CloudWatch Alarms have three states: OK, ALARM, and INSUFFICIENT_DATA. When not enough data points exist to evaluate, the alarm reports INSUFFICIENT_DATA. There is no PENDING state, and missing data is not implicitly ALARM or OK."
  },
  {
    domain: 4,
    service: "CloudWatch Alarms",
    q: "A company wants a pager alert to fire only when BOTH CPU is high AND request latency is elevated, to reduce false positives from isolated metrics. What should they configure?",
    options: [
      "A composite alarm combining the two alarms with AND logic",
      "A single metric alarm with metric math averaging CPU and latency",
      "Two independent alarms both routed to the same SNS topic",
      "A CloudWatch Anomaly Detection alarm on a joined metric"
    ],
    explanation: "Composite alarms combine the states of multiple alarms using AND or OR logic to reduce noise — exactly the use case described. Routing two alarms to the same SNS topic would page on either (OR semantics). Metric math averaging different scales would be meaningless, and anomaly detection doesn't natively combine metrics this way."
  },
  {
    domain: 4,
    service: "CloudWatch Alarms",
    q: "When a CloudWatch Alarm enters the ALARM state, which targets can it act on directly?",
    options: [
      "SNS topics, Lambda functions, and Auto Scaling actions",
      "Only SNS topics, with Lambda and Auto Scaling invoked via SNS subscriptions",
      "EventBridge buses only — all other integrations go through EventBridge",
      "Systems Manager Run Command and Step Functions state machines directly"
    ],
    explanation: "Alarms can directly trigger SNS notifications, invoke Lambda functions, and initiate Auto Scaling actions (and EC2 actions). Other integrations are possible via EventBridge or SNS, but the direct targets the source lists are SNS, Lambda, and Auto Scaling."
  },
  {
    domain: 4,
    service: "CloudWatch Alarms",
    q: "An alarm is configured with a Sum statistic, a 5-minute period, a GreaterThanThreshold comparison operator, and a threshold of 100. What does this mean?",
    options: [
      "The alarm triggers when the sum of the metric values over a 5-minute period exceeds 100",
      "The alarm triggers when the metric reports a value greater than 100 at any time in 5 minutes",
      "The alarm triggers when 100 data points are observed in 5 minutes",
      "The alarm triggers when the average value over any 5-minute window exceeds 100"
    ],
    explanation: "Alarms evaluate metrics using a statistic (sum/avg/min/max/count) over a period. Here the statistic is Sum over 5 minutes — so the aggregated sum must exceed 100. Average and per-data-point semantics correspond to different statistics."
  },
  {
    domain: 4,
    service: "CloudWatch Alarms",
    q: "A team needs an alarm based on the frequency of ERROR strings appearing in a CloudWatch Logs log group. What is the correct pattern?",
    options: [
      "Create a metric filter that converts matching log events into a custom metric, then set an alarm on that metric",
      "Create an alarm directly on the log group with a log-pattern threshold",
      "Use a CloudWatch Logs Insights query scheduled every minute to emit alarm states",
      "Subscribe the log group to SNS and let SNS evaluate the threshold"
    ],
    explanation: "CloudWatch Logs metric filters count matching log events and publish the count as a CloudWatch metric; alarms are then configured on that metric. Alarms operate on metrics, not directly on log groups. Logs Insights is not a real-time evaluation engine, and SNS doesn't evaluate thresholds."
  },

  /* -- CloudWatch Dashboards (3) -- */
  {
    domain: 4,
    service: "CloudWatch Dashboards",
    q: "An SRE team wants a single pane of glass showing CPU graphs, error-count widgets, and a Logs Insights query result together. Which service provides this?",
    options: [
      "CloudWatch Dashboards, which support metric graphs, number widgets, and embedded Logs Insights visualizations",
      "CloudWatch Metric Streams with a dashboard add-on",
      "AWS Systems Manager OpsCenter, the only unified visualization tool",
      "CloudWatch Synthetics with Canary-based screen captures"
    ],
    explanation: "Dashboards let you arrange widgets — line graphs, stacked area charts, number widgets, and Logs Insights visualizations — in a single grid view. The other services either don't provide visualization or serve different purposes (synthetic monitoring, streaming)."
  },
  {
    domain: 4,
    service: "CloudWatch Dashboards",
    q: "A Logs Insights query showing error rates over time should be displayed permanently on a team's operational dashboard. What is the supported workflow?",
    options: [
      "Run the query in Logs Insights and add the resulting visualization to a CloudWatch Dashboard",
      "Export the query results to S3 and embed the S3 URL in the dashboard",
      "Publish the query as a custom metric using PutMetricData, then graph the metric",
      "Convert the query to a Lambda function that writes dashboard JSON directly"
    ],
    explanation: "Logs Insights results can be exported or added directly to a CloudWatch Dashboard as a visualization — this is the native, intended integration. Custom metrics, S3 embedding, or Lambda translation are unnecessary workarounds for a feature that exists out of the box."
  },
  {
    domain: 4,
    service: "CloudWatch Dashboards",
    q: "What primary purpose do CloudWatch Dashboards serve in an operations practice?",
    options: [
      "Provide operational visibility by consolidating metrics and logs into a shared visual view",
      "Serve as the primary alerting mechanism when thresholds are breached",
      "Store historical metric data beyond the standard CloudWatch retention",
      "Automatically remediate issues when widgets show abnormal values"
    ],
    explanation: "Dashboards are visualization surfaces for monitoring application health, infrastructure utilization, and business metrics. Alerting is Alarms' job, retention is set on metrics/logs, and remediation is handled by Lambda, SSM, or Auto Scaling — not dashboards."
  },

  /* -- CloudWatch Agent (5) -- */
  {
    domain: 4,
    service: "CloudWatch Agent",
    q: "A team notices that local application log files on EC2 instances never appear in CloudWatch Logs. What must they do?",
    options: [
      "Deploy the CloudWatch Agent on the instances with an IAM role that permits sending logs",
      "Enable detailed monitoring on the EC2 instances",
      "Attach a VPC endpoint for CloudWatch Logs to the subnet",
      "Enable CloudTrail data events to capture the log files"
    ],
    explanation: "By default, EC2 local log files do not flow to CloudWatch. The CloudWatch Agent must be deployed on the instance, and the instance profile must grant permissions to publish logs. Detailed monitoring relates to metric frequency, VPC endpoints affect network path (not enablement), and CloudTrail does not ship application logs."
  },
  {
    domain: 4,
    service: "CloudWatch Agent",
    q: "Besides log files, what does the unified CloudWatch Agent collect that the legacy CloudWatch Logs Agent does not?",
    options: [
      "System-level metrics such as CPU, memory, disk I/O, netstat, processes, and swap",
      "CloudTrail management events from the instance",
      "EBS snapshot statistics",
      "X-Ray traces from the instance's applications"
    ],
    explanation: "The unified agent collects both logs and rich OS-level metrics (CPU, disk, disk I/O, memory/RAM, netstat, processes, swap) in a single deployment. The legacy Logs Agent sends only logs. CloudTrail, EBS, and X-Ray data come from different sources."
  },
  {
    domain: 4,
    service: "CloudWatch Agent",
    q: "A company manages a large fleet of EC2 instances running the unified CloudWatch Agent. How can they centrally push configuration changes to all agents without logging into each instance?",
    options: [
      "Store the agent configuration in AWS Systems Manager Parameter Store and reference it from the agent",
      "Hard-code the configuration into a new AMI and replace every instance",
      "Modify the CloudWatch Agent config via CloudFormation custom resources on every update",
      "Manually update /etc/cloudwatch-agent.conf on each instance via SSH"
    ],
    explanation: "Unified CloudWatch Agent configuration is centralized through SSM Parameter Store, letting you push updates across a fleet without manual changes per instance. AMI baking, custom resources, and SSH updates are operationally heavy and unnecessary."
  },
  {
    domain: 4,
    service: "CloudWatch Agent",
    q: "An on-premises data center wants to centralize logs and metrics into CloudWatch for hybrid visibility. What's the recommended approach?",
    options: [
      "Install the unified CloudWatch Agent on the on-premises servers",
      "Use the CloudTrail on-premises collector to forward system logs",
      "Deploy an outpost in the data center — the agent only runs on AWS-owned hardware",
      "Install the legacy Logs Agent only; metrics cannot be collected from on-prem"
    ],
    explanation: "The CloudWatch Agent (including the unified agent) can be deployed on on-premises servers, centralizing logs and OS-level metrics in CloudWatch. CloudTrail does not collect system logs, the agent is not restricted to AWS hardware, and the unified agent does support metrics in on-prem environments."
  },
  {
    domain: 4,
    service: "CloudWatch Agent",
    q: "A team is starting a greenfield project and asks whether to use the legacy CloudWatch Logs Agent or the unified CloudWatch Agent. What should you recommend?",
    options: [
      "Use the unified CloudWatch Agent — it supersedes the legacy agent and collects both logs and system metrics",
      "Use the legacy Logs Agent — it is still the recommended agent for log-only use cases",
      "Use both in parallel: the legacy agent for logs and the unified agent for metrics",
      "Neither — the default EC2 agent already collects everything"
    ],
    explanation: "The unified agent supersedes the legacy CloudWatch Logs Agent and collects both logs and system-level metrics from a single deployment. The legacy agent remains only for backward compatibility. EC2 does not include a default CloudWatch agent."
  },

  /* -- CloudWatch Synthetics (5) -- */
  {
    domain: 4,
    service: "CloudWatch Synthetics",
    q: "A retailer wants to detect checkout-flow outages before real customers hit them, by periodically simulating the full multi-page checkout in a browser. Which CloudWatch feature fits?",
    options: [
      "A CloudWatch Synthetics Canary running a script in a headless Chrome browser on a recurring schedule",
      "A CloudWatch Alarm on request count in the checkout ALB target group",
      "A CloudWatch Metric Filter on checkout application logs",
      "A CloudWatch Dashboard widget embedding the checkout page"
    ],
    explanation: "Synthetics Canaries run Node.js/Python scripts with access to a headless Chrome browser to reproduce user flows on a schedule — exactly the use case. Alarms and metric filters only react to observed traffic, and dashboards do not perform synthetic interactions."
  },
  {
    domain: 4,
    service: "CloudWatch Synthetics",
    q: "An SRE needs a quick canary that simply pings a URL every minute to alert when it becomes unavailable. Which Synthetics blueprint is most appropriate?",
    options: [
      "Heartbeat monitor, a simple endpoint health check",
      "Visual monitoring, which compares page screenshots",
      "Broken link checker, which scans for dead links",
      "Canary recorder, which captures and replays user interactions"
    ],
    explanation: "The heartbeat monitor blueprint is specifically for simple endpoint health checks. Visual monitoring detects visual regressions, the broken link checker traverses links, and the recorder captures multi-step user flows — all overkill for a basic availability ping."
  },
  {
    domain: 4,
    service: "CloudWatch Synthetics",
    q: "A QA team wants to be alerted when a deployment causes visual regressions on the homepage (e.g., a button turns invisible). Which blueprint fits?",
    options: [
      "Visual monitoring, which compares screenshots for visual regression",
      "API canary, which validates API responses",
      "Heartbeat monitor, which checks URL availability",
      "GUI workflow builder, a no-code multi-step builder"
    ],
    explanation: "Visual monitoring compares captured screenshots to a baseline to detect visual regressions such as changed layouts or colors. The API canary validates JSON/XML responses, heartbeat does availability, and the GUI workflow builder is a no-code canary authoring tool."
  },
  {
    domain: 4,
    service: "CloudWatch Synthetics",
    q: "In which languages can CloudWatch Synthetics canary scripts be written?",
    options: [
      "Node.js or Python",
      "Go or Java",
      "Ruby or Node.js",
      "Any language supported by AWS Lambda"
    ],
    explanation: "Synthetics canaries are authored in Node.js or Python and have access to a headless Chrome browser. Although canaries run on AWS infrastructure, the supported runtime set is intentionally narrow — not the full Lambda language matrix."
  },
  {
    domain: 4,
    service: "CloudWatch Synthetics",
    q: "How does a Synthetics Canary typically notify operators when an endpoint starts failing?",
    options: [
      "The canary integrates with CloudWatch Alarms, which trigger notifications on failure",
      "The canary publishes events directly to PagerDuty via a native integration",
      "Synthetics runs a Lambda callback embedded in every canary script by default",
      "The canary sends SNS notifications directly without involving CloudWatch Alarms"
    ],
    explanation: "Canaries integrate with CloudWatch Alarms; alarms then fan out to SNS, Lambda, or other targets. They do not have a native direct PagerDuty integration, and there is no default embedded Lambda callback."
  },

  /* -- X-Ray (5) -- */
  {
    domain: 4,
    service: "X-Ray",
    q: "A microservices team needs to identify which downstream service is the bottleneck in a slow API request spanning 6 services. Which X-Ray feature helps most?",
    options: [
      "The service map visualizing segments, subsegments, latency, and error rates across the call chain",
      "CloudWatch Logs Insights correlating log timestamps across services",
      "A CloudWatch Dashboard showing per-service CPU graphs",
      "CloudTrail management events for each service call"
    ],
    explanation: "X-Ray traces are collections of segments/subsegments that visualize the end-to-end path of a request as a service map — showing timing, dependencies, and errors so bottlenecks are clear. Logs, dashboards, and CloudTrail don't give per-request distributed-trace visualization."
  },
  {
    domain: 4,
    service: "X-Ray",
    q: "By default, how does X-Ray decide which requests to sample?",
    options: [
      "It traces the first request each second plus 5 percent of additional requests",
      "It traces 100 percent of all requests until sampling is manually configured",
      "It traces every Nth request, where N is based on current throughput",
      "It traces only requests that return HTTP 5xx errors"
    ],
    explanation: "X-Ray's default sampling rule captures the first request per second (reservoir) plus 5% of additional requests, balancing cost and observability. Always-on tracing is possible but not default. Error-only or Nth-request sampling are not the defaults described by the source."
  },
  {
    domain: 4,
    service: "X-Ray",
    q: "A team wants to trace 100% of requests to a critical /checkout endpoint while leaving default sampling for everything else. How should they configure this?",
    options: [
      "Create a custom sampling rule that matches the /checkout path and sets the fixed rate to 100%",
      "Raise the default sampling rate to 100%, impacting all endpoints",
      "Add a CloudWatch Alarm that activates full tracing only when the endpoint is slow",
      "Sampling rates cannot be customized per endpoint in X-Ray"
    ],
    explanation: "X-Ray sampling rules can match on request attributes (HTTP path, host, method, etc.) so you can raise the rate only for critical endpoints. Raising the global rate is wasteful, alarms don't configure sampling, and per-endpoint customization is a supported feature."
  },
  {
    domain: 4,
    service: "X-Ray",
    q: "Which building blocks make up an X-Ray trace?",
    options: [
      "Segments and subsegments representing the end-to-end path of a request through services",
      "Log streams and log events collected from each instrumented service",
      "Metric namespaces and dimensions emitted by each service",
      "Events and rules routed through EventBridge"
    ],
    explanation: "A trace is a collection of segments and subsegments representing the end-to-end path of a request; each segment records timing, errors, and metadata. Log streams, metrics, and EventBridge rules are separate CloudWatch/EventBridge concepts, not X-Ray trace primitives."
  },
  {
    domain: 4,
    service: "X-Ray",
    q: "Which AWS compute and integration services can X-Ray instrument out of the box?",
    options: [
      "Lambda, EC2, Elastic Beanstalk, and API Gateway, among others",
      "Only Lambda and API Gateway — EC2 must use CloudWatch metrics instead",
      "Only EC2 with the CloudWatch Agent installed",
      "Only on-premises applications via the X-Ray daemon"
    ],
    explanation: "X-Ray integrates with Lambda, EC2, Elastic Beanstalk, API Gateway, and other services, either automatically or via explicit SDK calls. It is not limited to a single compute type, and it supports AWS workloads in addition to on-premises applications."
  },

  /* -- CloudTrail (5) -- */
  {
    domain: 4,
    service: "CloudTrail",
    q: "A security team needs an immutable record of every API call and management event across all regions in their AWS account for compliance. Which service provides this?",
    options: [
      "CloudTrail with logging enabled across all regions",
      "CloudWatch Logs with a metric filter on 'api-call'",
      "EventBridge with a rule capturing all AWS events",
      "AWS Config recording configuration changes over time"
    ],
    explanation: "CloudTrail logs API calls and management events to create an audit trail, and enabling it in all regions captures activity across the entire footprint. CloudWatch Logs metric filters read existing logs (they don't generate the audit trail), EventBridge routes events but isn't the authoritative audit log, and Config tracks resource configuration — not API calls directly."
  },
  {
    domain: 4,
    service: "CloudTrail",
    q: "Where does CloudTrail store its logs by default, and how can they be made searchable in near-real-time?",
    options: [
      "Logs are stored in S3 by default and can also be sent to CloudWatch Logs for real-time analysis",
      "Logs are stored only in CloudWatch Logs; S3 export is a separate feature",
      "Logs are retained in the CloudTrail service itself for 90 days only",
      "Logs are sent directly to EventBridge and must be archived manually"
    ],
    explanation: "CloudTrail's default destination is S3 for durable retention, and it can additionally forward events to CloudWatch Logs for search, metric filters, and alarms. CloudTrail itself stores event history for 90 days in the Event History view, but S3 is the durable store and CloudWatch Logs enables real-time analysis."
  },
  {
    domain: 4,
    service: "CloudTrail",
    q: "Why is enabling CloudTrail across all regions a best practice even if a company only uses one region?",
    options: [
      "Because it captures activity across the entire AWS footprint, including unexpected actions in unused regions",
      "Because CloudTrail pricing is lower when all regions are enabled",
      "Because single-region trails are deprecated and no longer supported",
      "Because region-specific trails only capture read events, not write events"
    ],
    explanation: "Enabling CloudTrail in all regions ensures you audit activity everywhere — including malicious or accidental actions in regions you don't normally use. Pricing is not reduced by enabling more regions, single-region trails are still supported, and region setting does not limit event type."
  },
  {
    domain: 4,
    service: "CloudTrail",
    q: "A team wants CloudTrail events streamed to CloudWatch Logs so they can alarm on specific API calls. Is filtering the events supported?",
    options: [
      "Yes — CloudTrail can send logs to CloudWatch Logs, optionally filtered",
      "No — CloudTrail forwards all events unconditionally to CloudWatch Logs",
      "Only management events are streamable; data events cannot reach CloudWatch Logs",
      "Filtering is only possible when events are also delivered to EventBridge"
    ],
    explanation: "The source explicitly notes CloudTrail can send logs to CloudWatch Logs, optionally filtered. This lets teams focus on relevant events before attaching metric filters and alarms."
  },
  {
    domain: 4,
    service: "CloudTrail",
    q: "Which analysis use case is CloudTrail best suited for?",
    options: [
      "Forensic investigation and compliance auditing of API activity",
      "Real-time application performance tracing across microservices",
      "Capturing operating-system-level metrics such as memory and disk usage",
      "Synthetic monitoring of public endpoints from outside AWS"
    ],
    explanation: "CloudTrail is an audit log of API calls and management events — ideal for forensics and compliance. Performance tracing is X-Ray's role, OS-level metrics come from the CloudWatch Agent, and synthetic monitoring is done by Synthetics Canaries."
  },

  /* -- EventBridge (5) -- */
  {
    domain: 4,
    service: "EventBridge",
    q: "A team needs to trigger a Lambda function whenever an EC2 instance enters the 'stopped' state. Which EventBridge construct routes this event?",
    options: [
      "An EventBridge rule with an event pattern matching the EC2 state-change event, targeting the Lambda function",
      "A CloudWatch Alarm on the EC2 'stopped' metric targeting the Lambda function",
      "An SNS topic subscribed to the EC2 lifecycle and fanning out to Lambda",
      "A scheduled EventBridge rule polling EC2 state every minute"
    ],
    explanation: "EventBridge rules use event pattern matching to route specific AWS-service events to targets like Lambda. There is no built-in 'stopped' metric, SNS isn't the event source here, and polling is unnecessary because EC2 emits state-change events natively."
  },
  {
    domain: 4,
    service: "EventBridge",
    q: "Which of the following are valid EventBridge rule targets?",
    options: [
      "Lambda functions, SNS topics, SQS queues, and CloudWatch Logs",
      "Only Lambda functions — other services must be invoked indirectly",
      "Only services in the same region and account as the rule",
      "EC2 instances directly via a TCP socket"
    ],
    explanation: "EventBridge routes events to a broad target set including Lambda, SNS, SQS, and CloudWatch Logs (among many others). Targets are not limited to Lambda, can be cross-account/region in many cases, and EventBridge does not open TCP connections to EC2 instances."
  },
  {
    domain: 4,
    service: "EventBridge",
    q: "How does EventBridge determine which events a given rule should act on?",
    options: [
      "By matching incoming events against an event pattern defined on the rule",
      "By polling each event source on a fixed schedule",
      "By using CloudWatch metric filters applied to event payloads",
      "By hashing the event ID against the rule's ARN"
    ],
    explanation: "Rules use event-pattern matching against the incoming event's structure to decide whether to invoke targets. Polling is not how EventBridge ingests events; metric filters belong to CloudWatch Logs; and rule ARNs are not used for matching."
  },
  {
    domain: 4,
    service: "EventBridge",
    q: "A SaaS vendor wants to deliver webhook-style events directly to a customer's AWS account. What EventBridge capability supports this?",
    options: [
      "EventBridge can route events from third-party applications, not just AWS services",
      "Only AWS-native services can publish events to EventBridge",
      "The vendor must send events to SNS, which then forwards them to EventBridge",
      "EventBridge requires a Kinesis stream as an intermediate for third-party events"
    ],
    explanation: "EventBridge routes events from AWS services, third-party applications, and custom applications to targets. Third-party SaaS partner event sources are a first-class capability; SNS or Kinesis are not required intermediaries."
  },
  {
    domain: 4,
    service: "EventBridge",
    q: "A central 'automation' target needs to run on a mix of AWS events (e.g., ECR image push) and custom application events. Which EventBridge feature enables both in one place?",
    options: [
      "Define rules on the event bus that match both AWS-service patterns and custom-application events, with the automation as the target",
      "Deploy two separate systems — EventBridge for AWS events and SNS for custom events",
      "Route all events through CloudTrail, which unifies AWS and custom events",
      "Use CloudWatch Alarms to evaluate and forward both event types"
    ],
    explanation: "EventBridge is designed to route AWS service events, third-party events, and custom application events from a single bus to common targets. CloudTrail audits API calls (not custom events), and alarms/SNS do not provide unified pattern-based routing."
  },

  /* -- Athena (6) -- */
  {
    domain: 4,
    service: "Athena",
    q: "A team wants to run ad-hoc SQL queries against large JSON and Parquet log files sitting in S3 without provisioning any infrastructure. Which service fits?",
    options: [
      "Amazon Athena, a serverless query service that reads data directly from S3",
      "Amazon Redshift with a dc2.large cluster scaled to the dataset size",
      "CloudWatch Logs Insights pointed at the S3 bucket",
      "Amazon EMR with Spark running Presto on the data"
    ],
    explanation: "Athena is serverless, reads CSV/JSON/ORC/Avro/Parquet directly from S3 via a Presto-based engine, and charges per TB scanned. Redshift and EMR require cluster management, and Logs Insights does not query arbitrary S3 data."
  },
  {
    domain: 4,
    service: "Athena",
    q: "A team's Athena bill is high because queries repeatedly scan terabytes of raw CSV. Which single change most directly reduces scan size and cost?",
    options: [
      "Convert data to a columnar format such as Parquet or ORC",
      "Double the number of S3 prefixes to improve throughput",
      "Enable Athena Workgroup result caching",
      "Move the data to S3 Standard-IA to reduce retrieval charges"
    ],
    explanation: "Columnar formats like Parquet/ORC dramatically reduce scan size because Athena reads only the columns referenced by the query. More prefixes don't reduce scan size, S3 storage class affects storage cost (not scan cost), and result caching only helps when queries repeat exactly."
  },
  {
    domain: 4,
    service: "Athena",
    q: "An analyst filters logs almost always by date. What optimization allows Athena to scan only the relevant date's data instead of the whole dataset?",
    options: [
      "Partition the S3 dataset by date so Athena can prune partitions during query execution",
      "Compress the data with gzip so filters evaluate faster",
      "Store one large file per year rather than daily files",
      "Enable S3 Transfer Acceleration on the Athena query bucket"
    ],
    explanation: "Partitioning exposes partition keys as virtual columns; when a query filters on them, Athena prunes irrelevant partitions and scans far less data. Compression helps but doesn't skip data, large single files prevent pruning, and Transfer Acceleration is unrelated to Athena."
  },
  {
    domain: 4,
    service: "Athena",
    q: "How is Amazon Athena priced?",
    options: [
      "$5 per terabyte of data scanned, with no upfront costs or infrastructure to manage",
      "By instance-hour for the compute cluster allocated to each query",
      "By row count returned from each query",
      "A flat monthly fee based on total S3 bucket size"
    ],
    explanation: "Athena is serverless and priced at $5 per TB scanned; there is no cluster or infrastructure management. It is not priced per instance-hour, per row returned, or by bucket size — all of which would mislead cost-optimization decisions."
  },
  {
    domain: 4,
    service: "Athena",
    q: "A data team stores millions of small (2–5 KB) JSON files in S3 and Athena queries are slow. Which guideline addresses this?",
    options: [
      "Use larger files (greater than 128 MB) to minimize per-file open/close overhead",
      "Store each record in its own object to maximize parallelism",
      "Switch from S3 Standard to S3 One Zone-IA for faster Athena reads",
      "Enable gzip compression on every small file"
    ],
    explanation: "Athena incurs overhead opening each S3 object; with millions of tiny files, that overhead dominates. Consolidating into larger files (>128 MB) is a documented optimization. More objects means more overhead, storage class does not accelerate queries, and compression alone doesn't fix the small-file problem."
  },
  {
    domain: 4,
    service: "Athena",
    q: "An analyst wants to run a single SQL query joining data in S3 with data in an on-premises MySQL database, without copying the data into S3 first. Which Athena feature supports this?",
    options: [
      "Athena Federated Query using data source connectors running on Lambda",
      "Athena Query Federation with Redshift Spectrum as the connector",
      "Athena CREATE EXTERNAL TABLE with a JDBC storage handler",
      "Athena cross-region replication to colocate the MySQL data"
    ],
    explanation: "Federated Query uses Lambda-based connectors to run SQL across relational DBs, non-relational stores, object stores, and custom sources — no pre-copy required. Redshift Spectrum is a Redshift feature, there is no JDBC storage handler for Athena tables, and Athena does not replicate MySQL data."
  },
  /* -- Kinesis (4) -- */
  {
    domain: 4,
    service: "Kinesis",
    q: "Which destinations can a CloudWatch Logs subscription filter stream log events to in real time?",
    options: [
      "Amazon Kinesis Data Streams, Amazon Kinesis Data Firehose, or AWS Lambda",
      "Amazon S3, Amazon Athena, or Amazon QuickSight",
      "Amazon SQS, Amazon SNS, or AWS Step Functions",
      "AWS CloudTrail, AWS Config, or AWS Systems Manager"
    ],
    explanation: "CloudWatch Logs subscriptions support three real-time destinations: Kinesis Data Streams, Kinesis Data Firehose, and Lambda. S3 delivery from CloudWatch Logs is a separate asynchronous export (up to 12 hours) rather than a subscription destination."
  },
  {
    domain: 4,
    service: "Kinesis",
    q: "A subscription filter is forwarding a high-volume log group to a Kinesis Data Stream and driving up data-transfer and downstream processing costs. What is the recommended way to reduce what gets sent?",
    options: [
      "Apply a filter pattern to the subscription so only matching log events are delivered",
      "Shorten the log group's retention period so fewer events exist to forward",
      "Disable encryption at rest on the log group to lower the payload size",
      "Export the log group to S3 and subscribe the Kinesis stream to the S3 bucket"
    ],
    explanation: "Subscription filters accept a filter pattern, and only matching log entries are sent to the destination — this is the source's stated mechanism for reducing data transfer and processing costs. Retention governs storage, not what the subscription forwards; encryption does not change payload size; and S3 export is an async archival flow, not a subscription source."
  },
  {
    domain: 4,
    service: "Kinesis",
    q: "A central security account needs to aggregate CloudWatch Logs events from many source accounts into one Kinesis Data Stream. How should this be configured?",
    options: [
      "Create a CloudWatch Logs destination in the receiving account (wrapping the Kinesis Data Stream) with an access policy allowing the source accounts, then create subscription filters in each source account targeting that destination",
      "Share the Kinesis Data Stream ARN with each source account via AWS RAM and have them write to it directly with PutRecord",
      "Enable CloudWatch Logs cross-region replication from each source account into the central account's log group, then subscribe the Kinesis Data Stream to that log group",
      "Export logs to S3 in each source account and configure S3 event notifications to invoke the central Kinesis Data Stream"
    ],
    explanation: "For cross-account log aggregation, the receiving account creates a CloudWatch Logs destination with an access policy granting the source accounts permission to put events; source accounts then create subscription filters pointing at that destination. CloudWatch Logs does not have a cross-region replication feature, and Kinesis is not a valid S3-event-notification target."
  },
  {
    domain: 4,
    service: "Kinesis",
    q: "Which AWS streaming destination does CloudWatch Metric Streams deliver to natively for near-real-time metric export?",
    options: [
      "Amazon Kinesis Data Firehose (which can forward to S3, Redshift, OpenSearch, or partners like Datadog, Dynatrace, and Splunk)",
      "Amazon Kinesis Data Streams, consumed by a custom application using the Kinesis Client Library",
      "Amazon EventBridge, with rules fanning out to Lambda or SQS targets",
      "Amazon S3 directly, with automatic Parquet conversion"
    ],
    explanation: "CloudWatch Metric Streams' supported destinations include Kinesis Data Firehose and third-party platforms such as Datadog, Dynatrace, and Splunk. It does not write to Kinesis Data Streams, EventBridge, or S3 directly."
  }
];
