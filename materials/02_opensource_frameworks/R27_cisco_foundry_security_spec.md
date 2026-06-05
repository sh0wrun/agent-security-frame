---
source: https://github.com/CiscoDevNet/foundry-security-spec
spec_files:
  - https://github.com/CiscoDevNet/foundry-security-spec/blob/main/constitution.md
  - https://github.com/CiscoDevNet/foundry-security-spec/blob/main/spec.md
  - https://github.com/CiscoDevNet/foundry-security-spec/blob/main/AGENTS.md
chinese_writeup:
  publisher: 昆仑AI安全实验室（微信公众号）
  author: 逍遥
  title: "别迷信模型了：Cisco开源Foundry Security Spec，用8个Agent角色+11条铁律告诉你——AI安全测试的核心不是模型，是模型周围的验证闭环"
  date: 2026-05-18
received: 2026-05-22
title: Cisco Foundry Security Spec — Open specification for agentic AI security evaluation
publisher: Cisco DevNet
license: MIT
status: Seed v0.1.0
repo_stars_at_capture: 45
tags: [agent-security, agentic-AI, security-evaluation, validation-loop, Cisco, Foundry, 8-roles, 11-principles, sandbox, evidence-based]
priority: 引用源  # 写书时必引
chapter_relevance: high
---

# Cisco Foundry Security Spec

## 一句话

Cisco 把内部做 agentic AI 安全测评的经验抽出来开源成**基础设施中性、模型中性**的规范——8 个 agent 角色 + 11 条工程化"铁律"，把"AI 安全测试"从"测模型"转成"测模型周围的验证闭环"。

## 核实结果

| 项 | 值 |
|---|---|
| 仓库 | `CiscoDevNet/foundry-security-spec` ✅ 真 |
| 许可证 | **MIT** ✅ 可商业引用 |
| 状态 | Seed v0.1.0（刚开源，2026 年 5 月）|
| 关键文件 | `constitution.md`（11 条原则）+ `spec.md`（8 角色 + 130+ FR 编号需求）+ `AGENTS.md`（标准 AGENTS.md 格式）|
| 中文导读出处 | 微信公众号「昆仑AI安全实验室」逍遥 2026-05-18 |

## 8 个核心 Agent 角色（来自 spec.md）

| 角色 | 一句话职责 | 关键约束 |
|---|---|---|
| **Orchestrator** | 调度、生命周期、回答 operator 查询；系统唯一对外接口 | FR-019：lifecycle 与 conversational queries 必须双 lane，不互相阻塞 |
| **Indexer** | 解析代码，构建结构索引（符号、调用图、cross-ref） | FR-020：每种语言必须用**确定性 parser**；FR-003：所有下游 agent 都等它先跑完 |
| **Cartographer** | 画安全地图：攻击面、信任边界、威胁模型、数据流 | FR-036/036a：地图不完整时下游必须**优雅降级**，且有 fallback 机制 |
| **Detector** | 出候选发现（基于规则/依赖/秘密/探索）+ 记录规则缺口 | 强制 breadth-first；FR-045：写入前必须按 fingerprint 去重 |
| **Triager** | 调查每个候选，给**带证据的判决** | §7.3 evidence gate：必须引用 reachability、boundary、impact；FR-088：所有位置必须能 resolve |
| **Validator** | **独立**复现可利用性 | "clean room"——全新 agent，无共享 state；FR-061：`exploited` 标志仅在直接观察到时才打 |
| **Coverage-Guide** | 把目标转 checklist，指导往哪挖，决定何时完成 | FR-068：不准发明目标；FR-072：不能关闭自己排队的任务 |
| **Reporter** | 输出人类可读报告（issue tracker issues + evaluation rollup） | 极简固定标签；不暴露系统内部细节；代码用 permalinks（FR-084）|

**架构亮点**：
- **Indexer 是 gate**——下游 agent 必须等它跑完，强制数据基础先稳
- **Validator 是 clean room**——专门切开，避免"自己的报告自己验证"的污染
- **Coverage-Guide 与 Detector 解耦**——前者管"该看哪儿"、后者管"看到了什么"，避免单一 agent 既当裁判又当运动员

## 11 条铁律（constitution.md 全文）

| # | 英文原则 | 中文含义 | 工程意义 |
|---|---|---|---|
| 1 | **Evidence Over Assertion** | 证据高于断言 | 发现必须有结构化证据 + 已校验的代码引用，**模型 confidence 不算证据** |
| 2 | **Surface Only What Survives** | 只暴露经过考验的 | 只有通过 triage 的 finding 才给 operator，未验证的留内部 |
| 3 | **Liveness By Heartbeat, Never By Clock** | 用心跳判活，不看墙钟 | Agent 健康由 heartbeat 新鲜度判断，不用 wall-clock 超时 |
| 4 | **Claims Are Atomic And Mortal** | 占用是原子且可朽的 | 并发 claim 互斥；agent 挂了 claim 自动释放，无需人工干预 |
| 5 | **The Provider Is The Rate Arbiter** | 上游服务商决定速率 | 用 backpressure 适配 LLM 限流，不内部硬编码 cap |
| 6 | **Coverage Before Yield** | 覆盖优先于产出 | 自动停止 = 低产出 **且** coverage 完成，不能只看产出降 |
| 7 | **Exploited Means Demonstrated** | "已被利用"必须演示过 | `exploited` 标志只在 testbed 独立复现后才打 |
| 8 | **Fingerprints Are Stable Under Edit** | 指纹在代码编辑下稳定 | Finding 身份 = 代码结构（路径、符号、类），不是行号 |
| 9 | **Sandbox By Infrastructure, Not By Prompt** | 沙箱靠基础设施，不靠 prompt | 网络/文件系统边界由 runtime 强制，**不靠 prompt 说"请别访问"** |
| 10 | **The Operator Outranks Every Agent** | 操作员压过所有 agent | Operator 指令优先于任何 agent 的 peer suggestions 或历史 note |
| 11 | **Persist Atomically** | 原子持久化 | 共享 artifact 用"完整写 + 原子替换"，禁止"先删再写" |

