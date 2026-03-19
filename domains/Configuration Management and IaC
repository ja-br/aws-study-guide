## CloudFormation

Declarative infrastructure-as-code service for AWS. You declare what resources you want, and CloudFormation automatically determines dependencies and creates them in the correct order. CloudFormation handles all orchestration; you do not need to manage creation sequencing manually.

**Example declarations:**
- Security group
- Two EC2 instances using that security group
- Two Elastic IPs for the instances
- S3 bucket
- Elastic Load Balancer in front of instances

CloudFormation reads these declarations, builds a dependency graph, and provisions resources in the correct sequence automatically.

**Template example:**
```yaml
AWSTemplateFormatVersion: "2010-09-09"
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-example-bucket
```

**Infrastructure Composer:** A visual drag-and-drop canvas in the AWS console that auto-generates CloudFormation YAML. You can see the architecture as a diagram while editing the template; changes in the canvas update the YAML and vice versa.

### Benefits

#### Infrastructure as Code

No resources are manually created, eliminating configuration drift and human error. The template is the single source of truth for all infrastructure.

Code can be version controlled, providing a full audit trail of every infrastructure change via Git history. Rolling back to any previous state is straightforward.

Infrastructure changes are reviewed through code, just like application code. Pull requests gate all infrastructure changes.

#### Productivity

Ability to destroy and recreate infrastructure on demand, useful for ephemeral environments (dev/test). Delete the stack at night, recreate from the same template in the morning for zero idle cost.

Automated diagram generation from templates. Infrastructure Composer renders a live architecture diagram directly from the template.

Declarative syntax eliminates the need to figure out ordering and orchestration. CloudFormation builds a dependency graph from resource references; if EC2 references a security group, CloudFormation creates the security group first automatically.

#### Separation of Concern

Create many stacks for different applications and layers. Each stack is independently deployable and deletable; a failure in one stack does not affect others.

Common pattern: network stack exports VPC and subnet IDs; application stack imports them via Outputs.

#### Cost

Every resource within a stack is automatically tagged with the stack identifier, allowing per-stack cost tracking in Cost Explorer.

CloudFormation console provides an "Estimate cost" feature that feeds the template into the AWS Pricing Calculator.

Savings strategy: automate deletion and recreation of templates as needed. Works well for stateless infrastructure (compute, load balancers). Only safe when there is no persistent state that would be lost on deletion.

### How It Works

Templates are uploaded to S3 and referenced in CloudFormation. S3 upload is required for templates over 51 KB; smaller templates can be pasted directly in the console.

To update a template, upload a new version instead of editing the previous one. S3 maintains a history of template versions; each deployment references a new S3 object key, allowing easy rollback to prior versions.

Stacks are identified by name. Deleting a stack deletes every resource created by it. Individual resources can be protected using `DeletionPolicy: Retain` or `Snapshot` to survive stack deletion.

**Deployment flow:** template upload → S3 → reference in CloudFormation → create stack

### Stack

A stack is a collection of AWS resources and the unit of deployment. All resources defined in one template are managed together as a single stack. A stack is uniquely identified by its name and AWS region.

### How to deploy

#### Manual

Edit templates in Infrastructure Composer or a code editor (Infrastructure Composer provides a visual canvas; any text editor works for YAML or JSON).

Use the CloudFormation console to input parameters and review settings before deploying.

#### Automated

Edit templates in YAML (YAML is preferred over JSON for readability and inline comment support).

Use the AWS CLI to deploy templates, or integrate with a continuous deployment tool. `aws cloudformation deploy` packages and deploys in one command; CD tools (CodePipeline, GitHub Actions, etc.) call this as a pipeline step.

### Building Blocks

#### Components

**AWSTemplateFormatVersion** — Optional. Declares the template format version. The only valid value is `"2010-09-09"`.

**Description** — Optional free-text string shown in the AWS console. Describe the stack's purpose here.

**Resources** — Mandatory. The only required section. Each entry has a logical ID, a `Type` (e.g., `AWS::S3::Bucket`), and `Properties`.

**Parameters** — Runtime inputs provided at deploy time. Support types, AllowedValues, Default, and Description fields.

**Mappings** — Static key-value lookup tables embedded in the template. For example, map region names to AMI IDs. Values are looked up at deploy time using `Fn::FindInMap`.

**Outputs** — Values the stack exports after creation (e.g., bucket name, ALB DNS name). Visible in the console and importable by other stacks via `Fn::ImportValue`.

**Conditionals** — Boolean expressions evaluated at deploy time. Used to include or exclude resources and properties based on parameter values (e.g., only create a bastion host in non-prod environments).

### Helpers

#### References

**`Ref`** — Returns the default identifier (usually physical ID) of a resource or the value of a parameter. YAML shorthand: `!Ref LogicalId`.

**`Fn::GetAtt`** — Returns a specific attribute of a resource rather than its default ID. Example: `!GetAtt MyBucket.Arn` returns the bucket ARN.

#### Functions

**`Fn::Join` / `!Join`** — Joins a list of values with a delimiter. Example: `!Join ["-", ["my", "bucket"]]` → `"my-bucket"`.

**`Fn::Sub` / `!Sub`** — Substitutes `${VarName}` placeholders in a string with parameter or resource values. Cleaner than Join for complex strings.

**`Fn::FindInMap`** — Looks up a value from a Mappings table by up to three keys.

**`Fn::Select`** — Returns one item from a list by zero-based index.

**`Fn::ImportValue`** — Reads an Output exported by another stack. Used for cross-stack references.

**`Fn::If`** — Returns one of two values based on a Condition. Example: use a larger instance type in production and a smaller one in development.

**`Fn::Base64`** — Encodes a string to Base64. Most common use is encoding EC2 UserData scripts.



### YAML

CloudFormation templates are typically written in YAML (preferred over JSON for its readability and native comment support). JSON is also supported but requires different syntax for the same functionality.

YAML is structured around key-value pairs, which map names to values. Values can be scalars (strings, numbers, booleans), nested objects (indented key-value pairs), or arrays (lists prefixed with hyphens). YAML supports multiline strings for longer content, making it ideal for embedding scripts or large text blocks. Comments in YAML begin with `#` and extend to the end of the line.

**Example:**
```yaml
AWSTemplateFormatVersion: "2010-09-09"
Description: Example stack with nested objects and arrays
Parameters:
  InstanceType:
    Type: String
    Default: t3.micro
    Description: EC2 instance type
Resources:
  MySecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow SSH and HTTP
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0
          Description: SSH access
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
  UserDataScript: |
    #!/bin/bash
    yum update -y
    yum install -y httpd
    # Start the web server
    systemctl start httpd
Outputs:
  GroupId:
    Value: !Ref MySecurityGroup
    Description: Security group ID
```


### Resources

The `Resources` section is the core of every CloudFormation template and is the only **mandatory** section. This section declares all AWS components that CloudFormation will create, update, and manage on your behalf.

#### Purpose

Resources represent the actual AWS infrastructure components you want to deploy—EC2 instances, S3 buckets, databases, networking components, IAM roles, security groups, and more. Each resource declaration specifies:
- What type of AWS component it is
- How it should be configured (properties)
- How it relates to other resources in the template

CloudFormation automatically orchestrates the creation, updates, and deletion of resources. You do not manually determine sequencing; CloudFormation analyzes resource references and builds a dependency graph to determine the correct order of operations.

#### Resource Types

AWS provides **over 700 resource types** across all services. Each resource type is uniquely identified by a three-part naming convention:

```
service-provider::service-name::data-type-name
```

**Examples:**
- `AWS::S3::Bucket` — S3 bucket
- `AWS::EC2::Instance` — EC2 instance
- `AWS::RDS::DBInstance` — RDS database instance
- `AWS::Lambda::Function` — Lambda function
- `AWS::IAM::Role` — IAM role

#### How Resources Work

**Declaration and Referencing**
- Resources are declared in the `Resources` section with a logical ID (user-defined name) and a resource type
- Resources can reference each other by their logical IDs
- When a resource references another, CloudFormation automatically creates a dependency

**Automatic Orchestration**
- CloudFormation analyzes all resource references and builds a dependency graph
- Resources are created in the correct order automatically (no manual sequencing required)
- If resource A references resource B, CloudFormation creates B first, then A

**Lifecycle Management**
- CloudFormation manages creation of all declared resources
- On stack updates, CloudFormation intelligently determines which resources need to be updated or replaced
- On stack deletion, CloudFormation removes all resources (unless protected with `DeletionPolicy: Retain`)

#### Resource Declaration Example

```yaml
Resources:
  MySecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow HTTP and HTTPS
      VpcId: vpc-12345678
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0

  MyWebInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t3.micro
      SecurityGroupIds:
        - !Ref MySecurityGroup  # Reference to the security group above
```

In this example, `MyWebInstance` references `MySecurityGroup` using `!Ref`. CloudFormation will create the security group first, then the EC2 instance.

#### Documentation Reference

For the complete list of all supported resource types and their properties, see the official AWS CloudFormation Resource Type Reference:

[AWS CloudFormation Resource Type Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-template-resource-type-ref.html)

For details on the Resources section syntax, required fields, and optional attributes like `DependsOn`, `DeletionPolicy`, and `Condition`, see:

[Resources Section Structure](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/resources-section-structure.html)


### Parameters

Parameters enable runtime inputs to CloudFormation templates, allowing template reuse across different environments and configurations. Rather than hardcoding values, you define parameters that users provide at deploy time, eliminating the need to edit and re-upload the template for each deployment.

Parameters are not simple strings—CloudFormation supports type validation, constraints, and defaults, preventing configuration errors before deployment even begins.

#### When to Use Parameters

Use parameters for any CloudFormation resource configuration that is likely to change between deployments or environments:

- **Environment-specific values** — Instance type, database size, or network CIDR ranges that differ between dev, staging, and production
- **Reusable templates** — Enable the same template to be deployed multiple times with different values without modification
- **User input** — Avoid requiring template edits; let operators provide values through the console or CLI at deploy time

#### Parameter Types

CloudFormation supports the following parameter types:

- **`String`** — Plain text value
- **`Number`** — Integer or floating-point number
- **`List<Number>`** — Comma-delimited list of numbers
- **`CommaDelimitedList`** — Comma-separated strings
- **AWS-Specific Types** — Predefined types for AWS resources (e.g., `AWS::EC2::Image::Id` for AMI IDs, `AWS::EC2::VPC::Id` for VPC IDs, `AWS::EC2::SecurityGroup::Id` for security group IDs)
- **`List<AWS::EC2::Image::Id>`** — List of AWS-specific types
- **SSM Parameter Types** — References to values stored in AWS Systems Manager Parameter Store

#### Parameter Properties and Constraints

Each parameter can include the following properties to enforce validation and provide guidance:

**Core Properties:**
- **`Type`** — Mandatory. The parameter type (String, Number, etc.)
- **`Description`** — Recommended. Free-text description displayed in the console to guide users
- **`Default`** — Optional default value used if the user does not provide one

**Validation Properties:**
- **`AllowedValues`** — Array of acceptable values. Parameter must match one of these values
- **`AllowedPattern`** — Regular expression. Parameter must match this pattern (String types only)
- **`MinLength` / `MaxLength`** — Minimum and maximum string length (String types only)
- **`MinValue` / `MaxValue`** — Minimum and maximum numeric values (Number types only)

**Special Properties:**
- **`ConstraintDescription`** — Text shown when validation fails, guiding users on acceptable values
- **`NoEcho`** — Boolean flag. When `true`, parameter value is masked in the console and CloudFormation outputs (useful for passwords and secrets)

#### Parameter Example

```yaml
Parameters:
  InstanceType:
    Type: String
    Default: t3.micro
    AllowedValues:
      - t3.micro
      - t3.small
      - t3.medium
    Description: EC2 instance type for the web server
    ConstraintDescription: Must be a valid EC2 instance type (t3.micro, t3.small, or t3.medium)

  DatabasePassword:
    Type: String
    NoEcho: true
    MinLength: 8
    MaxLength: 41
    Description: Master password for the RDS database
    ConstraintDescription: Password must be between 8 and 41 characters

  EnvironmentName:
    Type: String
    Default: development
    Description: Environment name (used for resource naming and tagging)
```

#### Referencing Parameters

Parameters are referenced within templates using the `Ref` function or its YAML shorthand `!Ref`:

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType  # References the InstanceType parameter
      ImageId: ami-0c55b159cbfafe1f0
```

The `Ref` function can also reference other resources and pseudo-parameters. Avoid using the same name for both parameters and resources to prevent confusion.

#### Pseudo-Parameters

CloudFormation provides a set of built-in pseudo-parameters available in every template without explicit declaration. These parameters are enabled by default and can be referenced at any time:

- **`AWS::AccountId`** — AWS account ID of the stack
- **`AWS::Region`** — AWS region where the stack is being deployed
- **`AWS::StackId`** — Unique identifier of the stack (includes account, region, and stack name)
- **`AWS::StackName`** — User-provided name of the stack
- **`AWS::NotificationARNs`** — List of SNS topic ARNs specified for stack notifications
- **`AWS::NoValue`** — Special pseudo-parameter that returns no value; useful in conditionals to exclude properties

**Example:**

```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "my-bucket-${AWS::Region}-${AWS::AccountId}"
```

In this example, `AWS::Region` and `AWS::AccountId` are substituted to create a globally unique bucket name.

### Mappings

Mappings are static key-value lookup tables embedded in CloudFormation templates. They store fixed data that is hardcoded within the template and used to differentiate configurations based on region, environment, AMI type, or other variables. Mappings are ideal when you know all possible values in advance and can derive them from a known variable (like region or environment).

#### Purpose

Mappings allow you to:
- Store region-specific values (e.g., AMI IDs that differ by region)
- Create environment-specific configurations without parameters
- Implement lookup logic directly in the template
- Reduce template complexity when values are predetermined and finite

#### How Mappings Work

Mappings are declared in the `Mappings` section of a template with a nested structure of keys and values. Lookup is performed at deploy time using the `Fn::FindInMap` function with up to three keys: the mapping name, top-level key, and second-level key.

#### Mapping Example

```yaml
Mappings:
  RegionToAMI:
    us-east-1:
      AMI: ami-0c55b159cbfafe1f0
      InstanceType: t3.micro
    us-west-2:
      AMI: ami-0d70546e43a148d8d
      InstanceType: t3.small
    eu-west-1:
      AMI: ami-0dad359ff462124ca
      InstanceType: t3.micro

  EnvironmentConfig:
    development:
      MinSize: 1
      MaxSize: 2
    production:
      MinSize: 2
      MaxSize: 10
