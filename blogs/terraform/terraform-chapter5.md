# Chapter 5: Designing Clean Module Interfaces with Variables, Locals, Outputs, and Dependencies

> _"Good Terraform modules are not defined by the number of resources they create. They are defined by the simplicity, stability, and clarity of the interfaces they expose."_

---

# Introduction

In the previous chapter, we explored how to design reusable Terraform modules by defining clear ownership boundaries and choosing the right module strategy.

However, dividing infrastructure into modules is only half the solution.

Poorly designed module interfaces can quickly turn a modular repository into a tightly coupled system where every infrastructure change impacts multiple components.

As infrastructure grows, engineers spend less time creating new resources and more time maintaining existing ones. At that stage, the quality of a Terraform project is determined by **how modules communicate**, not by how many modules exist.

This chapter focuses on designing clean, predictable interfaces using variables, locals, outputs, and explicit dependencies.

Rather than treating Terraform as a collection of configuration files, we'll approach it as a software engineering problem where every module behaves like an API with clearly defined contracts.

---

# Before We Started Thinking About Interfaces

When the infrastructure was still relatively small, modules often exposed every configurable value simply because Terraform made it possible.

The repository looked something like this:

```text
Root Module
│
├── Networking
│     ├── 28 Variables
│     └── 19 Outputs
│
├── EKS
│     ├── 34 Variables
│     └── 26 Outputs
│
├── Karpenter
│     ├── 18 Variables
│     └── 12 Outputs
│
└── Add-ons
      ├── 21 Variables
      └── 15 Outputs
```

Every new requirement introduced additional variables.

Every downstream module depended on more outputs.

Eventually the root module became responsible for wiring together dozens of values, many of which were never actually used outside the originating module.

Although the infrastructure worked, maintaining it became increasingly difficult.

Questions such as these became common:

- Which outputs are actually required?
    
- Why is this value exposed?
    
- Can this module change without affecting everything else?
    
- Is this variable part of the public interface or merely an internal implementation detail?
    

These questions highlighted an important realization:

> **A module interface should expose only what consumers genuinely need; not everything the module knows.**

---

# What a Good Interface Looks Like

Consider two software libraries.

One exposes hundreds of public methods.

The other exposes only five carefully designed functions.

Which one is easier to understand?

Terraform modules follow exactly the same principle.

A well-designed module hides implementation details while exposing only the capabilities required by other modules.

Instead of thinking:

> "This module creates an Amazon EKS cluster."

Think:

> "This module provides a Kubernetes platform."

Instead of thinking:

> "This module creates a VPC."

Think:

> "This module provides networking services."

The internal implementation may change multiple times throughout the life of the project.

The interface should remain stable.

---

# Thinking of Terraform Modules as APIs

One of the most useful mental models for designing Terraform modules is to treat them as software APIs.

When an application consumes a REST API, it doesn't need to understand how the server stores data internally.

It only needs to know:

- What information should be sent?
    
- What response will be returned?
    
- What guarantees does the API provide?
    

Terraform modules should behave in exactly the same way.

Instead of exposing internal resources directly, modules define a public contract through input variables and output values.

```text
                    Consumer Module
                           │
                           │
                Input Variables (API Request)
                           │
                           ▼
                ┌────────────────────┐
                │                    │
                │   Terraform Module │
                │                    │
                │  Internal Resources│
                │                    │
                └────────────────────┘
                           │
                           │
                 Output Values (API Response)
                           │
                           ▼
                  Downstream Consumers
```

The resources inside the module remain private.

Consumers interact only through the published interface.

This separation significantly reduces coupling between modules and makes infrastructure easier to evolve over time.

---

# Running Case Study

To make the concepts in this chapter more concrete, we'll use a simplified version of the Terraform platform introduced throughout this series.

```text
portfolio-infrastructure/

├── backend.tf
├── providers.tf
├── versions.tf
├── locals.tf
├── variables.tf
├── outputs.tf
│
├── modules/
│
│   ├── networking/
│   ├── eks/
│   ├── iam/
│   ├── security/
│   ├── addons/
│   ├── karpenter/
│   └── lbc/
│
└── terraform.tfvars
```

Rather than introducing unrelated examples for every concept, each section will reference this same platform.

This mirrors how Terraform is used in real engineering projects, where modules evolve together rather than existing in isolation.

---

# Designing Input Variables

Input variables define the configuration interface of a module.

Every variable should answer three questions:

