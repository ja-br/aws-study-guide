## CodeCommit
Fully managed, private Git repositories hosted in AWS. Encrypted at rest (AWS KMS) and in transit (HTTPS/SSH). No size limits on repositories.

### Branching Strategies
- **Trunk-based development** — all developers commit directly to `main`; feature flags gate incomplete work; fastest CI feedback loop; minimizes merge conflicts
- **GitFlow** — long-lived `main` + `develop` + `feature/*` + `release/*` + `hotfix/*` branches; more process overhead; suited to scheduled release cycles
- **Feature branch workflow** — short-lived feature branches merged via pull request; common middle ground between trunk-based and GitFlow

### Pull Requests
- PRs support comments, inline code review, and status checks before merging
- PRs can require **approval rule templates** — define how many approvers are required and which IAM principals (users, roles, groups) can approve
- Approval rules can be applied per-repository or as **account-level templates** automatically applied to new repos matching a name filter

### Triggers & Notifications
- **Repository triggers** — fire on push/branch/tag events; targets are **SNS topics** or **Lambda functions**
- **EventBridge notifications** — emit events for PR created/updated/merged, comment added, branch created/deleted; more event types than triggers; preferred for pipeline integration
- **Notification rules** — configure which CodeCommit events send to SNS/Chatbot (Slack, Chime)

### Branch Protection (Approval Rules)
Use approval rule templates to prevent direct pushes to `main` — all changes must come through an approved PR. CodeCommit cannot natively block direct CLI pushes (unlike GitHub branch protection); enforce via **SCPs + IAM policies** denying `codecommit:GitPush` on protected branches for non-admin roles.

### Cross-Account Access
- Grant another account access via a **resource-based policy** on the repository, or have the external account assume an IAM role in the owning account
- *Use case:* CodePipeline in a tooling account pulls source from CodeCommit in a workload account

### Integration with CodePipeline
CodePipeline Source action type `CodeCommit` listens for branch changes via **EventBridge** (preferred) or polling. Triggered on any commit to the configured branch.

---

## CodePipeline
Fully managed **continuous delivery service** that models, visualizes, and automates software release pipelines. Replaces manual release processes with an automated, auditable, and repeatable workflow.

- Pipelines are defined as a series of **stages** (Source → Build → Test → Deploy → Invoke)
- Each stage contains one or more **actions** that run sequentially or in parallel within **action groups**
- A pipeline execution is triggered when source changes are detected; each execution carries **input/output artifacts** between stages via an S3 bucket encrypted with KMS
- Integrates natively with CodeCommit, CodeBuild, CodeDeploy, CloudFormation, ECS, Lambda, and third-party tools (GitHub, Jenkins, Bitbucket via CodeStar Connections)

**Stages:**
- **Source** — pulls code from CodeCommit, GitHub, S3, ECR, Bitbucket
- **Build** — compiles code, runs unit tests (CodeBuild, Jenkins)
- **Test** — integration/load testing (CodeBuild, Device Farm, 3rd party)
- **Deploy** — deploys artifacts (CodeDeploy, Elastic Beanstalk, CloudFormation, ECS, S3)
- **Invoke** — invoke Lambda functions, Step Functions
- **Manual Approval** — publish SNS notification, requires IAM permission to approve

Each stage can have sequential or parallel **action groups**.

### Artifacts
An **artifact** is any file or set of files produced by one pipeline action and consumed by a later action. Artifacts are the mechanism by which data flows between stages — a stage cannot directly pass data to the next stage except through artifacts stored in S3.

- Each artifact is a **ZIP file** stored in the pipeline's designated S3 artifact bucket, encrypted with KMS
- Actions declare **input artifacts** (what they need) and **output artifacts** (what they produce); CodePipeline manages the transfer automatically
- Artifact names are defined in the pipeline configuration (e.g., `SourceOutput`, `BuildOutput`) and must be unique within a pipeline execution
- A single action can consume multiple input artifacts and produce multiple output artifacts
- Artifacts persist for the lifetime of the pipeline execution; they are not shared across separate executions

**Common artifact chain:**
1. **Source action** — downloads source code from CodeCommit/GitHub/S3 and produces `SourceOutput` (a ZIP of the repo)
2. **Build action (CodeBuild)** — consumes `SourceOutput`, compiles code, runs tests, produces `BuildOutput` (compiled binaries, appspec.yml, task definitions, etc.)
3. **Deploy action (CodeDeploy/CloudFormation/ECS)** — consumes `BuildOutput` to perform the deployment

**Artifact Flow:**
1. Developer pushes code → **CodeCommit**
2. CodePipeline pulls code → stores artifact in **S3**
3. Subsequent stages (CodeBuild, CodeDeploy, etc.) retrieve artifact from **S3**

### Events vs Webhooks vs Polling
#### Events (preferred)
- **CodeCommit** → **EventBridge** → **CodePipeline**
- **GitHub** → **CodeStar Source Connection** → **CodePipeline**

#### Webhook
An external system makes an HTTP request to a CodePipeline webhook endpoint to trigger a pipeline execution. Configure the webhook URL in your external source control system (e.g., GitHub).

#### Polling
CodePipeline periodically checks the source for changes (least preferred, incurs API call costs).
- CodePipeline → GitHub (or other source)

### Notifications & Observability

**EventBridge (preferred):**
- CodePipeline publishes events for every **state change**: `STARTED`, `SUCCEEDED`, `FAILED`, `CANCELED`, `SUPERSEDED`
- Event granularity: pipeline level, stage level, action level
- Route events to Lambda, SNS, SQS, Step Functions, or AWS Chatbot for Slack/Chime notifications

