---
r_number: R37
graduated: 2026-06-05  # inbox → materials/05_tools_and_testsuites/(用户批量执行 batch 计划)
core_decision: 候选升核心(强烈推荐)  # 工具系统覆盖密度 + OpenAI 系第一家工具 + 内置 7 大合规框架映射;待用户拍板, 拍板后补 §C.2 v3.1 追加台账
source_repo: https://github.com/promptfoo/promptfoo
source_red_team_docs: https://www.promptfoo.dev/docs/red-team/
source_plugins_docs: https://www.promptfoo.dev/docs/red-team/plugins/
source_agent_red_team_docs: https://www.promptfoo.dev/docs/red-team/agents/
received: 2026-05-28
graduated_from_inbox: 2026-05-28-promptfoo-red-teaming.md (本次合并 + 增补 docs 研究后毕业)
captured_via: WebFetch(GitHub README + 红队/插件/agent 三份官方文档)
title: promptfoo — LLM 评测 + agent red-teaming 开源平台(OpenAI 旗下)
license: MIT
maintainer: promptfoo(2026 起为 OpenAI 旗下项目, 开源不变)
stars_at_graduation: ~21,700
plugins_at_graduation: 157(分 6 大类)
latest_release_at_capture: 2026-05-21 (code-scan-action 0.1.6)
distribution: npm / brew / pip;Node.js ≥ 20.20.0 或 ≥ 22.22.0
status: needs_verification  # YAML schema 全文 + 附录 B.3 四接口对照 + agentic:memory-poisoning 载荷细节 待二次核实
chapter_relevance: high
priority: 引用源(候选升核心, 与 R23 AgentDojo 互补)
tags: [promptfoo, openai, red-teaming, agent-security, MCP, memory-poisoning, excessive-agency, BOLA, BFLA, crescendo, rag-poisoning, opentelemetry, owasp-llm, mitre-atlas, nist-ai-rmf, eu-ai-act, testsuite]
---

# R37 promptfoo — LLM 评测 + agent red-teaming 开源平台

## 一句话

OpenAI 旗下的开源(MIT)LLM 评测与 agent 红队平台, **157 插件 × 6 大类**覆盖几乎所有 ASF v3 framework 关键威胁条目(memory poisoning / MCP / excessive agency / RAG poisoning / Crescendo / BOLA-BFLA / 轨迹断言), 内置 **7 大合规框架插件 ID 体系**(OWASP LLM/API Top 10 / MITRE ATLAS / NIST AI RMF / ISO/IEC 42001 / EU AI Act / GDPR), ~21.7k stars, README 声明 10M+ 生产用户, 2026-05-21 最近发布——是 Ch7 §7.3 测试库章节集合 9 的强候选, Ch8 §8.2 防护形状对比表"评测侧"一栏的代表方案, 也是 ASF 整个材料库里**第一个 OpenAI 系工具**(战略卡位)。

## ✅ 已核实事实

| 项 | 值 | 来源 |
|---|---|---|
| 项目定位 | LLM 评测 + agent red-teaming 平台 | GitHub README |
| License | **MIT** | GitHub repo |
| Stars | ~21,700 | GitHub README |
| 厂商 | **2026 起为 OpenAI 旗下**, 开源不变 | GitHub README |
| 最近发布 | 2026-05-21 (`code-scan-action: 0.1.6`) | GitHub Releases |
| Commits | 主分支 8,734 commits(主语言 TypeScript 96.9%)| GitHub |
| Releases | 410 | GitHub |
| 分发渠道 | npm / brew / pip 三栈 | GitHub README |
| 本地优先 | "prompts never leave machine" | GitHub README(隐私优势 vs 远程评测) |
| 用户规模声明 | 10M+ 生产用户(README 营销数字) | GitHub README |
| 插件总数 | **157**(6 大类) | docs/red-team/plugins/ |
| 内置基准 | AgentHarm / HarmBench / Aegis / BeaverTails / Pliny / XSTest / DoNotAnswer / CyberSecEval / ToxicChat / UnsafeBench / VLGuard / VLSU (11 个 Dataset-Based 插件) | docs/red-team/plugins/ |

## 🎯 157 插件 × 6 大类全景

