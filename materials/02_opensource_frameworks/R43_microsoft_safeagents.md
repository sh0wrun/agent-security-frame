---
r_number: R43
graduated: 2026-06-05  # 直接落 materials/(用户批量执行 batch 计划)
core_decision: 不升核心(早期项目 + 度量原语简单 + 8 commits 无 release; 但生态卡位独特, 与 R5 AGT 互补)
source_repo: https://github.com/microsoft/SafeAgents
received: 2026-05-29
captured_via: WebFetch(GitHub repo README)
title: Microsoft SafeAgents(亦称 SafeAgentEval)— 多 agent 系统统一构建 + 安全评测框架
license: MIT
maintainer: Microsoft(开源, 无对应学术 paper)
stars_at_graduation: 14
forks_at_graduation: 2
commits_at_graduation: 8
releases_at_graduation: 0
status: needs_monitoring  # 早期项目, 半年后(2026-12 前)复查活跃度 / release / 度量论文
chapter_relevance: medium
priority: 工具映射候选(Ch7 §7.3 候选集合 11, 待稳定后正式入册;Ch8 §8.2 评测侧横评一行)
tags: [microsoft, safeagents, safeagenteval, multi-framework, autogen, langgraph, openai-agents, aria, dharma, agentharm, asb, eval, red-team, build-time]
---

# R43 Microsoft SafeAgents — 多 agent 系统统一构建 + 安全评测框架

## 一句话

微软 2026-05 开源(MIT)的"多 agent 系统**统一构建** + **内置安全评测**"框架, 一份 agent 代码在 **Autogen / LangGraph / OpenAI Agents** 三大基座间免重写, 集成 **ARIA**(Agent Risk Assessment)+ **DHARMA**(Domain-specific Harm Assessment)度量, 自动接入 **AgentHarm / ASB** 两大主流 agent 安全基准, **当前 14★ / 8 commits / 0 release 早期形态**, 卡位独特(build-time 抽象 + eval 度量一体)但工程成熟度尚低, ASF 引用价值在"多框架抽象 + 评测一体化"卡位, 半年后复查决定是否进 Ch7 §7.3 正式集合。

## ✅ 已核实事实

| 项 | 值 | 来源 |
|---|---|---|
| 项目名 | **SafeAgents**(亦称 **SafeAgentEval**, README 双名)| GitHub README |
| 仓库 | github.com/microsoft/SafeAgents | — |
| License | **MIT** | GitHub repo |
| Stars | 14(开源伊始)| GitHub |
| Forks | 2 | GitHub |
| Commits(主分支) | 8 | GitHub |
| Open issues | 1 | GitHub |
| Releases | **0**(无正式发布)| GitHub |
| 维护方 | Microsoft(无具名作者, 无对应 paper) | README |
| 抽象层覆盖 | **Autogen / LangGraph / OpenAI Agents** 三大 agent 框架统一 | README |
| 内置度量 | **ARIA**(Agent Risk Assessment)+ **DHARMA**(Domain-specific Harm Assessment) | README |
| 攻击检测 | 监控 tool call / bash 命令 / 日志模式;命中即**自动 ARIA=4** | README |
| 基准集成 | AgentHarm + ASB(支持 checkpointing 长跑评测)| README |
| 预置 agent | web browsing / file operations / code execution | README |
| 部署形态 | 研究偏 production-oriented;引用 AgentHarm/ASB peer-reviewed paper | README |

## ⚠ 重要缺失(决定它当前不升核心的原因)

- **无对应 paper**: ARIA / DHARMA 度量定义未公开论文, 度量科学性待证(README 仅命名)
- **早期项目**: 8 commits / 0 release / 14★, 半年内形态可能大变, 引用稳定性低
- **代码量未公开**: README 未给 LOC / 模块数量, 实际抽象层覆盖深度待跑验
- **攻击检测原语弱**: 行为日志模式监控, robustness 远低于 R6 AEGIS 的 deep string extraction + 三决策模型
- **"Production-oriented" 措辞乐观**: 实际 0 release, 该措辞属 README 营销

## 🎯 对 ASF framework 的价值(逐层评估)

| ASF 层 | 触动 | 评估 |
|---|---|---|
| **Apex P1 默认零信任** | 攻击检测层 "命中即 ARIA=4" 自动降级 | ⚠ 偏 eval 侧, 非 runtime 强制(与 R5 AGT 的 sub-ms policy engine 不同位) |
| **Apex P4 可验证** | ARIA + DHARMA 是 P4 度量的最朴素实现路径 | ✓ Ch7 §7.5 验证接口规范的轻量参考点之一 |
| **Core 12 cells** | 攻击检测覆盖 in/C, in/I 局部;AgentHarm 覆盖 post/C;cross 全空 | ⚠ 局部覆盖, 无 cross 维度 |
| **Overlay 12 攻击面 S1-S12** | 偏行为层度量, S1-S12 未直接映射 | ✗ 无新攻击面 |
| **Derived 8 测试库** | AgentHarm + ASB 已是行业主流, SafeAgents 提供统一接入层 | ✓ Ch7 §7.3 候选集合 11(接入层价值, 非数据集本身) |

