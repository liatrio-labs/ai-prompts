---
name: liatrio-dns
description: "Provision DNS records for liatr.io subdomains in the liatrio/liatrio-external-dns repository. Use when adding, modifying, or removing DNS CNAME records, A records, or other Route53 records for liatr.io or k8s-ignite.com domains. Triggers on requests like 'add a domain', 'create a subdomain', 'point X.liatr.io to Y', or 'set up DNS for a new site'."
---

# Liatrio DNS Provisioning

Provision DNS records for `liatr.io` subdomains in the `liatrio/liatrio-external-dns` Terraform/Terragrunt repository.

## Repository Location

Clone URL: `git@github.com:liatrio/liatrio-external-dns.git`

If the repo is not already cloned locally, clone it to the user's working directory before proceeding.

## Repository Structure

```text
liatrio-external-dns/
├── dns/
│   ├── liatr_io_records.tf      # All liatr.io DNS records (primary file to edit)
│   ├── k8s_ignite_com_records.tf # k8s-ignite.com DNS records
│   ├── zones.tf                  # Route53 hosted zones
│   ├── certificates.tf           # ACM wildcard certificates
│   ├── redirects.tf              # CloudFront redirect modules
│   ├── domains.tf                # Registered domain imports
│   └── terragrunt.hcl            # Terragrunt config
├── modules/
│   ├── cloudfront-redirect/      # Module for HTTP redirects via CloudFront
│   └── wildcard-acm-cert/        # Module for wildcard ACM certs with DNS validation
├── insights-liatrio-com/         # S3 + CloudFront for insights.liatrio.com
├── root.hcl                      # Shared Terragrunt config (S3 backend, provider)
└── shared.tfvars                 # Shared variables (region: us-east-1)
```

## Record Types and Patterns

### CNAME to GitHub Pages (most common)

For sites hosted on GitHub Pages under the `liatrio` org:

```hcl
# <description>.liatr.io
resource "aws_route53_record" "<name>_liatr_io" {
  zone_id = aws_route53_zone.liatr_io.zone_id
  name    = "<name>.liatr.io"
  type    = "CNAME"
  ttl     = 300
  records = ["liatrio.github.io"]
}
```

- Resource name convention: replace hyphens with underscores, append `_liatr_io`
- For repos under `liatrio-labs` org, use `liatrio-labs.github.io` instead
- For repos under `liatrio-clients` org, use `liatrio-clients.github.io` instead

### CNAME to External Service

For domains pointing to Vercel, Azure, or other external services:

```hcl
resource "aws_route53_record" "<name>_liatr_io" {
  zone_id = aws_route53_zone.liatr_io.zone_id
  name    = "<name>.liatr.io"
  type    = "CNAME"
  ttl     = 300
  records = ["<target-domain>"]
}
```

### A Record (GitHub Pages apex or similar)

For apex domains or GitHub Pages A records:

```hcl
resource "aws_route53_record" "<name>_liatr_io" {
  zone_id = aws_route53_zone.liatr_io.zone_id
  name    = "<name>.liatr.io"
  type    = "A"
  ttl     = 300
  records = local.github_pages_ips
}
```

The `local.github_pages_ips` variable is defined at the top of `liatr_io_records.tf`.

### CloudFront Redirect

To redirect a subdomain to another URL, add a module in `dns/redirects.tf` and A/AAAA alias records in `dns/liatr_io_records.tf`:

```hcl
# In redirects.tf:
module "<name>_liatr_io_redirect" {
  source          = "../modules/cloudfront-redirect"
  name            = "<name>-liatr-io-redirect"
  destination_url = "<target-url>"
  origin_domain   = "<name>.liatr.io"
  certificate_arn = module.liatr_io_wildcard_cert.certificate_arn
  tags            = var.tags
}

# In liatr_io_records.tf:
resource "aws_route53_record" "<name>_liatr_io_redirect" {
  zone_id = aws_route53_zone.liatr_io.zone_id
  name    = "<name>.liatr.io"
  type    = "A"
  alias {
    name                   = module.<name>_liatr_io_redirect.domain_name
    zone_id                = module.<name>_liatr_io_redirect.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "<name>_liatr_io_redirect_ipv6" {
  zone_id = aws_route53_zone.liatr_io.zone_id
  name    = "<name>.liatr.io"
  type    = "AAAA"
  alias {
    name                   = module.<name>_liatr_io_redirect.domain_name
    zone_id                = module.<name>_liatr_io_redirect.hosted_zone_id
    evaluate_target_health = false
  }
}
```

### NS Delegation

To delegate a subdomain to another DNS provider or AWS account:

```hcl
resource "aws_route53_record" "<name>_liatr_io_ns" {
  zone_id = aws_route53_zone.liatr_io.zone_id
  name    = "<name>.liatr.io"
  type    = "NS"
  ttl     = 300
  records = ["ns1.example.com", "ns2.example.com", "ns3.example.com", "ns4.example.com"]
}
```

## Workflow

1. **Create a branch** following the naming convention: `add-<name>-liatr-io-cname` (or similar descriptive name)
2. **Add the DNS record** to `dns/liatr_io_records.tf` (or appropriate file)
3. **Commit** with message format: `chore: add CNAME for <name>.liatr.io`
4. **Push and create a PR** — the `pr.yaml` workflow will run `terragrunt plan` and comment the changes on the PR
5. After merge, the `apply.yaml` workflow runs `terragrunt apply` automatically

## Important Reminders

- For GitHub Pages sites, the target repo also needs a `CNAME` file or custom domain configured in Settings > Pages
- The hosted zone reference is `aws_route53_zone.liatr_io.zone_id` for `liatr.io` subdomains
- The hosted zone reference is `aws_route53_zone.k8s_ignite_com.zone_id` for `k8s-ignite.com` subdomains
- The `platform.liatr.io` subdomain has its own zone: `aws_route53_zone.platform_liatr_io.zone_id`
- Wildcard ACM certs already exist for `liatr.io` and `k8s-ignite.com` (in `certificates.tf`)
- Run `tofu fmt` on changed files before committing — CI checks formatting