1. **What value is expected?**
    
2. **Why is this value required?**
    
3. **How is the value validated?**
    

Consider the following example from an Amazon EKS module.

```hcl
variable "cluster_name" {
  description = "Amazon EKS Cluster Name"

  type = string

  validation {
    condition     = length(var.cluster_name) >= 4
    error_message = "Cluster name must contain at least four characters."
  }
}
```

Although this example is simple, it demonstrates several important design principles.

- The description documents the purpose of the variable.
    
- The type ensures only valid values are accepted.
    
- Validation prevents invalid infrastructure from being deployed.
    

Validation is particularly valuable in collaborative environments, where multiple engineers may consume the same module.

Failing early during `terraform plan` is far preferable to discovering an invalid configuration after resources have already been created.

---

# Designing Better Variable Interfaces

Not every value belongs in a variable.

A common mistake is exposing every configurable attribute simply because Terraform supports it.

For example:

```hcl
module "eks" {

  cluster_name             = var.cluster_name

  endpoint_private_access  = var.endpoint_private_access

  endpoint_public_access   = var.endpoint_public_access

  cluster_log_types        = var.cluster_log_types

  enable_irsa              = var.enable_irsa

  kms_key_id               = var.kms_key_id

  cloudwatch_retention     = var.cloudwatch_retention

  node_security_group_tags = var.node_security_group_tags

  ...
}
```

Although this module appears flexible, it also forces every consumer to understand implementation details that rarely change.

A cleaner interface exposes only configuration that consumers genuinely need to control.

For example:

```hcl
module "eks" {

  cluster_name = var.cluster_name

  kubernetes_version = var.cluster_version

  vpc_id = module.networking.vpc_id

  private_subnets = module.networking.private_subnet_ids

}
```

Implementation details remain inside the module.

Consumers interact with a significantly smaller and more predictable interface.

This approach makes upgrades easier because internal changes rarely affect downstream modules.

---

# Variables vs. Locals

One of the most common questions among engineers new to Terraform is:

> **When should a value become a variable, and when should it remain a local?**

A simple rule works well.

|Variables|Locals|
|---|---|
|Defined by the module consumer|Computed by the module|
|External configuration|Internal implementation|
|Part of the public interface|Hidden from consumers|
|Expected to change between deployments|Usually consistent within the module|

In other words:

If another engineer needs to configure it, make it a variable.

If the module can determine it internally, use a local.

---

# A Practical Example

Suppose every AWS resource requires identical tags.

One approach is to duplicate those tags across every resource.

```hcl
resource "aws_vpc" "this" {

  tags = {

    Project = var.project_name

    Environment = var.environment

    ManagedBy = "Terraform"

  }

}
```

The same block eventually appears dozens of times across the repository.

Instead, centralize the shared values.

```hcl
locals {

  common_tags = {

    Project = var.project_name

    Environment = var.environment

    ManagedBy = "Terraform"

  }

}
```

Every resource now references the same object.

```hcl
resource "aws_vpc" "this" {

  tags = local.common_tags

}
```

The benefits extend beyond reducing duplicated code.

Changing a tag now requires modifying a single location rather than searching through the entire repository.

Consistency also improves governance, cost allocation, and operational reporting.

---

# Naming Strategy

Infrastructure naming conventions often receive little attention early in a project.

As environments grow, inconsistent naming becomes a surprisingly expensive operational problem.

Consider the following examples.

```text
prod-vpc

production-vpc

vpc-prod

my-vpc

networking-vpc
```

Although every name is technically valid, there is no consistent pattern.

Searching, filtering, and automation become more difficult.

Instead, establish a standard convention from the beginning.

```text
<Project>-<Environment>-<Resource>
```

For example:

```text
portfolio-prod-vpc

portfolio-prod-eks

portfolio-prod-karpenter

portfolio-prod-alb
```

A predictable naming strategy makes infrastructure easier to navigate while reducing ambiguity during operations and troubleshooting.

---
# Designing Output Values

If variables define how consumers configure a module, **outputs define what consumers are allowed to know about it**.

Every output becomes part of the module's public contract.

Once another module depends on an output, changing or removing it may require changes throughout the platform.

For this reason, outputs should be treated with the same care as public APIs in software engineering.

A useful question to ask before creating an output is:

> **"Does another module genuinely need this value, or am I exposing an internal implementation detail?"**

The fewer outputs a module exposes, the easier it becomes to evolve its internal implementation without affecting downstream consumers.