```

#### Accessing Mappings

Use the `Fn::FindInMap` function or its YAML shorthand `!FindInMap` to retrieve values from a mapping:

```
!FindInMap [MapName, TopLevelKey, SecondLevelKey]
```

**Example:**

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !FindInMap [RegionToAMI, !Ref "AWS::Region", AMI]
      InstanceType: !FindInMap [RegionToAMI, !Ref "AWS::Region", InstanceType]
```

In this example, the AMI ID and instance type are retrieved based on the current AWS region.

#### Mappings vs. Parameters

**Use Mappings when:**
- You know all possible values in advance
- Values can be derived from a known variable (region, availability zone, AWS account, environment)
- You want to enforce stricter control over template usage and prevent arbitrary user input
- The lookup logic should be internal to the template

**Use Parameters when:**
- Values are user-specific and not predetermined
- Users need flexibility to provide custom values at deploy time
- You want to support reuse of the template with external input
- Values may change between deployments in ways that cannot be predicted in advance

Mappings are safer for enforcing consistency; parameters are more flexible for user-driven customization.

### Outputs

Outputs declare optional values that a CloudFormation stack exports after creation. These values can be accessed in the AWS console, retrieved via the CLI, or imported into other stacks for cross-stack collaboration. Outputs are useful for sharing resource identifiers (bucket names, instance IPs, security group IDs, VPC IDs, etc.) between stacks without hardcoding values.

#### Purpose

Outputs solve the cross-stack reference problem. Instead of manually copying resource identifiers from one stack to another, you declare an output in one stack and import it in another using the `Fn::ImportValue` function. This creates a dependency: a stack that exports a value cannot be deleted while other stacks are importing from it.

#### Export and Import Flow

**Stack 1 (Network Stack):**
- Creates resources (VPC, subnets, security groups)
- Declares outputs for these resources
- Exports outputs with the `Export` property to make them available across the region

**Stack 2 (Application Stack):**
- Imports exported values from Stack 1 using `Fn::ImportValue`
- References the imported values in resource properties
- Creates a dependency: Stack 1 cannot be deleted while Stack 2 imports from it

#### Output Properties

Each output in the `Outputs` section has the following properties:

**Core Properties:**
- **Logical ID** — User-defined name for the output (must be unique within the stack)
- **`Value`** — Mandatory. The value to export (usually a resource attribute or parameter)
- **`Description`** — Optional free-text description displayed in the console
- **`Export`** — Optional object containing a `Name` property that makes this output available to other stacks

#### Output Example

```yaml
Resources:
  MySshSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow SSH access
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0

Outputs:
  SshSecurityGroupId:
    Description: Security group ID for SSH access
    Value: !Ref MySshSecurityGroup
    Export:
      Name: my-app-ssh-security-group
```

#### Importing Values from Other Stacks

In a second template, import the exported value using `Fn::ImportValue`:

```yaml
Resources:
  MyWebInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t3.micro
      SecurityGroupIds:
        - !ImportValue my-app-ssh-security-group  # Import from the first stack
```

#### Export Naming Constraints

- Export names must be **unique within a region** across all stacks and accounts
- If two stacks try to export the same name in the same region, the second deployment will fail
- Use a naming convention to avoid collisions (e.g., `{app-name}-{resource-type}`)

#### Cross-Stack Dependencies

When a stack exports a value that is imported by another stack, a dependency is created:
- The **exporting stack cannot be deleted** while any stack is importing from it
- If you attempt to delete the exporting stack, CloudFormation will raise an error listing the dependent stacks
- You must delete the importing stacks first, then delete the exporting stack

This safety mechanism prevents accidental deletion of infrastructure that other stacks depend on.

#### Viewing Outputs

Outputs are visible in multiple places:
- **AWS Console** — View outputs on the stack details page under the **Outputs** tab
- **AWS CLI** — Use `aws cloudformation describe-stacks --stack-name <stack-name>` to retrieve output values programmatically
- **Cross-stack references** — Use `Fn::ImportValue` to reference outputs from other stacks within templates

### Conditions

Conditions are Boolean expressions evaluated at deploy time that control whether resources or outputs are created. They enable template reuse by conditionally creating different infrastructure based on parameter values, regions, or other template variables.

#### Purpose

Common use cases for conditions:
- **Environment-specific resources** — Create a bastion host only in non-production environments, or add additional monitoring in production
- **Region-specific resources** — Create certain resources only in specific AWS regions
- **Feature flags** — Enable or disable optional features based on parameter input
- **Cost optimization** — Skip expensive resources in development or test environments

#### How to Define Conditions

Conditions are declared in the optional `Conditions` section of a template. Each condition has a logical ID (user-defined name) and an intrinsic condition function that evaluates to true or false.

**Syntax:**
```yaml
Conditions:
  LogicalIdOfCondition: !Function
    - argument1
    - argument2
```

#### Intrinsic Condition Functions

CloudFormation provides five intrinsic condition functions:

**`Fn::Equals` / `!Equals`** — Compares two values for equality. Returns true if they match.

```yaml
Conditions:
  IsProduction: !Equals [!Ref EnvironmentType, "production"]
```

**`Fn::And` / `!And`** — Returns true if all conditions in a list are true. Allows up to 10 conditions.

```yaml
Conditions:
  IsProductionInUS: !And
    - !Equals [!Ref EnvironmentType, "production"]
    - !Equals [!Ref "AWS::Region", "us-east-1"]
```

**`Fn::Or` / `!Or`** — Returns true if any condition in a list is true. Allows up to 10 conditions.

```yaml
Conditions:
  IsNonProduction: !Or
    - !Equals [!Ref EnvironmentType, "development"]
    - !Equals [!Ref EnvironmentType, "staging"]
```

**`Fn::Not` / `!Not`** — Negates a condition. Returns true if the condition is false.

```yaml
Conditions:
  IsNotProduction: !Not [!Equals [!Ref EnvironmentType, "production"]]
```

**`Fn::If` / `!If`** — Returns one of two values based on a condition. Syntax: `[ConditionName, ValueIfTrue, ValueIfFalse]`.

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !If [IsProduction, t3.large, t3.micro]
```

#### Referencing Conditions

Conditions can reference:
- **Parameter values** — Compare a parameter to a fixed string or number
- **Pseudo-parameters** — Check the current region or account ID
- **Other conditions** — Combine conditions using And, Or, and Not for complex logic
- **Mappings** — Use `!FindInMap` within a condition to derive values from lookup tables

#### How to Use Conditions

Once defined, conditions are applied to resources and outputs using the `Condition` property:

```yaml
Resources:
  BastionHost:
    Type: AWS::EC2::Instance
    Condition: IsNotProduction  # Only created if IsNotProduction is true
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t3.micro

Outputs:
  BastionIP:
    Condition: IsNotProduction  # Only exported if IsNotProduction is true
    Value: !Ref BastionHost
    Description: IP address of bastion host
```

Resources with conditions are only created if their condition evaluates to true. If a condition is false, the resource is not provisioned and is not included in cost calculations.

#### Complete Example

```yaml
Parameters:
  EnvironmentType:
    Type: String
    Default: development
    AllowedValues:
      - development
      - production
    Description: Environment for deployment

Conditions:
  IsProduction: !Equals [!Ref EnvironmentType, "production"]
  IsDevelopment: !Not [!Condition IsProduction]

Resources:
  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: !If [IsProduction, t3.large, t3.micro]

  EnhancedMonitoring:
    Type: AWS::CloudWatch::Alarm
    Condition: IsProduction  # Only create in production
    Properties:
      MetricName: CPUUtilization
      Threshold: 80
      ComparisonOperator: GreaterThanThreshold

  DevelopmentDatabase:
    Type: AWS::RDS::DBInstance
    Condition: IsDevelopment  # Only create in development
    Properties:
      DBInstanceClass: db.t3.micro
      Engine: mysql
      MasterUsername: admin
```

#### Exam Notes

For AWS Certified DevOps Engineer exam purposes, you should understand:
- How to read and interpret existing conditions in templates
- The purpose of conditions and when they are commonly used
- The five intrinsic condition functions and their syntax
- How conditions are applied to resources using the `Condition` property

You do not need to memorize the exact syntax for writing conditions from scratch, but you should be able to understand and explain condition logic in existing CloudFormation templates.


### Intrinsic Functions

Intrinsic functions are CloudFormation built-in functions that enable dynamic template behavior. They allow you to reference resources, retrieve resource attributes, perform conditional logic, and manipulate strings and data structures at template evaluation time.

#### Core Functions (Essential for Exam)

**`Ref` / `!Ref`** — References a resource or parameter by its logical ID, returning its default identifier (usually the physical ID). Used to create dependencies between resources and to reference parameter values.

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      SecurityGroupIds:
        - !Ref MySecurityGroup  # Reference to the security group resource
      InstanceType: !Ref InstanceTypeParameter  # Reference to a parameter
```

The `Ref` function can reference parameters, resources, and pseudo-parameters (like `AWS::Region`).

**`Fn::GetAtt` / `!GetAtt`** — Retrieves a specific attribute from a resource rather than its default ID. Each resource type provides different attributes that can be queried. Common attributes include `Arn`, `Id`, `AvailabilityZone`, `PrivateDnsName`, `PrivateIp`, `PublicDnsName`, and `PublicIp`.

To determine what attributes are available for a specific resource, consult the AWS CloudFormation Resource Type Reference documentation for that resource type.

```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-example-bucket

  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t3.micro

Outputs:
  BucketArn:
    Value: !GetAtt MyBucket.Arn  # Get the ARN of the bucket
  InstanceAvailabilityZone:
    Value: !GetAtt MyInstance.AvailabilityZone  # Get the AZ of the instance
  InstancePublicIP:
    Value: !GetAtt MyInstance.PublicIp  # Get the public IP of the instance
```

**`Fn::FindInMap` / `!FindInMap`** — Retrieves a value from the `Mappings` section of the template using up to three keys for nested lookup.

```yaml
Mappings:
  RegionMap:
    us-east-1:
      AMI: ami-0c55b159cbfafe1f0
    us-west-2:
      AMI: ami-0d70546e43a148d8d

Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !FindInMap [RegionMap, !Ref "AWS::Region", AMI]
```

**`Fn::ImportValue` / `!ImportValue`** — Imports a value exported by another CloudFormation stack within the same region. Enables cross-stack collaboration and resource sharing without hardcoding values.

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      SecurityGroupIds:
        - !ImportValue my-app-ssh-security-group  # Import from another stack
```

**`Fn::Base64` / `!Base64`** — Encodes a string or `Fn::Sub` result into Base64 format. Most commonly used to encode EC2 UserData scripts, which require Base64 encoding.

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t3.micro
      UserData: !Base64 |
        #!/bin/bash
        yum update -y
        yum install -y httpd
        systemctl start httpd
```

