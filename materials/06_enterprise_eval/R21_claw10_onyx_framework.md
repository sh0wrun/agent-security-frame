# R21 — CLAW-10 Enterprise Evaluation Framework (Onyx AI)

> **Source**: https://onyx.app/insights/openclaw-enterprise-evaluation-framework
> **Title**: The Enterprise Evaluation Framework for OpenClaw
> **Author**: Wenxi Huang
> **Publication Date**: February 24, 2026
> **Article Type**: AI Security (8-minute read)
> **Fetched at**: 2026-04-23

---

## Overview

This article introduces the **CLAW-10 Enterprise Readiness Matrix**, a vendor-neutral scoring system for evaluating autonomous AI agents against enterprise security requirements.

OpenClaw is described as "an open-source, autonomous AI agent that connects large language models to your computer, your accounts, and your tools." Created by Peter Steinberger and released in November 2025, the tool gained significant traction — attracting over 150,000 GitHub stars — but also revealed substantial security vulnerabilities. The article notes that "within the first 24 hours of scanning, Bitsight's STRIKE team identified over 40,000 exposed OpenClaw instances."

## CLAW-10 Dimensions and Scoring

The matrix evaluates agents across 10 dimensions using a 1–5 scale, with 4 marking the enterprise-ready threshold. OpenClaw's composite score is **1.2/5**.

| # | Dimension | Score | Threshold | Status |
|---|-----------|-------|-----------|--------|
| 1 | Identity & Authentication | 1/5 | 4 | Critical gap |
| 2 | Authorization & Access Control | 1/5 | 4.5 | Critical gap |
| 3 | Audit Logging & Observability | 2/5 | 4.5 | Major gap |
| 4 | Data Isolation & Residency | 1/5 | 4 | Critical gap |
| 5 | Execution Sandboxing | 1/5 | 4.5 | Critical gap |
| 6 | Compliance Certifications | 1/5 | 4 | Critical gap |
| 7 | Supply Chain Security | 1/5 | 4 | Critical gap |
| 8 | Network Exposure & Attack Surface | 2/5 | 4 | Major gap |
| 9 | Privilege Model | 1/5 | 4 | Critical gap |
| 10 | Vendor Support & SLAs | 1/5 | 3 | Major gap |

### Key Dimension Details

**Identity & Authentication (1/5)**: OpenClaw lacks SSO, SAML, OIDC, and MFA. Microsoft's security team states the agent requires "dedicated non-privileged credentials" for safe evaluation.

**Authorization & Access Control (1/5)**: No RBAC or ABAC exists. CrowdStrike observes: "A compromised agent can use its legitimate tool access to move laterally."

**Audit Logging & Observability (2/5)**: Basic conversation logging exists but lacks tamper-evidence, SIEM integration, and compliance mapping.

**Data Isolation & Residency (1/5)**: API keys and session data stored in plaintext. Bitdefender documented exploitation targeting `~/.clawdbot/.env` files containing unencrypted credentials.

**Execution Sandboxing (1/5)**: Runs with full user privileges. Microsoft characterizes it as "untrusted code execution with persistent credentials."

**Compliance Certifications (1/5)**: No SOC 2, HIPAA, GDPR, ISO 27001, or FedREAMP certifications available.

**Supply Chain Security (1/5)**: The ClawHavoc campaign poisoned the skill marketplace with 1,184+ malicious packages. Requirements were minimal — only a week-old GitHub account.

**Network Exposure & Attack Surface (2/5)**: Listens on port 18789 by default. CVE-2026-25253 (CVSS 8.8) affects versions before 2026.1.29.

**Privilege Model (1/5)**: Ambient authority model with no least-privilege enforcement. Sophos calls it the "lethal trifecta" combining data access, external communication, and untrusted content processing.

**Vendor Support & SLAs (1/5)**: Community project with no commercial support, SLAs, or guaranteed maintenance following the original creator's departure to OpenAI.

## Using the CLAW-10 Matrix

The framework involves four steps:

1. **Weight dimensions** based on organizational priorities
2. **Set minimum thresholds** for acceptable scores
3. **Identify compensating controls** to address gaps
4. **Calculate total readiness cost** against use-case value

## Enterprise Requirements

Baseline requirements for enterprise-grade AI agents identified by the article:

- Sandboxed execution isolating agent actions from the host
- Role-based access control with minimal required permissions
- Immutable audit logging for compliance and incident response
- Data isolation respecting existing access controls
- Verified supply chains with signed extensions and automated scanning

The article notes that Onyx (the publishing organization) implements these controls with SOC 2 Type II certification, self-hosting options, and built-in SSO/RBAC.

## Resources

No downloadable PDF is mentioned in the article. This piece is identified as the first in a 4-part series on enterprise AI agent security.
