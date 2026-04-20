## AWS Config

AWS Config provides auditing and compliance recording capabilities by tracking the configuration of your AWS resources and recording changes over time. AWS Config answers critical compliance and security questions such as: Is there unrestricted SSH access to any security groups? Do my S3 buckets have public access? How has my Application Load Balancer configuration changed over time? By maintaining a detailed history of resource configurations, AWS Config enables you to assess compliance status, investigate configuration changes, and meet regulatory audit requirements.

AWS Config is a per-region service. Configuration data can be aggregated across regions and accounts, and the data can be stored in Amazon S3 for long-term analysis using Amazon Athena. AWS Config can send notifications to Amazon SNS for configuration changes, allowing you to integrate with notification systems and downstream workflows.

### Config Rules

AWS Config Rules evaluate resource compliance against predefined or custom rules. AWS manages a set of predefined rules that can be applied immediately without additional configuration. For requirements not covered by managed rules, you can define custom rules as AWS Lambda functions. Rules can be evaluated either on a scheduled interval (for example, every 6 hours) or triggered immediately when a resource configuration changes. It is important to understand that Config Rules evaluate and report on compliance status but do not prevent non-compliant actions—they provide visibility and assessment only.

AWS Config does not offer a free tier. Pricing is approximately **$0.003** per configuration item recorded per region and **$0.001** per configuration evaluation per region.

### Resource

AWS Config provides compliance and configuration history views for each resource:

- **Compliance timeline**: View the compliance status of a resource over time, showing when the resource became compliant or non-compliant.
- **Configuration timeline**: View the detailed configuration of a resource over time, tracking how settings have changed since the resource was created.
- **CloudTrail API calls**: View the API calls made to the resource via AWS CloudTrail, showing who made changes and when.

### Remediations

AWS Config can automate remediation of non-compliant resources through AWS Systems Manager (SSM) Automation documents (also called runbooks). Remediations execute automatically when a resource is detected as non-compliant, without human intervention. You can use AWS-managed runbooks provided by AWS or create custom automation documents to implement remediation logic. Custom automation documents can invoke AWS Lambda functions to perform complex remediation actions beyond what the runbook itself can do.

You can configure remediation retries to handle cases where a resource remains non-compliant after the initial automatic remediation attempt. If a resource is still non-compliant on retry, you can configure additional retry attempts with optional backoff delays.

### Notifications

Use Amazon EventBridge to trigger notifications and automated workflows when resources are detected as non-compliant. AWS Config can also send configuration changes and compliance state notifications to Amazon SNS topics. When sending to SNS, you can filter events either by applying SNS filtering policies on the topic itself or by implementing client-side filtering logic in your application.

### Configuration Recorder

The Configuration Recorder stores configurations of resources as configuration items. A configuration item is a point-in-time view of the attributes of a resource, created whenever a change to the resource is detected. You can set up a custom Configuration Recorder to record only the resource types you specify, reducing storage and focusing compliance tracking on relevant resources. The Configuration Recorder must be created before AWS Config can track resources.

You can enable the Configuration Recorder using AWS CloudFormation StackSets and attach a Service Control Policy (SCP) at the organization level to prevent users from disabling or deleting AWS Config.

### Aggregators

An aggregator account aggregates rules, resources, and configuration data from other accounts. When using AWS Organizations, no individual authorization is required per source account. Rules are created in each individual source AWS account and then centralized in the aggregator account for unified compliance monitoring. Use AWS CloudFormation StackSets to deploy rules to multiple target accounts efficiently.

### Conformance Pack

A Conformance Pack is a collection of AWS Config rules and remediations deployed all at once—similar in concept to an AWS CloudFormation template. Conformance Packs are authored in YAML format and can be deployed to a single AWS account and region or across an entire AWS Organization. AWS provides prebuilt packs for common compliance frameworks, and you can also create your own to match your organization's requirements.

Conformance Packs can include custom rules backed by AWS Lambda functions to evaluate whether resources are compliant with your organization's standards. Parameters can be passed in via the `parameters` section to make a pack more flexible and reusable across different configurations. You can designate a delegated administrator account to deploy Conformance Packs organization-wide, centralizing management and ensuring consistent policy application.

Conformance Packs combine parameters with Config rules, allowing you to template compliance requirements and apply them at scale.

#### CI/CD

A typical CI/CD workflow for Conformance Packs is as follows: a developer checks in a Conformance Pack definition to AWS CodeCommit, AWS CodeBuild builds and prepares the pack, and the Conformance Pack is then deployed across multiple accounts using AWS CloudFormation.

### Organizational Rules

An Organizational Rule is an AWS Config rule managed across all accounts within an AWS Organization. The rule is deployed to all member accounts, enabling consistent compliance evaluation across your entire organization.

Organizational Rules differ from Conformance Packs in several key ways:

- **Scope**: Organizational Rules apply only within AWS Organizations, whereas Conformance Packs can be deployed standalone or organization-wide.
- **Granularity**: An Organizational Rule is a single rule that evaluates resources, whereas a Conformance Pack is a bundle of multiple rules and remediations.
- **Compliance Management**: Organizational Rules have compliance managed at the organization level, providing centralized visibility and control across all member accounts.


## AWS Organizations

AWS Organizations allows you to manage multiple AWS accounts from a central location. The organization has a hierarchical structure in which the root contains Organizational Units (OUs). The organization includes a **management account** that is used for administrative purposes. Within each OU, you can create additional OUs containing multiple member accounts—OUs can nest all the way down the hierarchy to give you fine-grained organizational structure.

### Organization Account Access Role

When you create a member account through the AWS Organizations API, an IAM role is automatically created in the new account. The management account assumes that role to perform administrative actions within the member account. The role can be assumed by IAM users in the management account. However, if you invite an existing AWS account to join the organization, you must create the Organization Account Access Role manually in that account.