---

# Before and After: Designing Better Outputs

Consider a networking module.

A common beginner approach is to expose almost everything.

##  Poor Interface

```hcl
output "vpc" {
  value = aws_vpc.main
}

output "internet_gateway" {
  value = aws_internet_gateway.main
}

output "nat_gateway" {
  value = aws_nat_gateway.main
}

output "route_tables" {
  value = aws_route_table.private
}

output "network_acls" {
  value = aws_network_acl.private
}

output "private_subnets" {
  value = aws_subnet.private
}

output "public_subnets" {
  value = aws_subnet.public
}
```

At first glance this appears useful.

In reality, most downstream modules never require direct access to route tables, internet gateways, or network ACLs.

Every unnecessary output increases coupling.

---

## Better Interface

```hcl
output "vpc_id" {
  value = aws_vpc.main.id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}
```

Now the module exposes only the information consumers actually require.

The networking implementation can evolve without affecting other modules.

This smaller interface is significantly easier to maintain.

---

# Outputs Are Contracts

One of the most important lessons learned while working with Terraform is that outputs should remain **stable**.

Consider the following dependency chain.

```text
                    Networking Module

Outputs

• vpc_id

• private_subnet_ids

• public_subnet_ids

            │

            ▼

                  Root Module

            │

            ▼

                    EKS Module

Outputs

• cluster_name

• cluster_endpoint

• oidc_provider_arn

            │

            ▼

                Karpenter Module
```

Notice that every module depends only on the published interface—not on internal resources.

Because the interface remains stable, modules can evolve independently.

---

# Managing Module Dependencies

Terraform automatically builds a dependency graph during planning.

However, **engineering good dependencies is different from Terraform calculating dependencies**.

Poor dependency design often leads to tightly coupled modules where changing one component unexpectedly affects many others.

Instead, dependencies should always flow in one direction.

```text
Networking

        │

        ▼

IAM

        │

        ▼

Amazon EKS

        │

        ▼

Platform Add-ons

        │

        ▼

Applications
```

Each layer consumes outputs only from the layer immediately below it.

This creates a predictable infrastructure architecture.

---

# Dependency Inversion in Terraform

Although Terraform is declarative, one software engineering principle still applies remarkably well:

> **Depend on contracts, not implementations.**

For example, the EKS module should not care how the networking module creates subnets.

It only requires:

```hcl
module.networking.vpc_id

module.networking.private_subnet_ids
```

Whether those subnets were created manually, through a Terraform Registry module, or by a future implementation is irrelevant.

The interface remains unchanged.

---

# Keeping Modules Loosely Coupled

Loose coupling is one of the primary goals of modular infrastructure.

Consider two possible designs.

![[.\assets\terraform-module.png]]

## Tightly Coupled

```text
Networking

│

├── Internet Gateway

├── Route Tables

├── NAT Gateway

├── Security Groups

├── EKS

├── Karpenter

├── ALB Controller
```

Every change affects the same module.

Reviewing pull requests becomes difficult.

Testing becomes expensive.

Upgrades become risky.

---

## Loosely Coupled

```text
Networking

↓

IAM

↓

EKS

↓

Add-ons

↓

Karpenter

↓

AWS Load Balancer Controller
```

Each module owns a single responsibility.

Each exposes only a minimal interface.

Each can evolve independently.

This design significantly reduces the blast radius of infrastructure changes.

---

# Engineering Decision Record

## Decision

Keep module interfaces intentionally small.

Expose only values that another module genuinely consumes.

Keep implementation details private.

---

## Context

During the initial platform design, there was a temptation to expose nearly every configurable value as an input variable and almost every resource as an output.

This appeared to make modules more flexible.

In practice, it produced larger interfaces, stronger coupling, and unnecessary complexity.

---
## Alternatives Considered

### Option 1

Expose every configurable value.

**Rejected**

Reason:

Large interfaces become difficult to understand and maintain.

---

### Option 2

Hide all implementation details except essential inputs and outputs.

**Selected**

Reason:

Smaller contracts reduce coupling and simplify future refactoring.

---

# Registry Modules and Interface Stability

One advantage of using mature Terraform Registry modules is that their interfaces tend to remain relatively stable across minor releases.

For example, the widely used Amazon EKS module exposes outputs such as:

```hcl
module.eks.cluster_name

module.eks.cluster_endpoint

module.eks.cluster_certificate_authority_data

module.eks.oidc_provider_arn
```