**Condition Functions** — `Fn::Equals`, `Fn::And`, `Fn::Or`, `Fn::Not`, and `Fn::If` enable conditional logic in templates. These are described in detail in the [Conditions](#conditions) section above.

#### Additional Functions

**`Fn::Join` / `!Join`** — Joins a list of values with a delimiter into a single string. Useful for building strings from multiple pieces.

```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Join ["-", ["my", "bucket", !Ref "AWS::Region"]]
      # Results in: my-bucket-us-east-1
```

**`Fn::Sub` / `!Sub`** — Substitutes `${VariableName}` placeholders in a string with parameter or resource values. Cleaner than `Join` for complex strings with multiple substitutions.

```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "my-bucket-${AWS::Region}-${AWS::AccountId}"
      # ${AWS::Region} and ${AWS::AccountId} are replaced with their values
```

**`Fn::Select` / `!Select`** — Returns one item from a list by zero-based index.

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Properties:
      SubnetId: !Select [0, !GetAZs ""]  # Select the first availability zone
```

**`Fn::Split` / `!Split`** — Splits a string by a delimiter and returns a list of substrings.

```yaml
Resources:
  MyResource:
    Type: AWS::S3::Bucket
    Properties:
      # If a parameter contains "value1,value2,value3", split it into a list
      Tags:
        - Key: Items
          Value: !Select [0, !Split [",", !Ref CommaSeparatedValues]]
```

**`Fn::GetAZs` / `!GetAZs`** — Returns a list of availability zones for the specified region.

```yaml
Resources:
  MySubnet:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref MyVpc
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs ""]  # Use the first AZ
```

**`Fn::Length` / `!Length`** — Returns the number of items in a list.

**`Fn::ToJsonString` / `!ToJsonString`** — Converts a value or object to a JSON string representation.

**`Fn::Cidr` / `!Cidr`** — Generates a list of CIDR blocks by dividing a given CIDR block into smaller subnets. Useful for allocating multiple subnets from a larger CIDR range.

**`Fn::ForEach` / `!ForEach`** — Iterates over a list and creates multiple resources with different properties based on each item. Reduces repetition when creating many similar resources.

**`Fn::Transform` / `!Transform`** — Applies a transform to the template before processing. Commonly used with `AWS::Include` to embed external template files or with `AWS::Serverless` for SAM (Serverless Application Model) templates.

#### Exam Notes

For the AWS Certified DevOps Engineer exam, prioritize understanding:
- **Core functions** (`Ref`, `GetAtt`, `FindInMap`, `ImportValue`, `Base64`, condition functions) — These are tested frequently and appear in most CloudFormation templates
- How to read and interpret function syntax in template examples
- When to use each function and why (e.g., `GetAtt` vs. `Ref`, `Sub` vs. `Join`)
- How functions interact with parameters, mappings, and conditions

You do not need to memorize the exact syntax of less common functions like `Fn::ForEach` or `Fn::Transform`, but you should recognize them and understand their general purpose when encountering them in template examples.


### Rollbacks

**Exam importance:** Rollback behavior is a critical CloudFormation concept tested on the AWS Certified DevOps Engineer exam.

#### Stack Creation Failures

When a CloudFormation stack creation fails for any reason (invalid resource properties, insufficient IAM permissions, resource quota exceeded, etc.):

**Default behavior:** By default, CloudFormation automatically rolls back the entire stack, deleting all resources that were successfully created before the failure occurred. This ensures the stack does not remain in a partially created state.

**Troubleshooting option:** You can disable automatic rollback during stack creation to investigate the failed resources and understand what went wrong. This allows you to examine resource configurations, logs, and error messages before CloudFormation cleans them up.

To view detailed failure information, check the CloudFormation stack events and logs in the AWS console to understand the root cause of the failure.

#### Stack Update Failures

When a CloudFormation stack update fails (due to invalid property changes, resource replacement errors, incompatible updates, etc.):

**Automatic rollback:** CloudFormation automatically rolls back the stack to its previous known working state. All partially completed changes are undone, and the stack returns to the configuration it had before the failed update attempt was initiated.

**Diagnostics:** You can view the detailed logs and stack events in the AWS console to understand what failed and why the update was not completed.

#### Rollback Failures

In rare cases, a rollback operation itself can fail if CloudFormation cannot restore resources to their previous state (for example, if a deletion fails during rollback, or if a resource cannot be recreated). When this occurs:

**Manual remediation:** You must manually fix the affected resources to restore the stack to a consistent state.

**Continue Update Rollback API:** After manually remedying the underlying issues, use the `continue-update-rollback` API call to instruct CloudFormation to retry the rollback operation and complete the process.

This can be invoked through:
- The AWS CloudFormation console (stack actions menu)
- The AWS CLI: `aws cloudformation continue-update-rollback --stack-name <stack-name>`

Once the rollback completes successfully, the stack returns to its previous working state.

### Service Role

A service role is an IAM role that CloudFormation assumes to create, update, and delete stack resources on your behalf. Service roles enable a separation of concerns: you can grant users permission to manage CloudFormation stacks without giving them direct permissions to the underlying AWS resources that the stack creates.

#### Purpose

Service roles solve a common authorization challenge. Without a service role, users must have permissions for every action CloudFormation performs (EC2, S3, RDS, etc.). By using a service role, you delegate permissions to CloudFormation itself, while restricting what users can do directly.

**Key benefit:** Users can create and update stacks without needing permission to interact with those resources themselves. For example, a user with `cloudformation:CreateStack` and `iam:PassRole` permissions can trigger stack creation, but the actual resource provisioning is performed by CloudFormation under the service role's permissions.

#### How Service Roles Work

When you create or update a CloudFormation stack, you specify a service role ARN. CloudFormation assumes this role and uses its permissions to:
- Create resources declared in the template
- Update resource properties during stack updates
- Delete resources when the stack is deleted

The flow is:
1. User calls CloudFormation with `CreateStack` or `UpdateStack`, specifying a service role ARN
2. CloudFormation assumes the service role
3. CloudFormation uses the role's permissions to provision, modify, or delete resources
4. The service role's policies determine what resources can be created and modified

#### IAM Permissions Required

To use a service role with CloudFormation, users need two key permissions:

**`cloudformation:*` (CloudFormation permissions)**
- `cloudformation:CreateStack` — Create new stacks
- `cloudformation:UpdateStack` — Update existing stacks
- `cloudformation:DeleteStack` — Delete stacks
- Other CloudFormation API permissions as needed

**`iam:PassRole`**
- This permission allows the user to pass the service role to CloudFormation
- Without this permission, users cannot specify a service role when creating or updating stacks
- The permission should be scoped to the specific service role ARN to enforce least privilege

#### Service Role Policy Example

The service role itself needs permissions to manage the resources declared in your CloudFormation templates. Use the principle of least privilege—grant only the permissions required for your specific use case.

**Example: Service role for an application stack that creates EC2 instances, security groups, and S3 buckets:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateSecurityGroup",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:DeleteSecurityGroup",
        "ec2:DescribeSecurityGroups",
        "ec2:RunInstances",
        "ec2:TerminateInstances",
        "ec2:DescribeInstances",
        "ec2:ModifyInstanceAttribute"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:GetBucketVersioning",
        "s3:PutBucketVersioning"
      ],
      "Resource": "arn:aws:s3:::my-app-*"
    }
  ]
}
```

#### User Permissions Example

In contrast, the user creating or updating the stack needs minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:ListStacks"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::ACCOUNT-ID:role/cloudformation-service-role"
    }
  ]
}
```

Notice that the user has **no direct permissions** to EC2, S3, or other services. All actual resource operations are performed by the service role that CloudFormation assumes.

#### Best Practices

**Use the principle of least privilege:** Service roles should have the minimum permissions necessary to create the resources in your templates. Do not grant wildcard permissions like `s3:*` unless absolutely required. This limits the blast radius if credentials are compromised.

**Scope service roles by template:** Consider creating separate service roles for different types of stacks (networking, application, databases). This isolates permissions and prevents a single compromised role from affecting all infrastructure.

**Regularly audit service role policies:** Review service role permissions periodically to ensure they have not become overly permissive over time.

#### Exam Notes

For the AWS Certified DevOps Engineer exam, understand:
- What a CloudFormation service role is and why it is used
- The separation of concerns it provides (users don't need direct resource permissions)
- The `iam:PassRole` permission requirement for users
- How to scope service role policies to the minimum required permissions
- The principle of least privilege as it applies to service roles


### Capabilities

Capabilities are explicit acknowledgments that a CloudFormation template is allowed to perform sensitive operations, such as creating IAM resources or applying macros. CloudFormation requires capabilities to be specified during stack creation or update as a security safeguard to prevent unintended authorization changes.

#### CAPABILITY_IAM

**Use case:** Required when a CloudFormation template creates, updates, or deletes IAM resources without explicitly specifying resource names.

Examples of resources that require this capability:
- IAM roles (without a `RoleName` property)
- IAM policies
- IAM users
- IAM groups

This capability acknowledges that the template will modify identity and access management configuration.

#### CAPABILITY_NAMED_IAM

**Use case:** Required when a CloudFormation template creates or updates IAM resources that have explicitly named properties.

Examples:
- An IAM role with `RoleName: "MyCustomRoleName"` specified
- An IAM user with `UserName: "alice"` specified

Use `CAPABILITY_NAMED_IAM` instead of `CAPABILITY_IAM` when IAM resources are named within the template. This capability is stricter because named resources can conflict with existing resources in the AWS account.

**Distinction:** Both `CAPABILITY_IAM` and `CAPABILITY_NAMED_IAM` must be specified. If your template creates named IAM resources, you must include both capabilities when deploying.

#### CAPABILITY_AUTO_EXPAND

**Use case:** Required when a CloudFormation template includes **macros** or **nested stacks** that perform dynamic transformations and template expansion.

Macros are custom processing instructions (written as Lambda functions or AWS transforms) that can modify the template before CloudFormation evaluates it. Nested stacks are templates that create other CloudFormation stacks.

This capability acknowledges that:
- The template may be transformed or expanded before deployment
- The actual resources created may differ from what is explicitly declared in the uploaded template
- CloudFormation may invoke external code or processes that alter the template structure

**When to use:**
- AWS Serverless Application Model (SAM) templates, which use the `AWS::Serverless` transform
- Templates with custom macros using `AWS::CloudFormation::Macro`
- Templates that reference nested stacks (though nested stacks may work without this capability if they do not use transforms)

#### Specifying Capabilities

Capabilities are specified when creating or updating a stack:

**AWS CLI:**
```bash
aws cloudformation create-stack \
  --stack-name my-stack \
  --template-body file://template.yaml \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```

**AWS Console:**
Capabilities are acknowledged via a checkbox on the final review step before deploying: **"I acknowledge that AWS CloudFormation might create IAM resources with custom names."** and **"I acknowledge that AWS CloudFormation might create IAM resources."**

#### InsufficientCapabilitiesException

**Error condition:** CloudFormation raises `InsufficientCapabilitiesException` when you attempt to create or update a stack without acknowledging the required capabilities for the template.

**Root cause examples:**
- Deploying a template that creates IAM resources without specifying `CAPABILITY_IAM` or `CAPABILITY_NAMED_IAM`
- Deploying a SAM template or a template with macros without specifying `CAPABILITY_AUTO_EXPAND`

**Resolution:** Rerun the stack creation or update command, adding the required capabilities:

```bash
aws cloudformation create-stack \
  --stack-name my-stack \
  --template-body file://template.yaml \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```

#### Exam Notes

For the AWS Certified DevOps Engineer exam, understand:
- When each capability is required and why
- The distinction between `CAPABILITY_IAM` and `CAPABILITY_NAMED_IAM`
- That capabilities are a security mechanism to prevent accidental authorization changes
- How to specify capabilities when deploying stacks via CLI
- The `InsufficientCapabilitiesException` error and how to resolve it

### DeletionPolicy

**DeletionPolicy** is a CloudFormation template attribute applied to individual resources to control what happens when a resource is removed from a stack or the stack itself is deleted. It provides protection mechanisms to preserve and back up critical resources.

#### Delete

The default deletion policy. When a resource is deleted, CloudFormation permanently removes it from AWS.

**Behavior:**
- The resource is deleted when removed from the template or when the stack is deleted
- This is the default behavior if no DeletionPolicy is specified
- Does not work on S3 buckets that contain objects—CloudFormation deletion will fail if the bucket is not empty

**Example:**
```yaml
Resources:
  MyTemporaryResource:
    Type: AWS::S3::Bucket
    # DeletionPolicy: Delete (implied default)
```

#### Retain

Preserves the resource even if it is removed from the template or the stack is deleted. The resource is not affected by CloudFormation operations.

**Behavior:**
- The resource persists when the stack is deleted or the resource is removed from the template
- The resource is no longer managed by CloudFormation after retention
- Works with any CloudFormation resource type

**Example:**
```yaml
Resources:
  CriticalDatabase:
    Type: AWS::RDS::DBInstance
    DeletionPolicy: Retain
    Properties:
      DBInstanceIdentifier: production-database
      Engine: mysql
      AllocatedStorage: 100
```

#### Snapshot

Creates a final snapshot of the resource before deletion. Applicable to stateful resources like databases and volumes.

**Behavior:**
- A snapshot is created immediately before the resource is deleted
- The resource is then deleted from CloudFormation
- The snapshot persists independently and can be used for recovery or future restoration
- Only applicable to resources that support snapshots (e.g., RDS database instances, EBS volumes, Redshift clusters, Neptune databases)

**Example:**
```yaml
Resources:
  ProductionDatabase:
    Type: AWS::RDS::DBInstance
    DeletionPolicy: Snapshot
    Properties:
      DBInstanceIdentifier: my-database
      Engine: postgres
      AllocatedStorage: 100
```

#### Exam Notes

For the AWS Certified DevOps Engineer exam, understand:
- The three DeletionPolicy options: Delete (default), Retain, and Snapshot
- When to use Retain for critical resources that should survive stack deletion
- When to use Snapshot to preserve stateful data before deletion
- Which resource types support each DeletionPolicy option
- How DeletionPolicy applies to stack updates and deletions
- The implications of each policy on data preservation and cost


### Stack Policies

A stack policy is a JSON document that defines which update actions are allowed on resources during CloudFormation stack updates. Stack policies serve as a safeguard to prevent unintentional modifications to critical resources.

#### Default Behavior

By default, during a CloudFormation stack update, all update actions are allowed on all resources. This means resources can be modified, replaced, or deleted without restrictions. Stack policies restrict this behavior by explicitly defining what operations are permitted.

#### How Stack Policies Work

When you attach a stack policy to a stack, all resources in the stack are **protected by default**. You must explicitly grant `Allow` actions for any resources you want to permit updates on. This follows the principle of "deny by default, allow by exception."

**Key characteristics:**
- Stack policies are JSON documents similar to IAM policies
- They define actions that are allowed or denied during updates
- Resources without an explicit allow are protected from updates
- Both CREATE and UPDATE actions are controlled
- Stack policies do not apply to stack creation, only to updates

#### Stack Policy Example

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "Update:*",
      "Resource": "LogicalResourceId/WebServerInstanceA"
    },
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "Update:*",
      "Resource": "LogicalResourceId/ProductionDatabase"
    }
  ]
}
```

In this example:
- The `WebServerInstanceA` resource is allowed to be updated
- The `ProductionDatabase` resource is explicitly denied from updates
- All other resources inherit the default deny behavior

#### Specifying Stack Policies

Stack policies are applied during stack creation or update via the AWS CLI or console:

**AWS CLI:**
```bash
aws cloudformation create-stack \
  --stack-name my-stack \
  --template-body file://template.yaml \
  --stack-policy-body file://stack-policy.json
```

To update an existing stack's policy:
```bash
aws cloudformation set-stack-policy \
  --stack-name my-stack \
  --stack-policy-body file://stack-policy.json