### Multi Account Strategies

You can organize accounts by department, cost center, environment, or based on regulatory restrictions enforced through Service Control Policies (SCPs). A multi-account strategy provides several benefits: better resource isolation, per-account service quotas and limits, and the ability to designate an isolated account dedicated to centralized logging.

A multi-account architecture presents a design tradeoff compared to a single-account architecture with multiple VPCs. Use tagging standards across accounts for accurate billing attribution and cost allocation. Enable AWS CloudTrail on all accounts and send logs to a centralized Amazon S3 bucket for audit compliance. Similarly, forward Amazon CloudWatch Logs from all accounts to a central logging account. Implement a consistent account-level security strategy across all accounts in the organization.

### Feature Modes

AWS Organizations supports two feature modes:

- **Consolidated Billing**: Provides a single payment method across all member accounts and offers pricing benefits such as volume discounts and tiered pricing.
- **All Features**: Includes Consolidated Billing plus the ability to apply Service Control Policies (SCPs). When enabling All Features, invited accounts must approve the transition. Once All Features is enabled, you cannot switch back to Consolidated Billing mode. You can apply SCPs to prevent member accounts from leaving the organization.

### Reserved Instances

For billing purposes, Consolidated Billing treats all accounts in the organization as a single entity. All accounts in the organization receive the hourly cost benefit of Reserved Instances (RIs) purchased by any other account in the organization. The payer account of the organization can disable Reserved Instance discount sharing and Savings Plan discount sharing for specific accounts. When sharing is disabled, Reserved Instance and Savings Plan discounts are not shared between those accounts. To enable discount sharing, the organization's payer account must turn sharing on.

### Moving Accounts

To move a member account to a different organization, send an invitation to the member account from the destination organization. The member account owner accepts the invitation, and the account is successfully transferred.

### Service Control Policies

Service Control Policies define an allow-list or deny-list of AWS IAM actions that can be performed in member accounts. SCPs are applied at the Organizational Unit (OU) level or at the individual account level. SCPs do not apply to the management account, which always has full permissions. SCPs apply to all IAM users and roles in a target account, including the root user, but do not affect service-linked roles. SCPs use an explicit allow model—permissions must be explicitly allowed from the root down through each OU in the direct path, and nothing is allowed by default. Common use cases for SCPs include restricting access to certain AWS services and enforcing compliance requirements such as PCI DSS.

## Control Tower

AWS Control Tower helps you set up and govern a secure, compliant multi-account AWS environment based on AWS best practices. It automates the setup of an AWS environment in a few clicks, provides ongoing policy management through Guardrails, and detects and remediates policy violations automatically. Compliance monitoring is provided through an interactive dashboard that gives you visibility across your entire organization. Control Tower runs on top of AWS Organizations and automatically sets up and configures the organization for you.

### Account Factory

Account Factory automates account provisioning and deployment. It enables you to create pre-approved baseline configurations and deployment options for new accounts, allowing teams to provision accounts consistently without manual setup. Account Factory uses AWS Service Catalog to provide a self-service experience for account creation.

### Events

When a new account is created through Account Factory, a new event is published to Amazon EventBridge. This event can trigger downstream automation, such as invoking an AWS Lambda function or sending a notification to an Amazon SNS topic, enabling you to customize account setup workflows.

### Migrate Account to Control Tower

To migrate an existing account into AWS Control Tower, follow these steps:

1. **Define the destination Organizational Unit (OU)** — Decide which OU in your landing zone structure the account should belong to.
2. **Move the account to an unregistered OU** — If the account is not yet part of AWS Organizations, invite it to join. Once it is a member account in the organization, move it to a temporary "unregistered" OU (an OU that is not yet managed by Control Tower).
3. **Create the required IAM role** — Create an IAM role in the migrating account that Control Tower needs to manage it. This role is similar to the Organization Account Access Role that Control Tower uses to assume control over managed accounts.
4. **Enable AWS Config and evaluate conformance** — Control Tower automatically enables AWS Config on the account and evaluates the account's compliance status using Conformance Packs. This step ensures the account meets the baseline security and compliance requirements defined in your landing zone.
5. **Move account to destination OU** — Once the account is compliant, move it from the unregistered OU to its intended destination OU within the Control Tower landing zone. The account is now fully managed by Control Tower.

### Customization

Account Factory Customization (AFC) enables you to customize resources deployed to new and existing accounts managed by Control Tower. AFC uses custom blueprints, which are defined as AWS Service Catalog products and backed by AWS CloudFormation templates. Blueprints are stored in a dedicated hub account—AWS recommends not using the management account as the hub to maintain separation of concerns. AWS and AWS Partners provide pre-defined blueprints that you can use immediately. An important constraint is that only one blueprint can be deployed per account.

### Guardrails

Guardrails detect and remediate policy violations to enforce ongoing governance. There are two types of guardrails:

- **Preventive guardrails** are implemented using Service Control Policies (SCPs) to prevent actions that would violate your governance requirements.
- **Detective guardrails** are implemented using AWS Config rules to identify and report on resources that are non-compliant with your policies.

#### Mandatory

Mandatory guardrails are automatically enabled and enforced by Control Tower on all accounts in your landing zone.

#### Strongly Recommended

Strongly Recommended guardrails are based on AWS best practices and are optional. You can enable them if they align with your organization's governance requirements.

#### Elective

Elective guardrails are commonly used by enterprises and are optional. You can enable them as needed based on your specific compliance and security requirements.

### Landing Zone

A Landing Zone is an automatically provisioned, secure, and compliant multi-account AWS environment based on AWS best practices. The Landing Zone consists of the following components:

- **AWS Organizations**: The organizational structure that contains your accounts and defines your multi-account hierarchy.
- **Account Factory**: The mechanism for provisioning new accounts with pre-approved baselines.
- **Organizational Units (OUs)**: The structural divisions within AWS Organizations that organize accounts into logical groups.
- **Service Control Policies (SCPs)**: Policies applied at the OU or account level to enforce governance constraints.
- **IAM Identity Center**: The centralized identity management service for your multi-account environment.
- **Guardrails**: The detective and preventive policies that enforce compliance and governance rules.

### Customizations for AWS Control Tower (CfCT)

Customizations for AWS Control Tower (CfCT) is a GitOps-style customization framework provided by AWS that enables you to deploy custom resources and policies across your landing zone and all managed accounts. Unlike Account Factory Customization (AFC), which is used to deploy resources to individual accounts at the time of account creation, CfCT is designed for organization-wide customization of the landing zone itself.

The CfCT workflow operates as follows:

1. **Source control and packaging** — You store AWS CloudFormation templates and Service Control Policies in Amazon S3 or AWS CodeCommit. An AWS CodePipeline pipeline is triggered when these files are updated.
2. **Build and prepare** — The pipeline invokes AWS CodeBuild to package the artifacts (CloudFormation templates and SCPs) into a deployable format.
3. **Orchestrate deployment** — CodePipeline then invokes an AWS Step Functions state machine that orchestrates the deployment across all managed accounts in your organization.
4. **Deploy as CloudFormation StackSets** — The CloudFormation templates are deployed as AWS CloudFormation StackSets across target managed accounts, ensuring consistent resource provisioning at scale.
5. **Automate new account onboarding** — When a new account is created in the organization, Control Tower emits an event to Amazon EventBridge. EventBridge intercepts this event and sends a notification to an Amazon SNS topic, which triggers an AWS Lambda function. The Lambda function invokes the CodePipeline pipeline, automatically deploying all CfCT customizations to the new account.

This design ensures that all new accounts automatically receive the same customizations as existing accounts, maintaining consistency across your organization without manual intervention.

### Config Integration

AWS Config is used to implement detective guardrails within Control Tower. When you deploy Control Tower, it automatically enables AWS Config in all enabled AWS regions across your managed accounts. Configuration history and snapshots are delivered to a central account for unified compliance monitoring and auditing. The deployment of AWS Config uses AWS CloudFormation StackSets, AWS Config aggregators for centralized rule management, and AWS CloudTrail for centralized logging of API calls and configuration changes.

#### Conformance Packs

Conformance Packs are collections of AWS Config compliance rules and remediations that are deployed together as a unit. You can create Conformance Packs containing multiple Config rules to enforce your organization's compliance standards. These packs can be deployed to individual accounts or across your entire AWS Organization. When a new account is created in the organization, an Amazon EventBridge event fires, which sends a notification to an AWS Lambda function. The Lambda function uses AWS CloudFormation StackSets to enforce the appropriate Conformance Packs in the new account, ensuring immediate compliance with your organization's standards.

## IAM Identity Center

AWS IAM Identity Center is the successor to AWS Single Sign-On (AWS SSO) and provides centralized single sign-on access across multiple AWS accounts and business applications. The service enables users to log in once and gain access to AWS accounts within an AWS Organization, business cloud applications (such as Salesforce, Box, and Microsoft 365), SAML 2.0-enabled applications, and Amazon EC2 Windows instances. For exam purposes, the most likely focus is on single sign-on access across multiple AWS accounts.

### Identity Sources

The identity provider—the repository where user credentials and identity information are stored—can be configured in two ways:

- **Built-in identity store**: A native identity store within IAM Identity Center where you can define users and groups directly, similar to AWS IAM user management.
- **External third-party identity providers**: Integration with Active Directory (on-premises or cloud-hosted), OneLogin, Okta, or other identity management services that manage users and groups externally.

### Login Flow

When a user accesses the IAM Identity Center login portal, they enter their username and password. Upon successful authentication, they are redirected to the IAM Identity Center user portal, which displays all AWS accounts and applications they are authorized to access. Selecting an AWS account from the portal logs the user directly into that account's management console without requiring additional authentication credentials. This seamless login experience eliminates the need for users to remember or enter separate credentials for each account.

### Permission Sets

A permission set is a collection of AWS IAM policies that defines what resources and actions a user or group can access in AWS. Permission sets bridge the gap between identity management in IAM Identity Center and access control in AWS accounts. When a permission set is assigned to a user or group for a specific AWS account, IAM Identity Center automatically creates a corresponding IAM role in that account. When the user logs in and accesses the account, they assume this role and receive the permissions defined in the permission set.

#### Multi-Account Access Example

To illustrate how permission sets enable centralized multi-account access management, consider an organization with development and production accounts. You can create a developers group containing multiple team members, then create an "admin access" permission set granting full administrative privileges. By assigning this permission set to the developers group for all development accounts, all members of the group automatically gain admin access to those accounts. Simultaneously, you can create a separate "read-only access" permission set and assign it to the same developers group for production accounts, granting them read-only visibility without modification capabilities. This approach centralizes permission management—you define permissions once and apply them across many accounts and users.

### Multi-Account Access

IAM Identity Center is designed to manage access across many accounts in your organization from a single place. Permission sets can be applied to multiple accounts and multiple groups simultaneously, enabling you to control access at scale. The same permission set definition can be reused across development, staging, and production environments, reducing duplication and ensuring consistent policy application. When a user logs in and accesses an account, they automatically assume the IAM role created from the corresponding permission set for that account.

### Application Assignments

IAM Identity Center can assign users and groups to business cloud applications and SAML 2.0-enabled custom applications. When you assign a user or group to an application, IAM Identity Center automatically provides the required integration URLs, X.509 certificates, and Service Provider (SP) metadata needed for federated authentication. This eliminates manual configuration and streamlines the process of integrating third-party applications with your identity provider.

