# R14 — ZeroShot: Offensive Security Testing for AI Agents

> **Source (platform home)**: https://0eroshot.com/
> **Secondary reference (case study)**: https://nwosunneoma.medium.com/battle-of-the-claws-security-evaluation-of-agents-against-adversarial-attacks-ab043040a12c
> **Fetched at**: 2026-04-23
> **Note**: The home page is a single-page application rendered client-side; full content not directly extractable via HTTP fetch. Information below consolidated from page metadata and a public third-party evaluation.

---

## Overview

ZeroShot is an offensive security testing platform for AI agents. Tagline: *"Pentest your AI agents before attackers do. OWASP compliance reports. Free CLI tool."*

Positioned as a red-team / pentest tool for LLM-based agents, producing OWASP compliance reports against the OWASP LLM Top 10 and MITRE ATLAS techniques.

**Self-described keywords** (from page metadata):

- AI security / LLM security
- Jailbreak testing
- Prompt injection
- AI red teaming / AI penetration testing
- OWASP LLM Top 10
- MITRE ATLAS
- AI vulnerability scanner
- PII detection
- Hallucination detection

## Attack Methodology (from the "Battle of the Claws" evaluation)

ZeroShot's benchmark suite used in the third-party evaluation:

- **145 attack payloads**
- **12 attack categories**, including:
  - Prompt injection
  - Jailbreaking
  - Guardrail bypass
  - System prompt extraction
  - Data exfiltration
  - PII leak
  - Hallucination
  - Privilege escalation
  - Unauthorized action
  - Resource abuse
  - Harmful content
  - (one category unspecified in article)

## Frameworks Evaluated (third-party, Feb 2026)

From Nwosu Rosemary's "Battle of the Claws" (published Feb 2026). Testing required custom Zeroshot wrappers for each framework:

| Framework | Language | Security Score | Risk Level | Critical Failures |
|-----------|----------|----------------|------------|-------------------|
| OpenClaw | TypeScript | 77.8/100 | CRITICAL | 5 |
| PicoClaw | Go | 84.7/100 | CRITICAL | 2 |
| ZeroClaw | Rust | 84.1/100 | CRITICAL | 2 |
| IronClaw | — | — | — | Testing abandoned (setup issues) |
| Minion | — | 94.4/100 | CRITICAL | 3 |

> Author's disclosure: "Minion, one of the agents in this benchmark is owned by me and my lab."

**Notable insight from the evaluator**: *"Security variance arises primarily from orchestration architecture rather than base model capability."*

## Status of Collection

- Platform home page is a JS-rendered SPA; direct scrape returns only title and metadata.
- **No public GitHub repo** has been located for the Zeroshot benchmark tool itself (the `covibes/zeroshot` repo on GitHub is an unrelated AI coding-agent orchestration CLI).
- **Canonical URL** declared in page metadata points to `https://zeroshot.dev`, but that domain hosts a different "Zeroshot" product (code-generation LLMs), suggesting either a domain migration or confused branding. The actual platform used in the Medium evaluation is served from `0eroshot.com`.
- Contact for the coding-LLM product: `mattk@zeroshot.dev` — NOT the security benchmark.

## Citations in the Main Document

- `materials-outline.md` §[R14]: "Zeroshot 安全基准测试 · 攻击载荷: 145 个,覆盖 12 个攻击类别 · 已测框架: OpenClaw、PicoClaw、ZeroClaw、IronClaw、Minion"
- Used in: 测试库分析章节

## Follow-up Actions (if deeper content required)

1. Execute the ZeroShot CLI (requires signup / install) to get the actual payload manifest and generate an OWASP compliance report against a local target.
2. Render the SPA via a headless browser (Chromium / Playwright) to capture the pricing, documentation, and signup flow content.
3. Contact the platform operator for access to the payload corpus.