```

#### Exam Notes

For the AWS Certified DevOps Engineer exam, understand:
- What a stack policy is and how it provides protection during updates
- That all resources are protected by default when a stack policy is in place
- The difference between resource-level protection and template-level protection
- Common use cases: protecting production databases, critical infrastructure components, and important IAM roles
- That stack policies apply to updates but not to initial stack creation

---

### CloudFormation Concepts Review

This section consolidates everything covered so far — use it for quick revision and active recall before moving on to Custom Resources, Dynamic References, and remaining topics.

#### CloudFormation Fundamentals

CloudFormation uses a **declarative model**: you declare the desired AWS resources and their configurations, and CloudFormation handles orchestration, dependency resolution, and provisioning order automatically. Templates are uploaded to S3 (even when submitted through the console), and each deployed template becomes a **stack** identified by its name within a region. **Infrastructure Composer** provides a visual drag-and-drop interface for designing templates. Deployment can be **manual** (console-based) or **automated** (CLI, CI/CD pipelines).

#### Template Structure

| Section | Required? | Purpose |
|---------|-----------|---------|
| AWSTemplateFormatVersion | No | Only valid value: `"2010-09-09"` |
| Description | No | Free-text, visible in console |
| Resources | **Yes** | Declares AWS resources (`AWS::Service::Resource` naming) |
| Parameters | No | Accept user input with validation constraints |
| Mappings | No | Static key-value lookup tables |
| Outputs | No | Expose values for cross-stack references |
| Conditions | No | Conditionally create resources or set properties |

#### Key Concepts at a Glance

- **Resources** — The only required section. Over 700 resource types following the `AWS::Service::Resource` naming convention (e.g., `AWS::EC2::Instance`). CloudFormation automatically resolves dependencies between resources and determines creation order.

- **Parameters** — Accept dynamic input at deploy time. Supported types include `String`, `Number`, `CommaDelimitedList`, AWS-specific types (`AWS::EC2::VPC::Id`, `AWS::EC2::KeyPair::KeyName`), and SSM Parameter Store types. Validation constraints include `AllowedValues`, `AllowedPattern`, `MinLength`/`MaxLength`, `MinValue`/`MaxValue`, and `NoEcho` (masks sensitive input). `ConstraintDescription` provides a custom error message. Reference parameter values with `!Ref`.

- **Mappings** — Hardcoded key-value lookup tables for known values (e.g., AMI IDs per region). Retrieved with `!FindInMap [MapName, FirstLevelKey, SecondLevelKey]`. Use mappings when values are predictable and fixed; use parameters when the user decides the value.

- **Outputs** — Expose stack values for visibility or cross-stack sharing. Exported outputs must have unique names per region. Other stacks consume them with `!ImportValue`. A stack cannot be deleted while another stack imports its outputs.

- **Conditions** — Control whether resources are created or properties are applied based on logic. Built with condition functions: `Fn::Equals`, `Fn::And`, `Fn::Or`, `Fn::Not`. Applied to resources with the `Condition` key and to properties with `Fn::If`.

- **Pseudo-Parameters** — AWS-provided parameters available in every template without declaration: `AWS::AccountId`, `AWS::Region`, `AWS::StackName`, `AWS::StackId`, `AWS::URLSuffix`, and `AWS::NoValue` (used with `Fn::If` to remove a property).

#### Intrinsic Functions Quick Reference

- **References:** `!Ref` returns the parameter value or resource physical ID. `!GetAtt` returns resource attributes like `.Arn`, `.DomainName`, `.AvailabilityZone`.
- **String:** `!Sub` performs variable interpolation (`${Variable}`). `!Join` concatenates a list with a delimiter. Prefer `!Sub` when embedding multiple variables.
- **List:** `!Select` picks an element by index. `!Split` breaks a string into a list. `!GetAZs` returns AZs for a region. `!Length` returns list size.
- **Import:** `!ImportValue` retrieves an exported output from another stack.
- **Encoding:** `!Base64` encodes strings, required for EC2 UserData.
- **Advanced:** `Fn::Cidr` generates CIDR address blocks from a VPC CIDR. `Fn::ForEach` iterates to create multiple similar resources.

#### Operations & Safety

- **Rollbacks** — On creation failure, CloudFormation auto-rolls back and deletes all created resources (default behavior, can be disabled for debugging). On update failure, it auto-rolls back to the previous working state. If a rollback itself fails, use the `continue-update-rollback` API to skip problematic resources and complete the rollback.

- **Service Roles** — An IAM role that CloudFormation assumes to create/update/delete resources. The user only needs CloudFormation permissions plus `iam:PassRole`; the service role carries the broad resource permissions. Scope roles by template type and follow least privilege.

- **Capabilities** — `CAPABILITY_IAM` for IAM resources with auto-generated names. `CAPABILITY_NAMED_IAM` for custom-named IAM resources. `CAPABILITY_AUTO_EXPAND` for macros, SAM transforms, and nested stacks. Omitting a required capability results in `InsufficientCapabilitiesException`.

- **DeletionPolicy** — Controls what happens when a resource is removed from a template or a stack is deleted. `Delete` (default) removes the resource. `Retain` detaches the resource from CloudFormation but keeps it in the account. `Snapshot` takes a final snapshot before deletion — only supported on RDS, EBS, ElastiCache, Redshift, and Neptune.

- **Stack Policies** — Protect specific resources from unintended updates. Once any stack policy is applied, all resources are protected by default (deny-by-default model). Target specific resources with `LogicalResourceId`. Can be temporarily overridden during an update. Stack policies affect updates only, not initial creation.

- **Termination Protection** — Must be explicitly disabled before a stack can be deleted.

#### Common Exam Pitfalls

- S3 buckets with content cannot be deleted by `DeletionPolicy: Delete` — stack deletion fails (use a Custom Resource Lambda to empty the bucket first)
- Stack policies apply to **updates only**, not initial stack creation
- **All resources** are protected by default once any stack policy exists
- Capabilities are required for IAM resources and transforms — omitting causes `InsufficientCapabilitiesException`
- `Snapshot` DeletionPolicy only works on specific resource types (RDS, EBS, ElastiCache, Redshift, Neptune)
- `!GetAtt` returns resource attributes (Arn, DNS, etc.) while `!Ref` returns the resource physical ID
- `!ImportValue` creates a dependency — the exporting stack cannot be deleted while imports exist

#### Self-Test Questions

1. What is the only required section in a CloudFormation template?
2. What is the only valid value for `AWSTemplateFormatVersion`?
3. How would you restrict a parameter to only accept specific values? What about enforcing a regex pattern?
4. What does `NoEcho` do, and when would you use it?
5. When should you use `!Sub` instead of `!Join` for string construction?
6. What is the difference between `!Ref` and `!GetAtt`? Give an example of when you need each.
7. How would you construct a globally unique S3 bucket name using pseudo-parameters?
8. When should you use Mappings instead of Parameters?
9. What must be true about Output export names? What happens if you try to delete a stack whose outputs are imported elsewhere?
10. How do you conditionally create a resource based on whether an environment is "prod"?
11. What API call resolves a failed rollback, and what does it do?
12. What permissions does a user need to assign a service role to CloudFormation?
13. What happens if you deploy a SAM template without specifying any capabilities?
14. An S3 bucket has `DeletionPolicy: Delete` but stack deletion fails — what is the likely cause?
15. You apply a stack policy that allows updates to `MySecurityGroup`. Can `MyRDSInstance` be updated?

#### Topics Pending Completion

Custom Resources, Dynamic References, and detailed Termination Protection notes are still being added in the sections below.

---

### Termination Protection

Termination Protection is a safety mechanism that prevents accidental deletion of CloudFormation stacks. When enabled, the stack cannot be deleted until protection is explicitly disabled.

#### How to Enable

Enable termination protection in the CloudFormation console by navigating to the stack details and setting the termination protection flag. Termination protection can also be enabled at stack creation time or modified at any point after creation.

#### Exam Notes

- Termination Protection prevents accidental stack deletion
- Protects the entire stack from deletion; individual resources are protected using `DeletionPolicy: Retain`
- Must be explicitly disabled before a stack can be deleted

### Custom Resources

Custom Resources enable CloudFormation to work with resources not yet supported by native CloudFormation resource types, define custom provisioning logic for resources outside of CloudFormation's scope (such as on-premises systems or third-party services), and execute custom scripts during resource creation, update, and deletion phases.

Custom resources are particularly useful for automating tasks that CloudFormation cannot natively perform, allowing you to extend CloudFormation's capabilities to almost any infrastructure component or external system.

#### How to Define Custom Resources

Custom resources are defined in a CloudFormation template using one of two type declarations:

- **`AWS::CloudFormation::CustomResource`** — Generic type that requires a `ServiceToken` property
- **`Custom::MyCustomResourceTypeName`** — Allows you to define a descriptive name for the custom resource type

#### Service Token

The **`ServiceToken`** property is mandatory and specifies the endpoint where CloudFormation sends lifecycle requests (create, update, delete):

- **Lambda ARN** — Most common backing service. Lambda function receives and processes CloudFormation requests
- **SNS Topic ARN** — Alternative backing service. SNS topic receives CloudFormation lifecycle notifications

The `ServiceToken` must reference a resource in the same AWS region as the stack. CloudFormation cannot invoke endpoints in other regions.

#### Lifecycle and Lambda Invocation

When a custom resource is created, updated, or deleted, CloudFormation sends a request to the `ServiceToken` endpoint. If backed by Lambda, the Lambda function receives:

- **RequestType** — String indicating the operation: `"Create"`, `"Update"`, or `"Delete"`
- **PhysicalResourceId** — Unique identifier for the resource (required in response)
- **ResourceProperties** — User-defined properties from the template
- **StackId** — Identifier of the CloudFormation stack
- **LogicalResourceId** — Logical name of the resource in the template
- **ResponseURL** — S3 URL where the Lambda function must send success or failure responses

The Lambda function must respond within a timeout (default 1 hour) by posting a JSON response to the `ResponseURL`.

#### Common Use Case: Delete Content from S3 Bucket

A frequent exam scenario is using a custom resource to empty an S3 bucket before CloudFormation deletes the bucket resource. CloudFormation cannot delete non-empty S3 buckets by default.

**Solution workflow:**
1. Create a Lambda function that accepts CloudFormation lifecycle requests
2. On `Delete` requests, empty the bucket (delete all objects)
3. Define a custom resource that invokes this Lambda function
4. Ensure the S3 bucket depends on the custom resource completing successfully
5. When the stack is deleted, CloudFormation invokes the Lambda to empty the bucket first, then deletes the now-empty bucket

#### Exam Notes

- Custom Resources are backed by Lambda (most common) or SNS topics
- ServiceToken is required and must point to a resource in the same region
- Lambda functions must respond to the ResponseURL within the timeout period
- Empty S3 buckets before deletion is a classic exam scenario
- Custom resources are named either `AWS::CloudFormation::CustomResource` or `Custom::MyTypeName`

### Dynamic References

**Dynamic references** enable CloudFormation templates to securely retrieve external values from **AWS Systems Manager Parameter Store** and **AWS Secrets Manager** at runtime. Rather than hardcoding sensitive information like database passwords directly in your template, dynamic references allow you to reference values stored and managed in these external services. CloudFormation resolves the reference during stack creation, update, and deletion operations, retrieving the current value from the source service at that moment.

Dynamic references are essential for maintaining secure infrastructure-as-code because they keep sensitive information out of version control while ensuring CloudFormation has access to the values needed to configure resources.

#### Supported Services and Syntax

CloudFormation supports dynamic references to three types of external values:

- **SSM Parameter Store (Plaintext)** — Retrieve plaintext parameter values using `{{resolve:ssm:parameter-name:version}}`
- **SSM Parameter Store (Secure Strings)** — Retrieve encrypted secure string values using `{{resolve:ssm-secure:parameter-name:version}}`
- **Secrets Manager** — Retrieve entire secrets or specific secret values using `{{resolve:secretsmanager:secret-id:secret-string:json-key:version-stage:version-id}}`

The curly braces and colon-separated format is the standard dynamic reference syntax. CloudFormation parses these during template processing and retrieves the corresponding values.

#### Example Use Case: RDS Database Password

A common exam scenario is securing an RDS database master password. Rather than including the password in your CloudFormation template (which would expose it in version control), you can store the password in Secrets Manager and reference it dynamically:

```yaml
Resources:
  MyDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      Engine: mysql
      DBInstanceClass: db.t3.micro
      MasterUsername: admin
      MasterUserPassword: '{{resolve:secretsmanager:my-db-password:SecretString:password}}'
```

CloudFormation retrieves the password from Secrets Manager during stack creation and passes it to the RDS resource without exposing it in the template.

#### Systems Manager Parameter Store References

**SSM plaintext parameters** store non-sensitive configuration values and are referenced without encryption:

```
{{resolve:ssm:parameter-name:version}}
```

**SSM secure string parameters** store encrypted values (encrypted by default with AWS KMS) and are referenced using:

```
{{resolve:ssm-secure:parameter-name:version}}
```

Both patterns accept an optional `version` number (an integer); if omitted, CloudFormation uses the latest version of the parameter. Version is required in the `Parameters` section of your template but optional elsewhere.

#### Secrets Manager References

**Secrets Manager references** are more flexible because they can retrieve either entire secrets or individual key-value pairs from a secret:

```
{{resolve:secretsmanager:secret-id:SecretString:json-key:version-stage:version-id}}
```

All components except `secret-id` are optional:

- **`secret-id`** — The name or ARN of the secret (required)
- **`SecretString`** — Always use this literal value to retrieve the secret's string content (optional, only value supported)
- **`json-key`** — If the secret is JSON, specify the key name to retrieve only that value; omit to retrieve the entire secret (optional)
- **`version-stage`** — The staging label of a specific version, such as `AWSCURRENT` or `AWSPREVIOUS` (optional, defaults to `AWSCURRENT`)
- **`version-id`** — The unique identifier of a specific version; do not use together with `version-stage` (optional)

**Example retrieving a specific JSON key:**

```yaml
MasterUsername: '{{resolve:secretsmanager:MyDatabaseSecret:SecretString:username}}'
MasterUserPassword: '{{resolve:secretsmanager:MyDatabaseSecret:SecretString:password}}'
```

This retrieves only the `username` and `password` fields from a secret that contains other data.

#### Option 1: RDS ManageMasterUserPassword

RDS provides a built-in feature that automatically manages database master user passwords through Secrets Manager. When you set **`ManageMasterUserPassword: true`** on an `AWS::RDS::DBInstance` or `AWS::RDS::DBCluster` resource, RDS automatically:

- Generates a secure random password
- Creates a secret in Secrets Manager to store the password
- Manages the secret's lifecycle (rotation, updates, encryption)
- Returns the secret's ARN via `GetAtt`

You should NOT specify `MasterUserPassword` when using `ManageMasterUserPassword: true` — RDS handles password generation.

**Example:**

```yaml
MyDatabase:
  Type: AWS::RDS::DBInstance
  Properties:
    Engine: mysql
    DBInstanceClass: db.t3.micro
    MasterUsername: admin
    ManageMasterUserPassword: true
    MasterUserSecret:
      KmsKeyId: !Ref MyKMSKey
```

To retrieve the generated secret ARN for use in other resources:

```yaml
DatabaseSecretArn: !GetAtt MyDatabase.MasterUserSecret.SecretArn
```

This approach is the simplest and most secure for RDS — AWS handles all password management automatically.

#### Option 2: Manual Dynamic References with Secrets Manager

Alternatively, you can manually create a secret in Secrets Manager (using `AWS::SecretsManager::Secret`) and reference it dynamically in your RDS instance. This approach gives you more explicit control over the secret and its properties, including rotation configuration:

```yaml
Resources:
  DatabaseSecret:
    Type: AWS::SecretsManager::Secret
    Properties:
      GenerateSecretString:
        SecretStringTemplate: '{"username": "admin"}'
        GenerateStringKey: "password"
        PasswordLength: 32

  MyDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      Engine: mysql
      DBInstanceClass: db.t3.micro
      MasterUsername: !Sub '{{resolve:secretsmanager:${DatabaseSecret}:SecretString:username}}'
      MasterUserPassword: !Sub '{{resolve:secretsmanager:${DatabaseSecret}:SecretString:password}}'

  SecretRotationAttachment:
    Type: AWS::SecretsManager::SecretTargetAttachment
    Properties:
      SecretId: !Ref DatabaseSecret
      TargetId: !Ref MyDatabase
      TargetType: RDSDBInstance
