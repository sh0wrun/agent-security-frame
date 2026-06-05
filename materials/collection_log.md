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
| R1 | 奇安信龙虾（OpenClaw）安全使用指南 | 内部文档 (PDF, 53p) | — | `07_legacy/R1_qianxin_openclaw_guide.pdf` | ⏸ **retired 2026-06-05**(OpenClaw 产品向 → 转国际/权威定位;内容去 R1 化为本书综合,通则由 R38/R45 承载;砍国内等保角度) | 2026-04-23 | ~~1-7,12~~ 已去引用 |
| R2 | SlowMist OpenClaw Security Practice Guide | GitHub (README + docs) | https://github.com/slowmist/openclaw-security-practice-guide | `07_legacy/R2_slowmist_practice_guide.md` | ⏸ **retired 2026-06-05**(OpenClaw 产品向 → 低摩擦/夜间审计去 R2 化为本书综合,R38 dwell-time 佐证) | 2026-04-23 | ~~4,7,10,12~~ 已去引用 |
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
| R13a | 腾讯大模型与智能体安全风险治理与防护 | 内部文档 (PDF, 19p) | — | `07_legacy/R13a_tencent_llm_agent_security.pdf` | ⏸ **retired 2026-06-05**(产品向中文文档 → 七层模型改以 R7 为骨架;MCP 投毒案例改引 R44/R38) | 2026-04-23 | ~~2,4~~ 已去引用 |
| R13b | AI 智能体安全治理白皮书 | 内部文档 (PDF, 9p) | — | `07_legacy/R13b_ai_agent_security_governance.pdf` | ⏸ **retired 2026-06-05**(背景参考 → 工具链/记忆钓鱼案例改引 R44/R38/R11) | 2026-04-23 | ~~背景参考~~ 已去引用 |
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
| R24 | AARM v1: Autonomous Action Runtime Management Specification | 开放规范 (CSA WG) | https://aarm.dev + https://github.com/aarm-dev/docs | (无本地文件) | ⏸ **retired 2026-06-05**(仅 URL/已识别,无本地副本,3+ 周未整合;如需可重新抓取毕业) | 2026-05-07 | ~~下版集成~~ 已退役 |
| R25 | DecodingTrust-Agent Platform (DTap) | arXiv 论文(平台 + 数据集 + 自主红队 agent,279p / 148 figs) | https://arxiv.org/abs/2605.04808 + https://decodingtrust-agent.com | `03_academic_papers/R25_dtap.md` + `R25_dtap_2605.04808.pdf` | ✅ **主对接点已织入**(2026-06-05);Apache-2.0 | 2026-05-10 | **Ch7 §7.3.1 红队平台对比 + §7.4 DTap-Red 自主红队**;次要锚点(Ch5 §5.1 五向量 / Ch8 §8.6 cross/K / Ch9 backbone 选型)待后续 |
| R26 | SoK: Robustness in LLMs against Jailbreak Attacks(提出 Security Cube 多维评测) | arXiv 论文(SoK;含 artifact:Available/Functional/Reproduced) | https://arxiv.org/abs/2605.05058 | `03_academic_papers/R26_sjtu_sok_jailbreak_robustness.pdf` | ✅ **已织入**(2026-06-05);artifact-evaluated | 2026-05-24 | **Ch7 §7.2 Security Cube 多维评测(批判单一 ASR)** |
| R27 | Cisco Foundry Security Spec(8 agent 角色 + 11 条铁律) | 开放规范 (Cisco DevNet, MIT, Seed v0.1.0) | https://github.com/CiscoDevNet/foundry-security-spec | `02_opensource_frameworks/R27_cisco_foundry_security_spec.md` | ✅ **已织入**(2026-06-05);Cisco/MIT | 2026-05-22 | **Ch6 §6.2.5 铁律#9 Sandbox-by-Infra + 8 角色防御模板** |
| R28 | ARGUS: Defending LLM Agents Against Context-Aware Prompt Injection(IPG 影响溯源 + AgentLure 基准) | arXiv 论文(NJU + SMU,2026-05) | https://arxiv.org/abs/2605.03378 | `03_academic_papers/R28_argus_2605.03378.pdf` | ✅ **已织入**(2026-06-05);NJU+SMU | 2026-05-18 | **Ch6 §6.2.4 ARGUS 溯源审计 + Ch7 §7.3 AgentLure 基准** |
| R29 | Security Risks in Tool-Enabled AI Agents(特权执行环境系统化分析) | arXiv 论文(Microsoft,2026-05,COMPSAC ext.) | https://arxiv.org/abs/2605.09721 | `03_academic_papers/R29_tool_enabled_risks_2605.09721.pdf` | ✅ **已织入**(2026-06-05);Microsoft/IEEE COMPSAC | 2026-05-18 | **Ch4 §4.4.3 环境授权 + 权限放大 + capability-intent mismatch** |
| R30 | Authorization Propagation in Multi-Agent AI Systems(7 项身份治理结构需求 + SIF 攻击) | arXiv 论文(Kamiwaza AI,2026-05) | https://arxiv.org/abs/2605.05440 | `03_academic_papers/R30_authz_propagation_2605.05440.pdf` | ⚪ PDF 入库;**强烈推荐升核心材料层**,笔记待补 | 2026-05-18 | **Ch6 §6.4 跨智能体层(核心)**(_ANALYSIS P3) |
| R31 | Toward Securing AI Agents Like Operating Systems(OS-Agent 类比 + 16 攻击 × 4 agent) | arXiv 论文(BIFOLD TU Berlin + MPI,2026-05) | https://arxiv.org/abs/2605.14932 | `03_academic_papers/R31_agents_like_os_2605.14932.pdf` | ⚪ PDF 入库;研究笔记待补 | 2026-05-18 | Ch3 §3.1 framework 隐喻 / Ch4 §4.1 / Ch6 §6.5(_ANALYSIS P4) |
| R32 | When Agents Handle Secrets: Survey of Confidential Computing for Agentic AI(8 TEE 平台对标) | arXiv 论文(Imperial College London,2026-05) | https://arxiv.org/abs/2605.03213 | `03_academic_papers/R32_confidential_computing_2605.03213.pdf` | ⚪ PDF 入库;**触发 ASF §6.1.x 硬件可信根补强**,笔记待补 | 2026-05-18 | Ch6 §6.1 新子节(硬件根信任) / Ch9 §9.2(_ANALYSIS P5) |
| R33 | Agentic AI and the Industrialization of Cyber Offense(AACM 攻击压缩 + 2026-2028 预测) | arXiv 论文(独立研究者 Christopher Koch,2026-05) | https://arxiv.org/abs/2605.06713 | `03_academic_papers/R33_industrialization_offense_2605.06713.pdf` | ⚪ PDF 入库;研究笔记待补 | 2026-05-18 | Ch1 §1.2 攻击速度论证 / Ch5 §5.3 / Ch9 §9.5(_ANALYSIS P6) |
| R34 | The Attack and Defense Landscape of Agentic AI: Comprehensive Survey(128 篇 + 51 防御) | arXiv 论文(UC Berkeley + UIUC,2026-03) | https://arxiv.org/abs/2603.11088 | `03_academic_papers/R34_attack_defense_landscape_2603.11088.pdf` | ⚪ PDF 入库;研究笔记待补 | 2026-05-18 | Ch2 综述(**安全 OF agents**:攻防全景 + 防御机制 + 设计空间)/ Ch5 / Ch1 §1.4 |
| R35 | SOK: Taxonomy of Attack Vectors and Defense Strategies for Agentic Supply Chain Runtime(Viral Agent Loop + Zero-Trust Runtime) | arXiv 论文(独立研究者,ICLR 2026 Workshop) | https://arxiv.org/abs/2602.19555 | `03_academic_papers/R35_supply_chain_sok_2602.19555.pdf` | ⚪ PDF 入库;**强烈推荐升核心材料层**,笔记待补 | 2026-05-18 | **Ch6 §6.1 事前准入(核心)**/ Ch5 §5.2 / §3.5.1 build-vs-runtime 方法论说明(**已决:不增设 S13**,Viral Agent Loop 作 runtime 涌现补充)(_ANALYSIS P8) |
| R36 | A Survey of Agentic AI and Cybersecurity(4 域应用 + 15 系统性风险) | arXiv 论文(Tennessee Tech + Purdue,2026-01) | https://arxiv.org/abs/2601.05293 | `03_academic_papers/R36_agentic_cyber_survey_2601.05293.pdf` | ⚪ PDF 入库;研究笔记待补 | 2026-05-18 | Ch2 综述(**agentic AI 用于网络安全 / dual-use** + 系统性风险/治理;与 R34 差异化非冗余)/ Ch9 §9.2 行业适配 |
| R37 | promptfoo — LLM 评测 + agent red-teaming 开源平台(OpenAI 旗下,157 plugins × 6 类 + 7 大合规框架内置 ID 体系) | 开源平台(MIT;GitHub README + 红队/插件/agent 三份官方文档) | https://github.com/promptfoo/promptfoo + https://www.promptfoo.dev/docs/red-team/ | `05_tools_and_testsuites/R37_promptfoo.md` | ✅ 笔记入库(合并 inbox + docs 研究);**候选升核心(强烈推荐)**, YAML schema + 4 接口对照待二次核实 | 2026-06-05 | Ch7 §7.3 集合 9(主)/ Ch7 §7.5 接口规范 / Ch8 §8.2 评测形状 / Ch8 §8.5.3 合规决策树 / Ch9 §9.3 / §4.8 MCP 验证 / 附录 A §A.3 / 附录 B.2 B.3 |
| R38 | Zero Trust for AI Agents(Anthropic 立场文 + 36pp eBook;4 子要素 + 三层成熟度 + 八阶段 + Agentic SOAR + impossible-vs-tedious) | 厂商框架(Anthropic,2026-05;position paper + 36pp eBook) | https://claude.com/blog/zero-trust-for-ai-agents | `04_industry_references/R38_anthropic_zero_trust_for_agents.md` + `R38_anthropic_zero_trust_ebook.pdf` | ✅ 立场文分析 + eBook 36pp 全文已核实(2026-06-05);**不升核心(厂商框架)**——贡献 impossible-vs-tedious + 成熟度三层 + 对 R30/R32/R35 独立收敛验证 | 2026-05-29 | Ch3 §3.2.1(P1 厂商收敛,与 R45 并)/ Ch1 §1.4 / Ch9 §9.3 |
| R43 | Microsoft SafeAgents(亦称 SafeAgentEval)— 多 agent 系统统一构建 + 安全评测框架(Autogen / LangGraph / OpenAI Agents 三框架抽象 + ARIA / DHARMA 度量 + AgentHarm/ASB 接入) | 开源框架(MIT;GitHub README;无对应 paper) | https://github.com/microsoft/SafeAgents | `02_opensource_frameworks/R43_microsoft_safeagents.md` | ✅ 笔记入库;**不升核心**(早期项目, 14★ / 8 commits / 0 release, 半年观察期);ARIA/DHARMA 公式 + 度量 paper 待发布 | 2026-06-05 | Ch7 §7.3 候选集合 10(待 2026-12 复查)/ Ch8 §8.2 评测形状 / 附录 A §A.3(与 R5 互补)|
| R44 | Exploring the Emerging Threats of the Agent Skill Ecosystem(扫 3,984 skill / 76 恶意 / 13.4% 含 critical / 8 仍可装;8-9 类 skill 威胁分类 + 真实检出率表 + IOC) | arXiv 技术报告(Snyk;Beurer-Kellner 等,2026-02) | https://arxiv.org/abs/2605.28588 | `03_academic_papers/R44_snyk_skill_ecosystem_2605.28588.pdf` | ✅ PDF 入库;**实证证据(辅助),不升核心**;研究笔记待补 | 2026-06-05 | Ch6 §6.1.2 Skill 扫描(实证锚)/ §6.1.6 运行时供应链 / S2 技能分发 / pre/C |
| R45 | Beyond Zero: Enterprise Security for the AI Era(BeyondCorp 延伸;信任边界收缩到 per-action,静态+动态融合授权;4 架构组件 World Model/Event Intake/Reasoning Engine/Challenge) | arXiv 愿景论文(Google/Alphabet Security,Valente & Zalewski;ACM Queue,2026-05) | https://arxiv.org/abs/2605.22985 | `04_industry_references/R45_google_beyond_zero_2605.22985.pdf` | ✅ PDF 入库;**不升核心(厂商零信任愿景)**——与 R38 合并入"厂商零信任收敛"佐证 P1/R30,不单独章节收割;研究笔记待补 | 2026-06-05 | Ch3 §3.2.1(P1 厂商收敛,与 R38 并)/ 立论 1.5 每边界评估呼应 R30 |
> **编号说明**:R37 由 Anthropic Zero Trust(R38)在 2026-05-29 入库时预留给 promptfoo, 现已于 2026-06-05 由 promptfoo 占用毕业。R39–R42 由 v3.1 Ch4 §4.8 MCP 节素材包草稿(commit `d80861e`)预留给 inbox 5 件 MCP 簇资料(OX advisory / HackerNews / Akamai / Adversa), 4 项 graduation 决策待 §4.8 草稿 review 后确认。SafeAgents 因 R39-R42 已预留, 取 R43。R44(Snyk skill 生态实证)/ R45(Google Beyond Zero 愿景)于 2026-06-05 毕业,取 R43 之后下两个未占用号。

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
3. **R12**（活跃）/ ~~R1 / R13a / R13b~~（2026-06-05 已退役入 `07_legacy/`）：内部/厂商文档由用户投放；R12 后续若版本升级需由用户同步更新本地副本。

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
