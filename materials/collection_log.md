# Materials 收集日志

**更新日期**: 2026-05-05
**参照**: `materials-outline.md`（R1–R22）
**目录布局**: 按类别分 6 个子目录（详见 `/home/kali/.claude/plans/logical-launching-scott.md`）

## 状态图例

- ✅ 已完成 — 原始文件或 README/文档已落盘
- 🟡 部分完成 — 下载成功但原始内容需 SPA 渲染或访问受限
- ⚪ 用户提供 — 由用户直接投放本地副本
- ❌ 下载失败 / 出处未知
- ⏭ 预研(下一版本迭代) — 已识别但未下载/整合,计划 v2.1 处理

---

## 收集清单

| R  | 标题 | 类型 | 原始 URL | 本地路径 | 状态 | 抓取时间 | 章节引用 |
|----|------|------|----------|----------|------|----------|----------|
| R1 | 奇安信龙虾（OpenClaw）安全使用指南 | 内部文档 (PDF, 53p) | — | `01_industry_guides/R1_qianxin_openclaw_guide.pdf` | ⚪ 用户提供 | 2026-04-23 | 1,2,3,4,5,6,7,12 |
| R2 | SlowMist OpenClaw Security Practice Guide | GitHub (README + docs) | https://github.com/slowmist/openclaw-security-practice-guide | `01_industry_guides/R2_slowmist_practice_guide.md` | ✅ | 2026-04-23 | 4,7,10,12 |
| R3 | OWASP Top 10 for Agentic Applications 2026 | PDF (8p) | https://genai.owasp.org/download/52117/ | `01_industry_guides/R3_owasp_top10_asi_2026.pdf` | ✅ | 2026-04-23 | 2,3,4,7,8,9 |
| R3b | OWASP Agentic AI Threats and Mitigations (T01–T17) | PDF (8p) | https://genai.owasp.org/download/45674/ | `01_industry_guides/R3b_owasp_agentic_threats_t01_t17.pdf` | ✅ | 2026-04-23 | 伴随 R3 |
| R4 | Cisco DefenseClaw | GitHub (README + docs + blog) | https://github.com/cisco-ai-defense/defenseclaw | `02_opensource_frameworks/R4_cisco_defenseclaw.md` | ✅ | 2026-04-23 | 5,7,11 |
| R5 | Microsoft Agent Governance Toolkit | GitHub (README + docs + blog) | https://github.com/microsoft/agent-governance-toolkit | `02_opensource_frameworks/R5_microsoft_agt.md` | ✅ | 2026-04-23 | 4,6,7,8,10,11 |
| R6 | AEGIS: No Tool Call Left Unchecked | arXiv PDF (12p) | https://arxiv.org/abs/2603.12621 | `02_opensource_frameworks/R6_aegis_2603.12621.pdf` | ✅ | 2026-04-23 | 1,2,4,6,7,10,11 |
| R7 | A Systematic Taxonomy of Security Vulnerabilities in OpenClaw | arXiv PDF (7p) | https://arxiv.org/abs/2603.27517 | `03_academic_papers/R7_2603.27517.pdf` | ✅ | 2026-04-13 (已有) | 1,2,3,4,6,9,10 |
| R8 | A Systematic Security Evaluation of OpenClaw and Its Variants | arXiv PDF (5p) | https://arxiv.org/abs/2604.03131 | `03_academic_papers/R8_2604.03131.pdf` | ✅ | 2026-04-13 (已有) | 1,2,3,9,10 |
| R9 | Your Agent, Their Asset: A Real-World Safety Analysis of OpenClaw | arXiv PDF (14p) | https://arxiv.org/abs/2604.04759 | `03_academic_papers/R9_2604.04759.pdf` | ✅ | 2026-04-16 (已有) | 1,2 |
| R10 | ClawSafety: "Safe" LLMs, Unsafe Agents | arXiv PDF (8p) | https://arxiv.org/abs/2604.01438 | `03_academic_papers/R10_clawsafety_2604.01438.pdf` | ✅ | 2026-04-23 | 测试库分析章节 |
| R11 | From Assistant to Double Agent (PASB) | arXiv PDF (4p) | https://arxiv.org/abs/2602.08412 | `03_academic_papers/R11_pasb_2602.08412.pdf` | ✅ | 2026-04-23 | 测试库分析章节 |
| R12 | Taxonomy of Failure Mode in Agentic AI Systems (Microsoft) | PDF (Whitepaper) | https://cdn-dynmedia-1.microsoft.com/...Taxonomy-of-Failure-Mode-in-Agentic-AI-Systems-Whitepaper.pdf | `04_industry_references/R12_microsoft_taxonomy_whitepaper.pdf` | ⚪ 用户提供 | 2026-04-23 | 1,2,3,4,10 |
| R13a | 腾讯大模型与智能体安全风险治理与防护 | 内部文档 (PDF, 19p) | — | `04_industry_references/R13a_tencent_llm_agent_security.pdf` | ⚪ 用户提供 | 2026-04-23 | 2 |
| R13b | AI 智能体安全治理白皮书 | 内部文档 (PDF, 9p) | — | `04_industry_references/R13b_ai_agent_security_governance.pdf` | ⚪ 用户提供 | 2026-04-23 | 背景参考 |
| R14 | ZeroShot — Offensive Security Testing for AI Agents | 平台 (SPA) + 第三方评估 | https://0eroshot.com/ | `05_tools_and_testsuites/R14_zeroshot_benchmark.md` | 🟡 部分完成（SPA 渲染限制，正文为元数据 + Medium 评估摘要） | 2026-04-23 | 测试库分析章节 |
| R15 | 1Password SCAM | GitHub (README) | https://github.com/1Password/SCAM | `05_tools_and_testsuites/R15_1password_scam.md` | ✅ | 2026-04-23 | 测试库分析章节 |
| R16 | ClawSafety Scanner | GitHub (README + docs) | https://github.com/relaxcloud-cn/clawsafety | `05_tools_and_testsuites/R16_clawsafety_scanner.md` | ✅ | 2026-04-23 | 测试库分析章节 |
| R17 | ClawSec (Prompt Security) | GitHub (README + docs) | https://github.com/prompt-security/clawsec | `05_tools_and_testsuites/R17_clawsec_prompt_security.md` | ✅ | 2026-04-23 | 测试库分析章节 |
| R18 | Knownsec OpenClaw Security | GitHub (README + vuln DB) | https://github.com/knownsec/openclaw-security | `05_tools_and_testsuites/R18_knowsec_openclaw_security.md` | ✅ | 2026-04-23 | 测试库分析章节 |
| R19 | PinchBench | GitHub (README) | https://github.com/pinchbench/skill | `05_tools_and_testsuites/R19_pinchbench.md` | ✅ | 2026-04-23 | 测试库分析章节 |
| R20 | OpenClaw CVE Tracker | GitHub (CVE DB) | https://github.com/jgamblin/OpenClawCVEs | `05_tools_and_testsuites/R20_openclaw_cve_tracker.md` | ✅ | 2026-04-23 | 背景参考 |
| R21 | CLAW-10 Enterprise Readiness Matrix (Onyx AI) | Web 文章 (MD) | https://onyx.app/insights/openclaw-enterprise-evaluation-framework | `06_enterprise_eval/R21_claw10_onyx_framework.md` | ✅ | 2026-04-23 | 测试库分析章节 |
| R22 | CaMeL: Defeating Prompt Injections by Design | 论文(arXiv) + 开源研究工件(GitHub) | https://arxiv.org/abs/2503.18813 + https://github.com/google-research/camel-prompt-injection | `02_opensource_frameworks/R22_camel.md` | ✅ | 2026-05-05 | 6, 10, 11(v2.2 已整合) |
| R23 | AgentDojo: Dynamic Environment for LLM Agent Eval | 论文(NeurIPS 2024) + GitHub | https://arxiv.org/abs/2406.13352 + https://github.com/ethz-spylab/agentdojo | (随 R22 笔记内联描述) | ✅ | 2026-05-05 | 10, 11(v2.2 已整合,作为第 7 个评估基准) |