### Attribute-Based Access Control (ABAC)

IAM Identity Center supports fine-grained, attribute-based access control through user attributes stored in the identity store. You can assign attributes to users—such as cost center, job title (junior, senior), locale, or region—and then write permission set policies that reference these attributes using conditions like `aws:PrincipalTag/...`. Attributes are mapped as key/value pairs, enabling flexible condition evaluation at runtime. This approach allows you to define IAM permission sets once and control user access by modifying their underlying attributes, rather than updating policies repeatedly. For example, you can assign a user a `region` attribute and gate Amazon EC2 access to specific regions through a single policy that checks the attribute value at runtime. ABAC can be used in IAM Identity Center permission sets as well as in resource-based policies, providing consistent attribute-based access control across your infrastructure. This pattern scales well in organizations where access requirements are driven by user metadata that changes independently of policy definitions.

### External Identity Providers

IAM Identity Center can authenticate users from external identity providers (IdPs) instead of, or in addition to, its built-in identity store. This capability allows organizations to reuse their existing corporate identity systems, reducing the administrative burden of managing credentials in multiple places.

#### SAML 2.0

SAML 2.0 federation authenticates identities from an external IdP. When a user accesses the AWS access portal, they sign in using their corporate identity credentials. Supported IdPs include Okta, Microsoft Azure AD (also known as Microsoft Entra ID), Active Directory, and OneLogin. It is important to note that SAML 2.0 does not provide a way to query the IdP to learn about users and groups in the external system. Instead, you must manually create users and groups inside IAM Identity Center that are identical to those in the external IdP, either through manual configuration or scripted duplication.

#### System for Cross-domain Identity Management (SCIM)

SCIM provides automatic provisioning of user identities from an external IdP into IAM Identity Center. SCIM must be supported by the external IdP for this integration to work. SCIM is designed as a complement to SAML 2.0. While SAML 2.0 handles authentication, SCIM handles automatic user and group synchronization. The two are typically used together to provide both secure authentication and automatic identity provisioning.

### Multi-Factor Authentication

IAM Identity Center enforces multi-factor authentication (MFA) to enhance security by requiring users to provide a second factor of authentication in addition to their password. You can configure MFA enforcement at the IAM Identity Center level to apply to all users accessing the service.

MFA enforcement in IAM Identity Center supports two primary modes:

- **Always-on**: Users are required to authenticate with MFA on every sign-in, regardless of context or location. This is the most restrictive and secure option.
- **Context-aware**: MFA is required only when the sign-in context changes—for example, when a user logs in from a new device, a new geographic location, or an unusual access pattern. This balances security with user experience by reducing authentication friction for routine access.

Additionally, IAM Identity Center can prompt users to register an MFA device during their first sign-in, ensuring that MFA credentials are set up before accessing AWS resources. Supported MFA methods include authenticator applications, FIDO2 security keys, and built-in platform authenticators on modern devices.

## AWS WAF (Web Application Firewall)

AWS WAF is a web application firewall that protects web applications from common layer seven (HTTP/HTTPS) exploits and attacks. WAF can be deployed on **Application Load Balancers** to protect backend services within a region, on **API Gateway** to protect REST and HTTP APIs at the regional or edge level, on **CloudFront** distributions to provide global protection across all CloudFront edge locations, and on **AWS AppSync** to protect GraphQL APIs. A common deployment pattern uses CloudFront in front of an Application Load Balancer serving EC2 instances or custom origins, allowing you to apply WAF rules globally through CloudFront. WAF is not used for DDoS protection—that is the role of AWS Shield. WAF specifically protects against layer seven application attacks.

### Web ACLs and Rules

A **Web Access Control List (Web ACL)** is the primary configuration artifact in WAF and defines a set of rules that are evaluated sequentially against incoming requests. If a request matches a rule, the specified action is taken; otherwise, evaluation continues to the next rule. Web ACLs can include rules that filter by IP address, evaluate HTTP headers or request body content, match against URL strings, and detect common attack patterns such as SQL injection and cross-site scripting (XSS). Rules can enforce size constraints on requests to reject oversized payloads, use geomatch to block or allow traffic from specific countries, and employ rate-based rules to count occurrences of events and trigger an action when a threshold is exceeded.

Rule actions determine how matching requests are handled:

- **Allow**: The request proceeds to the protected resource.
- **Block**: The request is rejected and does not reach the protected resource.
- **Count**: The rule is evaluated and matched requests are logged, but traffic is allowed to proceed. This mode is useful for detecting false positives before enabling a rule in block mode.
- **CAPTCHA**: A CAPTCHA challenge is presented to the client to verify human interaction.
- **Silent challenge**: A silent challenge is sent to differentiate bot traffic from human users without presenting a visible challenge.

### Managed Rules

AWS WAF provides over 190 pre-built managed rules that are maintained by AWS or third-party sellers on the AWS Marketplace. These rules can be applied immediately without requiring you to define custom logic, significantly accelerating WAF deployment. Managed rules are organized into four categories:

**Baseline rule groups** provide general protection from common threats. These include the Common Rule Set, which protects against widespread attacks, and the Admin Protection rule set, which safeguards administrative interfaces.

**Use-case-specific rule groups** target protection requirements for particular application technologies. These include rule sets for SQL injection protection, Windows application protection, PHP application protection, and WordPress protection.

**IP reputation rule groups** block requests based on the source IP address. The **Amazon IP Reputation List** is a critical managed rule that identifies IPs trusted by AWS and those flagged for malicious activity, allowing you to block spammers and known bad actors quickly. The Anonymous IP List rule group identifies and blocks requests from anonymization services and proxies.

**Bot Control rule group**, specifically the AWS Managed Rules Bot Control Rule Set, evaluates incoming traffic to identify and manage bot requests, separating legitimate automated traffic from malicious bots.