Consumers rely only on these published outputs.

The internal implementation of the Registry module may change significantly between versions, but downstream modules continue working as long as the public interface remains stable.

This is one of the reasons mature Registry modules are widely adopted in production environments.

---

#  Interview Corner

### Question

**Why shouldn't Terraform modules expose every resource as an output?**

### Strong Answer

Every output becomes part of the module's public contract.

Exposing unnecessary outputs increases coupling between modules and makes future refactoring more difficult.

Good module design exposes only the information that downstream consumers genuinely require while keeping implementation details private.

This allows internal changes without affecting dependent modules.

---

# Putting It All Together

By this point, we've covered the individual building blocks of a well-designed Terraform interface:

- Variables define how consumers configure a module.
    
- Locals simplify internal implementation.
    
- Outputs expose only the information consumers require.
    
- Dependencies connect modules through stable contracts.
    

Individually, these concepts appear straightforward.

Their real value becomes apparent when infrastructure evolves.

Production platforms rarely remain static.

Clusters are upgraded.   

Networking evolves.

Platform components are replaced.

Security standards change.

The quality of a Terraform platform is measured not by how easily it provisions infrastructure on day one, but by how safely it evolves over time.

---

# Case Study: Amazon EKS Blue/Green Migration

One of the best tests of a Terraform architecture is a major platform upgrade.

During the migration of an Amazon EKS platform from **Kubernetes v1.31** to **v1.35**, the objective was not simply to deploy a newer cluster.

The goal was to migrate the platform while minimizing risk and avoiding unnecessary changes to stable infrastructure.

Instead of modifying the existing production cluster in place, a new Amazon EKS v1.35 environment was provisioned using a blue/green deployment strategy.

The overall architecture remained consistent.

```text
Old Platform

Networking
      │
      ▼
Amazon EKS v1.31
      │
      ▼
Applications

                │
                │ Migration
                ▼

New Platform

Networking
      │
      ▼
Amazon EKS v1.35
      │
      ▼
Applications
```

Although the Kubernetes control plane changed significantly, the networking layer remained identical.

The networking module continued exposing only its public contract.

```text
Outputs

• vpc_id

• private_subnet_ids

• public_subnet_ids
```

The EKS module continued consuming those same outputs.

No consumer needed to understand how the networking resources were implemented internally.

This stability reduced the migration effort and isolated infrastructure changes to the platform components that actually required modification.

---

# What Actually Changed?

During the migration, several platform components required updates.

Examples included:

- Amazon EKS control plane
    
- Managed node groups
    
- Karpenter configuration
    
- AWS Load Balancer Controller
    
- Cluster add-ons
    
- Kubernetes version-specific configurations
    

Notice what did **not** require redesign.

- VPC architecture
    
- Private subnets
    
- Public subnets
    
- Route tables
    
- NAT Gateway
    
- Internet Gateway
    

Because module responsibilities were clearly separated, stable infrastructure remained untouched while platform components evolved independently.

This significantly reduced testing effort and lowered operational risk.

---

# Engineering Principles Reinforced

Several important engineering principles became much more apparent during the migration.

## Stable Interfaces Reduce Change

Modules that expose only essential outputs rarely require downstream modifications.

Small interfaces are easier to maintain.

---

## Module Responsibilities Matter

Networking owned networking.

The EKS module owned the Kubernetes control plane.

Karpenter owned node provisioning.

Each module had a clearly defined responsibility.

No module attempted to solve multiple unrelated problems.

---

## Internal Refactoring Becomes Easier

Because consumers depended only on published outputs, implementation details inside a module could change without affecting other parts of the platform.

This is one of the strongest arguments for treating Terraform modules as software components rather than collections of resources.

---

# Common Interface Anti-Patterns

Over time, several interface design mistakes appeared repeatedly across Terraform projects.

Understanding these anti-patterns is often more valuable than memorizing best practices.

---

## Anti-Pattern 1 — The "Expose Everything" Module

Some modules expose nearly every resource as an output.

```text
Outputs

vpc

igw

nat

route_tables

network_acl

default_route

subnet_objects

security_groups

...
```

While this initially feels flexible, it tightly couples consumers to implementation details.

A future refactor becomes much more difficult because every downstream module depends on those outputs.

Instead, expose only the information required by consumers.

---

## Anti-Pattern 2 — Variable Explosion

Another common mistake is exposing every configurable value as an input.

