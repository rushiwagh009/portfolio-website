# Chapter 4: Designing Reusable Terraform Modules for Production Infrastructure

> _"The goal of a Terraform module is not to eliminate duplication. The goal is to create a clear architectural boundary that encapsulates a single responsibility."_

---

# Introduction

Once the repository structure was established, the next challenge was deciding **how the infrastructure should be divided into reusable modules**.

At first glance, the answer appears straightforward—create a module for every major component.

In practice, however, module design is one of the most difficult aspects of Infrastructure as Code.

Modules that are too small introduce unnecessary complexity.

Modules that are too large become miniature monoliths.

Modules that are overly generic are difficult to understand.

Modules that are too specific cannot be reused.

Finding the right balance requires careful engineering decisions rather than strict rules.

This chapter explores the principles used to design Terraform modules that are maintainable, reusable, and scalable in production environments.

---
# When Should You Create a Terraform Module?

One of the biggest misconceptions about Terraform is that every repeated resource should immediately become a module.

In reality, introducing a module is an architectural decision, not a refactoring exercise.

Every module introduces its own interface, documentation requirements, variables, outputs, and maintenance overhead.

Creating modules too early can make a project more difficult to understand than simply keeping the resources together.

Instead of asking:

> **"Can I create a module?"**

Ask:

> **"Does this abstraction solve a real engineering problem?"**

A Terraform module should exist because it provides one or more of the following benefits:

- Enforces organizational standards
- Eliminates repeated infrastructure patterns
- Creates a stable interface for consumers
- Isolates responsibilities
- Enables independent lifecycle management

If none of these benefits exist, introducing another abstraction may simply increase complexity.

A useful rule of thumb is:

> **Abstract infrastructure because multiple engineers need to understand it—not because Terraform supports modules.**

As infrastructure grows, module creation should become a deliberate engineering decision rather than an automatic coding pattern.

---
# Why Modules Exist

Many engineers believe modules exist primarily to reduce duplicated code.

While reuse is an important benefit, it is **not** the primary reason modules were introduced in this project.

The real objective was to establish **clear ownership boundaries**.

Instead of asking:

> "Can this code be reused?"

the more useful question became:

> **"What responsibility does this module own?"**

A well-designed module represents a distinct capability within the platform.

Examples include:

- Networking
    
- Identity and Access Management (IAM)
    
- Kubernetes Control Plane
    
- Managed Node Groups
    
- Platform Add-ons
    
- Security Controls
    
- Autoscaling Components
    

Each module owns its lifecycle independently.

---

# 💡 Engineering Decision

## Design modules around responsibilities, not around Terraform resources.

Consider these two approaches.

### Approach A: Resource-Based Modules

```text
vpc-module
subnet-module
route-table-module
nat-module
internet-gateway-module
```

Although each module is technically reusable, deploying a VPC now requires coordinating multiple tightly coupled modules.

The abstraction becomes more complicated than the infrastructure itself.

---

### Approach B: Responsibility-Based Module

```text
networking-module
```

Responsibilities:

- VPC
    
- Public Subnets
    
- Private Subnets
    
- Internet Gateway
    
- NAT Gateway
    
- Route Tables
    
- Network ACLs
    

The module owns the complete networking layer.

Consumers interact with a single interface rather than assembling several low-level components.

This approach simplifies both usage and maintenance.

---

# Identifying Module Boundaries

One of the most useful questions when designing Terraform modules is:

> **If this component changes, what else should remain unaffected?**

For example:

If networking changes:

- IAM should remain unaffected.
    
- Kubernetes configuration should remain unaffected.
    
- Monitoring should remain unaffected.
    

Similarly:

If Karpenter is upgraded:

- The VPC should remain unchanged.
    
- IAM roles unrelated to Karpenter should remain unchanged.
    
- The Kubernetes control plane should remain unchanged.
    

These independent lifecycles naturally define module boundaries.

---

# Applying the Single Responsibility Principle

Each Terraform module should own **one clearly defined responsibility**.

|Module|Responsibility|
|---|---|
|`networking`|AWS networking resources|
|`iam`|Roles, policies, instance profiles|
|`eks`|Kubernetes control plane|
|`nodegroups`|Worker node lifecycle|
|`addons`|Cluster extensions|
|`karpenter`|Dynamic node provisioning|
|`lbc`|AWS Load Balancer Controller|

When responsibilities begin to overlap, the module likely needs refactoring.

---

# Designing Module Interfaces

Every Terraform module exposes an interface.

That interface consists of:

- Input variables
    
- Output values
    

Think of a Terraform module as a software library.