**Notification Rules:**
- AWS Console shortcut for CodePipeline → SNS/Chatbot notifications
- Select event types (e.g., "Action execution failed") and target (SNS topic)

**CloudWatch Metrics:**
- `PipelineExecutionAttempts` — count of pipeline runs
- No built-in success/failure metrics by default; use EventBridge → Lambda to publish custom metrics
- Set CloudWatch Alarms on custom metrics to alert on sustained failure rates

**Use case — Slack alert on pipeline failure:**
`CodePipeline FAILED event → EventBridge rule → SNS topic → AWS Chatbot → Slack channel`

### CloudFormation as CodePipeline Target
CloudFormation Deploy Action can be used to deploy AWS resources via CodePipeline.

**Example Pipeline Flow:**
CodeCommit → CloudFormation Deploy (Create Change Set) → Manual Approval → CloudFormation Deploy (Execute Change Set)

Works with CloudFormation StackSets to deploy across multiple AWS accounts and regions. Configure different settings per account/region.

#### Action Modes
- **Create or Replace a Change Set** — creates the change set without executing (for review)
- **Execute a Change Set** — executes a previously created change set
- **Create or Update** — creates stack if it doesn't exist, updates if it does (no review step)
- **Delete Only** — deletes a stack
- **Replace on Failure** — if stack is in FAILED state, delete and recreate; otherwise update

#### Template Parameter Overrides
Specify a JSON object to override CloudFormation template parameters at deployment time.
- Retrieves parameter values from CodePipeline Input Artifact using `Fn::GetParam` to extract values
- All parameter names must be present in the template

---

## CodeBuild
Fully managed build service — provides a managed alternative to self-hosted solutions like Jenkins. Supports multiple source providers and integrates seamlessly with CodePipeline.

**Key features:**
- **Source** — CodeCommit, S3, GitHub, Bitbucket
- **Build Instructions** — defined in `buildspec.yml` (or entered directly in the AWS Console)
- **Output logs** — streamed to S3 and CloudWatch Logs
- **CloudWatch Metrics** — monitor build statistics (duration, success/failure counts)
- **EventBridge** — detect failed builds and trigger automated notifications or workflows
- **CloudWatch Alarms** — alert when thresholds are breached (e.g., too many consecutive failed builds)

Supports execution in AWS-managed containers or with custom Docker images for specialized build environments.

### VPC Access
By default, CodeBuild runs in AWS-managed infrastructure with internet access. To integrate CodeBuild with private resources (such as RDS databases, ElastiCache clusters, or internal load balancers), you can place the build in a VPC — at the cost of losing default internet access.

**Configuration:**
- Specify VPC ID, subnets, and security groups in the CodeBuild project configuration
- CodeBuild provisioning creates ENIs in your specified VPC

**Internet access from VPC-bound builds:**
- Outbound internet access requires the subnet to route through a **NAT Gateway** (not an Internet Gateway)
- CodeBuild instances do not receive public IPs, so they cannot route directly through an IGW
- Common use case: downloading packages from package managers (npm, Maven, PyPI) during the build

**Performance consideration:**
- VPC placement adds approximately 30 seconds to build startup time for ENI attachment

**Best practice:** Use VPC placement only when the build requires access to private resources; otherwise, rely on the default AWS-managed network for faster startup and simpler configuration.

### Testing in Pipelines
**Unit tests:**
- Run in the `build` phase of `buildspec.yml`
- Fail the build by returning a non-zero exit code
- Output test results to CodeBuild **Test Reports** using JUnit XML format

**Integration tests:**
- Run in a separate CodePipeline **Test** stage after deployment to a staging environment
- CodeBuild invokes tests against the live staging endpoint, validating end-to-end functionality

**Load and performance tests:**
- Use CodeBuild with open-source tools (k6, Artillery, JMeter)
- Alternatively, use AWS **Device Farm** for mobile or browser-based load testing
- Execute in the Test stage after integration tests pass

**CodeBuild Test Reports:**
- CodeBuild automatically parses JUnit and Cucumber XML formats
- Displays pass/fail results and execution duration in the console
- Supports trend analysis across multiple builds for historical insight

**Recommended pattern — Staging gate:**
Deploy to staging → run automated tests → obtain Manual Approval → deploy to production. This ensures changes are validated in a production-like environment before reaching live users.

### Advanced Features

**Privileged mode:**
- Required to run the Docker daemon inside CodeBuild (for `docker build` operations)
- Disabled by default for security; enable explicitly per project when needed

**Secondary sources:**
- Pull code from up to 12 additional source repositories (CodeCommit, GitHub, S3) alongside the primary source
- Useful for monorepo builds or when sourcing shared build scripts from separate repos

**Secondary artifacts:**
- Produce multiple named artifact outputs from a single build execution
- Each artifact is uploaded to a separate S3 path, enabling flexible artifact management

**Batch builds:**
- Run multiple build configurations in parallel or as a dependency graph
- Defined in `buildspec.yml` under the `batch:` key
- Results aggregated into a single batch build report for holistic visibility

**Local builds:**
- Use the `codebuild-agent` Docker image to run builds locally on your machine
- Reproduces the CodeBuild environment for debugging and validation before pushing to CodePipeline

### buildspec.yml
Must be at root of source code (or specify alternate path).