### Logging

WAF can send logs to multiple destinations depending on your traffic volume and analysis requirements. CloudWatch Logs accepts WAF logs with a maximum throughput of 5 MB per second. Amazon S3 accepts WAF logs, which are delivered every 5 minutes. For high-volume logging requirements, WAF can send logs directly to **Kinesis Data Firehose**, which imposes only the throughput limits of Firehose itself and is suitable for very high-traffic deployments. From Kinesis Data Firehose, logs can be delivered to Amazon S3, Amazon Redshift, Amazon OpenSearch, or other supported destinations, enabling flexible downstream analysis and long-term storage.

### Securing CloudFront Origins with WAF

A common solution architecture uses WAF to ensure that only traffic originating from CloudFront reaches protected Application Load Balancers, preventing direct access to the load balancer by malicious users or competitors. This pattern consists of several steps:

First, deploy a Web ACL on CloudFront to provide initial layer seven protection at the edge. While this alone does not prevent direct access to the origin, it adds a layer of security for clients connecting through CloudFront.

Second, configure a custom HTTP header on CloudFront—for example, `X-Origin-Verify` with a secret value—that CloudFront adds to every origin request. This header is invisible to end users and cannot be replicated by clients accessing the origin directly.

Third, deploy a Web ACL on the Application Load Balancer that allows only requests containing the specific custom header and secret value. All other requests, including those sent by users accessing the load balancer URL directly, are blocked by WAF.

Fourth, rotate the custom header secret periodically to maintain security. This can be automated by storing the secret in AWS Secrets Manager, configuring automatic rotation, and using an AWS Lambda function to update both the CloudFront custom header value and the WAF rule on the Application Load Balancer whenever rotation occurs.

## AWS Shield

AWS Shield provides **DDoS protection** for your AWS infrastructure. Shield Standard is automatically enabled for all AWS customers at no additional cost and provides protection against common layer three and four DDoS attacks. **Shield Advanced** is an optional paid service that adds additional protections: a dedicated **Shield Response Team (SRT)** available 24/7 to assist during DDoS events, advanced attack diagnostics and detailed reporting, and the automatic creation of WAF rules in response to detected DDoS patterns. Shield Advanced is recommended for organizations frequently targeted by DDoS attacks or running mission-critical applications that require the highest level of protection. AWS Firewall Manager can deploy Shield Advanced policy across all accounts in an AWS Organization.

## AWS Firewall Manager

AWS Firewall Manager is a centralized firewall management service that allows you to define and apply firewall security policies across all AWS accounts within an AWS Organization. Policies are created at the region level and are automatically applied to all accounts in the organization. A key benefit of Firewall Manager is automatic remediation: when a new resource (such as an Application Load Balancer) is created in any account, Firewall Manager automatically applies the relevant security policies to that resource without manual intervention. This ensures consistent security posture across your entire organization without requiring per-resource configuration.

### Security Policy Types

WAF policies allow you to define Web ACL rules that are applied to Application Load Balancers, API Gateways, and CloudFront distributions across all accounts. When creating a WAF policy, you can choose to audit only (view compliance without taking action) or auto-remediate (automatically attach the Web ACL to existing resources that do not already have the policy applied).

Shield Advanced policies enable Shield Advanced protection across all accounts in the organization. Like WAF policies, you can choose an audit-only approach to assess impact or auto-remediate to enable Shield Advanced everywhere.

Security group policies allow you to standardize security groups across EC2 instances, Application Load Balancers, and Elastic Network Interfaces in all accounts. You can audit security group rules to identify non-compliant configurations, audit security group usage to find unused or redundant security groups, and optionally clean up unused groups by deleting them.

Network Firewall policies manage AWS Network Firewall deployments across accounts. You can choose a distributed architecture where each VPC has its own firewall endpoint, or a centralized architecture where all firewall endpoints are managed in a central VPC. You also have the option to import existing Network Firewall configurations into Firewall Manager for centralized management.

Route 53 Resolver DNS Firewall policies centrally manage DNS Firewall rule group associations with VPCs across all accounts in the organization.

### WAF vs. Shield vs. Firewall Manager

These three services work together to provide comprehensive protection. **WAF** is used to define Web ACL rules for specific resources and provides layer seven application protection. When you need one-time protection for a single Application Load Balancer or CloudFront distribution, WAF is the appropriate choice. **Shield** and **Shield Advanced** provide DDoS protection at layers three and four. **Firewall Manager** is the organizational layer that centralizes management of WAF rules, Shield Advanced protection, security groups, and network firewalls across all accounts. If you need to apply consistent WAF rules across multiple accounts, accelerate configuration, and automatically protect new resources, use Firewall Manager to manage your WAF policies organization-wide. Firewall Manager can also deploy Shield Advanced policy across all accounts, enabling DDoS protection at scale without configuring each account individually.

## Amazon GuardDuty

Amazon GuardDuty is an intelligent threat detection service that uses **machine learning algorithms**, **anomaly detection**, and **third-party threat intelligence** to identify potential security threats in your AWS environment. GuardDuty is enabled with a single click and includes a 30-day free trial. It requires no software installation or infrastructure changes and operates on a continuous basis once enabled. Important to note: GuardDuty is a detection service that identifies findings (potential security issues or malicious events) but does not prevent attacks—it provides visibility for response and automation.

### Input Data Sources

GuardDuty analyzes multiple data streams to detect threats. The core data sources are always enabled once GuardDuty is active and require no additional configuration:

- **CloudTrail logs** — Both management events (such as creating a VPC subnet or modifying an S3 bucket policy) and data events (such as `GetObject`, `ListObjects`, and `DeleteObject` operations on S3 resources) are continuously monitored for unusual API calls, unauthorized deployments, and suspicious access patterns.
- **VPC Flow Logs** — Traffic flow data is analyzed to detect unusual internet traffic, communications with suspicious IP addresses, and anomalous network behavior within your VPCs.
- **DNS logs** — Requests are monitored to identify EC2 instances sending encoded data through DNS queries, a common signal of compromised instances attempting to exfiltrate data.

Additionally, GuardDuty supports optional data sources that you can enable to extend its detection capabilities. These include **S3 Protection** for analyzing S3 data events, **EKS Protection** for monitoring Kubernetes audit logs and runtime behavior, **Malware Protection** for analyzing EBS volumes, **RDS and Aurora login events**, and **Lambda network activity**. GuardDuty reads these data streams independently—enabling GuardDuty does not require you to separately enable CloudTrail logging, VPC Flow Logs, or other underlying services if they are not already active.

### Findings

A **finding** represents a potential security issue or detected malicious event discovered by GuardDuty. Each finding has a **severity** value (ranging from approximately 0.1 to 8 or higher) that is categorized into Low, Medium, or High severity levels. Findings use a structured naming convention: **Threat Purpose** indicates the primary goal of the threat, **Resource Type** shows the affected resource (such as EC2 or S3), **Threat Family Name** describes the category of threat, **Detection Mechanism** explains how the finding was detected, and **Artifact** identifies the specific evidence (such as a DNS request or IP address).

GuardDuty supports **sample findings**, a feature that generates synthetic findings to allow you to test automated response workflows and verify that your EventBridge rules, Lambda functions, and notification systems function correctly. Sample findings can be generated for any finding type without creating actual security alerts.

Finding types vary by resource and threat category. For **EC2 instances**, common findings include unauthorized SSH access attempts (SSH brute force) and cryptocurrency mining activities. For **IAM**, findings include CloudTrail logging being disabled and root credential usage—both critical security indicators. For **Kubernetes**, findings include credential access from malicious IP addresses, anomalous login behavior, and suspicious file activities. For **S3**, findings include detection of public access changes and penetration testing attempts. GuardDuty includes a **dedicated cryptocurrency attack detection category**, which is designed to identify instances performing cryptocurrency mining or participating in mining pools—this is relevant for the exam as it represents a significant cloud security threat.

### EventBridge Integration

Every finding detected by GuardDuty is automatically published as an event to **Amazon EventBridge**. From EventBridge, you can create rules that trigger automated responses such as invoking an AWS Lambda function, sending notifications to an Amazon SNS topic, posting to Slack, or invoking any other EventBridge-supported target. In multi-account environments using a GuardDuty delegated administrator or administrator account, findings are published to both the member account and the administrator account, enabling centralized monitoring and response across your organization.

### Multi-Account Management

GuardDuty supports multi-account management through **AWS Organizations**. The GuardDuty administrator account can send invitations to member accounts (or use direct Organizations integration), add and remove member accounts, and manage GuardDuty settings across all members. The administrator account has centralized visibility and control over all findings, suppression rules, trusted IP lists, and threat lists across member accounts.

A key feature is the **delegated administrator** pattern: a non-management account within your AWS Organization can be designated as the GuardDuty administrator, separating GuardDuty administration from overall organization administration. This allows you to delegate GuardDuty security operations to a specialized security team without granting those users broad organization-wide administrative privileges.

### Trusted IP and Threat IP Lists

GuardDuty supports two types of IP lists, applicable only to public IP addresses:

A **trusted IP list** contains CIDR ranges you explicitly trust. GuardDuty suppresses findings for traffic originating from these IP ranges, useful when your internal security team is performing penetration testing or developers need to test behavior without triggering alerts.

A **threat IP list** contains known malicious IP addresses and CIDR ranges. GuardDuty generates findings when traffic is detected from these IPs, helping you identify attacks from known bad actors. Threat lists can come from third-party threat intelligence providers or be custom lists maintained by your organization.

In multi-account setups, only the GuardDuty administrator account can manage these lists, ensuring consistent threat intelligence across all member accounts.

### Automated Response Architectures

GuardDuty findings integrate with EventBridge to enable automated security responses. Two concrete architectures illustrate this capability:

**EC2 SSH Brute Force Remediation** — An EC2 instance generates VPC Flow Logs showing repeated SSH connection attempts on port 22. GuardDuty detects an SSH brute force finding and publishes it to EventBridge. An EventBridge rule triggers two actions: first, an SNS notification informs your security operations team; second, a Lambda function evaluates the finding and takes remediation action. For instances behind a Web Application Firewall, the Lambda function creates or updates a WAF Web ACL rule to block the source IP. For instances without WAF, the Lambda function updates the VPC Network ACL to deny traffic from the malicious source IP, preventing further connection attempts.

**Back-Door Detection with AWS Network Firewall** — An EC2 instance exhibits command-and-control (C2) communication or back-door access patterns visible in VPC Flow Logs. GuardDuty detects a back-door finding and publishes it to EventBridge. An EventBridge rule invokes an AWS Step Functions state machine that orchestrates a multi-step remediation workflow. The workflow includes Lambda functions that check whether the attacker's IP is already in your malicious-IP database; if not, they add it. A subsequent Lambda function calls the AWS Network Firewall API to add the IP to the rule group attached to the firewall policy applied to your firewall endpoint. The EC2 instance's traffic now routes through the firewall subnet where the suspicious IP is blocked. The workflow publishes success and failure notifications to separate SNS topics; if remediation fails, a manual review may be required before further action.

### Enabling GuardDuty via CloudFormation

Direct enablement of GuardDuty through AWS CloudFormation can fail if GuardDuty is already enabled in the target account, causing the stack deployment to fail. A practical solution uses a **CloudFormation custom resource** backed by an AWS Lambda function. The Lambda function checks whether GuardDuty is already enabled in the account and only invokes the enablement API if necessary, preventing idempotency errors. This custom resource can then be deployed across an entire AWS Organization using AWS CloudFormation StackSets, ensuring consistent GuardDuty enablement at scale without manual per-account coordination.

