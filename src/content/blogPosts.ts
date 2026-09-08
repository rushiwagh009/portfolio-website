export interface BlogPost {
  slug: string
  category: string
  title: string
  teaser: string
  searchKeywords: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'terraform-chapter1',
    category: 'Infrastructure as Code',
    title: 'Chapter 1: Introduction & Engineering Context',
    teaser:
      'A search for "Terraform EKS" returns hundreds of tutorials explaining how to provision an Amazon EKS cluster in just a few commands. This focuses on engineering...',
    searchKeywords: 'terraform engineering context introduction eks',
  },
  {
    slug: 'terraform-chapter2',
    category: 'Infrastructure as Code',
    title: 'Chapter 2: Monolithic Terraform to Modular Infrastructure',
    teaser:
      'Every Terraform project starts with optimism. A single main.tf file appears sufficient until... The challenge becomes maintaining Terraform, not just writing it.',
    searchKeywords: 'terraform monolithic modular infrastructure architecture',
  },
  {
    slug: 'terraform-chapter3',
    category: 'Infrastructure as Code',
    title: 'Chapter 3: Designing a Production Repository Structure',
    teaser:
      'Terraform code is read far more often than it is written. Every infrastructure change begins with understanding the existing codebase. A well-designed repository...',
    searchKeywords: 'terraform repository structure production design',
  },
  {
    slug: 'terraform-chapter4',
    category: 'Infrastructure as Code',
    title: 'Chapter 4: Designing Reusable Terraform Modules',
    teaser:
      'Once the repository structure was established, how should infrastructure be divided into reusable modules? Module design requires careful engineering...',
    searchKeywords: 'terraform reusable modules production infrastructure architecture',
  },
  {
    slug: 'terraform-chapter5',
    category: 'Infrastructure as Code',
    title: 'Chapter 5: Clean Module Interfaces',
    teaser:
      'Good Terraform modules are not defined by the number of resources they create. They are defined by the simplicity, stability, and clarity of the interfaces...',
    searchKeywords: 'terraform clean module interfaces variables locals outputs dependencies',
  },
  {
    slug: 'terraform-chapter6',
    category: 'Infrastructure as Code',
    title: 'Chapter 6: Understanding Terraform State',
    teaser:
      "Terraform doesn't read your cloud to understand your infrastructure — it relies on its state file. Understanding Terraform state is the first step toward building reliable, production-grade IaC...",
    searchKeywords: 'terraform state source of truth infrastructure foundation state file',
  },
]