```

The `SecretTargetAttachment` resource links the secret to the RDS instance, enabling automatic password rotation — Secrets Manager can periodically update the password in both the secret and the database without requiring template changes.

#### Limitations and Constraints

- CloudFormation allows a **maximum of 60 dynamic references** per stack template
- Dynamic references **cannot be used in properties that form a resource's primary identifier**
- Dynamic references are **not supported in custom resources, `AWS::CloudFormation::Init` metadata, or EC2 `UserData` properties**
- If your template uses **transforms** (such as `AWS::Include` or `AWS::Serverless`), dynamic references are not resolved before the transform is applied — they are resolved later during change set execution
- Dynamic references **cannot end with a backslash**

#### Exam Notes

- Dynamic references retrieve sensitive values from Systems Manager Parameter Store or Secrets Manager at runtime, keeping secrets out of templates
- Three syntax patterns: `{{resolve:ssm:...}}`, `{{resolve:ssm-secure:...}}`, and `{{resolve:secretsmanager:...}}`
- **ManageMasterUserPassword** for RDS is the simplest approach — AWS automatically manages password and rotation
- Manual dynamic references with **SecretsManager::Secret** and **SecretTargetAttachment** enable explicit rotation configuration
- Maximum 60 dynamic references per stack template
- Dynamic references are not supported in custom resources, CloudFormation::Init metadata, or UserData properties


### User Data in EC2 for CloudFormation
we can have user data at ec2 instance launch through console as a script
write same ec2 user-data script in cf template

important thing to pass is the entire script through Fn::Base64

user data script log is in /var/log/cloud-init-output.log

### CloudFormation Helper Scripts

CloudFormation helper scripts are Python-based tools that come pre-installed on Amazon Linux AMIs or can be installed via `yum` or `dnf` package managers. They solve several key challenges when configuring EC2 instances through CloudFormation:

- How to manage complex, large-scale instance configurations declaratively
- How to evolve EC2 instance state without terminating and recreating the instance
- How to make EC2 user data more readable and maintainable
- How to signal CloudFormation that an EC2 instance has been configured successfully

#### cfn-init

The **cfn-init** helper script retrieves and interprets resource metadata from CloudFormation, making complex EC2 configurations readable and maintainable. It is a Python script that queries the CloudFormation service for initialization data defined in the `AWS::CloudFormation::Init` metadata section of a resource.

**Configuration Execution Order**

The `AWS::CloudFormation::Init` metadata section contains a configuration that executes in the following order:

- **Packages** — Download and install pre-packaged applications and components
- **Groups** — Create user groups on the instance
- **Users** — Create users and assign them to groups
- **Sources** — Download files and archives, then place them on the EC2 instance
- **Files** — Create files on the EC2 instance using inline content or by pulling from a URL
- **Commands** — Execute a series of shell commands
- **Services** — Start or manage system services (sysvinit)

**Metadata and Logging**

The `AWS::CloudFormation::Init` metadata must be placed in the metadata section of the resource. When cfn-init executes, it logs all output to `/var/log/cfn-init.log`, which is essential for debugging configuration issues.

#### cfn-signal and Wait Conditions

After **cfn-init** completes, CloudFormation needs to know whether the EC2 instance was configured successfully. The **cfn-signal** script sends a success or failure signal back to CloudFormation, allowing the template to proceed or fail accordingly.

**How It Works**

- Run the **cfn-signal** script immediately after cfn-init completes
- cfn-signal notifies CloudFormation whether the resource creation was successful or failed
- CloudFormation either continues with the next resource or fails the entire stack based on the signal received

**Wait Conditions and Creation Policies**

Define a **wait condition** to control template execution:

- **WaitCondition** — Blocks the template until it receives the required number of signals from cfn-signal
- **CreationPolicy** — An alternative to WaitCondition that also works with EC2 instances and Auto Scaling Groups (ASGs)
- **Count** — If you need more than one signal (e.g., from multiple instances), define `Count > 1` on the wait condition

**Example: Using cfn-signal with a WaitCondition**

```yaml
Resources:
  MyInstance:
    Type: AWS::EC2::Instance
    Metadata:
      AWS::CloudFormation::Init:
        config:
          packages:
            yum:
              httpd: []
          commands:
            01_start_httpd:
              command: systemctl start httpd
    Properties:
      ImageId: ami-0c55b159cbfafe1f0
      InstanceType: t3.micro
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash
          /opt/aws/bin/cfn-init -v --stack ${AWS::StackName} --resource MyInstance --region ${AWS::Region}
          /opt/aws/bin/cfn-signal -e $? --stack ${AWS::StackName} --resource MyWaitCondition --region ${AWS::Region}

  MyWaitCondition:
    Type: AWS::CloudFormation::WaitCondition
    Properties:
      Count: 1
      Handle: !Ref MyWaitHandle
      Timeout: 300

  MyWaitHandle:
    Type: AWS::CloudFormation::WaitConditionHandle