## 覆盖率统计

- 总条目数（R1–R21，含 R3b 子文档）: **22**
- ✅ 已完成: 17（公共下载）+ 4（用户提供：R1/R12/R13a/R13b）= **21**
- 🟡 部分完成: 1（R14 — SPA 渲染限制）
- ❌ 下载失败: **0**

按 outline 附录矩阵（第 1–12 章引用映射），每章至少有一条核心或辅助资料处于「已完成」或「用户提供」状态。

## 已知限制与后续行动

1. **R14 ZeroShot**（🟡）：`0eroshot.com` 为 SPA，纯 HTTP 抓取无法获取完整内容；当前 MD 汇总了官方站点元数据和 Nwosu Rosemary 2026-02 的 Medium 第三方评估。如需完整 payload 清单，建议：
   - 在需要引用时直接运行 ZeroShot CLI 对目标 Agent 做评估，获取官方 OWASP 合规报告
   - 或用 Chromium headless 渲染站点后再抓取
2. **R3 相关生态**：除 R3/R3b 外，outline 还提到 `AI Security Solutions Landscape for Agentic AI Q2 2026` 和 OWASP FinBot CTF 平台作为相关子资源。如章节撰写需要再补充抓取。
3. **R1 / R12 / R13a / R13b**：内部/厂商文档由用户投放完成；后续若版本升级需由用户同步更新本地副本。

## 验证命令

```bash
cd /home/kali/ppt/agent-security-frame/materials

# 覆盖率：outline 条目数 vs log 条目数
grep -cE '^### \[R[0-9]+\]' materials-outline.md          # 预期: 22（R1–R13/R13 重号 + R2 也算，需逐项核对）
grep -cE '^\| R[0-9]+' collection_log.md                  # 本日志记录数

# PDF 可读性抽样
for p in */*.pdf; do echo "$p"; python3 -c "import re;d=open('$p','rb').read();m=re.search(rb'/Title\s*\(([^)]+)\)',d);print(' ',m.group(1).decode('utf-8','replace')) if m else print(' (no title)')"; done

# MD 非空校验（>=500 字节即视为有效）
for m in */*.md; do s=$(stat -c%s "$m"); if [ "$s" -lt 500 ]; then echo "SHORT: $m ($s bytes)"; fi; done

# 章节稿交叉核验：从第 1–4 章稿中抽取 arXiv ID 和作者名，确认都在 log 中
grep -oE 'arXiv:26[0-9]{2}\.[0-9]+|2603\.[0-9]+|2604\.[0-9]+|2602\.[0-9]+' ../第*.md | sort -u
```