| 大类 | 数量 | 代表插件 | ASF 主战场 |
|---|---|---|---|
| **Security & Access Control** | 54 | Coding Agent 全套(Repo Prompt Injection / Sandbox R/W Escape / Network Egress Bypass / Secret Env Read / Verifier Sabotage / Steganographic Exfiltration)、Memory Poisoning、Indirect/Direct Prompt Injection、ASCII Smuggling、CCA、Special Token Injection、System Prompt Override、Tool Discovery、BOLA/BFLA/RBAC、SSRF、SQL/Shell Injection、**Model Context Protocol (MCP)**、RAG Poisoning、Reasoning DoS | Ch4 §4.3 攻击面 / Ch5 攻击场景 / Ch6 §6.2 in/I / **§4.8 MCP 节直接对位** |
| **Compliance & Legal** | 58 | OWASP LLM/API、NIST AI RMF、ISO 42001、EU AI Act、GDPR、HIPAA、SOC2、FERPA、COPPA、PCI DSS、FINRA、Fair Housing Act、FDA Cyber、Japan FIEA、TCPA | **Ch9 §9.3 合规适配主线** |
| **Trust & Safety** | 49 | 4 类偏见(年龄/残疾/性别/种族)、有害内容(7 类)、6 项医学安全、6 项青少年安全、3 项电商欺诈 | Ch10 真实案例的 trust/safety 维度 |
| **Brand & Reputation** | 14 | Hallucination、Excessive Agency、Goal Misalignment、Misinformation、Off-Topic Manipulation、Imitation、Overreliance | Ch6 in/I 行为漂移 / Apex P1 立论 1.3 Least Agency |
| **Dataset-Based** | 11 | AgentHarm、BeaverTails、CyberSecEval、DoNotAnswer、HarmBench、Pliny、ToxicChat、UnsafeBench、VLGuard、VLSU、XSTest | Ch7 §7.3 标准化测试库 |
| **Custom** | 2 | Custom Policy(YAML/JSON 业务规则)、Custom Prompts(Intent plugin)| 附录 B.2 测试用例 Schema 的工程接入点 |

## 🏷️ 内置 7 大框架映射(promptfoo 差异化卖点)

插件 ID 直接携带框架坐标——一行 YAML 即可触发某框架某条目的测试集:

| 框架 | 插件 ID 格式 | 对 ASF 章节价值 |
|---|---|---|
| OWASP LLM Top 10 | `owasp:llm:01` | Ch3 §3.2.1 共识源 + 附录 A 映射表 |
| OWASP API Security Top 10 | `owasp:api:01` | Ch8 §8.4 API 集成路径 |
| **MITRE ATLAS** | `mitre:atlas:reconnaissance` | **Ch4 §4.7.1 既有映射的可执行参考实现** |
| NIST AI RMF | `nist:ai:measure:1.1` | Ch9 §9.3 / 附录 C R4 NIST AI 800-4 配套 |
| ISO/IEC 42001 | `iso:42001:privacy` | Ch9 §9.3 |
| **EU AI Act** | `eu:ai-act:art5` | **Ch9 §9.3 直接对位条款级测试** |
| GDPR | `gdpr:art5` | Ch9 §9.3 |

> 这张 ID 体系是 promptfoo **vs 其他测试集合(R10/R11/R14)的决定性差异**:既有合规映射多停在文档级"该测什么", promptfoo 把映射变成"`-p owasp:llm:01` 一行可跑的测试集合"。

## 🎯 Agent red-teaming 插件覆盖(对 ASF 核心价值)

| 插件 / 策略 | 覆盖威胁 | 对应 ASF |
|---|---|---|
| `agentic:memory-poisoning` | 有状态代理内存中毒 | **post/K 矩阵核心格** + R12 Memory Poisoning + Ch10 §10.1 邮件助手案例 |
| `mcp` | MCP 安全测试 | **§4.8 MCP 节 + S5/S10 攻击面 + 2026-Q2 事件簇** |
| `excessive-agency` | 代理超出预期范围的行为 | **Apex P1 立论 1.3 Least Agency + OWASP ASI03** |
| `tool-discovery` | 未授权用户的工具枚举泄露 | pre/C / cross/C |
| `rag-poisoning` | RAG 知识库中毒 | in/K / post/K |
| `rag-document-exfiltration` | RAG 文档外泄 | post/K + S3 上下文窗口 |
| `crescendo` strategy | 多轮渐进式攻击 | **Ch10 §10.3 既有 Crescendo 案例的现成 payload 源** |
| `BOLA` / `BFLA` | 对象级/功能级授权破坏 | **R30 Authorization Propagation 同方向(cross/I)** + Apex P1 |
| `trajectory:tool-used` / `trajectory:tool-args-match` | 工具调用轨迹断言 | **附录 B.2 测试用例 Schema 的可观测断言层** |
| 分层测试 + OpenTelemetry | 黑盒 / 组件级 / 追踪级 | **附录 B.3 四接口的潜在参考实现** |

> 这张表是判断 promptfoo "升核心材料层"的主要证据:它命中 framework 的密度比现有任一测试集合(R10/R11/R14/R23)都高。

## 📐 与既有 R 编号的关系

- **不取代 R23 AgentDojo**: AgentDojo 走形式化沙盒(可证明安全任务完成率), promptfoo 走覆盖广度 + 工程化集成 → **互补**(Ch7 §7.3 集合 9 + 集合 7 并列)
- **可能边缘化 R14 ZeroShot**: ZeroShot 145 载荷 + SaaS(已标 🟡 SPA 渲染受限), promptfoo 开源 + 主动维护 + 覆盖远广 → 引用矩阵里 R14 让位
- **挤压 R10 ClawSafety / R11 PASB**: 两者偏研究基准, promptfoo 工业化程度高得多 → Ch7 §7.3 测试库章节需要"分代"(R10/R11 标"研究代", promptfoo 标"工程代")
- **与 R6 AEGIS / R5 AGT**: 不同层——AEGIS/AGT 是**事中防御实施**, promptfoo 是**验证侧** → 互不替代但在附录 A §A.3 工具映射中并列
- **与 R43 Microsoft SafeAgents**: SafeAgents 偏 build-time 多框架抽象 + 简单 ARIA/DHARMA 度量, promptfoo 偏 eval/red-team 插件生态 + CI/CD → **互补不替代**(同评测侧, 但分工不同, 详见 Ch8 §8.2 草稿)
- **与 R22 CaMeL**: CaMeL 是 by-design 防御(协议层 capability 解释器), promptfoo 是验证侧 → 正交