```

#### Common Failures and Troubleshooting

**Issue: Did not receive the required number of signals from EC2**

This occurs when cfn-signal fails to communicate back to CloudFormation. Common causes and solutions:

- **AMI missing helper scripts** — Ensure the AMI has CloudFormation helper scripts installed. Amazon Linux AMIs come with them pre-installed; for other distributions, you may need to install them manually.
- **Verify cfn-init and cfn-signal output** — Check `/var/log/cfn-init.log` and `/var/log/cloud-init-output.log` on the instance for error messages.
- **Retrieve logs for debugging** — Log into the instance to inspect logs. You must disable **rollback on failure** in the stack to prevent CloudFormation from terminating the instance before you can investigate.
- **Network connectivity** — Verify the EC2 instance has internet connectivity to reach the CloudFormation service endpoint.

#### Exam Notes

- **cfn-init** is a Python helper script that retrieves and executes resource metadata, making complex EC2 configurations declarative and readable
- Configurations execute in order: Packages → Groups → Users → Sources → Files → Commands → Services
- cfn-init logs to `/var/log/cfn-init.log`
- **cfn-signal** must be called after cfn-init to notify CloudFormation of success or failure
- **WaitCondition** and **CreationPolicy** block the template until cfn-signal signals completion
- Common failure causes: missing helper scripts on AMI, no network connectivity, configuration errors in cfn-init
- Disable rollback on failure to debug instance configuration issues before CloudFormation terminates the instance

### Nested Stacks

Nested stacks are CloudFormation templates that create other CloudFormation stacks. This pattern enables you to isolate repeated components and reusable patterns in separate stacks, which are then invoked from a parent (root) stack. Nested stacks are considered a best practice for managing complex infrastructure with reusable components.

#### Use Cases for Nested Stacks

Nested stacks are ideal when you have common infrastructure patterns that need to be reused across multiple deployments:

- **Load balancer configurations** — Define an ALB configuration once, deploy it as a nested stack from multiple parent stacks
- **Security group templates** — Create standardized security group setups that are referenced by multiple applications
- **Database templates** — Encapsulate RDS configurations for reuse across environments
- **Networking components** — Define subnets, NAT gateways, and route tables as nested stacks

#### Stack Hierarchy and Updates

Nested stacks follow a parent-child relationship. When updating a nested stack, always update the parent (root) stack rather than updating the nested stack directly. This ensures that CloudFormation maintains consistency across the entire stack hierarchy and can properly manage dependencies.

Nested stacks can be arbitrarily deep—a nested stack can itself contain nested stacks, allowing you to build complex multi-level architectures while maintaining modularity.

#### Nested Stacks vs. Cross-Stack References

**Nested Stacks** — Used when infrastructure components must be reused and tightly coupled. The nested stack is managed entirely through the parent stack; its lifecycle is tied to the parent. Nested stacks are useful for encapsulating repeated patterns and are visible only within the parent stack context.

**Cross-Stack References** — Used when stacks have independent lifecycles and must share values. One stack exports values via the `Export` property in Outputs; other stacks import those values using `Fn::ImportValue`. Cross-stack references are helpful when teams manage different stacks independently, as they allow loose coupling through value sharing.

**Key Difference:** Nested stacks are for component reuse with tight coupling; cross-stacks are for independent stacks that need to share specific values.

#### Exam Notes

For AWS Certified DevOps Engineer exam purposes, you should understand:
- The purpose of nested stacks and when they are used (component reuse and modularity)
- The relationship between parent and nested stacks in the stack hierarchy
- That updates to nested stacks should always be performed through the parent stack
- The distinction between nested stacks (reuse and tight coupling) and cross-stack references (independent lifecycles and loose coupling)
- Practical scenarios where nested stacks are the appropriate solution versus cross-stacks

### DependsOn

**DependsOn** is a CloudFormation attribute that explicitly specifies the creation order of resources. When added to a resource, that resource is created only after the resource specified in the `DependsOn` attribute has been successfully created.

#### How DependsOn Works

CloudFormation automatically detects implicit dependencies when resources reference each other using `!Ref` (Ref) or `!GetAtt` (GetAtt) intrinsic functions. In these cases, CloudFormation creates the referenced resource first without requiring an explicit `DependsOn` declaration.

However, when resources have logical dependencies that are not automatically detected through intrinsic functions, you can use `DependsOn` to explicitly declare the creation order. This ensures CloudFormation provisions resources in the correct sequence.

#### When to Use DependsOn

DependsOn is typically required when:
- A resource depends on another resource but does not reference it via `!Ref` or `!GetAtt`
- CloudFormation cannot automatically infer the dependency relationship
- You need to enforce a specific creation order beyond what intrinsic functions provide

You can apply `DependsOn` to any CloudFormation resource type.

#### Exam Notes

- DependsOn explicitly specifies resource creation order
- Implicit dependencies are automatically detected when using `!Ref` and `!GetAtt`
- Use DependsOn only when CloudFormation cannot automatically infer dependencies
- DependsOn can be applied to any CloudFormation resource

### StackSets

**CloudFormation StackSets** enable you to create, update, and delete CloudFormation stacks across multiple AWS accounts and regions with a single operation using a single template. StackSets centralize infrastructure management, allowing you to deploy the same infrastructure consistently across your organization without repeating template operations in each target account and region.

#### How StackSets Work

StackSets use a two-tier architecture:

- **Administrator Account** — Creates and manages StackSets. An admin account defines a StackSet template and specifies which target accounts and regions should receive stack instances
- **Target Accounts** — Receive and maintain stack instances. Target accounts host the actual resources deployed from the StackSet. When you update a StackSet, CloudFormation automatically updates all stack instances in all target accounts and regions specified

When a StackSet is updated, all target accounts receive the update simultaneously, ensuring consistent infrastructure versions across your organization.

#### Permission Models

CloudFormation StackSets support two permission models for controlling deployment authorization:

##### Self-Managed Permissions

With self-managed permissions, you manually create and manage **IAM roles** in both the administrator account and each target account:

- Create an IAM role in the administrator account to assume roles in target accounts
- Create an IAM role in each target account that can be assumed by the administrator account
- Deploy StackSet instances to any target account in which you have permission to create and assume the required IAM role
- Suitable for deployments across accounts you manage directly

##### Service-Managed Permissions

Service-managed permissions leverage **AWS Organizations** to automate role creation and management:

- Deploy to accounts managed by AWS Organizations
- CloudFormation automatically creates and manages the required IAM roles on your behalf
- Requires that all features in AWS Organizations be enabled
- Provides automatic support for accounts added to your organization in the future
- Scales more easily across large organizations

#### StackSets with AWS Organizations

CloudFormation StackSets integrates with AWS Organizations to provide automatic deployment at scale:

- **Automatic deployment to new accounts** — Configure a StackSet to automatically deploy stack instances to new accounts as they are added to your organization
- **Delegated administration** — Delegate StackSets administration to member accounts within your organization, allowing those accounts to manage their own StackSet deployments without requiring root-level permissions
- **Trusted access requirement** — Trusted access with AWS Organizations must be enabled for StackSets to access your organization structure and deploy across member accounts

#### Exam Notes

- StackSets enable multi-account, multi-region deployments from a single template
- Administrator accounts create and manage StackSets; target accounts host stack instances
- Updates to a StackSet are applied to all target accounts simultaneously
- Two permission models: self-managed (manual IAM roles) and service-managed (AWS Organizations)
- Service-managed StackSets automatically support new accounts added to an organization
- Trusted access with AWS Organizations must be enabled for organization-integrated deployments


### Troubleshooting

#### DELETE_FAILED

This error occurs when CloudFormation cannot delete one or more resources in the stack. Common causes and solutions:

- **Resources must be emptied before deletion** — Some resources (e.g., S3 buckets with objects, RDS databases) cannot be deleted while they contain data. Empty the resource first, then retry the stack deletion.
- **Security groups have dependent resources** — Security groups cannot be deleted if EC2 instances or other resources are still using them. Ensure all instances in the security group are terminated or reassigned to different security groups before deletion.
- **Use DeletionPolicy to retain resources** — Set `DeletionPolicy: Retain` on resources you want to keep when the stack is deleted. This prevents CloudFormation from attempting to delete the resource.
- **Automate cleanup with custom resources** — For complex deletion scenarios, use **custom resources** with **Lambda functions** to automate cleanup actions before CloudFormation deletes the resource.

#### UPDATE_ROLLBACK_FAILED

This error indicates that CloudFormation failed to update the stack and then also failed to roll back to the previous state. The stack is now in an inconsistent state. Common causes:

- **Resources changed outside of CloudFormation** — Manual changes made directly in the AWS console can cause update operations to fail and prevent rollback.
- **Insufficient permissions** — The CloudFormation execution role lacks the necessary permissions to complete the update or rollback operation.
- **Auto Scaling Group signals not received** — The ASG did not receive the required number of signals during the update, causing the update to fail.

**Resolution:** Manually investigate and fix the underlying error, then use `ContinueUpdateRollback` to complete the rollback operation.

#### Stack Operation Failed (Outdated)

This error occurs when a stack operation fails due to account-level or permission issues. Investigate the following causes:

- **Insufficient permissions in target account** — The CloudFormation execution role does not have permissions to create the resource in the target account.
- **Attempting to create a global resource** — Some resources (e.g., IAM roles, S3 buckets) are global and can only exist once per AWS account. The template may be trying to create a duplicate global resource.
- **Missing trust relationship** — The admin account does not have a trust relationship configured with the target account, preventing cross-account stack creation.
- **Quotas or limits reached** — The target account has reached a service quota or resource limit. Check CloudFormation limits and request quota increases if needed.

#### EC2 Instance Private DNS Name Cannot Be Set

CloudFormation does not support setting the private DNS name of an EC2 instance. This is a CloudFormation-specific limitation:

- **General rule:** CloudFormation can only set properties that are configurable through the AWS console. Since private DNS names cannot be modified through the console, CloudFormation does not support this property.
- **Workaround:** Use EC2 user data scripts or Systems Manager to configure DNS settings post-launch if needed.

#### Template Works in One Region but Not Another

When a CloudFormation template succeeds in one region but fails in another, check for region-specific misconfigurations:

- **Service availability** — The AWS service may not be available in the target region. Verify that all services used in the template are available in the target region.
- **Hardcoded AMI IDs** — AMI IDs are region-specific. If the template hardcodes an AMI ID from another region, it will fail. Use **Mappings** to store region-specific AMI IDs or use an AMI lookup parameter.
- **Hardcoded ARNs and endpoints** — Verify that ARNs, endpoint URLs, and other region-specific values are not hardcoded. Use `!Sub` or `Fn::ImportValue` to dynamically reference region-appropriate values.
- **Unique resource names** — Ensure that globally unique resource names (e.g., S3 bucket names, SNS topic names) are not hardcoded. Use parameters or generate unique names dynamically.

#### Exam Notes

- **DELETE_FAILED** can be resolved by emptying resources, removing dependencies, using DeletionPolicy, or automating cleanup with custom Lambda functions
- **UPDATE_ROLLBACK_FAILED** requires manual intervention to fix the underlying error before calling `ContinueUpdateRollback`
- Stack operation failures are often due to insufficient permissions, quota limits, or account configuration issues
- CloudFormation can only manage properties that are accessible through the AWS console
- Region-specific failures typically stem from hardcoded values (AMI IDs, ARNs, endpoint URLs) or service availability issues—use dynamic references and Mappings instead
- Always test templates in multiple regions before deploying to production


### ChangeSets

**CloudFormation ChangeSets** allow you to preview the exact changes that will be made to a stack before applying them. When you update a stack, ChangeSets show you which resources will be created, modified, or deleted, and how their properties will change. This preview capability enables you to review changes thoroughly before committing them to production.

#### Change Set Workflow

The typical workflow for using ChangeSets is straightforward:

1. **Create Change Set** — Submit your updated template to CloudFormation, which creates a change set without executing any changes
2. **Review Changes** — Examine the proposed changes to see exactly what will be added, modified, or removed
3. **Execute or Discard** — Execute the change set to apply the changes, or discard it if the changes are not what you expected

#### What Change Sets Show

A change set displays detailed information about each resource change:

- **Add** — Resources that will be created as part of the update
- **Modify** — Resources that will be updated, including which properties will change
- **Remove** — Resources that will be deleted from the stack
- **Physical Resource ID** — The actual AWS resource ID that will be affected

#### Important Limitation

ChangeSets show you **what will change**, but they do **not** indicate whether the update will succeed. A change set might show a modification as "Add" or "Modify" even if the actual update operation will fail due to:

- Insufficient permissions
- Resource constraints or conflicts
- Service quotas or limits
- Invalid property values that conflict with the resource's current state

Always review the change set carefully and test in non-production environments before executing changes in production.

#### Nested ChangeSets

When a parent stack contains nested stacks, ChangeSets can show changes propagating through the stack hierarchy. If you update a nested stack through the parent, the change set will display all changes across both the parent and nested stacks, giving you a complete view of infrastructure changes.

#### Exam Notes

- **ChangeSets preview changes before execution** — Use them to review updates thoroughly before applying to production
- **Change sets show Add, Modify, and Remove actions** — They provide detailed visibility into which resources will be affected and how
- **ChangeSets do not guarantee success** — They show structural changes only; permission errors, quota limits, and other runtime failures are not reflected in the change set preview
- **Discard unwanted changes** — If a change set does not match your expectations, discard it without executing
- **Nested stacks appear in change sets** — Updates to nested stacks are visible in the parent's change set, showing the full scope of changes

### cfn-hup

**cfn-hup** is a daemon service that continuously monitors CloudFormation resource metadata on EC2 instances. If the metadata changes (via a stack update), cfn-hup detects the change and automatically re-executes the configuration defined in that metadata. This capability is essential for keeping instances in sync with infrastructure changes without manual intervention.

#### How cfn-hup Works

cfn-hup operates on a polling interval, periodically checking the CloudFormation service for metadata updates:

1. The daemon queries the stack metadata at regular intervals (configurable, typically every 15 minutes)
2. If metadata has changed since the last check, cfn-hup detects the change
3. cfn-hup re-runs **cfn-init** to apply the new configuration
4. The instance is updated to match the new metadata definition

This approach keeps instances synchronized with stack updates automatically, ensuring that manual drift does not occur due to outdated configurations.

#### Configuration Files

cfn-hup requires two configuration files to operate:

**`/etc/cfn/cfn-hup.conf`**
- Contains global configuration for the cfn-hup daemon
- Specifies the stack name and region to monitor
- Example:
  ```
  [main]
  stack=MyStackName
  region=us-east-1
  interval=15
  ```

**`/etc/cfn/hooks.d/cfn-auto-reloader.conf`**
- Defines actions to take when metadata changes are detected
- Specifies which metadata sections trigger configuration reapplication
- Typically calls cfn-init to apply the updated metadata
- Example:
  ```
  [cfn-auto-reloader-hook]
  triggers=post.update
  path=AWS::CloudFormation::Init
  action=/opt/aws/bin/cfn-init -v --stack MyStackName --resource MyInstance --region us-east-1
  runas=root
  ```

#### Integration with cfn-init

cfn-hup and **cfn-init** work together to keep instance configurations declarative and synchronized:

- **cfn-init** applies the initial configuration when the instance first launches
- **cfn-hup** monitors for metadata changes and re-invokes cfn-init as needed
- Both tools use the same metadata structure (under `AWS::CloudFormation::Init`)

This combination eliminates the need for manual configuration updates or instance replacement when you need to change instance behavior.

#### Exam Notes

- **cfn-hup is a daemon that monitors metadata changes** — It polls CloudFormation at regular intervals and re-applies configuration when metadata updates
- **Two configuration files are required:** `/etc/cfn/cfn-hup.conf` (global settings) and `/etc/cfn/hooks.d/cfn-auto-reloader.conf` (action triggers)
- **cfn-hup works with cfn-init** — When metadata changes, cfn-hup re-executes cfn-init to apply the new configuration
- **Polling interval is configurable** — By default, cfn-hup checks for metadata changes every 15 minutes, but this can be adjusted in the configuration file
- **Automatic synchronization** — cfn-hup keeps instances in sync with stack updates without requiring instance replacement or manual intervention
- **Both cfn-hup and cfn-init must be properly configured** — Missing or incorrect configuration files will prevent the daemon from functioning correctly

### Drift

**Drift Detection** is a CloudFormation feature that identifies and reports when resources in a stack have been manually modified outside of CloudFormation. Infrastructure drift occurs when actual resource configurations diverge from the template definition. Drift detection helps you maintain infrastructure consistency by alerting you when manual changes have been made.

#### Why Drift Detection Matters

CloudFormation creates and orchestrates resources according to your template, but it does not prevent users from modifying those resources directly through the AWS console, CLI, or other tools. Over time, these out-of-band modifications can accumulate, causing the actual infrastructure to diverge significantly from the template. Drift detection identifies these discrepancies, allowing you to either:

- Reconcile the drift by manually updating the template to match the actual configuration
- Update the resources back to their template-defined state
- Understand what untracked changes exist in production

#### How to Detect and View Drift

Drift detection is simple to execute:

1. **Initiate drift detection** — In the CloudFormation console, select a stack and choose "Detect Drift" to scan all resources in the stack
2. **CloudFormation scans resources** — The service queries each resource's current configuration and compares it to the template definition
3. **View drift results** — Once the scan completes, you can view which resources have drifted and what specific property changes were made

The drift detection report shows the **expected** configuration (from the template) alongside the **actual** configuration (from the resource's current state).

#### Drift Status Values

Each resource can have one of four drift statuses:

- **IN_SYNC** — The resource's current configuration matches the template definition exactly
- **DRIFTED** — The resource's current configuration differs from the template in one or more properties
- **NOT_CHECKED** — The resource was not checked during the drift detection scan (either because it is not supported by drift detection or because the scan did not complete)
- **DELETED** — The resource defined in the template has been deleted outside of CloudFormation

#### Limitations of Drift Detection

Drift detection is powerful but has important limitations:

- **Not all resource types support drift detection** — Some AWS resource types do not support drift detection. Check the AWS documentation to verify that your resources are supported before relying on drift detection for compliance
- **Drift detection scans only CloudFormation-managed properties** — User data, tags, and other metadata set outside of CloudFormation may not be captured by drift detection
- **Partial resource support** — For resources that do support drift detection, only certain properties are checked. Custom or vendor-specific properties may not be compared

#### Common Drift Scenarios

**Example: Manual EC2 Security Group Change**

A developer modifies a security group rule directly in the console instead of updating the CloudFormation template. When you run drift detection, the security group shows as **DRIFTED**, with a report showing the actual rule differs from the template definition.

**Example: Lambda Function Code Update**

A Lambda function's code is updated directly through the console without updating the template. Drift detection identifies this change, showing that the function's code hash differs from the template.

#### Exam Notes

- **Drift detection identifies manual changes to resources** — It compares the actual configuration of each resource to the template definition
- **Drift statuses:** IN_SYNC, DRIFTED, NOT_CHECKED, and DELETED
- **Not all resource types support drift detection** — Verify that your resources are supported before assuming drift detection will work
- **Drift detection does not prevent manual changes** — It only detects and reports them; enforcement requires additional mechanisms (like IAM policies)
- **Drift reports show expected vs. actual configuration** — Use these reports to understand what changes have been made and decide whether to reconcile them
- **Common drift scenarios include manual resource edits through the console, direct CLI modifications, and changes made by other automation tools**

## AWS Service Catalog

A self-service portal that enables users to launch a curated set of authorized products that are pre-defined and managed by administrators. Service Catalog provides a streamlined way to provision approved AWS infrastructure without requiring deep knowledge of underlying resources and configuration details.

### Overview

**Included Products:**
VMs, databases, storage solutions, and other AWS services

**Administrator Role:**
- Define products using CloudFormation templates
- Organize products into portfolios
- Configure IAM permissions for portfolio access

**User Experience:**
- Browse available products through the Service Catalog interface
- Launch desired products, which provision resources based on associated CloudFormation templates

**Key Benefits:**
- Create and manage a catalog of IT services approved on AWS
- Ensure consistency and standardization across deployments
- Assign teams to specific portfolios for controlled access
- Centrally manage deployed services as products
- Support governance, compliance, and organizational consistency
- Integration with ServiceNow for ticketing and workflow automation

### Constraints

#### Stack Set Constraints
Configure product deployment options using CloudFormation StackSets.

**Restrict Deployments By:**
- **Accounts:** Identify AWS accounts where products can be created
- **Regions:** Specify regions for deployment (order can be configured)
- **Permissions:** IAM StackSet Administrator role required to manage target AWS accounts

#### Launch Constraints

An IAM role assigned to a product that allows users to launch, update, or terminate products with minimal direct IAM permissions.

**Example Use Case:**
An end user has access to Service Catalog without broad AWS permissions. All additional permissions required for the product are attached to the launch constraint IAM role.

**Required IAM Permissions:**
- CloudFormation: Full access
- AWS services referenced in the CloudFormation template: Required permissions
- S3 bucket containing the template: Read access

### Integration with Version Control (Git-Synced Products)

**Git-Synced Products:**
- Service Catalog natively supports syncing products with GitHub, GitHub Enterprise, or Bitbucket repositories via AWS CodeStar Connections
- Authorize a one-time connection, then specify the repository, branch, and template file path
- Service Catalog automatically detects commits and creates new product versions
- No custom CI/CD pipelines or Lambda functions required

This approach ensures that Service Catalog products are always synchronized with the latest approved templates in version control.


## Elastic Beanstalk

### Overview

**Problem**: Most web applications have similar underlying architecture (Application Load Balancer + Auto Scaling Group). Developers want to focus on writing application code without managing infrastructure provisioning, deployment, database configuration, load balancer setup, and scaling concerns.

**Solution**: Elastic Beanstalk is a developer-centric, managed service for deploying applications on AWS. It abstracts away infrastructure complexity by handling capacity provisioning, load balancing, auto-scaling, application health monitoring, and instance configuration. Developers are responsible only for application code. Elastic Beanstalk itself is free; you pay only for the underlying AWS resources consumed.

### Components

- **Application**: A collection of Elastic Beanstalk components including environments, application versions, and configurations.
- **Application Version**: A specific iteration or snapshot of your application code.
- **Environment**: A collection of AWS resources running a particular application version.
- **Tiers**: Web server tier (for web applications) or worker tier (for background job processing).
- **Multiple Environments**: Support for separate environments such as development, testing, staging, and production.

**Workflow**: Create application → upload version → launch environment → manage environment

### Supported Languages and Platforms

Elastic Beanstalk supports numerous programming languages and frameworks, including:
- Go
- Java SE
- Java with Tomcat
- .NET
- PHP
- Python
- Ruby
- Packer Builder
- Docker

### Web Server Tier vs. Worker Tier

**Web Server Tier**: Best for traditional web applications. Handles incoming HTTP/HTTPS requests and serves web pages.

**Worker Tier**: Best for long-running or background tasks. Decouples heavy processing from the web tier by using Amazon SQS queues to send tasks from the web environment to a dedicated worker environment.

**Use Case Example**: A web application could receive a request to process a video or generate a ZIP file. Instead of handling this synchronously in the web tier (which would block other requests), the web environment sends the task to an SQS queue, and a worker environment processes it asynchronously.

**Periodic Tasks**: Worker tiers support periodic task scheduling via `cron.yaml`, enabling scheduled background jobs.

### Notifications

Elastic Beanstalk integrates with Amazon EventBridge to create rules that trigger actions based on events, including:
- Environment operation status changes
- Other AWS resource status changes
- Managed updates status
- Environment health status

### Deployment Modes

- **Single Instance Deployment**: Recommended for development and testing environments. Deploys your application to a single Amazon EC2 instance with no load balancer.

- **High Availability with Load Balancer**: Recommended for production environments. Deploys your application across multiple Amazon EC2 instances behind an Application Load Balancer, with auto-scaling enabled for resilience and performance.


## AWS SAM

**AWS Serverless Application Model (SAM)** is a framework for developing and deploying serverless applications. All configuration is defined in YAML, which SAM transforms into complex CloudFormation templates. SAM supports all CloudFormation features, including outputs, mappings, parameters, and resources.

### Key Capabilities

- **Lambda Deployment**: SAM integrates with CodeDeploy to deploy Lambda functions with advanced traffic shifting and rollback capabilities
- **Local Development**: Run Lambda, API Gateway, and DynamoDB locally for rapid debugging and testing
- **Serverless-First Design**: Purpose-built for serverless applications, streamlining both local development and AWS deployment

### Basic Recipe

#### Transform Header
Declare a SAM template using the transform directive:
```yaml
Transform: 'AWS::Serverless-2016-10-31'
```

#### Define Serverless Resources
Express serverless components using SAM resource types:
- `AWS::Serverless::Function` — Lambda function
- `AWS::Serverless::Api` — API Gateway
- `AWS::Serverless::SimpleTable` — DynamoDB table

#### Example Template

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: 'AWS::Serverless-2016-10-31'
Description: Simple API with Lambda and DynamoDB

Globals:
  Function:
    Timeout: 10
    Runtime: nodejs20.x

Resources:
  ItemsTable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      PrimaryKey:
        Name: id
        Type: String

  GetItemFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: src/get.handler
      CodeUri: ./
      Environment:
        Variables:
          TABLE_NAME: !Ref ItemsTable
      Policies:
        - DynamoDBReadPolicy:
            TableName: !Ref ItemsTable
      Events:
        GetItem:
          Type: Api
          Properties:
            Path: /items/{id}
            Method: get

  PutItemFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: src/put.handler
      CodeUri: ./
      Environment:
        Variables:
          TABLE_NAME: !Ref ItemsTable
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref ItemsTable
      Events:
        PutItem:
          Type: Api
          Properties:
            Path: /items
            Method: post

Outputs:
  ApiUrl:
    Value: !Sub 'https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/'
```