```yaml
version: 0.2
env:
  variables:          # plaintext environment variables
  parameter-store:    # SSM Parameter Store references
  secrets-manager:    # Secrets Manager references
phases:
  install:            # install dependencies
  pre_build:          # commands before build (e.g., login to ECR)
  build:              # actual build commands
  post_build:         # finishing touches (e.g., zip output, push image)
artifacts:            # what to upload to S3 (encrypted with KMS)
  files:
    - '**/*'
cache:                # files to cache (usually dependencies) in S3
  paths:
    - '/root/.m2/**/*'  # example: Maven cache
```

### Environment Variables
- **Default** — defined by AWS (CODEBUILD_BUILD_ID, AWS_REGION, etc.)
- **Custom (static)** — defined at build project level, visible in plaintext
- **Custom (dynamic)** — reference SSM Parameter Store or Secrets Manager at build time (more secure for secrets)

### Build Caching
**S3 Cache:**
- Dependencies are serialized to/from S3 between builds
- Adds transfer time compared to local caching
- Best suited for dependencies (Maven, npm, etc.) that change infrequently
- Recommended for builds with long intervals between executions

**Local Cache:**
- Cache is stored on the build host itself
- Three sub-types available:
  - `SOURCE` — Git repository metadata
  - `DOCKER_LAYER` — Docker layer cache for image builds (requires privileged mode enabled)
  - `CUSTOM` — arbitrary user-defined directory paths
- No transfer overhead compared to S3 caching

**Docker layer caching (most impactful):**
- Set `DOCKER_BUILDKIT=1` environment variable and enable `LOCAL_DOCKER_LAYER_CACHE`
- Only effective when the same build host is reused (best-effort basis by CodeBuild)
- Significantly accelerates image builds by reusing unchanged layers

**Cache invalidation:**
- Change the cache key prefix in the CodeBuild project configuration to force a full cache refresh

---

## CodeDeploy
Automated deployment service to EC2, on-premises, Lambda, and ECS.

### Components
- **Application** — unique name, functions as a container for deployment info
- **Deployment Group** — set of tagged EC2 instances or Auto Scaling Group (ASG), Lambda function, or ECS service
- **Deployment Configuration** — rules for success/failure (min healthy hosts, traffic routing)
- **AppSpec file** — `appspec.yml` (EC2, on-premises, Lambda, and ECS)
- **Revision** — application code + appspec file

### EC2/On-Premises
Requires **CodeDeploy Agent** running on instances.
Supports in-place deployment or Blue/Green deployment.

#### Deployment Strategies (EC2)
- **AllAtOnce** — deploy to all instances simultaneously (fastest, most downtime)
  - *Preferred when:* dev/test environments where deployment speed matters more than availability; non-critical internal tools with maintenance windows
- **HalfAtATime** — deploy to half the fleet at a time
  - *Preferred when:* production workloads that can tolerate reduced capacity but not full outage; moderate-risk changes where you want some validation before full rollout
- **OneAtATime** — deploy to one instance at a time (slowest, most available)
  - *Preferred when:* mission-critical production systems with strict availability SLAs; high-risk changes where you need to catch issues before they affect more hosts
- **Custom** — e.g., MinimumHealthyHosts = 75%
  - *Preferred when:* large fleets (hundreds of instances) where you need fine-grained control over deployment speed vs. capacity; compliance requirements dictating a specific minimum healthy threshold

#### Blue/Green (EC2)
- New ASG is created (Green)
- Traffic shifts from old (Blue) to new (Green) via ALB
- Old instances terminated after success
- *Preferred when:* zero-downtime production deployments; you need instant rollback capability (just switch ALB back to Blue); validating the new environment with production traffic before fully committing; major version upgrades where in-place updates are risky (e.g., OS or runtime changes)

### Lambda Deployment Strategies
- **Linear** — traffic shifted in equal increments (e.g., Linear10PercentEvery10Minutes)
  - *Preferred when:* high-traffic APIs where you want sustained monitoring at each increment; gradual migration of a business-critical function (e.g., order processing) with CloudWatch alarms gating each step
- **Canary** — traffic shifted in two increments (e.g., Canary10Percent5Minutes — 10% first, then 90% after 5 min)
  - *Preferred when:* risky code changes (e.g., payment or auth logic) where a small test group validates correctness before full rollout; you want faster deployment than Linear but still need a safety net
- **AllAtOnce** — immediate full shift
  - *Preferred when:* low-risk changes like config updates or log-level tweaks; dev/test environments; functions with very low traffic where gradual shifting provides no statistical benefit