## ⚠️ 还需核实的关键细节

1. **测试用例 YAML schema 与附录 B.2 的兼容性** —— promptfoo 是 YAML config 驱动, 但首页文档没贴 schema 全文。需拉 `promptfoo.config.yaml` schema 全文, 判断它能否作为附录 B.2 ASF YAML Schema 的"参考实现"或需要双向适配。
2. **是否实现附录 B.3 的 4 标准接口语义** —— 评估请求 / 状态查询 / 审计读取 / 异常上报。promptfoo 的 OpenTelemetry 集成可能覆盖部分, 但完整对照需拉 spec 细看。
3. **`agentic:memory-poisoning` 攻击载荷质量** —— 该插件是否真能跨会话验证记忆持久化, 还是只在单会话内"模拟投毒", 决定它能否成 §4.8 / §6.4 N7 recovery 的可执行断言。
4. **🌐 远程推理依赖** —— 部分插件标 🌐, 在 Community edition 走 promptfoo 远程推理, Enterprise 版才本地化; air-gapped 部署场景下哪些插件可用待清单化。
5. **OpenAI 收购后 OSS 治理** —— 长期路线 / 中立性 / 是否会出现"仅 Enterprise 可用"的关键插件 → 写白皮书时该 disclaim。

## 📐 ASF 章节落地映射

- **Ch7 §7.3 测试库**: 集合 9(promptfoo agent red-team 插件集), 与 R10/R11/R14/R23 + PinchBench 并列
- **Ch7 §7.5 验证系统接口规范**: YAML schema 与 OpenTelemetry 接入待对照附录 B.3 四接口
- **Ch8 §8.2 主流方案防护形状对比**: "评测侧"代表方案, 与 R23 AgentDojo / R43 SafeAgents 并列
- **Ch8 §8.5 选型决策树**: 按合规要求场景的默认推荐(7 大框架内置映射)
- **Ch9 §9.3 合规适配**: EU AI Act / NIST / ISO 42001 三大框架的可执行测试通道
- **§4.8 MCP 节(草稿中)**: `mcp` plugin 是 §4.8.3 OX 四漏洞家族的可执行验证
- **附录 A §A.3 工具映射**: 与 R5/R6/R22/R23/R43 并列, 标"评测侧 / 红队驱动"
- **附录 B.2 测试用例 Schema 参考实现**: 待 YAML schema 核实
- **附录 B.3 四接口语义**: 待 OpenTelemetry 对照核实

## 战略意义(超出工具层)

ASF 材料库截至 R36 的厂商分布: Microsoft(R5/R12/R29)、Cisco(R4/R27)、Google DeepMind(R22)、Anthropic 协议层(MCP 提及)、奇安信/腾讯/慢雾/知道创宇(国内厂商)、各高校(R7/R8/R30 等)。**OpenAI 系工具一直是空白**。

promptfoo 入库 = 补 OpenAI 视角, 且它选择 **agent red-teaming 而非防御侧** 这个定位本身就有解读价值——上游模型厂商对"如何评测自己生态里的 agent 安全"的工程立场。R38 Anthropic Zero Trust(立场文)+ R37 promptfoo(工具)+ R5 Microsoft AGT(治理工具包)三家齐, 构成 ASF "三大模型厂商对 agent 安全立场" 的可对比锚点(Ch1 §1.4)。

## TODO

- [ ] 拉 `promptfoo.config.yaml` 完整 schema, 对照附录 B.2 测试用例 Schema 字段一致性
- [ ] 看 promptfoo 是否实现附录 B.3 的 4 接口语义(评估请求 / 状态查询 / 审计读取 / 异常上报)
- [ ] 验证 `agentic:memory-poisoning` 插件载荷是否跨会话(决定 §4.8 / §6.4 N7 可执行断言可行性)
- [ ] 列出 promptfoo agent 插件全集(本文从 docs 列出 54 + 11 dataset 已完整, 仅缺 agentic 子族特定子项)
- [ ] 看 OpenAI 收购 / 接管 promptfoo 的具体公告, 确认开源许可证未变更, 监控半年后是否出现 Enterprise-only 插件
- [ ] 跑一次 promptfoo 对一个示例 agent(如 LangChain 简单 demo)的红队评估, 记录运行时间 / 报告格式 / 集成成本
- [ ] 决定: R14 ZeroShot 在引用矩阵里是否让位 / 共存 / 仍并列
- [ ] 决定升核心 → 拍板后补附录 C §C.2 v3.1 追加台账 + Ch7 §7.3 集合 9 正式入册
- [ ] 列 🌐 远程推理插件清单(air-gapped 部署场景适用性)
