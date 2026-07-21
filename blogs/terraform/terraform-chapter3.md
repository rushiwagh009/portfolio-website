# Chapter 3: Designing a Production Repository Structure

> _"The structure of a Terraform repository reflects how engineers think about infrastructure. If engineers struggle to navigate the repository, they will eventually struggle to maintain the platform."_

---

# Introduction

When engineers discuss Infrastructure as Code, conversations usually revolve around modules, variables, providers, or state management.

Repository structure rarely receives the same attention.

However, after working on production infrastructure, one lesson became increasingly clear:

> **Terraform code is read far more often than it is written.**

Every infrastructure change begins with understanding the existing codebase.

Questions such as:

- Where is the EKS cluster defined?
    
- Which file manages IAM?
    
- Where is the AWS Load Balancer Controller deployed?
    
- Which module creates the VPC?
    
- How are providers configured?
    

are asked every day by engineers maintaining the platform.

A poorly organized repository turns these simple questions into investigations.

A well-designed repository answers them almost immediately.

This chapter explains the engineering decisions that shaped the repository structure and why those decisions improved long-term maintainability.

---

# Engineering Goal

The objective was **never** to create more Terraform files.

The objective was to make the repository predictable.

A new engineer joining the project should be able to answer three questions without reading hundreds of lines of code.

1. **Where should a new resource be added?**
    
2. **Where should an existing resource be modified?**
    
3. **Which parts of the infrastructure will be affected by this change?**
    

If the repository answers those questions naturally, it has achieved its purpose.

---

# Repository Evolution

Every Terraform project begins with a simple structure.

```text
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
└── terraform.tfvars
```

For a small proof of concept, this layout works perfectly.

As the platform evolves, however, responsibilities begin to overlap.

```text
main.tf
│
├── VPC
├── IAM
├── Security Groups
├── EKS Cluster
├── Node Groups
├── OIDC
├── Add-ons
├── AWS Load Balancer Controller
├── Karpenter
├── Outputs
└── Data Sources
```

The file continues to grow.

Every feature introduces additional dependencies.

Eventually, even a simple change requires scrolling through hundreds of lines of configuration.

At this point, the repository has become difficult—not because Terraform is complicated, but because **responsibilities are no longer clearly separated**.

---

# Repository Architecture

Instead of organizing Terraform by resource count, the project was organized by responsibility.

```text
terraform/
│
├── backend.tf
├── versions.tf
├── providers.tf
├── variables.tf
├── locals.tf
├── outputs.tf
│
├── security.tf
├── eks.tf
├── addons.tf
├── oidc.tf
├── karpenter.tf
├── lbc.tf
│
├── terraform.tfvars
│
└── modules/
    ├── networking/
    ├── eks/
    ├── iam/
    ├── security/
    ├── addons/
    └── ...
```

Every file has a clearly defined responsibility.

Instead of asking _"Which file contains this resource?"_, engineers begin asking _"Which component owns this responsibility?"_

That small shift dramatically improves maintainability.

---

# Repository Dependency Flow

The root module acts as an orchestration layer.

```text
                 terraform.tfvars
                         │
                         ▼
                  variables.tf
                         │
                         ▼
                     locals.tf
                         │
                         ▼
                 Root Terraform Module
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   Networking        IAM Module      EKS Module
        │                │                │
        └──────────────┬─┴────────────────┘
                       ▼
                Platform Components
        ┌─────────┬──────────┬──────────┐
        ▼         ▼          ▼          ▼
    Add-ons     OIDC     Karpenter     LBC
```

The root module coordinates infrastructure.

Individual modules implement infrastructure.

This separation keeps responsibilities clear and reduces coupling.

---

# 💡 Engineering Decision: Organize by Responsibility

Many Terraform repositories organize files according to AWS services.

For example:

```text
vpc.tf
subnets.tf
route-table.tf
internet-gateway.tf
nat.tf
```

Although technically correct, this forces engineers to mentally assemble the networking architecture from multiple files.

Instead, networking was treated as **one responsibility**.

Everything required to understand networking belonged to one logical component.

The same principle was applied across the repository.

| Responsibility      | Primary File   |
| ------------------- | -------------- |
| Kubernetes Platform | `eks.tf`       |
| Cluster Identity    | `oidc.tf`      |
| Platform Add-ons    | `addons.tf`    |
| Autoscaling         | `karpenter.tf` |
| Ingress             | `lbc.tf`       |
| Security            | `security.tf`  |

This organization reflects **how engineers think**, rather than how AWS categorizes services.

---

# File-by-File Design Decisions

## `versions.tf`

### Responsibility

Control compatibility.

### Why it exists

Different Terraform or provider versions can produce different behavior.

Centralizing version constraints ensures every engineer works against the same platform assumptions.

```
/**********************************************************************************
* File        : versions.tf
* Description : Terraform Version & Provider Requirements
**********************************************************************************/

terraform {

  required_version = ">= 1.10.0"
  required_providers {
  
    # create AWS resources
    
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.52"
    }

    # manage Kubernetes resources

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.37"
    }

    # manage Helm charts resources

    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.17"
    }

    # manage TLS resources (used for OIDC and cert-manager)

    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }

    # manage time-related resources (EKS API readiness checks if needed)

    time = {
      source  = "hashicorp/time"
      version = "~> 0.13"
    }

    # manage random resources (used for generating random strings, passwords, etc.)

    random = {
      source  = "hashicorp/random"
      version = "~> 3.7"
    }
  }
}
```

