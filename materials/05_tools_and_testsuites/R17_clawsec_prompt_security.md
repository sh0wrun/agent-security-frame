# R17 — ClawSec (Prompt Security)

> **Source**: https://github.com/prompt-security/clawsec
> **Default branch**: main
> **Commit SHA (fetched)**: 448a2bd577
> **Fetched at**: 2026-04-23T10:43:25Z

---

## README.md

<h1 align="center">
  <img src="./img/prompt-icon.svg" alt="prompt-icon" width="40">
  ClawSec: Security Skill Suite for AI Agents
  <img src="./img/prompt-icon.svg" alt="prompt-icon" width="40">
</h1>

<div align="center">

## Secure Your OpenClaw, NanoClaw, and Hermes Agents with a Complete Security Skill Suite

<h4>Brought to you by <a href="https://prompt.security">Prompt Security</a>, the Platform for AI Security</h4>

</div>

<div align="center">

![Prompt Security Logo](./img/Black+Color.png)
<img src="./public/img/mascot.png" alt="clawsec mascot" width="200" />

</div>
<div align="center">

🌐 **Live at: [https://clawsec.prompt.security](https://clawsec.prompt.security) [https://prompt.security/clawsec](https://prompt.security/clawsec)**

[![CI](https://github.com/prompt-security/clawsec/actions/workflows/ci.yml/badge.svg)](https://github.com/prompt-security/clawsec/actions/workflows/ci.yml)
[![Deploy Pages](https://github.com/prompt-security/clawsec/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/prompt-security/clawsec/actions/workflows/deploy-pages.yml)
[![Poll NVD CVEs](https://github.com/prompt-security/clawsec/actions/workflows/poll-nvd-cves.yml/badge.svg)](https://github.com/prompt-security/clawsec/actions/workflows/poll-nvd-cves.yml)


</div>

---

## 🦞 What is ClawSec?

ClawSec is a **complete security skill suite for AI agent platforms**. It provides unified security monitoring, integrity verification, and threat intelligence-protecting your agent's cognitive architecture against prompt injection, drift, and malicious instructions.

### Supported Platforms

- **OpenClaw** (MoltBot, Clawdbot, and clones) - Full suite with skill installer, file integrity protection, and security audits
- **NanoClaw** - Containerized WhatsApp bot security with MCP tools for advisory monitoring, signature verification, and file integrity
- **Hermes** - Hermes-native security skills for signed advisory feed verification, advisory-aware guarded verification, deterministic attestation generation, fail-closed verification, and baseline drift detection

### Skill Feature Matrix

| Skill name | supported platform| security feed verification| config drift | agent self pen testing| supply-chain install verification |
|---|---|---|---|---|---|
| claw-release | OpenClaw | No | No | No | Yes |
| clawsec-clawhub-checker | OpenClaw + clawsec-suite integration | No | No | No | Yes |
| clawsec-feed | OpenClaw | Yes | No | No | Yes |
| clawsec-nanoclaw | NanoClaw | Yes | Yes | Yes | Yes |
| clawsec-scanner | OpenClaw | Yes | No | Yes | Yes |
| clawsec-suite | OpenClaw | Yes | Yes | No | Yes |
| clawtributor | OpenClaw | Yes | No | No | No |
| hermes-attestation-guardian | Hermes | Yes (signed advisory feed verification) | Yes | No | Limited (advisory preflight gating only; no artifact signature/provenance install verification) |
| openclaw-audit-watchdog | OpenClaw | No | No | Yes | No |
| soul-guardian | OpenClaw | No | Yes | No | No |

### Core Capabilities

- **📦 Suite Installer** - One-command installation of all security skills with integrity verification
- **🛡️ File Integrity Protection** - Drift detection and auto-restore for critical agent files (SOUL.md, IDENTITY.md, etc.)
- **📡 Live Security Advisories** - Automated NVD CVE polling and community threat intelligence
- **🔍 Security Audits** - Self-check scripts to detect prompt injection markers and vulnerabilities
- **🔐 Checksum Verification** - SHA256 checksums for all skill artifacts
- **Health Checks** - Automated updates and integrity verification for all installed skills

---

## 🎬 Product Demos

Animated previews below are GIFs (no audio). Click any preview to open the full MP4 with audio.

### Install Demo (`clawsec-suite`)

[![Install demo animated preview](public/video/install-demo-preview.gif)](public/video/install-demo.mp4)

Direct link: [install-demo.mp4](public/video/install-demo.mp4)

### Drift Detection Demo (`soul-guardian`)

[![Drift detection animated preview](public/video/soul-guardian-demo-preview.gif)](public/video/soul-guardian-demo.mp4)

Direct link: [soul-guardian-demo.mp4](public/video/soul-guardian-demo.mp4)

---

## 🚀 Quick Start

### For AI Agents

```bash
# Install the ClawSec security suite
npx clawhub@latest install clawsec-suite
```

After install, the suite can:
1. Discover installable protections from the published skills catalog
2. Verify release integrity using signed checksums
3. Set up advisory monitoring and hook-based protection flows
4. Add optional scheduled checks

Manual/source-first option:

> Read https://github.com/prompt-security/clawsec/releases/latest/download/SKILL.md and follow the installation instructions.

### For Humans

Copy this instruction to your AI agent:

> Install ClawSec with `npx clawhub@latest install clawsec-suite`, then complete the setup steps from the generated instructions.

### Shell and OS Notes

ClawSec scripts are split between:
- Cross-platform Node/Python tooling (`npm run build`, hook/setup `.mjs`, `utils/*.py`)
- POSIX shell workflows (`*.sh`, most manual install snippets)

For Linux/macOS (`bash`/`zsh`):
- Use unquoted or double-quoted home vars: `export INSTALL_ROOT="$HOME/.openclaw/skills"`
- Do **not** single-quote expandable vars (for example, avoid `'$HOME/.openclaw/skills'`)

For Windows (PowerShell):
- Prefer explicit path building:
  - `$env:INSTALL_ROOT = Join-Path $HOME ".openclaw\\skills"`
  - `node "$env:INSTALL_ROOT\\clawsec-suite\\scripts\\setup_advisory_hook.mjs"`
- POSIX `.sh` scripts require WSL or Git Bash.

Troubleshooting: if you see directories such as `~/.openclaw/workspace/$HOME/...`, a home variable was passed literally. Re-run using an absolute path or an unquoted home expression.

---

## 🧭 Platform & Suite Documentation

Detailed platform and suite docs live in the wiki modules:
- NanoClaw: [wiki/modules/nanoclaw-integration.md](wiki/modules/nanoclaw-integration.md)
- Hermes: [wiki/modules/hermes-attestation-guardian.md](wiki/modules/hermes-attestation-guardian.md)
- ClawSec Suite (OpenClaw): [wiki/modules/clawsec-suite.md](wiki/modules/clawsec-suite.md)
- CI/CD pipelines: [wiki/modules/automation-release.md](wiki/modules/automation-release.md)

Quick install links:
- NanoClaw install: [skills/clawsec-nanoclaw/INSTALL.md](skills/clawsec-nanoclaw/INSTALL.md)
- Hermes skill package: `skills/hermes-attestation-guardian/`
- Suite package: `skills/clawsec-suite/`

---

## 📡 Security Advisory Feed

ClawSec maintains a continuously updated security advisory feed, automatically populated from NIST's National Vulnerability Database (NVD).

### Feed URL

```bash
# Fetch latest advisories
curl -s https://clawsec.prompt.security/advisories/feed.json | jq '.advisories[] | select(.severity == "critical" or .severity == "high")'
```

Canonical endpoint: `https://clawsec.prompt.security/advisories/feed.json`  
Compatibility mirror (legacy): `https://clawsec.prompt.security/releases/latest/download/feed.json`

### Monitored Keywords

The feed polls CVEs related to:
- **OpenClaw Platform**: `OpenClaw`, `clawdbot`, `Moltbot`
- **NanoClaw Platform**: `NanoClaw`, `WhatsApp-bot`, `baileys`
- Prompt injection patterns
- Agent security vulnerabilities

### Exploitability Context

ClawSec enriches CVE advisories with **exploitability context** to help agents assess real-world risk beyond raw CVSS scores. Newly analyzed advisories can include:

- **Exploit Evidence**: Whether public exploits exist in the wild
- **Weaponization Status**: If exploits are integrated into common attack frameworks
- **Attack Requirements**: Prerequisites needed for successful exploitation (network access, authentication, user interaction)
- **Risk Assessment**: Contextualized risk level combining technical severity with exploitability

This feature helps agents prioritize vulnerabilities that pose immediate threats versus theoretical risks, enabling smarter security decisions.

### Advisory Schema

**NVD CVE Advisory:**
```json
{
  "id": "CVE-2026-XXXXX",
  "severity": "critical|high|medium|low",
  "type": "vulnerable_skill",
  "platforms": ["openclaw", "nanoclaw"],
  "title": "Short description",
  "description": "Full CVE description from NVD",
  "published": "2026-02-01T00:00:00Z",
  "cvss_score": 8.8,
  "nvd_url": "https://nvd.nist.gov/vuln/detail/CVE-2026-XXXXX",
  "exploitability_score": "high|medium|low|unknown",
  "exploitability_rationale": "Why this CVE is or is not likely exploitable in agent deployments",
  "references": ["..."],
  "action": "Recommended remediation"
}
```

**Community Advisory:**
```json
{
  "id": "CLAW-2026-0042",
  "severity": "high",
  "type": "prompt_injection|vulnerable_skill|tampering_attempt",
  "platforms": ["nanoclaw"],
  "title": "Short description",
  "description": "Detailed description from issue",
  "published": "2026-02-01T00:00:00Z",
  "affected": ["skill-name@1.0.0"],
  "source": "Community Report",
  "github_issue_url": "https://github.com/.../issues/42",
  "action": "Recommended remediation"
}
```

**Platform values:**
- `"openclaw"` - OpenClaw/Clawdbot/MoltBot only
- `"nanoclaw"` - NanoClaw only
- `["openclaw", "nanoclaw"]` - Both platforms
- (empty/missing) - All platforms (backward compatible)

---

## 🔄 CI/CD Pipelines

CI/CD pipeline details were moved to the wiki module page:
- [wiki/modules/automation-release.md](wiki/modules/automation-release.md)

Related operations docs:
- [wiki/security-signing-runbook.md](wiki/security-signing-runbook.md)
- [wiki/migration-signed-feed.md](wiki/migration-signed-feed.md)

---

## 🛠️ Offline Tools

ClawSec includes Python utilities for local skill development and validation.

### Skill Validator

Validates a skill folder against the required schema:

```bash
python utils/validate_skill.py skills/clawsec-feed
```

Checks:
- `skill.json` exists and is valid JSON
- Required fields present (name, version, description, author, license)
- SBOM files exist and are readable
- OpenClaw metadata is properly structured

### Skill Checksums Generator

Generates `checksums.json` with SHA256 hashes for a skill:

```bash
python utils/package_skill.py skills/clawsec-feed ./dist
```

Outputs:
- `checksums.json` - SHA256 hashes for verification

---

## 🛠️ Local Development

### Prerequisites

- Node.js 20+
- Python 3.10+ (for offline tools)
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Populate Local Data

```bash
# Populate skills catalog from local skills/ directory
./scripts/populate-local-skills.sh

# Populate advisory feed with real NVD CVE data
./scripts/populate-local-feed.sh --days 120

# Generate wiki llms exports from wiki/ (for local preview)
./scripts/populate-local-wiki.sh

# Direct generator entrypoint (used by predev/prebuild)
npm run gen:wiki-llms
```

Notes:
- `npm run dev` and `npm run build` automatically regenerate wiki `llms.txt` exports (`predev`/`prebuild` hooks).
- `public/wiki/` is generated output (local + CI) and is intentionally gitignored.

### Build

```bash
npm run build
```

---

## 📁 Project Structure

```
├── advisories/
│   ├── feed.json                    # Main advisory feed
│   ├── feed.json.sig                # Detached signature for feed.json
│   └── feed-signing-public.pem      # Public key for feed verification
├── components/                      # React components
├── pages/                           # Route/page components
├── wiki/                            # Source-of-truth docs (synced to GitHub Wiki)
├── scripts/
│   ├── generate-wiki-llms.mjs       # wiki/*.md -> public/wiki/**/llms.txt
│   ├── populate-local-feed.sh       # Local CVE feed populator
│   ├── populate-local-skills.sh     # Local skills catalog populator
│   ├── populate-local-wiki.sh       # Local wiki llms export populator
│   ├── prepare-to-push.sh           # Local CI-style quality gate
│   ├── validate-release-links.sh    # Release link checks
│   └── release-skill.sh             # Manual skill release helper
├── skills/
│   ├── claw-release/                # 🚀 Release automation workflow skill
│   ├── clawsec-suite/               # 📦 Suite installer (skill-of-skills)
│   ├── clawsec-feed/                # 📡 Advisory feed skill
│   ├── clawsec-scanner/             # 🔍 Vulnerability scanner (deps + SAST + OpenClaw DAST)
│   ├── clawsec-nanoclaw/            # 📱 NanoClaw platform security suite
│   ├── clawsec-clawhub-checker/     # 🧪 ClawHub reputation checks
│   ├── clawtributor/                # 🤝 Community reporting skill
│   ├── hermes-attestation-guardian/ # 🛡️ Hermes attestation + drift verification
│   ├── openclaw-audit-watchdog/     # 🔭 Automated audit skill
│   └── soul-guardian/               # 👻 File integrity skill
├── utils/
│   ├── package_skill.py             # Skill packager utility
│   └── validate_skill.py            # Skill validator utility
├── .github/workflows/
│   ├── ci.yml                       # Cross-platform lint/type/build + tests
│   ├── pages-verify.yml             # PR-only pages build/signing verification
│   ├── poll-nvd-cves.yml            # CVE polling pipeline
│   ├── community-advisory.yml       # Approved issue -> advisory PR
│   ├── skill-release.yml            # Skill release/signing pipeline
│   ├── deploy-pages.yml             # GitHub Pages deployment
│   ├── wiki-sync.yml                # Sync repo wiki/ to GitHub Wiki
│   ├── codeql.yml                   # CodeQL security analysis
│   └── scorecard.yml                # OpenSSF Scorecard checks
└── public/                          # Static assets + generated wiki exports
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Submitting Security Advisories

Found a prompt injection vector, malicious skill, or security vulnerability? Report it via GitHub Issues:

1. Open a new issue using the **Security Incident Report** template
2. Fill out the required fields (severity, type, description, affected skills)
3. A maintainer will review and add the `advisory-approved` label
4. The advisory is automatically published to the feed as `CLAW-{YEAR}-{ISSUE#}`

See [CONTRIBUTING.md](CONTRIBUTING.md#submitting-security-advisories) for detailed guidelines.

### Adding New Skills

1. Create a skill folder under `skills/`
2. Add `skill.json` with required metadata and SBOM
3. Add `SKILL.md` with agent-readable instructions
4. Validate with `python utils/validate_skill.py skills/your-skill`
5. Submit a PR for review

## 📚 Documentation Source of Truth

For all wiki content, edit files under `wiki/` in this repository. The GitHub Wiki (`<repo>.wiki.git`) is synced from `wiki/` by `.github/workflows/wiki-sync.yml` when `wiki/**` changes on `main`.

LLM exports are generated from `wiki/` into `public/wiki/`:
- `/wiki/llms.txt` is the LLM-ready export for `wiki/INDEX.md` (or a generated fallback index if `INDEX.md` is missing).
- `/wiki/<page>/llms.txt` is the LLM-ready export for that single wiki page.

---

## 📄 License

- Source code: GNU AGPL v3.0 or later - See [LICENSE](LICENSE) for details.
- Fonts in `font/`: Licensed separately - See [`font/README.md`](font/README.md).

---

<div align="center">

**ClawSec** · Prompt Security, SentinelOne

🦞 Hardening agentic workflows, one skill at a time.

</div>

---

## SECURITY.md

# Security Policy

## Supported Versions

ClawSec follows a strict release lifecycle where **only the latest version within each major version** is retained and supported.

When a new patch or minor version is released (e.g., updating from `1.0.0` to `1.0.1`), the previous release artifacts for that major version are automatically deleted to maintain a clean release history. Major versions co-exist for backwards compatibility.

| Version | Supported | Notes |
| ------- | :---: | --- |
| **Latest Major** | :white_check_mark: | The most recent release (e.g., `v1.x.x`) is fully supported. |
| **Previous Majors** | :white_check_mark: | The latest release of previous major versions (e.g., `v0.x.x`) remains available. |
| **Older Patches** | :x: | Previous patch/minor versions are deleted upon new releases. |

## Reporting a Vulnerability

We welcome reports regarding prompt injection vectors, malicious skills, or security vulnerabilities in the ClawSec suite.

### How to Submit a Report
Please report vulnerabilities directly via **GitHub Issues** using our specific template:

1.  Navigate to the **Issues** tab.
2.  Open a new issue using the **Security Incident Report** template.
3.  Fill out the required fields, including:
    *   **Severity** (Critical/High/Medium/Low)
    *   **Type** (e.g., `prompt_injection`, `vulnerable_skill`, `tampering_attempt`)
    *   **Description**
    *   **Affected Skills**

### What to Expect
Once a report is submitted, the following process occurs:

1.  **Review:** A maintainer will review your report.
2.  **Approval:** If validated, the maintainer will add the `advisory-approved` label to the issue.
3.  **Publication:** The advisory is **automatically published** to the ClawSec Security Advisory Feed as `CLAW-{YEAR}-{ISSUE#}`.
4.  **Distribution:** The updated feed is immediately available to all agents running the `clawsec-feed` skill, which polls for these updates daily.

### Security Advisory Feed
ClawSec maintains a continuously updated feed populated by these community reports and the NIST National Vulnerability Database (NVD). You can verify the current status of known vulnerabilities by querying the feed directly:

```bash
curl -s https://clawsec.prompt.security/advisories/feed.json

---

## CONTRIBUTING.md

# Contributing to ClawSec Skills

Thank you for your interest in contributing security skills to the ClawSec ecosystem! This guide will walk you through creating, testing, and submitting new skills.

## Wiki Documentation Source of Truth

For contributor-facing wiki docs, treat `wiki/` in this repository as the single source of truth. Do not edit the GitHub Wiki directly; `.github/workflows/wiki-sync.yml` publishes `wiki/` to `<repo>.wiki.git` when `wiki/**` changes on `main`.

## Table of Contents

- [Wiki Documentation Source of Truth](#wiki-documentation-source-of-truth)
- [Getting Started](#getting-started)
- [Skill Structure](#skill-structure)
- [Creating a New Skill](#creating-a-new-skill)
- [skill.json Reference](#skilljson-reference)
- [Testing Your Skill](#testing-your-skill)
- [Submission Process](#submission-process)
- [Version Bump and Release Flow](#version-bump-and-release-flow)
- [Review Criteria](#review-criteria)
- [After Acceptance](#after-acceptance)
- [Submitting Security Advisories](#submitting-security-advisories)

---

## Getting Started

### 1. Fork the Repository

1. Navigate to the [ClawSec repository](https://github.com/prompt-security/clawsec)
2. Click the "Fork" button in the top-right corner
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/clawsec.git
cd clawsec
```

### 2. Set Up Your Environment

```bash
# Add upstream remote to sync with main repo
git remote add upstream https://github.com/prompt-security/clawsec.git

# Install dependencies (if any)
npm install

# Create a new branch for your skill
git checkout -b skill/my-new-skill
```

---

## Trust & Verification Model

All skills distributed through ClawSec undergo security review and are hashed for agent verification. Trust is implicit:

- **Backend Verification**: Every skill is validated against checksums, SBOM manifests, and security policies
- **Transparent Security**: SHA256 checksums, and advisory feeds operate automatically
- **Contribution Flow**: Submit skills via PR → maintainer review → approval → release


---

## Skill Structure

Each skill lives in its own directory under `skills/`. Here's the standard structure:

```
skills/
  └── my-skill-name/
      ├── skill.json          # Required: Metadata and SBOM
      ├── SKILL.md            # Required: Main skill documentation
      ├── README.md           # Optional: Additional documentation
      └── scripts/
          ├── # Any supporting scripts your skill needs
```

### Example: Minimal Skill

```
skills/
  └── my-security-scanner/
      ├── skill.json
      └── SKILL.md
```

### Example: Complex Skill

```
skills/
  └── advanced-analyzer/
      ├── skill.json
      ├── SKILL.md
      ├── README.md
      ├── templates/
      │   └── report-template.md
      ├── scripts/
      │   └── action.py
      └── config/
          └── rules.json
```

---

## Creating a New Skill

### Step 1: Create Skill Directory

```bash
mkdir -p skills/my-skill-name
cd skills/my-skill-name
```

### Step 2: Create skill.json

Create `skill.json` with the following structure:

```json
{
  "name": "my-skill-name",
  "version": "0.0.1",
  "description": "Brief description of what your skill does",
  "author": "your-github-username",
  "license": "AGPL-3.0-or-later",
  "homepage": "https://github.com/prompt-security/clawsec",
  "keywords": ["security", "relevant", "tags"],

  "sbom": {
    "files": [
      {
        "path": "SKILL.md",
        "required": true,
        "description": "Main skill documentation"
      }
    ]
  },

  "openclaw": {
    "emoji": "🔒",
    "category": "security",
    "requires": {
      "bins": ["curl", "jq"]
    },
    "triggers": [
      "keyword that activates skill",
      "another trigger phrase",
      "security check"
    ]
  }
}
```

**Important Notes:**
- Start with version `0.0.1` in both `skill.json` and `SKILL.md` frontmatter
- List ALL files your skill needs in the SBOM

### Step 3: Create SKILL.md

This is the main documentation for your skill. Include YAML frontmatter with a `version` that matches `skill.json`:

````markdown
```markdown
---
name: my-skill-name
version: 0.0.1
description: Brief description of what your skill does
metadata: {"openclaw":{"emoji":"🔒","category":"security"}}
---

# My Skill Name

## Overview

Brief description of what this skill does and why it's useful for AI agent security.

## Usage

How to use the skill.

## Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Requirements

- Required tools: curl, jq, etc.
- Any system dependencies
- Prerequisites

## Security Considerations

Important security notes about this skill.
```
````

### Step 4: Add Supporting Files

Add any additional files your skill needs (configs, templates, scripts), and **ensure they're listed in skill.json's SBOM**.

---

## skill.json Reference

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Skill identifier (lowercase, hyphens only) |
| `version` | string | Semantic version (0.0.1) |
| `description` | string | Brief description (max 200 chars) |
| `author` | string | Your GitHub username or organization |
| `license` | string | License type (prefer AGPL-3.0-or-later) |
| `homepage` | string | Repository URL |
| `keywords` | array | Searchable tags |
| `sbom` | object | Software Bill of Materials |

### Verification

All skills published through ClawSec are reviewed by Prompt Security staff or designated maintainers before release:

- All published skills undergo security review
- Checksums and SBOM validation ensure integrity
- There is no distinction between "verified" and "community" skills - every skill in the catalog has passed review

### SBOM Structure

The SBOM (Software Bill of Materials) lists all files that are part of your skill:

```json
{
  "sbom": {
    "files": [
      {
        "path": "SKILL.md",
        "required": true,
        "description": "Main skill file"
      },
      {
        "path": "config/rules.json",
        "required": false,
        "description": "Optional configuration rules"
      }
    ]
  }
}
```

**Critical:** Every file your skill uses MUST be listed in the SBOM. This enables:
- Automated checksum generation
- Integrity verification
- Secure distribution

### OpenClaw Integration

The `openclaw` section defines how the skill integrates with Claude Code:

```json
{
  "openclaw": {
    "emoji": "🔒",
    "category": "security",
    "requires": {
      "bins": ["curl", "jq", "git"]
    },
    "triggers": [
      "keyword to activate skill",
      "another trigger phrase"
    ]
  }
}
```

**Categories:** `security`, `monitoring`, `analysis`, `reporting`, `utility`

---

## Testing Your Skill

### 1. Validate JSON Structure

```bash
# Validate skill.json is valid JSON
cat skills/my-skill-name/skill.json | jq .
```

### 2. Verify SBOM Completeness

```bash
# Check all SBOM files exist
cd skills/my-skill-name
for file in $(jq -r '.sbom.files[].path' skill.json); do
  [ -f "$file" ] && echo "✓ $file" || echo "✗ $file MISSING"
done
```

### 3. Test Locally (if applicable)

If your skill includes executable scripts or requires testing:

```bash
# Follow the testing instructions in your SKILL.md
```

### 4. Check for Common Issues

- [ ] All SBOM files exist
- [ ] skill.json is valid JSON
- [ ] Version is `0.0.1` for new skills
- [ ] `skill.json` version matches `SKILL.md` frontmatter version
- [ ] No hardcoded credentials or secrets
- [ ] Trigger phrases are descriptive
- [ ] Required binaries are documented

---

## Submission Process

### 1. Commit Your Changes

```bash
# From the repository root
git add skills/my-skill-name/
git commit -m "feat(skills): add my-skill-name security skill"
```

**Commit Message Format:**
```
feat(skills): add <skill-name> <brief description>

- Key feature 1
- Key feature 2
- Security benefit
```

### 2. Push to Your Fork

```bash
git push origin skill/my-new-skill
```

### 3. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch (`skill/my-new-skill`)
4. Fill out the PR template:

```markdown
## Skill Contribution: [Skill Name]

### Description
Brief overview of what this skill does.

### Security Benefits
How this skill improves AI agent security.

### Testing Performed
- [ ] JSON validation passed
- [ ] SBOM files verified
- [ ] Local testing completed
- [ ] No secrets or credentials included

### Checklist
- [ ] skill.json is complete
- [ ] SKILL.md documentation is clear
- [ ] All SBOM files are present
- [ ] Version is 0.0.1 (if new skill)

### Additional Notes
Any special considerations for reviewers.
```

---

## Version Bump and Release Flow

This repository uses a branch-first workflow for skill versions:

1. Make skill changes on a branch (`skill/<name>-...`).
2. Keep versions in sync:
   - `skills/<skill>/skill.json` -> `.version`
   - `skills/<skill>/SKILL.md` -> frontmatter `version`
3. For existing skills, you can bump versions on your branch with:

```bash
./scripts/release-skill.sh <skill-name> <new-version>
```

4. Push your branch and open a PR. CI will run:
   - Version parity checks
   - A `release` dry-run (build/validation only, no publish)
5. Do **not** push release tags from PR branches.
   - `scripts/release-skill.sh` creates a local tag. Keep it local during PR review.
   - If you need to remove that local tag: `git tag -d <skill-name>-v<version>`
6. After merge, a maintainer creates and pushes the release tag from `main`:

```bash
git checkout main
git pull --ff-only origin main
git tag -a <skill-name>-v<version> -m "<skill-name> version <version>"
git push origin <skill-name>-v<version>
```

7. Pushing the tag triggers the full release workflow (GitHub release + ClawHub publish).

---

## Review Criteria

Maintainers will review your skill based on:

### Security
- [ ] No malicious code or backdoors
- [ ] No hardcoded credentials
- [ ] Safe command execution (no command injection)
- [ ] Proper input validation
- [ ] No unnecessary privileges required

### Quality
- [ ] Clear documentation
- [ ] Well-structured code
- [ ] Follows naming conventions
- [ ] Complete SBOM
- [ ] Descriptive trigger phrases

### Value
- [ ] Provides clear security benefit
- [ ] Not duplicate of existing skill
- [ ] Useful for AI agent protection
- [ ] Aligns with ClawSec mission

### Technical
- [ ] Valid JSON structure
- [ ] All SBOM files present
- [ ] Correct versioning
- [ ] Proper metadata

---

## After Acceptance

Once your skill is accepted:

1. **Maintainers will:**
   - Review your PR (Prompt Security staff or designated maintainers)
   - Merge your PR after security review
   - Create and push a release tag from merged `main` (`<skill>-v<version>`)
   - Generate checksums and publish to GitHub Releases + ClawHub
   - Update the skills catalog website

2. **You'll be credited:**
   - Listed as the skill author
   - Mentioned in release notes
   - Added to contributors list

3. **Future updates:**
   - Submit PRs with version bumps for improvements
   - Maintainers will handle releases
   - Follow semantic versioning:
     - `1.0.1` - Patch (bug fixes)
     - `1.1.0` - Minor (new features)
     - `2.0.0` - Major (breaking changes)

---

## Questions?

- **Issues:** [GitHub Issues](https://github.com/prompt-security/clawsec/issues)
- **Discussions:** [GitHub Discussions](https://github.com/prompt-security/clawsec/discussions)
- **Security:** For security-sensitive contributions, email security@prompt.security

---

## Example Contribution

Here's a complete example of a minimal skill contribution:

```bash
# Fork and clone
git clone https://github.com/YOUR-USERNAME/clawsec.git
cd clawsec

# Create branch
git checkout -b skill/simple-scanner

# Create skill
mkdir -p skills/simple-scanner
cat > skills/simple-scanner/skill.json << 'EOF'
{
  "name": "simple-scanner",
  "version": "0.0.1",
  "description": "Basic security scanner for AI agents",
  "author": "contributor-name",
  "license": "AGPL-3.0-or-later",
  "homepage": "https://github.com/prompt-security/clawsec",
  "keywords": ["security", "scanner", "basic"],
  "sbom": {
    "files": [
      { "path": "SKILL.md", "required": true, "description": "Scanner documentation" }
    ]
  },
  "openclaw": {
    "emoji": "🔍",
    "category": "security",
    "requires": { "bins": ["curl"] },
    "triggers": ["simple scan", "basic security check"]
  }
}
EOF

cat > skills/simple-scanner/SKILL.md << 'EOF'
---
name: simple-scanner
version: 0.0.1
description: Basic security scanner for AI agents
metadata: {"openclaw":{"emoji":"🔍","category":"security"}}
---

# Simple Scanner

A basic security scanner for AI agents.

## Usage
Run a simple security scan on your agent configuration.

## Features
- Quick security checks
- Minimal dependencies
- Easy to use
EOF

# Validate
cat skills/simple-scanner/skill.json | jq .

# Commit and push
git add skills/simple-scanner/
git commit -m "feat(skills): add simple-scanner security skill

- Provides basic security scanning
- Minimal dependencies
- Easy to use for beginners"
git push origin skill/simple-scanner
```

Then create a pull request on GitHub!

---

## Submitting Security Advisories

Found a prompt injection vector, malicious skill, or security vulnerability affecting AI agents? Help protect the community by submitting a security advisory.

### Advisory Types

| Type | Description | Example |
|------|-------------|---------|
| `prompt_injection` | Detected prompt injection or social engineering | Skill contains hidden instructions to exfiltrate data |
| `vulnerable_skill` | Skill with security vulnerabilities | Skill executes unsanitized user input |
| `tampering_attempt` | Attempt to disable/modify security controls | Instructions to remove ClawSec or ignore security checks |

### How to Submit

#### 1. Open a Security Incident Report

1. Go to [Issues → New Issue](https://github.com/prompt-security/clawsec/issues/new/choose)
2. Select **"Security Incident Report"** template
3. Fill out all required sections:

**Required Fields:**
- **Opener Type** - Are you a human or an AI agent reporting this?
- **Report Type** - What kind of issue is this?
- **Severity** - How severe is the threat?
- **Title** - Brief descriptive title
- **Description** - Detailed explanation of the vulnerability
- **Affected** - Which skill(s) and version(s) are affected
- **Recommended Action** - What should users do?

**Optional but Helpful:**
- Evidence (sanitized payloads, indicators)
- Reporter information (for follow-up questions)

#### 2. Privacy Checklist

Before submitting, ensure you have:
- [ ] Removed all real user data and PII
- [ ] Not included any API keys, credentials, or secrets
- [ ] Sanitized evidence to describe issues abstractly
- [ ] No proprietary or confidential information included

#### 3. Wait for Review

A maintainer will:
1. Review your report for validity and completeness
2. Assess the severity and impact
3. Add the `advisory-approved` label when ready to publish

#### 4. Automatic Publication

Once approved, the [community-advisory workflow](.github/workflows/community-advisory.yml) automatically:
1. Parses your issue content
2. Generates an advisory ID: `CLAW-{YEAR}-{ISSUE_NUMBER}` (e.g., `CLAW-2026-0042`)
3. Adds the advisory to `advisories/feed.json`
4. Comments on your issue confirming publication

### Advisory ID Format

| Source | Format | Example |
|--------|--------|---------|
| NVD CVE | `CVE-YYYY-NNNNN` | `CVE-2026-24763` |
| Community Report | `CLAW-YYYY-NNNN` | `CLAW-2026-0042` |

The `NNNN` in community advisories is your GitHub issue number, zero-padded to 4 digits.

### Example Security Report

```markdown
## Opener Type
- [x] Agent (automated report)

## Report Type
- [x] Vulnerable Skill - Found a skill with security issues

## Severity
- [x] High - Significant security risk, potential for harm

## Title
Data exfiltration via helper-plus skill network calls

## Description
The helper-plus skill was observed sending conversation data to an external
server (suspicious-domain.com) on every invocation. The skill makes
undocumented network calls that transmit full conversation context to a
domain not mentioned in the skill description.

## Affected

### Skill Name
helper-plus

### Skill Version
0.0.1, 1.0.0, 1.0.1

## Recommended Action
Remove helper-plus immediately. Do not use versions 0.0.1, 1.0.0 or 1.0.1.
Wait for a verified patched version.

## Reporter Information (Optional)
**Agent/User Name:** SecurityBot
```

### After Publication

Once your advisory is published:

1. **Agents receive it** - The feed is served at `https://clawsec.prompt.security/advisories/feed.json` (with signature/checksum artifacts), so agents see it on their next feed check
2. **You're credited** - Your issue is linked in the advisory
3. **Community is protected** - Agents using ClawSec Feed will be alerted

### Questions?

- **General questions:** [GitHub Discussions](https://github.com/prompt-security/clawsec/discussions)
- **Sensitive reports:** Email security@prompt.security for issues too sensitive for public disclosure

---

Thank you for contributing to ClawSec security! 🛡️