## 为什么这份规范的核心论点重要

仔细看 11 条：**没有一条**是关于模型本身的能力（强弱、对齐、温度）。全部是关于：

- **模型周围的工程结构**（条 3 心跳、条 4 claim 寿命、条 11 原子写）
- **模型输出的验证规则**（条 1 evidence、条 2 surface、条 7 demonstrated）
- **agent 之间的协议**（条 5 rate arbiter、条 6 coverage gate、条 10 operator 优先级）
- **基础设施级强制**（条 9 sandbox by infra）

→ 这就是文章标题说的"AI 安全测试的核心不是模型，是**模型周围的验证闭环**"。**完全印证**。

**最有思想杠杆的一条是 #9**——`Sandbox By Infrastructure, Not By Prompt`。这是对所有"靠 prompt 拦截恶意行为"路线的根本性否定。任何"我告诉 agent 不要做 X"的安全控制都不算数，必须**让 agent 在物理上做不到 X**。这一条值得在书里单开一节展开。

## 与本书各章节的映射建议

| 本书章节（推断/建议） | Foundry 引用点 | 引用方式 |
|---|---|---|
| **威胁建模与攻击面** | Cartographer 角色 + #1 Evidence Over Assertion | 8 角色里 Cartographer 是把"威胁建模"具象化的 agent 模板 |
| **Agent 可观测性 / 监控** | #3 Heartbeat + #4 Claim Mortality | 直接给"如何判断 agent 是否健康"的工程答案，反对用 timeout |
| **Agent 之间的协作与权责边界** | 8 角色 pipeline + #10 Operator Outranks | 现成的角色模板 + 权责分离原则 |
| **基础设施隔离 / 沙箱** | #9 Sandbox By Infra | **最重要的引用点**。要单开一节展开"prompt-sandbox 反模式" |
| **持久化与状态管理** | #11 Persist Atomically + #4 Claim Atomic | 工程化操作守则 |
| **事件调查 agent 甜区**（呼应你前面问过的） | Triager + Validator + Coverage-Guide 三角 | Foundry 已经把"调查、验证、覆盖度"分了三个 agent，是甜区场景的现成蓝图 |
| **Rate limiting / cost control** | #5 Provider Is Rate Arbiter | 反对内部硬编码 cap 的论据 |
| **报告与可追溯** | Reporter 角色 + #2 Surface Only What Survives + #8 Fingerprints Stable | 给"report 必须满足什么条件"提供 7 个 FR 级别要求 |
| **跟 OWASP / NIST AI RMF 的对比** | 整套 spec | OWASP/NIST 更治理层、Foundry 更工程层，正好补充 |

## 在书的"参考文献"中的位置

- 跟其它已收的素材**互补**而不重复：
  - **OX Security 的 MCP advisory**（[[2026-05-18-ox-security-mcp-supply-chain-advisory]]）讲攻击面
  - **《MCP 六层攻击面》**（[[2026-05-18-mcp-six-attack-surfaces-cn]]）讲 MCP 具体漏洞
  - **Cisco Foundry**（本文件）讲**防御侧的工程规范** ← 这一侧之前缺
- 跟 [[2026-05-18-addy-osmani-agent-skills]] 也有连接：Addy 是"工程师怎么写 skill"，Foundry 是"安全测评 agent 应该是什么形态"——一个微观一个宏观

## TODO

- [ ] 完整读 `spec.md` 的 130+ FR 编号需求，挑出最值得做成 case study 的 5-10 条
- [ ] 试装一下 Foundry 是否有参考实现（仓库只是 spec，没看到 reference impl；如果有就跑一下做评估）
- [ ] 找 Cisco 内部 Talos / Duo 等团队是不是发过具体使用 Foundry 的 talk / 博客
- [ ] 看 Foundry 的 SECURITY.md / CONTRIBUTING.md / GLOSSARY.md，可能有更多可引用的术语定义
- [ ] 跟踪 `Seed_v0.1.0` 之后的版本，看 11 条原则有没有变（变了说明工业实践还在迭代，要更新引用）
- [ ] 写"agent 安全工程化原则"章节时，把 Foundry 11 条作为骨架，每条延伸 2-3 段实例
- [ ] 把 #9 "Sandbox By Infrastructure, Not By Prompt" 单独写一节——这是对 prompt-only 防御路线的清算