> **Engineering Principle**
> 
> Reproducibility begins with consistent tooling.

---

## `providers.tf`

### Responsibility

Define how Terraform authenticates and communicates with external systems.

Infrastructure should never be responsible for authentication logic.

Separating providers also simplifies:

- multi-account deployments
    
- provider upgrades
    
- alias configuration
    
- testing

```
/**********************************************************************************

* File        : providers.tf
* Description : Terraform Provider Configuration

**********************************************************************************/

#############################################
# AWS Provider
#############################################

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "Platform Team"
      Cluster     = var.cluster_name
    }
  }
}
#############################################
# EKS Authentication
#############################################

data "aws_eks_cluster_auth" "this" {
  name = module.eks.cluster_name
}

#############################################
# Kubernetes Provider
#############################################

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.this.token
}

#############################################
# Helm Provider
#############################################

provider "helm" {
  kubernetes  {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.this.token
  }
}
```

---

## `backend.tf`

### Responsibility

Manage Terraform state.

Backend configuration is infrastructure in its own right.

Keeping it separate makes state migrations, locking configuration, and backend changes easier to understand and review.

---

## `variables.tf`

### Responsibility

Expose the configuration surface.

Variables represent everything an engineer is allowed to customize.

If a value is expected to change between environments, it belongs here.

---

## `locals.tf`

### Responsibility

Standardize repeated values.

Rather than scattering naming conventions across dozens of resources, common expressions are calculated once and reused consistently.

Typical examples include:

- project prefixes
    
- environment names
    
- resource naming
    
- shared tags
    

This dramatically reduces configuration drift.

---

## `outputs.tf`

### Responsibility

Expose only what other modules genuinely need.

Outputs are APIs.

Just because Terraform can expose every resource does not mean it should.

A small, carefully designed output interface reduces coupling between modules.

---

## Platform Files

The platform itself was divided into dedicated components.

```text
eks.tf
│
├── EKS Cluster
├── Managed Node Groups
└── Cluster Configuration
```

```text
addons.tf
│
├── EBS CSI Driver
├── CoreDNS
├── VPC CNI
├── kube-proxy
└── Future Add-ons
```

```text
karpenter.tf
│
├── Helm Release
├── IAM
├── NodePool
└── EC2NodeClass
```

```text
lbc.tf
│
├── IAM
├── Helm Release
└── Controller Configuration
```

Each file owns one platform capability.

---

#  Common Anti-Patterns

## Everything in `main.tf`

```text
main.tf
├── 2800+ lines
├── Every resource
├── Every data source
├── Every provider
└── Every output
```

Symptoms:

- difficult reviews
    
- merge conflicts
    
- slow onboarding
    
- hard debugging
    

---

## Random File Splitting

```text
network.tf
networking.tf
network-final.tf
network-new.tf
network2.tf
```

This is not organization.

It is fragmentation.

Files should represent architectural boundaries—not arbitrary names.

---

## Duplicate Provider Configuration

Multiple provider definitions increase maintenance effort and create unnecessary inconsistency.

One provider configuration should support the entire root module whenever possible.

---

#  Production Experience

One lesson became obvious after several months of maintaining the platform.

The amount of Terraform code wasn't the problem.

The difficulty came from locating the correct place to make a change.

When repository organization improved:

- Pull requests became smaller.
    
- Code reviews became faster.
    
- New engineers required less onboarding.
    
- Troubleshooting became more predictable.
    
- Infrastructure ownership became clearer.
    

The repository itself evolved into a form of documentation.

---

# Design Principles

Every repository decision was evaluated against the following principles.

| Principle              | Why It Matters                 |
| ---------------------- | ------------------------------ |
| Single Responsibility  | Easier maintenance             |
| Predictability         | Faster navigation              |
| Consistency            | Reduced cognitive load         |
| Loose Coupling         | Safer infrastructure changes   |
| Readability            | Faster onboarding              |
| Separation of Concerns | Independent platform evolution |

Whenever a proposed change violated one of these principles, it was reconsidered.

---

# Lessons Learned

Several engineering lessons emerged during this phase of the project.

- Repository structure is an architectural decision, not a cosmetic one.
    
- Engineers maintain infrastructure more often than they create it.
    
- Files should represent responsibilities, not arbitrary categories.
    
- The root module should orchestrate infrastructure, not implement it.
    
- Consistency reduces onboarding time.
    
- Predictable organization improves code reviews.
    
- Good repository design reduces technical debt before it appears.
    

---

# Key Takeaways

Before writing another line of Terraform, ask these questions:

- Can another engineer immediately understand where this resource belongs?
    
- Does this file have a single responsibility?
    
- Will this structure still make sense six months from now?
    
- Does this change reduce or increase cognitive load?
    
- If this component changes, what else should remain unaffected?
    

If those questions have clear answers, the repository is likely evolving in the right direction.

---

# Looking Ahead

With the repository now organized into clear architectural layers, the next challenge was designing the modules themselves.

A module is more than a directory containing Terraform files.

It is an architectural boundary.

The next chapter explores how to design reusable Terraform modules that remain simple, maintainable, and scalable without becoming over-engineered.