This shows SAM's key advantages: the `Events` property on a function auto-creates the API Gateway, SAM policy templates (`DynamoDBReadPolicy`) replace verbose IAM, and `SimpleTable` abstracts DynamoDB setup to a few lines.

#### Package and Deploy
```bash
sam package  # (optional)
sam deploy   # Package and deploy the application
```

For rapid iteration on Lambda code:
```bash
sam sync --watch  # Monitor for file changes and sync automatically
```

### Deployment Process

The deployment workflow follows these steps:
1. Application code + SAM YAML template
2. Transform to CloudFormation template
3. Zip and upload to S3
4. Create and execute CloudFormation changeset

### SAM Accelerate (sam sync)

**SAM Accelerate** is a feature set designed to minimize deployment latency by syncing changes directly to AWS without waiting for full CloudFormation stack updates.

#### `sam sync`
Syncs the project to AWS, applying both infrastructure and code changes. Code updates are pushed directly to Lambda functions without CloudFormation changeset overhead by leveraging AWS service APIs.

#### `sam sync --code`
Syncs code only, skipping infrastructure changes for faster updates when templates are unchanged.

#### `sam sync --code --resource <LogicalId>`
Syncs only a specific resource, enabling isolated updates to individual functions or resources.

#### `sam sync --watch`
Monitors the file system for changes and syncs automatically:
- Configuration changes trigger a full `sam sync`
- Code-only changes trigger `sam sync --code` for speed

### CodeDeploy Integration

SAM natively integrates with CodeDeploy to manage Lambda function deployments with sophisticated safety controls.

#### AutoPublishAlias
Automatically detects when new code is deployed, creates and publishes an updated function version with the latest code, and points the alias to the new version.

#### Deployment Preferences
Control how traffic transitions during deployments:
- **Canary**: Route a small percentage of traffic to the new version first, then shift the rest if successful
- **Linear**: Gradually shift traffic in increments (e.g., 10% every 10 minutes)
- **AllAtOnce**: Shift all traffic immediately (highest risk, fastest deployment)

#### Traffic Shifting Hooks
Execute pre-traffic and post-traffic validation:
- **Pre-traffic hook**: Lambda function to test the new version before traffic is shifted
- **Post-traffic hook**: Lambda function to validate the deployment after traffic has shifted

#### Alarms and Rollback
CloudWatch alarms can automatically trigger rollback if deployment metrics fall outside acceptable thresholds, enabling automated failure recovery.


## AWS Cloud Development Kit (CDK)

**AWS CDK** enables you to define cloud infrastructure using programming languages such as JavaScript, TypeScript, Python, Java, and .NET rather than declarative configuration files. CDK supersedes CloudFormation for infrastructure-as-code projects that benefit from programmatic control and type safety.

### Key Concepts

**Constructs**: High-level, reusable components that represent AWS resources and services. Constructs abstract away the complexity of individual CloudFormation resources and can be composed into larger constructs.

**Synthesis**: CDK synthesizes your code into a CloudFormation template, enabling infrastructure and application runtime code to be deployed together in a single operation.

**Type Safety**: Unlike YAML-based infrastructure definitions, CDK provides full type safety through programming languages, catching configuration errors at development time rather than deployment time.

### CDK vs SAM

**AWS SAM (Serverless Application Model)**:
- Focused on serverless workloads
- Templates defined declaratively in JSON or YAML
- Optimized for quick-start Lambda development
- Leverages CloudFormation under the hood

**AWS CDK**:
- Supports all AWS services, not limited to serverless
- Infrastructure defined programmatically in a general-purpose language
- Provides type safety and IDE support
- Also leverages CloudFormation for deployment

### Example: Defining a Lambda-backed API

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class MyApiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // DynamoDB table
    const table = new dynamodb.Table(this, 'Items', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda function
    const fn = new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: { TABLE_NAME: table.tableName },
    });

    // Grant Lambda read/write access to the table
    table.grantReadWriteData(fn);

    // API Gateway
    new apigateway.LambdaRestApi(this, 'Api', { handler: fn });
  }
}
```


### CDK + SAM Integration

You can use the **SAM CLI** to locally test CDK-generated infrastructure:

1. Run `cdk synth` to generate a CloudFormation template from your CDK code
2. Use `sam local invoke` to test Lambda functions locally against the generated template
3. This workflow allows you to validate your infrastructure and functions before deployment

## Step Functions

AWS Step Functions is a fully managed service that allows you to design and orchestrate complex workflows using state machines. Each workflow consists of a single state machine that coordinates the execution of AWS services and custom logic. Common use cases include order fulfillment pipelines, data processing workflows, web application orchestration, and any custom multi-step business process requiring state management and error handling.

### Overview

**Workflow Definition**: State machines are defined in JSON format, providing a clear, declarative representation of workflow logic that is both human-readable and machine-parseable.

**Visualization and Execution History**: Step Functions provides built-in visualization of your workflow structure, allowing you to see the flow at a glance. Each execution is tracked with a complete history, enabling straightforward debugging, auditing, and compliance verification.

**Service Orchestration**: Step Functions orchestrates interactions between multiple AWS services and external resources, automatically managing state transitions, error handling, and the flow of data between steps.

### Example: Order Processing Workflow

```json
{
  "Comment": "Order processing workflow",
  "StartAt": "ValidateOrder",
  "States": {
    "ValidateOrder": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:ValidateOrder",
      "Next": "CheckInventory"
    },
    "CheckInventory": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:CheckInventory",
      "Next": "IsInStock"
    },
    "IsInStock": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.inStock",
          "BooleanEquals": true,
          "Next": "ProcessPayment"
        }
      ],
      "Default": "BackorderNotification"
    },
    "ProcessPayment": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:ProcessPayment",
      "Next": "ShipOrder"
    },
    "ShipOrder": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:ShipOrder",
      "End": true
    },
    "BackorderNotification": {
      "Type": "Task",
      "Resource": "arn:aws:states:::sns:publish",
      "Parameters": {
        "TopicArn": "arn:aws:sns:us-east-1:123456789:BackorderAlerts",
        "Message.$": "$.orderDetails"
      },
      "End": true
    }
  }
}
```

This demonstrates Task states invoking Lambda functions, a Choice state for conditional branching, and a direct SNS integration using the `arn:aws:states:::` service integration syntax.

### Invocation Methods

State machine executions can be initiated through any of the following mechanisms:

- AWS SDK calls
- API Gateway endpoints
- EventBridge rules
- AWS CLI

### State Types

#### Task States

Task states perform actual work within the state machine. Common actions include:

- Invoking **AWS Lambda** functions
- Running **AWS Batch** jobs
- Executing **Amazon ECS** tasks
- Inserting data into **Amazon DynamoDB**
- Publishing messages to **Amazon SNS** or **Amazon SQS**

**Activities**: Task states can also invoke activities, which are long-running operations that execute on external resources (EC2 instances, Amazon ECS, or on-premises systems). Activities poll Step Functions for work units and return results back to the state machine upon completion.

#### Choice States

Choice states evaluate conditions to determine which branch of the workflow to execute next. They enable conditional branching based on state data.

#### Fail or Succeed States

These terminal states stop execution: **Succeed** states mark successful completion, while **Fail** states terminate execution with a failure status.

#### Pass States

Pass states transfer their input directly to their output without performing any work. They can also be used to inject fixed data into the workflow, useful for transforming or augmenting state data.

#### Wait States

Wait states introduce delays in workflow execution. You can specify a fixed duration or wait until a particular date and time before proceeding to the next state.

#### Map States

Map states enable dynamic iteration over arrays or collections, allowing a set of steps to be executed multiple times with different input data.

#### Parallel States

Parallel states initiate multiple branches of execution that run concurrently, enabling parallel processing within your workflow.




## AppConfig

AWS AppConfig is a capability of **AWS Systems Manager** that enables you to configure, validate, and deploy dynamic configurations to applications. It allows you to deploy configuration changes independently of code deployments, eliminating the need to restart the application. AppConfig separates configuration from code, giving operations teams the ability to update application behavior safely without going through a full CI/CD release cycle.

### Core Concepts

- **Application** — A logical grouping that represents a microservice, workload, or component (e.g., "payment-service")
- **Environment** — A deployment target such as dev, staging, or prod; each environment maintains its own independent configuration, so you can promote config changes through environments just like code
- **Configuration Profile** — Points to the configuration source and defines how AppConfig retrieves the data; each profile is associated with one source
- **Hosted Configuration Store** — AppConfig's native configuration store; supports JSON, YAML, and feature flags without requiring an external service; best choice when you don't already have config stored elsewhere

### Use Cases

- **Feature flags**: Enable or disable features without redeploying code
- **Application tuning**: Adjust performance parameters and settings
- **Allow/block listing**: Manage access control lists dynamically
- **Operational flags**: Kill switches, maintenance mode toggles to quickly respond to incidents
- **Throttling/rate limiting**: Dynamically adjust rate limits without redeployment

### Configuration Sources

A Configuration Profile points to one of the following sources:
- **Hosted Configuration Store** — AppConfig's built-in store (no external dependency)
- **SSM Parameter Store** — For config already stored as parameters
- **SSM Documents** — For config stored as SSM documents
- **Amazon S3** — For config stored as objects in S3 buckets

### Deployment Strategies

AppConfig supports three deployment strategy types, each defined by `GrowthFactor`, `DeploymentDurationInMinutes`, and `FinalBakeTimeInMinutes`:

- **AllAtOnce** — Deploys to all targets immediately; use for non-critical environments or dev/test
- **Linear** — Deploys to a fixed percentage of targets at fixed intervals (e.g., 20% every 6 minutes until 100%); steady, predictable rollout
- **Exponential** — Deploys to an exponentially growing percentage of targets (e.g., 1% → 2% → 4% → 8% → ...); allows fast ramp-up after initial validation on a small set of targets

#### Rollback

- **CloudWatch alarms** can be associated with a deployment; if an alarm fires during the deployment or bake time, AppConfig automatically rolls back to the previous configuration version
- Rollback also triggers automatically if **validation fails** during deployment
- `FinalBakeTimeInMinutes` defines a monitoring window after deployment reaches 100% — rollback can still occur during this period

### Validation

Before deploying configuration changes, AppConfig validates them using:
- **Syntactic validation**: JSON Schema to ensure proper structure and format
- **Semantic validation**: Custom Lambda functions that execute business logic to verify configuration correctness and compatibility

#### AppConfig Extensions

Extensions provide **pre- and post-deployment hooks** that run custom logic during the deployment lifecycle:
- Backed by Lambda, SQS, SNS, or EventBridge
- Use cases: notifications, enrichment, compliance checks, audit logging
- AWS-authored extensions available out of the box (e.g., Jira ticket creation, SNS notifications, CloudWatch Evidently A/B testing)

### Supported Compute Services

AppConfig integrates with:
- **EC2 / ECS / EKS** — Use the **AppConfig Agent** (sidecar or daemon) which polls for configuration updates and caches them locally
- **Lambda** — Use the **AppConfig Lambda Extension** (added as a Lambda layer) which caches configuration locally, avoiding API calls on every invocation

### AppConfig vs Parameter Store

| Aspect | AppConfig | Parameter Store |
|---|---|---|
| Purpose | Dynamic app config with safe deployment | Store/retrieve config values and secrets |
| Deployment | Gradual rollout with rollback | Immediate (get/put) |
| Validation | JSON Schema + Lambda | None built-in |
| Rollback | Automatic via CloudWatch alarms | Manual (version history) |
| Feature flags | Native support | Not purpose-built |
| Use when | Config changes need safe, staged rollout | Simple key-value lookups, secrets |

### CI/CD Integration

AppConfig integrates with **AWS CodePipeline** as a deployment action, enabling configuration deployments as part of CI/CD pipelines. This allows you to treat configuration changes with the same rigor as code changes — source control, approval gates, and staged rollout.


## Systems Manager

AWS Systems Manager helps manage Amazon EC2 instances and on-premises systems at scale, providing operational insights about infrastructure state and automated patching for enhanced compliance. It is a free service that works with both Windows and Linux and integrates with CloudWatch metrics and AWS Config.

### Features

#### Node Tools
- **Fleet Manager** — View and manage EC2 and on-premises instances
- **Compliance** — Track and report on compliance status
- **Inventory** — Collect and view inventory data from managed nodes
- **Hybrid Activations** — Activate and manage on-premises servers
- **Session Manager** — Start secure shell sessions to managed instances without SSH keys or bastion hosts
- **Run Command** — Execute commands on managed instances
- **State Manager** — Configure and maintain consistent instance state
- **Patch Manager** — Automate patching of operating systems and applications
- **Distributor** — Package and distribute software to managed nodes

#### Change Management
- **Automation** — Create and execute runbooks to automate operational tasks
- **Change Calendar** — Define and manage change approval windows
- **Maintenance Windows** — Schedule maintenance activities on instances
- **Documents** — Define the actions and parameters for automation tasks
- **Quick Setup** — Simplified configuration wizard for common tasks

#### Application Tools
- **Application Manager** — Manage applications running on managed nodes
- **AppConfig** — Feature flags and configuration management service
- **Parameter Store** — Secure storage for configuration data and secrets

#### Resource Groups
Logical grouping of resources based on tags for easier management and organization.

#### Operations Tools
- **Explorer** — Centralized view of operational data and resources
- **OpsCenter** — Incident management and response console

### How It Works

Systems Manager requires an agent to be installed on managed nodes. The agent is included by default with Amazon Linux 2 AMIs and some Ubuntu distributions.

To enable Systems Manager functionality, EC2 instances must have an appropriate IAM role attached that grants permission for Systems Manager actions.

### AWS Tags and Resource Groups

**Tags** are key-value pairs added to AWS resources (commonly used with EC2 instances) with free-form naming conventions. They are used for resource grouping, automation, and cost allocation.

**Resource Groups** allow you to create, view, and manage logical groups of resources based on tags. This enables organizing resources by applications, application stack layers (e.g., web, application, database tiers), or environments (production versus development).

Resource Groups is a regional service that works with EC2, S3, DynamoDB, and many other AWS services.

### Documents

Systems Manager Documents are defined in JSON or YAML format and specify the parameters and actions to be executed. Documents are executed by specific AWS services and are used across multiple SSM features including State Manager, Patch Manager, and Automation.

**Example SSM Document (JSON):**

```json
{
  "schemaVersion": "2.2",
  "description": "Install and start Apache HTTP Server",
  "mainSteps": [
    {
      "action": "aws:runShellScript",
      "name": "installApache",
      "inputs": {
        "runCommand": [
          "yum install -y httpd",
          "systemctl start httpd",
          "systemctl enable httpd"
        ]
      }
    }
  ]
}
```

Documents define the commands and configurations that are applied to resources during automation, patching, compliance, and state management operations.

### Automation

Automation simplifies common maintenance and deployment tasks for EC2 instances and other AWS resources. Common examples include:
- Restarting instances
- Creating Amazon Machine Images (AMIs)
- Creating Amazon EBS snapshots

**Automation Runbooks** are Systems Manager Documents of type "Automation" that define the actions performed on resources. AWS provides pre-defined runbooks for common tasks, or you can create custom runbooks.

Automations can be triggered:
- Manually via the AWS Console, CLI, or SDK
- Automatically via EventBridge rules
- As remediations for AWS Config rule violations

### Parameter Store

Parameter Store is a secure, serverless, and scalable storage service for configuration data and secrets with optional AWS Key Management Service (KMS) encryption. Key features include:
- Version tracking for parameter values
- Security through IAM policies
- Notifications via EventBridge integration
- Integration with AWS CloudFormation

#### Parameter Hierarchy

Parameters can be organized in a hierarchical namespace structure:

```
/department/
    app/
        dev/
            db-url
            db-password
        prod/
            db-url
            db-password