```text
cluster_name

cluster_version

cluster_log_types

endpoint_public

endpoint_private

kms_key

kms_alias

security_group_tags

launch_template

...

40+ Variables
```

Large interfaces increase cognitive load.

Consumers must understand implementation details that rarely change.

A smaller interface is almost always easier to use.

---

## Anti-Pattern 3 — Hardcoded Values

Hardcoded values often begin as temporary shortcuts.

```hcl
cluster_name = "production"

region = "ap-south-1"

environment = "prod"
```

Eventually the same configuration must be duplicated for another environment.

The module becomes difficult to reuse.

Configuration that varies between deployments should remain external.

---

## Anti-Pattern 4 — Circular Dependencies

A networking module should never depend on an EKS module.

Likewise, the EKS module should not require information that is produced only after Karpenter is deployed.

Dependencies should always move in one direction.

```text
Networking

↓

IAM

↓

EKS

↓

Platform Add-ons

↓

Applications
```

Predictable dependency flow simplifies both planning and troubleshooting.

---

# Interface Design Checklist

Before publishing a Terraform module, review the following questions.

### Variables

- Does every variable solve a real configuration problem?
    
- Can any variable be replaced with a local?
    
- Are descriptions and validations included?
    
- Are sensitive values marked appropriately?
    

---

### Locals

- Are repeated expressions centralized?
    
- Are naming conventions consistent?
    
- Are tags generated in one location?
    
- Can duplicated logic be simplified?
    

---

### Outputs

- Does another module genuinely require this output?
    
- Can implementation details remain private?
    
- Will changing this output affect downstream consumers?
    

---

### Dependencies

- Does dependency flow move in one direction?
    
- Are modules coupled only through outputs?
    
- Are module responsibilities clearly separated?
    

If the answer to these questions is consistently "yes," the interface is likely well designed.

---

# Interview Corner

### Question 1

**How do you decide whether something should be a variable or a local?**

**Strong Answer**

Variables define the external configuration interface of a module.

Locals are used to compute or standardize internal values that consumers should not configure directly.

Keeping this distinction clear produces smaller and more maintainable module interfaces.

---

### Question 2

**Why shouldn't every Terraform resource become an output?**

**Strong Answer**

Outputs represent the public contract of a module.

Exposing unnecessary outputs increases coupling and limits future refactoring.

Only values consumed by other modules should become outputs.

---

### Question 3

**What makes a Terraform module maintainable?**

**Strong Answer**

A maintainable module has a single responsibility, exposes a minimal public interface, validates its inputs, hides implementation details, and communicates with other modules only through stable contracts.

The emphasis is on simplicity and long-term maintainability rather than maximum configurability.

---

# Lessons Learned

Designing Terraform modules taught several lessons that apply beyond Infrastructure as Code.

- Smaller interfaces are easier to understand.
    
- Every abstraction introduces maintenance cost.
    
- Every output becomes a long-term commitment.
    
- Every unnecessary variable increases complexity.
    
- Stable contracts enable independent evolution.
    
- Clear ownership reduces operational risk.
    
- Infrastructure should evolve without forcing unnecessary changes across the platform.
    

Perhaps the most important lesson was this:

> **Good Terraform modules are designed for the engineers who will maintain them in two years—not for the engineer writing them today.**

---

# Key Takeaways

This chapter explored the engineering principles behind clean Terraform module interfaces.

The most important ideas can be summarized as follows.

- Treat every Terraform module as a software component.
    
- Design interfaces before implementation.
    
- Keep variables intentional and validated.
    
- Use locals to simplify internal logic.
    
- Expose only essential outputs.
    
- Keep module responsibilities independent.
    
- Design dependency flow carefully.
    
- Prefer stable contracts over excessive flexibility.
    
- Optimize for long-term maintainability rather than short-term convenience.
    

Infrastructure becomes easier to scale when engineers spend less time understanding interfaces and more time solving business problems.

---

# Looking Ahead

The platform now has:

- A production-ready repository structure
    
- Well-defined module boundaries
    
- A balanced strategy for Registry and local modules
    
- Clean interfaces between modules
    

The next challenge is ensuring multiple engineers can safely collaborate on the same infrastructure.

That requires reliable state management, remote backends, environment isolation, and deployment workflows.

In the next chapter, we'll explore how production teams manage **Terraform state**, **S3 backends**, **locking strategies**, **workspace alternatives**, and **environment separation** to build reliable Infrastructure as Code at scale.