Consumers should not need to understand its internal implementation.

Instead, they should interact only through well-defined inputs and outputs.

```text
                Root Module

                      │

        cluster_name = "production"

        vpc_id = module.networking.vpc_id

        subnet_ids = module.networking.private_subnets

                      │

                      ▼

                 EKS Module

          (Internal Implementation)

                      │

                      ▼

Outputs

cluster_name

cluster_endpoint

cluster_security_group
```

Notice that consumers never interact with internal resources directly.

The module exposes only what downstream consumers genuinely require.

---

# What Should Stay Inside a Module?

One common mistake is exposing too much.

Everything inside a module does **not** need to become an output.

For example, the following should usually remain internal:

- IAM policy documents
    
- Security group rules
    
- Data sources
    
- Local values
    
- Temporary resources
    
- Helper expressions
    

A smaller public interface reduces coupling between modules and makes future refactoring significantly easier.

---

# Module Dependency Flow

A production Terraform project often looks like this:

```text
                    Root Module
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
  Networking          IAM Module      Security
        │                │                │
        └──────────────┬─┴────────────────┘
                       │
                       ▼
                  EKS Module
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    Add-ons       Karpenter        LBC
```

Each module consumes outputs only from the components it depends upon.

This keeps dependencies explicit and predictable.

---
# Terraform Registry Modules vs Local Modules

One of the most common architectural decisions in Terraform projects is deciding whether to use community-maintained modules or develop custom modules internally.

There is no universally correct answer.

Each approach addresses different engineering requirements.

## Option 1 – Terraform Registry Modules

Terraform Registry provides community-maintained modules for common infrastructure components such as:

- Amazon VPC
- Amazon EKS
- RDS
- Security Groups
- IAM

For example:

```hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  cluster_name = var.cluster_name

  vpc_id     = module.networking.vpc_id
  subnet_ids = module.networking.private_subnets
}
```

Instead of writing hundreds of lines of Terraform, engineers consume infrastructure that has already been tested by thousands of organizations.

### Advantages

- Production-tested
- Community maintained
- Frequent updates
- AWS best practices
- Faster development
- Lower maintenance effort

### Challenges

- Opinionated implementation
- Breaking changes during major upgrades
- Limited customization in specific scenarios
- Additional learning curve

---

## Option 2 – Local Modules

Some infrastructure requirements are unique to an organization.

Examples include:

- Naming standards
- Tagging strategies
- IAM conventions
- Security controls
- Internal monitoring
- Platform governance

These requirements are typically implemented as local modules.

```text
modules/

├── networking/
├── security/
├── iam/
├── monitoring/
├── platform-tags/
└── ...
```

### Advantages

- Complete flexibility
- Easier customization
- Organization-specific standards
- Stable internal interfaces
- Easier debugging

### Challenges

- Higher maintenance effort
- Documentation responsibility
- Testing responsibility
- Version management
---

# ⚠️ Common Anti-Pattern: The Mega Module

A frequent mistake is creating one module responsible for everything.

```text
platform-module

├── VPC
├── IAM
├── Security Groups
├── EKS
├── Node Groups
├── Add-ons
├── Monitoring
├── Logging
├── Autoscaling
└── DNS
```

Initially, this appears convenient.

Eventually, it becomes another monolithic application.

Typical symptoms include:

- Hundreds of variables
    
- Hundreds of outputs
    
- Large pull requests
    
- Frequent merge conflicts
    
- Difficult testing
    
- High cognitive load
    

The solution is not more variables.

The solution is better module boundaries.

---

# ⚠️ Common Anti-Pattern: A Module for Everything

The opposite extreme is equally problematic.

Some repositories contain modules such as:

```text
subnet-module
nat-module
route-table-module
security-group-module
internet-gateway-module
```

Although technically modular, these modules introduce unnecessary abstraction while providing very little value.

Good modules simplify infrastructure.

Poor modules simply move complexity somewhere else.

---

# Engineering Trade-offs

No module design is perfect.

Every abstraction introduces trade-offs.

|Benefit|Cost|
|---|---|
|Reusability|Additional variables|
|Encapsulation|More outputs|
|Clear ownership|More module calls|
|Independent lifecycle|Dependency management|
|Easier testing|Slightly higher learning curve|

Engineering is about selecting the trade-offs that improve long-term maintainability.

---

# 🔍 Production Experience

One lesson became increasingly clear as the platform evolved.

The most successful modules were **not** the most generic ones.

They were the modules with the clearest responsibilities.

Networking evolved independently.

Karpenter had its own lifecycle.