```

You can also reference secrets stored in AWS Secrets Manager directly:
```
/aws/reference/secretsmanager/secret_ID_in_Secrets_Manager
```

Public AWS parameters are available without configuration:
```
/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2
```

#### Parameter Tiers

Parameter Store offers two tiers:

- **Standard Tier** — 4 KB maximum parameter size, free (up to 10,000 parameters)
- **Advanced Tier** — 8 KB maximum parameter size, $0.05 per parameter per month

Advanced Tier parameters support parameter policies, time-to-live (TTL) assignment, and multiple concurrent policies.

### Patch Manager

Patch Manager automates the process of patching managed instances with operating system updates, application updates, and security patches. It supports:
- EC2 instances and on-premises servers
- Linux, macOS, and Windows operating systems
- On-demand patching or scheduled patching via maintenance windows
- Scanning instances and generating compliance reports to Amazon S3

#### Patch Baseline

A patch baseline defines which patches should and should not be installed on instances. Key features include:
- Ability to create custom patch baselines
- Support for automatic patch approval
- By default, only critical and security-related patches are approved

**Pre-Defined Baselines** — AWS provides managed patch baselines that cannot be modified. The `AWS-RunPatchBaseline` Systems Manager Document applies both operating system and application patches.

**Custom Baselines** — You can create custom patch baselines and specify custom or alternative software repositories.

#### Patch Groups

Patch groups associate a set of instances with a specific patch baseline, allowing different environments to use different patch policies. Patch groups are defined using the tag key `patch-group`. Each instance can only belong to one patch group and can only register with one patch baseline.

#### Maintenance Windows

Maintenance windows define a schedule for performing actions on instances. A maintenance window includes:
- A schedule (day and time)
- Duration (how long the window remains open)
- Registered instances (which nodes are targeted)
- Registered tasks (what actions to perform)

### Run Command

Run Command enables you to execute commands across a fleet of managed instances without needing SSH or RDP access. Commands are defined using SSM Documents and can target instances by tag, resource group, or explicit instance IDs.

- **No SSH/bastion required** — Commands execute via the SSM Agent, eliminating the need for open inbound ports
- **Output options** — Command output can be sent to Amazon S3 or CloudWatch Logs for review and retention
- **Auditing** — All command invocations are recorded in CloudTrail for full audit traceability
- **Rate and error controls** — Configure concurrency limits (how many instances run simultaneously) and error thresholds (stop execution after a set number of failures)
- **IAM integration** — Control who can run which documents on which targets using IAM policies
- **Notifications** — Configure SNS notifications for command status changes (in-progress, success, failed)

### State Manager

State Manager maintains consistent configuration across your managed instances by applying configurations at scheduled intervals using **associations**. An association binds an SSM Document to a set of targets on a defined schedule.

- **Associations** — Combine a document (what to apply), targets (which instances), and a schedule (how often) into a reusable configuration unit
- **Desired state enforcement** — Automatically reapplies configurations on a schedule to correct configuration drift
- **Common use cases:**
  - Bootstrap new instances with required software and settings
  - Keep the SSM Agent and other agents updated to the latest version
  - Enforce security configurations (firewall rules, antivirus definitions)
  - Join instances to a Windows Active Directory domain
- **Compliance reporting** — Association compliance status is visible in the Compliance dashboard

### Inventory

Inventory collects metadata from managed instances to provide visibility into your fleet's software and configuration state.

- **Collected data** — Installed applications, OS details, network configuration, Windows updates, running services, Windows roles, and custom inventory types
- **Custom inventory** — Define and collect custom metadata specific to your organization's needs
- **Data export** — Sync inventory data to an S3 bucket using Resource Data Sync, then query with Amazon Athena or visualize with Amazon QuickSight
- **Multi-account aggregation** — Aggregate inventory data across accounts and regions for centralized reporting

### Session Manager

Session Manager provides secure shell access to EC2 instances and on-premises servers through the AWS Console, CLI, or SDK without requiring SSH keys, bastion hosts, or inbound SSH ports.

**Agent Requirements**
- EC2 instances must run the Systems Manager Agent (which is pre-installed on Amazon Linux 2 and some Ubuntu distributions)
- The agent enables users to connect via Session Manager with appropriate IAM permissions
- Supports Linux, macOS, and Windows operating systems

**Logging and Auditing**
- All session connections and executed commands are logged
- Session logs can be stored in Amazon S3 or CloudWatch Logs for long-term retention and analysis
- CloudTrail captures `StartSession` events for audit trail completeness

**Access Control**
- IAM policies control which users and groups can initiate sessions
- Use resource tags to restrict access to specific EC2 instances
- Required IAM permissions: access to Systems Manager, write permissions to S3 (if logging to S3), and write permissions to CloudWatch Logs (if logging to CloudWatch)
- Command execution can be restricted through additional IAM policy conditions


### Default Host Management Configuration

When enabled, Default Host Management Configuration automatically registers EC2 instances as managed nodes without requiring an EC2 instance profile. This simplifies the setup process for Systems Manager management.

**Instance Identity Role**

The **instance identity role** is an IAM role with minimal permissions—only enough to identify the EC2 instance to AWS services such as Systems Manager. This role:
- Authenticates the EC2 instance identity
- Passes authorization to an IAM role with appropriate Systems Manager permissions
- Eliminates the need to manage explicit instance profiles

**Requirements and Behavior**
- EC2 instances must have Instance Metadata Service Version 2 (IMDSv2) enabled
- Systems Manager Agent must be installed and IMDSv2 must be enabled (IMDSv1 is not supported)
- The Systems Manager Agent is automatically kept up to date
- Configuration is enabled on a per-region basis


### Hybrid Environments

Systems Manager can manage on-premises servers, IoT devices, edge devices, and virtual machines alongside AWS EC2 instances.

**Node Identification**
- EC2 instances are identified with the prefix `i-` in the Systems Manager console
- Hybrid managed nodes (on-premises and other non-EC2 resources) are identified with the prefix `mi-`

**Hybrid Activation Setup Process**

1. **Create a Hybrid Activation** — Generate credentials for on-premises nodes to authenticate with Systems Manager
2. **Obtain Activation Code and ID** — Receive unique credentials for each activation
3. **Install Systems Manager Agent** — Deploy the SSM Agent on the target on-premises server, IoT device, or virtual machine
4. **Register with Systems Manager** — Use the activation code and ID to register the managed node with Systems Manager

**Automation Integration**

Hybrid activation can be automated using a combination of:
- **API Gateway** — Expose hybrid activation endpoints
- **Lambda** — Execute registration logic
- **Systems Manager** — Manage the registered hybrid nodes

### IoT Greengrass Instance Activation

Systems Manager can manage AWS IoT Greengrass Core devices by registering them as managed nodes in SSM, enabling centralized management of IoT edge infrastructure.

**Agent Installation**

The Systems Manager Agent can be installed on Greengrass Core devices in two ways:
- **Manual Installation** — Deploy the SSM Agent directly on the Greengrass Core device
- **Greengrass Component Deployment** — Deploy the SSM Agent as a prebuilt Greengrass component (a software module deployed directly to the Greengrass Core device)

**IAM Permissions**

The token exchange role (the IAM role used by IoT Core devices) must be granted permissions to communicate with Systems Manager. This allows the Greengrass device to authenticate and operate as a managed node.

**Capabilities**

Once registered, Greengrass Core devices have access to all Systems Manager capabilities, enabling you to:
- Patch operating systems and applications across your fleet of Greengrass devices
- Execute commands and run automation runbooks on edge devices
- Maintain consistent configuration state across distributed edge infrastructure


### Automation Use Cases

**Cost Optimization: Automatic Instance Start/Stop**

Systems Manager Automation can automatically start and stop EC2 instances and RDS databases based on schedules:
- Use **EventBridge** to schedule SSM Automation runbooks
- Trigger start and stop actions on EC2 and RDS instances at specified times
- Reduce infrastructure costs during off-peak hours and non-production periods

**Cost Optimization: Automatic Instance Downsizing**

Automation can reduce infrastructure costs by automatically downsizing EC2 instances and RDS databases:
- Execute the `AWS-ResizeInstance` automation runbook to modify instance sizes
- Pair with monitoring metrics to trigger downsizing when resource utilization is consistently low

**Golden AMI Creation**

While AWS Image Builder is the preferred solution for building golden AMIs, Automation provides an alternative approach using the `AWS-CreateImage` runbook:
- **EventBridge** triggers the automation when conditions are met
- **SSM Automation** runs `AWS-CreateImage` to create an AMI from a configured instance
- Upon completion, **EventBridge** receives the new AMI ID
- **Lambda** function stores the AMI ID in **Parameter Store** for easy reference by deployment pipelines

**AWS Config Integration**

Systems Manager Automations are tightly integrated with AWS Config:
- **Config Rules** detect configuration drift or compliance violations
- **Config Remediation** automatically triggers SSM Automation runbooks to resolve non-compliant resources
- Enables self-healing infrastructure with minimal manual intervention

### Compliance

Systems Manager Compliance provides centralized visibility into the compliance status of your managed nodes across patching and configuration management.

**Scanning and Reporting**
- Scan your fleet of managed nodes for patch compliance status and configuration inconsistencies
- Display compliance data on patches from Patch Manager and associations from State Manager
- Generates compliance reports for audit and regulatory requirements

**Data Export and Analysis**
- Sync compliance data to an Amazon S3 bucket using **Resource Data Sync**
- Analyze aggregated compliance data using **Amazon Athena** for SQL-based queries
- Visualize compliance trends and metrics using **Amazon QuickSight** dashboards

**Multi-Account and Multi-Region Coverage**
- Collect and aggregate compliance data from multiple AWS accounts and regions
- Centralize compliance reporting across your organization
- Send compliance data to **AWS Security Hub** for integrated security posture management

### OpsCenter

OpsCenter provides a centralized console for viewing, investigating, and remediating operational issues across your AWS infrastructure and on-premises environment.

**Issue Types**
- Security issues and vulnerabilities
- Performance degradation and anomalies
- Infrastructure failures and outages
- Configuration drift and compliance violations

**OpsItems**

**OpsItems** represent operational issues or interruptions that require investigation or remediation. OpsCenter aggregates issues from multiple sources:
- CloudWatch alarms and metrics
- AWS CloudTrail logs and events
- AWS Config configuration changes
- EventBridge events
- EC2 and on-premises managed nodes

**Resolution and Automation**
- OpsCenter provides recommended Systems Manager Automation runbooks to resolve identified issues
- Reduces mean time to resolution (MTTR) by automating common remediation tasks
- Supports both EC2 instances and on-premises managed nodes
- Integrates with ServiceNow and other incident management platforms


### VPC Endpoints

Systems Manager VPC endpoints enable you to access Systems Manager from EC2 instances in private subnets without requiring internet access or NAT gateways. This provides a secure way to manage private infrastructure:
- Create VPC endpoints for Systems Manager API and agent communication
- EC2 instances can reach Systems Manager services through private network routes
- Useful for highly secure environments where internet access is restricted