## Amazon Detective

Amazon Detective provides **root-cause analysis** for security findings detected by GuardDuty, Amazon Macie, AWS Security Hub, and other AWS security services. When security services identify potential threats or suspicious activities, determining the origin and scope of the incident often requires manual correlation of data from multiple sources—VPC Flow Logs, CloudTrail events, GuardDuty findings, and other logs. This process is complex and time-consuming. Detective automates investigation by using **machine learning** and **graph analysis** to automatically collect and process events from VPC Flow Logs, CloudTrail, and GuardDuty findings. The service creates a unified view of all relevant data and provides visualizations with context, allowing security teams to quickly isolate the root cause of a security issue rather than spending hours manually correlating disparate data sources.

## Amazon Inspector

Amazon Inspector is an automated, continuous security assessment service that scans AWS infrastructure for vulnerabilities and unintended network accessibility. Inspector evaluates three categories of resources:

- **EC2 instances** — Inspector scans running instances to identify known operating system and package vulnerabilities against the CVE (Common Vulnerabilities and Exposures) database. It also evaluates network reachability to detect unintended network accessibility. Inspector requires that the AWS Systems Manager Agent (SSM Agent) be installed and operational on the instance.
- **Container images in Amazon ECR** — As Docker images and container images are pushed to Amazon ECR, Inspector automatically scans them against known vulnerabilities.
- **AWS Lambda functions** — When Lambda functions are deployed, Inspector scans the function code and package dependencies for software vulnerabilities.

Once Inspector analysis is complete, findings are automatically reported to **AWS Security Hub** and published as events to **Amazon EventBridge**. This integration enables centralized visibility into vulnerabilities across your environment and allows you to trigger automated response workflows.

### What Inspector Evaluates

Inspector performs continuous vulnerability assessment using multiple data sources and detection mechanisms:

- **Package vulnerabilities** — Inspector analyzes the CVE database to identify known vulnerabilities in installed packages and dependencies across EC2 instances, container images, and Lambda functions.
- **Network reachability** — For EC2 instances, Inspector evaluates VPC configuration and network settings to detect unintended network accessibility.
- **Continuous re-scanning** — When the CVE database is updated, Inspector automatically re-scans all managed resources to identify newly discovered vulnerabilities.
- **Risk scoring** — Each finding is assigned a **risk score** to aid in prioritization and remediation efforts.

### Enabling Inspector for EC2

For Amazon Inspector to assess an EC2 instance, three prerequisites must be met:

1. **SSM Agent installation** — The AWS Systems Manager Agent must be installed and running on the instance. Inspector leverages Systems Manager behind the scenes to collect inventory and system information from the instance.
2. **Systems Manager managed instance status** — The instance must be registered as a managed instance in AWS Systems Manager. This is achieved either by attaching an IAM role with Systems Manager permissions to the instance, or by enabling the **Default Host Management Configuration** feature, which automatically registers the instance as managed.
3. **Connectivity to Systems Manager endpoints** — The instance must be able to reach AWS Systems Manager endpoints, either the public endpoint or a private endpoint via AWS PrivateLink.

Once these requirements are satisfied and the instance is managed by Systems Manager, Inspector analyzes the inventory data collected by the SSM Agent and produces findings along with remediation recommendations.

## Migrating an EC2 Instance Between Availability Zones

To move an EC2 instance from one availability zone to another within the same region, create an **Amazon Machine Image (AMI)** from the source instance and launch a new instance from that AMI into a subnet in the target availability zone. The new instance inherits the source instance's file system, data, and installed applications because the AMI captures the complete state of the original instance. This is the standard and reliable pattern for moving EC2 instances across availability zones without data loss.

## Cross-Account AMI Sharing and Copying

An **Amazon Machine Image (AMI)** can be shared across AWS accounts without transferring ownership. The source account retains ownership of the shared AMI. The sharing and copying behavior varies depending on whether the underlying EBS volume is encrypted and what encryption method is used.

### Sharing Unencrypted AMIs

An unencrypted AMI can be shared directly with other AWS accounts. You can share it with specific AWS account IDs, an entire AWS Organization, specific Organizational Units (OUs), or make it public for any AWS account to use. The recipient account can immediately launch EC2 instances from the shared AMI without any additional configuration or permission requirements.

### Sharing Encrypted AMIs

AMIs backed by encrypted EBS volumes can be shared only when encrypted with a **customer-managed key (CMK)**. AWS-managed keys cannot be shared across accounts. When sharing an encrypted AMI, the source account must do two things: share the AMI itself, and grant the target account specific permissions on the customer-managed key used to encrypt the underlying snapshots. These key permissions must include the ability to describe the key, decrypt data, re-encrypt with different keys, and generate data keys. Without these KMS permissions, the target account cannot decrypt the snapshot and therefore cannot use the AMI.

### Cross-Account AMI Copying

A recipient account can copy a shared AMI to create a new AMI owned by the target account itself. This approach is more involved than simple sharing and provides greater control:

- The source account must grant the target account **read permissions on the EBS snapshots** that back the AMI.
- The target account issues a `CopyImage` API call to copy the source AMI into its own account.
- During the copy operation, the target account can optionally **re-encrypt the snapshot** with its own customer-managed key. For example, a snapshot encrypted with CMK-A in the source account can be decrypted using the shared CMK permissions and re-encrypted with CMK-B in the target account. This results in an AMI fully owned and encrypted by the target account's own key, giving the target account complete control over the encryption and lifecycle of the image.

### AMI Permissions Configuration

AMI sharing and copying permissions are configured through the AMI's permissions settings (accessed via **Actions → Edit AMI permissions** in the AWS Management Console). The available options are:

- **Private** — The default setting. The AMI is visible only to the owning account.
- **Public** — Any AWS account can discover and use the AMI. Public sharing is only available for unencrypted AMIs. Use caution when making AMIs public, as they become discoverable by any AWS user worldwide.
- **Shared with specific principals** — Share with individual AWS account IDs, an entire AWS Organization ARN, or specific OU ARNs. This provides granular control over who can access the AMI.
- **Create Volume permission** — When sharing, this option grants the recipient permission to create EBS volumes from the snapshots backing the AMI, allowing the target account to fully utilize the shared AMI.

## AWS Secrets Manager

AWS Secrets Manager is a managed service purpose-built for securely storing, managing, and retrieving secrets such as database credentials, API keys, authentication tokens, and other sensitive data. Unlike **AWS Systems Manager Parameter Store**, which is a general-purpose configuration management service, Secrets Manager is specifically designed for secret lifecycle management and offers enforced rotation, automatic secret generation, and deep integration with AWS database services.

Secrets Manager provides several capabilities that make it essential for credential management at scale. **Enforced rotation** allows you to configure automatic secret rotation at a specified interval, ensuring that credentials are refreshed regularly without manual intervention. During rotation, **automatic secret generation** can be triggered by invoking an AWS Lambda function that produces the new secret value, enabling credential rotation without requiring human interaction or application downtime. Secrets are encrypted at rest using **AWS Key Management Service (KMS)**, either with AWS-managed keys or customer-managed keys, providing strong encryption for sensitive data.

A particularly powerful feature is **native integration** with AWS data services. Secrets Manager integrates directly with Amazon RDS (MySQL, PostgreSQL, SQL Server), Amazon Aurora, Amazon Redshift, Amazon DocumentDB, and other databases. When a secret is stored for a supported database, Secrets Manager can automatically rotate credentials by invoking a rotation Lambda function, and applications can retrieve credentials directly from Secrets Manager without storing them in code or configuration files. For the DevOps Professional exam, any question mentioning credential storage or rotation for RDS, Aurora, or other database services should immediately suggest Secrets Manager as the solution.

### Multi-Region Secrets

Secrets Manager supports replicating a secret from a primary region to one or more secondary regions. Replicas are automatically kept in sync with the primary secret, ensuring consistency across geographic boundaries. This capability enables several critical use cases.

**Disaster recovery** is a primary motivation for multi-region replication. If the primary region becomes impaired or unavailable, a replica secret can be promoted to a standalone secret in the secondary region, allowing applications and data services in that region to continue accessing credentials without interruption. **Multi-region applications** can benefit from local replica access, where application instances in each region retrieve the secret from the nearby regional replica, reducing latency and avoiding cross-region API calls. Additionally, when an RDS database is configured with **cross-region read replicas**, the corresponding secret is automatically available in the secondary region, allowing replica database instances to be accessed using credentials stored in that region's local replica secret.

## AWS Trusted Advisor

AWS Trusted Advisor is an account-wide assessment service that provides high-level recommendations across your AWS environment. Trusted Advisor requires no installation, configuration, or agent deployment—it analyzes your account continuously once enabled. The service evaluates your infrastructure and provides recommendations grouped into six categories: **cost optimization** (identifying underutilized resources and unnecessary spending), **performance** (detecting resource configuration that may impact application responsiveness), **security** (identifying configurations that expose resources or credentials to unintended access), **fault tolerance** (ensuring your architecture can withstand failures), **service limits** (monitoring usage against AWS account quotas), and **operational excellence** (best practices for managing and monitoring AWS resources).

### Check Tiers and Support Plans

Trusted Advisor provides a **core set of checks** available to all AWS accounts at no additional cost. Core checks focus primarily on critical security and service quota items. These include checks for public S3 bucket access, security group rules allowing unrestricted access to specific ports, public EBS snapshots, public RDS snapshots, and root account usage—all foundational security concerns.

The **full set of checks** includes all core checks plus comprehensive coverage of cost optimization, performance, fault tolerance, and operational excellence recommendations. Access to the full check suite requires a **Business or Enterprise Support plan**. When a Business or Enterprise Support plan is active, you also gain **programmatic access** to Trusted Advisor through the **AWS Support API**, enabling you to integrate Trusted Advisor recommendations into your own applications, dashboards, and automation workflows.

### EventBridge Integration

Trusted Advisor emits events to **Amazon EventBridge** when specific conditions are detected, enabling automated remediation and notification workflows. Common integration patterns include the following.

**Low-utilization EC2 instance detection** leverages Trusted Advisor's continuous monitoring of instance CPU usage over a 14-day period. When average CPU utilization is extremely low, indicating that the instance is likely not actively used and is incurring unnecessary cost, Trusted Advisor publishes an event to EventBridge. An EventBridge rule can route this event to an Amazon SNS topic for manual review and notification, or invoke an AWS Lambda function to automatically remediate the finding—for example, by stopping the instance, terminating it, or right-sizing it to a smaller instance type.

**Service quota monitoring** tracks usage across approximately 50+ AWS service quotas, providing real-time visibility into how close your account is approaching service limits. Common monitored quotas include the EC2 on-demand instance limit, the number of AWS Lambda concurrent executions, and DynamoDB read and write capacity. As usage approaches thresholds—typically at 80% and 100% of the limit—Trusted Advisor publishes events to EventBridge. EventBridge rules can route these events to alerting systems, trigger Lambda-based autoscaling workflows (such as increasing DynamoDB capacity or requesting limit increases), or send notifications to your operations team for manual intervention. Note that Trusted Advisor does not monitor all service quotas; the **AWS Service Quotas console** is the authoritative source for complete quota visibility and should be consulted for a comprehensive quota management strategy.