AWS Load Balancer Controller upgrades rarely required changes to the Kubernetes control plane.

Platform add-ons could be upgraded without modifying cluster creation logic.

This separation significantly reduced the impact radius of infrastructure changes.

Instead of reviewing the entire repository, engineers could focus on a single module.

Smaller changes resulted in faster reviews, fewer merge conflicts, and more predictable deployments.

---

# Common Mistakes

Avoid these common module design mistakes:

- Creating modules before they are needed.
    
- Designing modules around AWS services instead of platform capabilities.
    
- Exposing every resource as an output.
    
- Passing dozens of unnecessary variables.
    
- Allowing unrelated responsibilities inside one module.
    
- Building "universal" modules that attempt to support every possible use case.
    
- Ignoring dependency boundaries between modules.
    

---

# Design Principles

Every module in the platform was evaluated against the following principles.

|Principle|Why It Matters|
|---|---|
|Single Responsibility|Easier maintenance|
|Encapsulation|Reduced coupling|
|Reusability|Consistent infrastructure|
|Simplicity|Faster onboarding|
|Predictability|Easier troubleshooting|
|Independent Lifecycle|Safer upgrades|

Whenever a module violated one of these principles, it was reconsidered.

---
#  Engineering Decision: Why We Used Both

One of the most important architectural decisions during this project was **not choosing between Registry modules and local modules**.

Instead, we combined both approaches.

```text
                    Root Module

                          │

        ┌─────────────────┴──────────────────┐

        ▼                                    ▼

Terraform Registry                   Local Modules

terraform-aws-eks               Security Standards

terraform-aws-vpc               IAM Standards

Community Modules               Naming Convention

                                Organization Tags

                                Monitoring

                                Platform Policies
```

Community modules were used whenever they solved a common infrastructure problem that was already well understood.

Local modules encapsulated organization-specific requirements and engineering standards.

This approach allowed us to benefit from community updates while maintaining complete control over platform-specific behavior.

Rather than reinventing infrastructure, engineering effort was focused on solving business-specific problems.

---
# Choosing the Right Module Strategy

There is no rule that every module should come from the Terraform Registry.

Likewise, there is no rule that every organization should build everything internally.

Instead, each module should be evaluated individually.

The following guidelines proved useful during this project.

| Scenario                  | Recommended Approach |
| ------------------------- | -------------------- |
| Common AWS infrastructure | Terraform Registry   |
| Standard networking       | Terraform Registry   |
| Amazon EKS                | Terraform Registry   |
| Organization-specific IAM | Local Module         |
| Security standards        | Local Module         |
| Monitoring integrations   | Local Module         |
| Organization tagging      | Local Module         |
| Platform automation       | Local Module         |

This hybrid strategy provides the best balance between community knowledge and organization-specific customization.

Rather than writing more Terraform, engineers spend their time improving the platform.

---
# Lessons Learned

Several engineering lessons emerged while designing Terraform modules.

- Modules should represent architectural boundaries rather than collections of resources.
    
- Clear ownership is more valuable than excessive reusability.
    
- Small, focused modules are easier to maintain than generic ones.
    
- Module interfaces should remain as small as possible.
    
- Every output increases coupling.
    
- Every input increases complexity.
    
- Good modules evolve independently without affecting unrelated platform components.
    

---

# Key Takeaways

Before creating a new Terraform module, ask yourself:

- What responsibility does this module own?
    
- What engineering problem does this abstraction solve?
    
- Can another engineer understand its purpose within a few minutes?
    
- Which resources should remain internal?
    
- Which values genuinely need to become outputs?
    
- If this module changes, what other components should remain unaffected?
    

If those questions have clear answers, the module is likely designed around sound engineering principles.


---

> 💬 **Interview Insight**
>
> One interview question frequently asked during Platform Engineering and DevOps interviews is:
>
> **Why didn't you build every Terraform module yourself?**
>
> A strong answer is:
>
> Mature engineering teams rarely reinvent well-tested infrastructure components. Community modules are reused for common AWS services, while local modules encapsulate organization-specific standards, reusable platform capabilities, and internal governance. The objective is not to maximize the amount of Terraform code written—it is to maximize maintainability and consistency across the platform.
---

# Looking Ahead

The repository is now organized.

Module boundaries are clearly defined.

The next challenge is designing **clean interfaces between modules**.

How should variables be defined?

When should values become `locals`?

Which outputs should be exposed?

How can configuration remain flexible without becoming difficult to maintain?

The next chapter explores these questions by focusing on **designing clean module interfaces with variables, locals, and outputs**.