## 📐 与既有 R 编号的关系

- **与 R5 Microsoft AGT**: **互补不重复, 错位明显**——
  - AGT 是 **runtime governance + policy engine**(<0.1ms p99, 七 packages 治理生态, OWASP ASI 10/10 覆盖)
  - SafeAgents 是 **build-time 抽象 + eval 度量**(轻量, 偏研究, 三框架统一)
  - 同厂商但**定位错开**: AGT 关心"运行时怎么管", SafeAgents 关心"开发时怎么写 + 评测时怎么测"
- **与 R23 AgentDojo**: 不同方法论——
  - AgentDojo 走 **形式化沙盒 + 可证明安全任务完成率**(77% 可证明, AgentDojo 是 NeurIPS 2024 benchmark)
  - SafeAgents 走 **多框架抽象 + 度量 + 攻击检测**
  - 引用矩阵 Ch7 §7.3 可并列, 但 AgentDojo 更成熟(已 graduated R23)
- **与 R37 promptfoo**: 同评测侧, **分工不同**——
  - promptfoo: 红队插件生态广(157 plugins), CI/CD 友好, 7 大合规框架 ID 体系
  - SafeAgents: 多框架抽象(同 agent 代码跨基座), 轻评测度量, 早期形态
  - **promptfoo 重攻击多样性 + 合规可执行, SafeAgents 重多框架接入 + 度量一体**
  - 引用矩阵 Ch8 §8.2 并列(评测侧两行)
- **与 R10 ClawSafety / R11 PASB**: 同属"研究基准"赛道, SafeAgents 更新 + 微软背书, 但 0 release;PASB 已有完整 paper, ClawSafety 已有 120 用例;**短期 SafeAgents 不替代二者**
- **与 R6 AEGIS / R22 CaMeL**: 防御层 vs 评测层, **正交**

## ⚠️ 限制 / 风险 / disclaim

- 早期项目: 14★ / 8 commits / 0 release, 半年后形态可能大变, 引用时必须标"截至 2026-06 状态"
- ARIA / DHARMA 度量公式 / 阈值未公开, 度量科学性待 paper 发布证明
- Attack detection 偏行为日志模式, 易被针对性混淆绕过(对比 R6 AEGIS 的字符串递归提取 robustness 弱)
- "Production-oriented" 是 README 用词, 写书时建议改"研究偏 production-oriented 但尚未发布"
- OpenAI Agents SDK 抽象层在 Anthropic Claude Agent SDK / Google ADK 上是否能扩展待验

## 📐 ASF 章节落地映射

- **Ch7 §7.3 测试库**: **候选集合 11**(待半年后稳定再正式入册), 当前作"接入层"提及, 不列为独立集合
- **Ch7 §7.5 验证接口规范**: ARIA + DHARMA 度量作"研究侧轻量度量"参考(与 R23 形式化指标对比)
- **Ch8 §8.2 主流方案防护形状对比**: **评测侧一行**, 与 R23 / R37 并列, 标"build-time + multi-framework 抽象"差异
- **Ch8 §8.5 选型决策树**: 不进默认推荐(早期), 但"需要跨 Autogen / LangGraph / OpenAI 三基座做统一 agent 代码"的场景下可推
- **附录 A §A.3 工具映射**: 与 R5 Microsoft AGT 并列, 显式标"R5 = runtime governance, R43 = build-time + eval"互补关系, 避免读者误以为 R5/R43 重复
- **不进 Ch6 防御实施**: 它不防御, 只评测

## TODO

- [ ] 半年后(2026-12 前)复查仓库活跃度 / release / 度量论文 / ★ 增长
- [ ] 跑一次 SafeAgents 对相同 agent(跟 R23 AgentDojo / R37 promptfoo 三方比较输出差异 / 误报率 / 集成成本)
- [ ] ARIA / DHARMA 度量定义具体公式 / 阈值 / 与 R10 ClawSafety 120 用例的 overlap 待披露
- [ ] OpenAI Agents SDK 抽象层能否扩展到 Anthropic Claude Agent SDK / Google ADK / Microsoft Agent Framework(R5 AGT 已覆盖的)
- [ ] 评估: 半年后若稳定, 是否升至 Ch7 §7.3 集合 11 正式入册;同步评估 R10/R11 在引用矩阵中是否让位
- [ ] AgentHarm / ASB 在 SafeAgents 接入下的实际可用 cell 覆盖清单(尤其 cross 维度)