### ECS Deployment Strategies
**See also:** [Deployment to ECS](#deployment-to-ecs) for end-to-end pipeline integration.

Same traffic-shifting strategies as Lambda — Linear, Canary, AllAtOnce.
Uses **ALB** target group switching (Blue/Green with ECS).

- **Linear** — *Preferred when:* rolling out a new container image to a microservice behind ALB; you want to monitor per-target-group health checks and custom CloudWatch metrics at each increment
- **Canary** — *Preferred when:* deploying a breaking API change to an ECS service; testing a new task definition (e.g., memory/CPU changes) with a small traffic slice before full cutover
- **AllAtOnce** — *Preferred when:* non-production environments; deploying sidecar or logging container updates with minimal risk; hotfixes that need to reach all tasks immediately

### Rollbacks
- **Automatic rollback** — triggered on deployment failure or CloudWatch alarm threshold
- **Manual rollback** — redeploy previous revision (CodeDeploy creates a new deployment, not a true "rollback")
- If rollback is triggered, CodeDeploy deploys the last known good revision as a **new deployment**

### appspec.yml (All Platforms)
Defines what to deploy and what scripts to run at each lifecycle hook. Must be in the **root** of your revision.

The file format is the same across EC2, on-premises, Lambda, and ECS. However, each platform uses different hook names and requirements (see sections below).

```yaml
version: 0.0
os: linux                        # or "windows" (EC2/on-premises only)
files:
  - source: /                    # what to copy from the revision
    destination: /var/www/myapp  # where to put it on the instance (EC2/on-premises)
permissions:                     # optional — set ownership/permissions on deployed files (Linux only)
  - object: /var/www/myapp
    owner: www-data
    group: www-data
    mode: "755"
hooks:
  BeforeInstall:
    - location: scripts/backup.sh       # path relative to revision root
      timeout: 300                       # seconds before CodeDeploy fails this hook
      runas: root                        # optional — run as specific OS user (EC2/on-premises)
  AfterInstall:
    - location: scripts/set_permissions.sh
      timeout: 60
  ApplicationStart:
    - location: scripts/start_server.sh
      timeout: 120
  ValidateService:
    - location: scripts/health_check.sh
      timeout: 60
```

**Key sections:**
- **files** — maps source paths in your revision to destinations on the instance (EC2/on-premises only)
- **permissions** — (Linux only) set owner, group, and mode on deployed files (EC2/on-premises only)
- **hooks** — lifecycle events at which to run deployment scripts or Lambda functions; each hook entry has:
  - `location` — script path relative to revision root (EC2/on-premises) or Lambda function ARN (Lambda/ECS)
  - `timeout` — max seconds before the hook is considered failed (default 3600)
  - `runas` — OS user to execute the script as (EC2/on-premises only)

Hooks are **fixed names** defined by CodeDeploy — you cannot create custom ones. Only define the hooks you need; undefined hooks are skipped.

### EC2/On-Premises In-Place Deployments

#### How CodeDeploy Finds Your Instances
- **EC2 Tags** — CodeDeploy targets instances matching specific tag key/value pairs (e.g., `Environment=Production`)
- **Auto Scaling Group (ASG)** — target all instances in a named ASG; CodeDeploy automatically deploys to newly launched instances (e.g., from a scale-out event)

#### How It Works
The **CodeDeploy Agent** runs on each EC2 instance and polls CodeDeploy for new deployments. When a deployment is triggered:
1. Agent downloads the **revision** (your app code + appspec.yml) from S3 or GitHub
2. Agent executes the lifecycle hooks defined in `appspec.yml` in order
3. Each hook points to a script on the instance (e.g., a shell script to stop the app, install dependencies, start the app)

#### In-Place Deployment Lifecycle (with Load Balancer)
When a load balancer is configured, the lifecycle has **three phases** — remove from traffic, deploy application, restore traffic:

**Phase 1 — Remove from traffic**
- `BeforeBlockTraffic` — run your scripts before deregistering (e.g., finish in-flight requests)
- `BlockTraffic` — **CodeDeploy deregisters the instance from ALB/NLB target group** *(automated, no script)*
- `AfterBlockTraffic` — run your scripts after deregistering (e.g., verify instance is no longer receiving traffic)

**Phase 2 — Deploy the application**
- `ApplicationStop` — run your script to stop the currently running app (e.g., `systemctl stop myapp`)
- `DownloadBundle` — **CodeDeploy downloads the revision** *(automated, no script)*
- `BeforeInstall` — run your pre-install scripts (e.g., decrypt files, create backups)
- `Install` — **CodeDeploy copies revision files to the destination** *(automated, no script)*
- `AfterInstall` — run your post-install scripts (e.g., set file permissions, run database migrations)
- `ApplicationStart` — run your script to start the new version (e.g., `systemctl start myapp`)
- `ValidateService` — run your script to verify deployment succeeded (e.g., health check curl, smoke tests)

**Phase 3 — Restore traffic**
- `BeforeAllowTraffic` — run your scripts before re-registering (e.g., warm up caches)
- `AllowTraffic` — **CodeDeploy re-registers the instance with ALB/NLB target group** *(automated, no script)*
- `AfterAllowTraffic` — run your scripts after re-registering (e.g., confirm instance is receiving traffic)

> **Without a load balancer**, Phase 1 and Phase 3 are skipped entirely — only the deploy phase (Phase 2) runs.

> **Key distinction:** Hooks marked *(automated, no script)* are handled by CodeDeploy itself. The other hooks require **your** scripts defined in `appspec.yml` — if you do not define a script for a hook, that hook is skipped.

#### Blue/Green Deployments (EC2)
A **load balancer (ALB or NLB)** is required for Blue/Green — it switches traffic between the two environments.

**Two provisioning modes:**

**Manual provisioning** — you create both sets of instances yourself
- Pre-provision Blue and Green EC2 instances, identified by EC2 tags
- CodeDeploy deploys to the Green instances, then shifts the ALB target group from Blue to Green
- *Use when:* you need full control over instance configuration, or instances take a long time to bootstrap

**Automatic provisioning** — CodeDeploy creates the Green environment for you
- CodeDeploy copies the current ASG (Blue) to create a new ASG (Green) with the same settings (instance type, AMI, scaling policies)
- Deploys to the new Green ASG, shifts traffic, then handles the old Blue ASG based on your termination setting
- *Use when:* standard deployments where you want CodeDeploy to handle provisioning (most common)

**BlueInstanceTerminationOption** — what happens to the old Blue instances after a successful deployment:
- **Terminate** — Blue instances are terminated after the wait time (default). Saves cost, no manual cleanup
- **Keep Alive** — Blue instances stay running. Useful for quick manual rollback (just re-route traffic back) or post-deployment debugging

#### Blue/Green Lifecycle Hooks (EC2)
Same hooks as in-place deployments, but they run on the **replacement (Green) instances**. The order differs slightly:

1. Green instances are launched and the deploy phase runs on them:
   `ApplicationStop` → `DownloadBundle` → `BeforeInstall` → `Install` → `AfterInstall` → `ApplicationStart` → `ValidateService`
2. Traffic shifts from Blue to Green:
   `BeforeAllowTraffic` → `AllowTraffic` → `AfterAllowTraffic`
3. Blue instances are blocked and optionally terminated:
   `BeforeBlockTraffic` → `BlockTraffic` → `AfterBlockTraffic`

> **Key difference from in-place:** In-place blocks traffic *first*, then deploys. Blue/Green deploys to Green *first*, then shifts traffic, then blocks/terminates Blue.

### Deployment Configurations (EC2/On-Premises)
Named presets that control how many instances are deployed to at a time:
- `CodeDeployDefault.AllAtOnce` — deploy to all instances simultaneously
- `CodeDeployDefault.HalfAtATime` — deploy to up to half the fleet at a time
- `CodeDeployDefault.OneAtATime` — deploy to one instance at a time

You can create **custom configurations** by specifying a minimum healthy hosts value as either a count or percentage (e.g., `MinimumHealthyHosts: 75%`).

#### Triggers
Publish deployment and instance lifecycle events to an **SNS topic** for notifications or automation:
- Deployment events — `DeploymentStart`, `DeploymentSuccess`, `DeploymentFailure`, `DeploymentStop`, `DeploymentRollback`
- Instance events — `InstanceStart`, `InstanceSuccess`, `InstanceFailure`

Common use: send deployment failure alerts to a Slack channel or email via SNS → Lambda or SNS → email subscription.

### Deployment to ECS

Automatically handles Blue/Green deployment of a new ECS Task Definition to an ECS Service.

**Prerequisites**
- New container image already pushed to **ECR**
- ECS Task Definition revision created that references the new image
- CodeDeploy agent is **not required** (ECS handles execution directly)

**Deployment Process**
1. Create `appspec.yml` that references the new ECS Task Definition and specifies Load Balancer information (container name, port)
2. Upload `appspec.yml` to **S3** (as part of your deployment artifact)
3. Invoke **CodeDeploy** with the S3 artifact as input to deploy to your ECS cluster
4. CodeDeploy automatically deletes the old task definition when deployment completes

#### End-to-End Pipeline Flow

**Developer push** → **CodeCommit** triggers **CodePipeline**

**CodeBuild stage:**
- Builds and pushes container image to **ECR**
- Creates and registers a new **ECS Task Definition** revision
- Generates `appspec.yml` referencing the new task definition and stores it in **S3**

**CodeDeploy stage** (using S3 artifact as input):
- Deploys to the **ECS cluster** using Blue/Green strategy
- Shifts traffic from old (Blue) to new (Green) task definition via ALB
- Rolls back automatically if health checks fail

#### Traffic Shifting Strategies (ECS)

Shift traffic to the new **Task Set** using one of five predefined strategies:

- `ECSLinear10PercentEvery1Minutes` — shift in 10% increments every 1 minute
- `ECSLinear10PercentEvery3Minutes` — shift in 10% increments every 3 minutes
- `ECSCanary10Percent5Minutes` — send 10% for 5 minutes, then shift remaining 90%
- `ECSCanary10Percent15Minutes` — send 10% for 15 minutes, then shift remaining 90%
- `ECSAllAtOnce` — shift all traffic immediately to the new Task Set

**Optional Test Listener:** Define a second **ALB Test Listener** to validate the Green version before traffic is shifted to production.

#### ECS Deployment Hooks

Deployment hooks are **Lambda functions** (not shell scripts like EC2) and execute once per deployment. Mark which steps are automated and which require your Lambda function:

1. **BeforeInstall** *(optional Lambda hook)* → **Install** *(automated)* → **AfterInstall** *(optional Lambda hook)*
2. **AllowTestTraffic** *(optional Lambda hook)* → **AfterAllowTestTraffic** *(optional Lambda hook)* — test listener receives traffic here
3. **BeforeAllowTraffic** *(optional Lambda hook)* → **AllowTraffic** *(automated)* → **AfterAllowTraffic** *(optional Lambda hook)* — production traffic shifts here


### Deployment to Lambda

CodeDeploy manages traffic shifting between Lambda function versions using an **alias**, enabling controlled rollouts without modifying the function itself.

#### Prerequisites

- New Lambda function **version already published** (not `$LATEST`)
- `appspec.yml` prepared referencing the new version
- CodeDeploy **agent is not required** (Lambda handles execution directly)

#### appspec.yml Structure

Key fields CodeDeploy reads to perform the deployment:

- **Name** — the Lambda function name to update
- **Alias** — the alias whose routing config CodeDeploy will shift (e.g., `live`)
- **CurrentVersion** — the version number currently receiving 100% traffic
- **TargetVersion** — the newly published version to shift traffic toward

#### Deployment Strategy

Lambda supports **Blue/Green only**. CodeDeploy shifts traffic on the **alias** — the alias acts as the stable endpoint and CodeDeploy adjusts its routing weights between `CurrentVersion` (Blue) and `TargetVersion` (Green). Clients invoking the alias automatically hit the new version as traffic shifts.

#### Traffic Shifting Strategies (Lambda)

Shift traffic to the new **function version** using one of five predefined strategies:

- `LambdaLinear10PercentEvery1Minute` — shift in 10% increments every 1 minute
- `LambdaLinear10PercentEvery10Minutes` — shift in 10% increments every 10 minutes
- `LambdaCanary10Percent5Minutes` — send 10% for 5 minutes, then shift remaining 90%
- `LambdaCanary10Percent30Minutes` — send 10% for 30 minutes, then shift remaining 90%
- `LambdaAllAtOnce` — shift all traffic immediately to the new function version

#### End-to-End Pipeline Flow

**Developer push** → **CodeCommit** triggers **CodePipeline**

**CodeBuild stage:**
- Deploys the new Lambda function version and publishes it
- Generates `appspec.yml` referencing `CurrentVersion` and `TargetVersion` and stores it in **S3**

**CodeDeploy stage** (using S3 artifact as input):
- Updates the **Lambda alias** routing config using Blue/Green strategy
- Shifts traffic from old (Blue) to new (Green) version according to the selected strategy
- Rolls back automatically if pre/post-shift health checks fail

#### Lambda Deployment Hooks

Hooks are **Lambda functions** (not shell scripts) and execute once per deployment:

1. **BeforeAllowTraffic** *(optional Lambda hook)* — pre-shift validation; invoke the new version directly to confirm it is healthy before any traffic is shifted
2. **AllowTraffic** *(automated)* — CodeDeploy updates the alias routing config to shift traffic to the new version
3. **AfterAllowTraffic** *(optional Lambda hook)* — post-shift validation; confirm the new version is behaving correctly under live traffic


### Redeployment & Rollbacks

A rollback redeploys the last known good revision as a **new deployment** — not a restore of prior state.

**Trigger types:**
- **Automatic** — deployment failure
- **Automatic** — CloudWatch Alarm threshold breach
- **Manual** — user-initiated
- **Disabled** — rollbacks turned off for the deployment group

#### Troubleshooting Common Issues

**1. InvalidSignatureException — Time Mismatch**
- **Symptom:** `InvalidSignatureException – Signature expired: [time] is now earlier than [time]`
- **Cause:** EC2 instance system clock is out of sync with the CodeDeploy signature timestamp
- **Resolution:** Synchronize the instance clock using `chronyc` or `ntpd`

**2. Lifecycle Events Skipped / Health Constraint Errors (EC2/On-Premises)**
- **Symptom:**
  ```
  The overall deployment failed because too many individual instances failed deployment
  Too few healthy instances are available for deployment
  Some instances in your deployment group are experiencing problems (Error code: HEALTH_CONSTRAINTS)
  ```
- **Common causes:**
  - CodeDeploy Agent not installed, not running, or unable to reach the CodeDeploy service endpoint
  - IAM service role or instance profile missing required CodeDeploy permissions
  - HTTP proxy not configured on the agent (`proxy_uri` setting missing)
  - System clock/date mismatch on the instance
- **Note:** Deployment failures can be intercepted and responded to via **EventBridge** rules

**3. Auto Scaling Group Scale-Out During Active Deployment**
- **Symptom:** New instances launched during an in-progress deployment receive the most-recently-deployed revision instead of the revision currently being deployed — resulting in mixed versions across the ASG
- **Resolution:** CodeDeploy automatically triggers a **follow-on deployment** to bring outdated instances into sync with the target revision

**4. AllowTraffic Failure in Blue/Green Deployment — No Error Logged**
- **Symptom:** The `AllowTraffic` lifecycle event fails without any error message appearing in CodeDeploy logs
- **Cause:** Misconfigured Elastic Load Balancer health checks
- **Resolution:** Review and correct the ELB health check configuration (target group settings, protocol, path, timeout, etc.)


## CodeArtifact
Secure, scalable artifact management service for software packages — provides a managed alternative to self-hosted solutions like JFrog Artifactory or Sonatype Nexus.

**Supported package managers:** Maven, Gradle, npm, Yarn, Twine (PyPI), pip, NuGet

**How it works:**
- Developers and CodeBuild retrieve dependencies from CodeArtifact instead of pulling directly from public registries
- CodeArtifact acts as a **proxy and cache** for upstream public repositories — packages fetched from upstream are cached locally for faster retrieval
- All artifacts are stored within your **VPC**, providing network isolation and security
- Designated **approvers and tech leads** can publish and curate packages before releasing them to development teams — enabling centralized governance

### Domains
A **domain** is a logical grouping that spans multiple repositories and multiple AWS accounts, enabling centralized package management and governance.

**Key benefits:**
- **Deduplicated storage** — a package asset is stored only once within a domain, even if it appears in multiple repositories, reducing storage costs
- **Fast copying** — pulling packages from upstream repositories updates only metadata records, not the physical asset, enabling near-instant availability
- **Policy scope** — apply a single authorization policy across all repositories in a domain, controlling which accounts can access repos and who can configure external connections

### Upstream Repositories
**Repository chaining:**
- A CodeArtifact repository can have up to **10** upstream CodeArtifact repositories
- Allows package manager clients to access packages across multiple repositories through a **single endpoint**
- Simplifies dependency resolution by searching upstream chain automatically

**Package retention:**
- Packages found in an upstream repository are **retained by reference** in the downstream repository
- Retained packages remain permanently available, even if the upstream repository is modified or deleted — ensuring stability
- Intermediate repositories in a chain do **not** retain packages; only the repository that originally requested the package keeps a reference

#### External Connections
**Purpose:**
- Links a CodeArtifact repository to a **public registry** (npmjs.com, PyPI, Maven Central, NuGet.org)
- Enables CodeArtifact to act as a proxy for packages from public package managers

**Constraints:**
- Each repository supports **at most one** external connection
- To proxy multiple public registries, create a separate repository for each registry and chain them as upstream repositories

### Resource Policy
**Overview:**
- Used to grant **cross-account access** to CodeArtifact repositories
- Controls which external AWS principals can access a specific repository

**Access granularity:**
- A principal is granted access to **all packages** in the repository or **none** — no per-package level access control
- Permission is binary at the repository level

### EventBridge Integration
**Event publishing:**
- CodeArtifact publishes events to **EventBridge** when a package version is **created, modified, or deleted**
- Enables real-time detection of changes in your artifact repositories

**Downstream targets:**
- Lambda functions, Step Functions, SNS topics, SQS queues, CodePipeline executions

**Example use case:**
- Automatically trigger a pipeline to rebuild and redeploy an application whenever a critical dependency receives a security patch — ensuring rapid vulnerability remediation

---

## SAM & CDK Pipelines

### AWS SAM (Serverless Application Model)
SAM is a framework for defining serverless applications (Lambda, API Gateway, DynamoDB, etc.) using shorthand CloudFormation syntax. SAM templates are automatically transformed into standard CloudFormation templates before deployment.

**Key commands:**
- `sam build` — compiles the application and its dependencies locally into a `.aws-sam/` build directory
- `sam deploy --guided` — packages build artifacts to S3 and deploys the application via CloudFormation; prompts for configuration on first run and saves answers to `samconfig.toml` for subsequent deployments

**Integration with CodePipeline:**
- A CodeBuild action in the deploy stage executes `sam build && sam deploy`, using IAM service role permissions to create or update the underlying CloudFormation stack

### CDK Pipelines (CDK construct library)
The `pipelines.CodePipeline` construct defines a **self-mutating** CodePipeline entirely in CDK code — no manual AWS Console configuration required.

**Key capabilities:**

**Self-mutation:**
- The pipeline automatically updates itself when CDK code changes
- A `SelfMutate` stage runs before application deployment stages, applying any pipeline infrastructure changes before deploying application updates

**Deployment environments:**
- Pipeline stages map to distinct deployment environments (dev, staging, prod)
- Each stage supports **pre/post steps** for additional control:
  - `ShellStep` — run automated tests or validation scripts
  - `ManualApprovalStep` — add human approval gates before proceeding

**Waves:**
- Enable parallel deployment across multiple AWS accounts and regions within a single pipeline stage
- Useful when deploying to many environments simultaneously (e.g., multi-region active-active deployments)

**Cross-account and cross-region bootstrapping:**
- CDK Pipelines handles bootstrapping automatically — run `cdk bootstrap --trust <tooling-account-id>` in target accounts once
- Eliminates manual bootstrap steps for multi-account/multi-region setups

**Example pipeline flow:**
```
CodeCommit → CodePipeline → Synth (cdk synth) → SelfMutate → Deploy Dev → (Manual Approval) → Deploy Prod
```

---

## Cross-Account & Multi-Region Pipelines

### Cross-Account Deployment Pattern
**Architecture:**
1. Pipeline infrastructure lives in a **tooling account**; deployment targets are **workload accounts** (separate accounts for dev, staging, prod)
2. The S3 artifact bucket must be **accessible from all target accounts** — grant cross-account bucket policies and KMS key policies explicitly
3. Each target account requires a **cross-account IAM role** that the tooling account's pipeline execution role can assume
4. CodePipeline assumes the cross-account role to execute CodeDeploy and CloudFormation actions in target accounts

**IAM configuration:**
- **Tooling account pipeline role** — permissions to `sts:AssumeRole` the cross-account roles in each target account
- **Target account cross-account role** — permissions for CodeDeploy operations, CloudFormation stack management, S3 artifact read, and KMS key decryption
- **KMS key policy** — allow target account principals to use the key for decrypting artifacts retrieved from the shared S3 bucket

### Multi-Region Pipelines
**Native support:**
- CodePipeline supports **multi-region actions** natively — specify a `Region` property on each action
- Enables parallel deployment to multiple regions within a single pipeline stage

**Artifact management:**
- Requires a separate **artifact store (S3 bucket) per region**
- CodePipeline automatically replicates artifacts across regions, eliminating manual cross-region transfers

**Use cases:**
- Deploy a CloudFormation stack to `us-east-1` and `eu-west-1` in parallel within the same stage
- Implement active-active deployments across multiple regions
- Support regional rollout strategies for gradual global deployment


## CodeGuru
Machine learning-powered service providing two distinct capabilities: automated code reviews at development time and runtime application performance recommendations.

### CodeGuru Reviewer
Static code analysis tool that identifies critical issues, security vulnerabilities, and hard-to-find bugs using machine learning trained on millions of code reviews across open-source projects and Amazon's internal repositories.

**Detection capabilities:**
- Common coding best practices violations
- Resource leaks (unclosed database connections, file handles, streams)
- Security vulnerabilities and input validation gaps
- Concurrency issues and race conditions

**Supported languages:** Java, Python

**Integrations:** GitHub, Bitbucket, CodeCommit — code reviews are triggered automatically on pull requests and provide inline feedback

#### Secrets Detector
A specialized feature within CodeGuru Reviewer that uses machine learning to identify hardcoded secrets (API keys, passwords, authentication tokens) embedded in source code, configuration files, and documentation.

**Remediation:**
- Suggests moving detected secrets to **AWS Secrets Manager** for secure centralized management
- Helps prevent accidental exposure of sensitive credentials in version control

### CodeGuru Profiler
Continuous application profiler that analyzes runtime behavior to identify performance bottlenecks and inefficiencies.

**Key capabilities:**
- Identify and eliminate code inefficiencies (e.g., logging routines consuming excessive CPU)
- Improve overall application performance and reduce compute costs
- Heap summary — visualize object allocation patterns over time
- Anomaly detection — automatically flag unexpected changes in application performance profiles

**Supported environments:**
- Applications running on AWS (EC2, Lambda, ECS, etc.)
- On-premises applications with network connectivity

#### Instrumentation for Lambda Functions
Two approaches to enable CodeGuru Profiler on Lambda:

**Function decorator (code change required):**
- Add `@with_lambda_profiler` decorator to your handler function
- Include `codeguru_profiler_agent` as a dependency in the function's deployment package (`.zip`)

**Lambda Layers (no code change required):**
- Attach the CodeGuru Profiler agent as a Lambda Layer
- Automatically instruments the function without modifying source code



## EC2 Image Builder
Fully automated service for creating, maintaining, validating, and testing EC2 AMIs and container images. Offered at no additional charge — you only pay for underlying resources consumed (EC2 instances, S3 storage, etc.).

**Key capabilities:**
- Schedule AMI builds on a recurring cadence (weekly, monthly, on-demand)
- Trigger builds automatically when packages or base images receive updates
- Publish AMIs to multiple AWS regions and across accounts
- Validate AMIs through automated testing before distribution

### Build Pipeline Workflow
```
EC2 Image Builder → Builder EC2 Instance (components applied, software customized)
                  → New AMI created
                  → Test EC2 Instance (validation tests run)
                  → AMI Distributed to target regions/accounts
```

### Integration with CodePipeline
**End-to-end AMI bake pipeline:**

1. **Stage 1 — Build Code:** CodeCommit → CodeBuild (compile application)
2. **Stage 2 — Build AMI:** CloudFormation → EC2 Image Builder → new AMI created
3. **Stage 3 — Deploy:** CloudFormation → rolling update ASG with new AMI → instances replaced

### Sharing Images Across Accounts
Use **AWS RAM (Resource Access Manager)** to share AMI images, image recipes, and image components across AWS accounts or an entire AWS Organization.

### Tracking the Latest AMI in Pipelines
Use **SSM Parameter Store** to maintain a pointer to the current AMI ID — enables automated pipelines to always reference the latest secure AMI (e.g., weekly security patch builds).

**Workflow:**
1. EC2 Image Builder completes a build and generates a new AMI
2. Sends **SNS notification** → Lambda function is triggered
3. Lambda function stores the new `ami-id` in **SSM Parameter Store** under a well-known parameter name
4. CloudFormation stacks and other consumers reference the parameter as a **dynamic SSM reference**
5. Parameter value resolves automatically to the latest AMI ID, enabling hands-off updates

## AWS Amplify
Fully managed platform for building and deploying scalable full-stack web and mobile applications. Streamlines the entire development lifecycle with built-in support for authentication, storage (S3), APIs (AppSync, REST), CI/CD, real-time PubSub, analytics, AI/ML predictions, and monitoring — eliminating the need to manage backend infrastructure manually.

### Architecture & Workflow

**Two main components:**
- **Amplify Console** — continuous delivery platform for frontend deployments (source detection, automatic builds, global CDN distribution via **CloudFront**)
- **Amplify Backend** (formerly AWS Amplify CLI) — backend infrastructure as code; provisions and manages AWS services (API Gateway, AppSync, Cognito, DynamoDB, Lambda, S3, etc.) without writing CloudFormation directly

### Source & Build Configuration
- **Connect source repositories** — GitHub, CodeCommit, Bitbucket, GitLab, or manual ZIP upload
- **Automatic build detection** — Amplify inspects the repository and automatically detects build settings (framework type: React, Next.js, Vue, Angular, etc.; build command; output directory)
- **Build customization** — override detected settings or provide a custom `amplify.yml` configuration file for non-standard builds
- **Continuous deployment** — push-to-deploy workflow; connected branches trigger automatic builds and deployments

### Environment & Branch Management
- **Per-branch environments** — each connected branch (main, develop, feature branches, etc.) gets its own independent deployment with its own backend resources
- **Feature branch deployments** — pull request previews and temporary environments for testing — each branch maintains separate authentication credentials, database instances, and API endpoints
- **Environment variables** — manage sensitive configuration per-branch (API keys, database credentials); encrypted at rest and in transit

### Backend Configuration
- **Backend infrastructure as code** — define backend resources (authentication flows, GraphQL schemas, database models, storage policies, serverless functions) using the Amplify CLI or the Amplify Studio visual interface
- **GraphQL API (AppSync)** — automatically generates resolvers and database access patterns from schema definitions
- **Authentication (Cognito)** — integrated user sign-up, sign-in, MFA, OAuth with social providers
- **Real-time data synchronization** — PubSub messaging and real-time database subscriptions for collaborative features

### Deployment & Delivery
- **Atomic deployments** — each frontend build is versioned and immutable; rollback to previous versions via the Amplify Console
- **Global CDN distribution** — content served through **CloudFront** for low-latency delivery
- **Custom domains** — domain configuration with automatic HTTPS via AWS Certificate Manager
- **Access controls** — optional HTTP basic auth or AWS IAM authentication for preview deployments

### Cost Considerations
- **Frontend hosting** — storage and data transfer via CloudFront (standard AWS CDN pricing)
- **Backend services** — pay for consumed services (AppSync API calls, Cognito MAUs, Lambda invocations, DynamoDB capacity, S3 storage)
- **Multi-environment overhead** — feature branch environments add cost; each branch has its own backend resources; useful for development but consider cleanup strategy for short-lived branches