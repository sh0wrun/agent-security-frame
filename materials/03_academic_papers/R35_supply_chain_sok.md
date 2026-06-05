# R35 — SOK: A Taxonomy of Attack Vectors and Defense Strategies for Agentic Supply Chain Runtime

> **Source (paper)**: https://arxiv.org/abs/2602.19555
> **Local PDF**: `materials/03_academic_papers/R35_supply_chain_sok_2602.19555.pdf`
> **License**: arXiv 预印本 + ICLR 2026 Workshop on AI for Mechanism Design and Strategic Decision Making(版权以会议页为准;笔记引用属合理使用)
> **Type**: SOK(Systematization of Knowledge)论文 + 统一分类法 + 零信任运行时架构提案
> **Fetched at**: 2026-05-25(PDF 入库)
> **Note authored at**: 2026-06-04(v3.1 Phase 1)
> **本笔记基础**:论文 Abstract + §1 Introduction + §2 Background and Threat Assumptions + §3 The Data Supply Chain 首段(首 3 页 PDF) + `inbox/_ANALYSIS_2026-05-18-asf-positioning.md` §P8 详细定位 + framework 价值分析综合。**论文 §3 中后段、§4 Tool Supply Chain、§5 Viral Agent Loop、§6 Defense Strategies、§7 Zero-Trust Architecture 未完整深读**,§六"待深读事项"已标记关键不确定点。

---

## 一、元信息

- **作者**(5 位 † 共同贡献):Shiqi Yang(NYU)、Wenting Yang(UCSD)、Xiaochong Jiang(Northeastern)、Yichen Liu(UCSD)、Cheng Ji(Illinois)
- **机构**:全部署名 "Independent Researcher" — 5 位作者邮箱分别来自 NYU / UCSD / Northeastern / Illinois 等大学,以个人独立研究形态产出,非任一机构官方课题组
- **arXiv ID**:2602.19555(v2,2026-04-19 提交,cs.CR)
- **发表场景**:ICLR 2026 Workshop on AI for Mechanism Design and Strategic Decision Making
- **篇幅**:待全文核(workshop 论文,估 8-12 页正文 + 附录)
- **核心问题**:Agent 系统的安全边界从**传统静态编译时**(static build-time)依赖转移到**动态推理时**(dynamic inference-time)依赖,后者具有循环、非枚举、语义概率性特征。已有研究只看模型级漏洞,**Agent 运行时供应链的全景结构性威胁尚未被系统化**。
- **核心论断**(摘要 + §1 原文):*"agentic systems assemble their execution context at runtime based on semantic probability ... external documents, retrieved knowledge, APIs, and tools become implicit dependencies. Inference-time context therefore operates as an active component of the system's attack surface, rather than serving as a passive input."* 并主张迁移到 **Zero-Trust Runtime Architecture**,其中"context is treated as untrusted control flow, and tool execution is bounded by cryptographic provenance rather than semantic likelihood"。

---

## 二、核心贡献

### 2.1 范式区分:Static vs Dynamic Supply Chain(论文 Table 1)

论文最核心的工程论断:Agent 供应链与传统软件供应链是**两个范式**,不是同一概念的延伸。Table 1 给出五维对比:

| 维度 | Static(传统软件) | Dynamic(Agentic) |
|---|---|---|
| Resolution Time | Build / Deploy Time | **Inference / Runtime** |
| Dependency Type | Libraries, Binaries | **Data Context, APIs, Tools** |
| Topology | Directed Acyclic | **Cyclic (Feedback Loops)** |
| Attack Surface | Code Vulnerabilities | **Semantic Manipulation** |
| Upstream Source | Verified Vendor | **Runtime Information Sources** |

工程含义:**任何沿用 "build-time 枚举 + 签名验证 + SBOM" 思路构建的供应链防御,在 dynamic 形态下都会出现根本性失配**。SBOM 假设依赖有限可枚举;agent 运行时依赖通过 LLM 推理"动态选定",事前无法穷举。这一论断直接挑战 R7 OpenClaw 漏洞分类法的"静态攻击面枚举"方法论边界——R7 的 S1-S10 假设组件预先存在,R35 指出 agent 的真实组件集合在 runtime 才生成。

### 2.2 威胁模型:Man-in-the-Environment(MitE)

论文 §2.2 提出 **MitE 威胁模型**,与传统 MitM(Man-in-the-Middle)对仗:

- **MitM** 攻陷通信信道,做"传输中"篡改
- **MitE** **不攻陷信道、不改模型权重、不动 system prompt、不动 hosting infra**,而是**污染环境**(wiki / repo / forum / tool registry)。环境是 agent 的 "primary source of truth",agent 主动检索环境内容并把它升格为指令——"**Prompt-Data Isomorphism**"。

关键概念:adversary 作为 **runtime supplier**,把恶意 artifact "种"到公共数据源或工具注册表;artifact 处于 dormant 状态,直到 agent 自主检索并集成,这一刻才劫持 agent reasoning loop。

工程含义:MitE 与 M3 / M4 inbox 中的 MCP 实战事件(MCP 工具描述符投毒、MCP 注册表恶意工具)**精确互证**——MCP 生态正是 MitE 的最完美实例化。第 5 章 §5.1.4 已记录的 "MCP 工具描述符投毒"案例(R13a)其实就是 MitE 的特例。

### 2.3 双供应链分类法

论文把 agent 运行时供应链拆为两条互不重叠的链:

**(A)Data Supply Chain(数据供应链 / Perception Module)** — 论文 §3

按"控制力点位"切分,而不按载荷表面形式分:

| 子类 | 攻击形态 | 触达点 |
|---|---|---|
| **会话内(transient context injection)** | 间接提示注入(Indirect PI) / In-Context Learning 污染 | 单会话窗口 |
| **跨会话(persistent memory poisoning)** | KB 中毒 / 长期记忆中毒 / 自更新记忆污染 | 跨 session 持久态 |

工程含义:论文明确把"**action-perception loop**"(感知-动作循环)作为放大器——一次中毒在 action-perception 反馈下不只产出一个 bad answer,而是"a compromised operational state",可跨 session 持续。

**(B)Tool Supply Chain(工具供应链 / Action Module)** — 论文 §4(未深读)

按"工具生命周期 3 阶段"切分:

| 阶段 | 攻击形态 |
|---|---|
| **Phase I: Discovery** | 工具注册表投毒 / 名称碰撞 / 恶意 MCP server 上架 |
| **Phase II: Implementation** | 工具代码后门 / 依赖污染 / 工具描述符与实现不一致 |
| **Phase III: Invocation** | 参数注入 / 工具链组合滥用 / 工具返回值再投毒 |

工程含义:这一 3 阶段切分**与 ASF S2(技能分发)+ S5(工具调度)+ S11(部署管线)三个攻击面正交**——Discovery 主要触达 S2 + S11;Implementation 主要触达 S2 + S11;Invocation 主要触达 S5。R35 的工具供应链 3 阶段可以作为 ASF S2 / S5 / S11 三个攻击面的"runtime 演化版"细分。

### 2.4 Viral Agent Loop(病毒智能体循环)— 涌现型新攻击形态

论文最具原创性的贡献。Viral Agent Loop 的核心特征:

- **生成式蠕虫(generative worm)**:不依赖代码漏洞、不依赖二进制传播,而是 agent 输出本身成为下一个 agent 的输入,实现**自传播**
- **生态系统污染(ecosystem pollution)**:被污染 agent 的输出回灌到公共环境(wiki / forum / registry / KB),成为下一波受害者的 ground truth
- **拓扑转换(topology transformation)**:静态供应链是 DAG(有向无环),agent 生态因 action-perception loop 形成**有环图(cyclic feedback)**——这是 Table 1 中 "Topology: Cyclic" 的具体表现

**ASF 框架含义**:Viral Agent Loop **不能被 12 攻击面 S1-S12 中任一单格捕获**——它不是一个攻击面,而是"攻击面之间的耦合关系"在 runtime 涌现的产物。

> ⚠ **关键框架决策**:**不建议在 ASF 中新增 S13**(会打破 12 攻击面数字稳定性,且 S13 在分类轴上与 S1-S12 不同级)。**建议在 §3.5.1 攻击面派生关系说明中加 "build-time 枚举 vs runtime 涌现" 元说明段落**,把 Viral Agent Loop 作为"runtime 涌现型攻击形态"的范例,与 S1-S12 形成"枚举型 vs 涌现型"两类并立。

### 2.5 5 层防御提案 + Zero-Trust Runtime Architecture

论文 §6 / §7(未深读)提议 5 层防御对标 + Zero-Trust Agentic Runtime Architecture,核心三件套:

1. **Cryptographic Provenance Binding Registry(密码学绑定注册表)**:工具与数据源必须有不可伪造的 provenance 凭证,工具执行边界由密码学而非语义可能性确定
2. **Neuro-Symbolic Information Flow Control(神经符号信息流控制)**:把语义级污点追踪固化为符号化策略,与 R22 CaMeL by-design 思想同源
3. **Auditor-Worker Architecture(审计员-工人架构)**:执行 agent(worker)的每个动作经独立审计 agent(auditor)的预执行校验,审计 agent 不与工人共享 LLM 状态

**ASF 框架含义**:Zero-Trust Runtime Architecture 不是一个 framework / library,而是一组**架构指导原则**,与 ASF 第 8 章 §8.3 "DefenseClaw + AGT + AEGIS 三框架协作"形成同级提案——可作为**第 4 候选**纳入 §8.3。

### 2.6 论文自承的局限(_ANALYSIS 摘要)

- 重点在**单 agent 或二元交互**,**多 agent 编排未充分覆盖**
- 防御提案多为**架构指导**,**缺实现原型**(对比 R22 CaMeL 有可运行解释器、R6 AEGIS 有 48 实例集)

---

## 三、与 v3 framework 的对接点

R35 在 framework 上的"防护形状" = **以 runtime supply chain 视角重新审视事前准入层的边界与攻击面元假设**。六处对接:

### 3.1 第 6 章 §6.1 事前准入层(主对接点之一,**升核心后需扩写**)

v3.0 §6.1 当前定位:Skill 供应链安全(扫描器 + CVE 情报)+ 部署管线审核 + 身份/知识基线。**全部基于 build-time 假设**——Skill 在被引用前可枚举、可扫描、可签名。

R35 提供 §6.1 当前缺失的范式补充:

| §6.1 现有内容 | R35 对应 | v3.1 扩写建议 |
|---|---|---|
| §6.1.2 Skill 扫描器 + CVE 情报 | 静态供应链 | 加段说明 "扫描器只覆盖 static 部分,inference-time 选定的 data/tool 不在扫描范围" |
| §6.1.3 部署管线审核 | 静态供应链 + Tool SC Phase II | 加段说明 "Provisioning Poisoning 是 static 形态,MitE 是 dynamic 形态,需互补" |
| §6.1.4 身份/知识基线 | 静态信任根 | 加段说明 "基线在 build-time 固化,runtime 偏移检测在 §6.3" |
| **(新)§6.1.5 Stochastic Supply Chain** | 全文范式 | **全新子节**:介绍 dynamic 供应链 + MitE 模型 + 解释 "为什么静态准入不充分" |
| **(新)§6.1.6 密码学 Provenance 绑定** | Zero-Trust §7 三件套之一 | **全新子节**:工具与数据源的 cryptographic provenance,作为事前层的 runtime 延伸 |

**v3.1 §6.1 章节结构扩写建议**:

```
§6.1 事前准入层(v3.1 扩写)
  §6.1.1 层职责定位
  §6.1.2 Skill 供应链安全:扫描器与 CVE 情报(标"static 视角")
  §6.1.3 部署管线审核:S11 攻击面的专属应对
  §6.1.4 身份配置基线与知识基线
  §6.1.5(新)Stochastic Supply Chain:静态准入的范式边界(R35 立论)
  §6.1.6(新)密码学 Provenance 绑定:事前层在 runtime 的延伸
```

### 3.2 第 5 章 §5.2 实证案例库(Viral Agent Loop 是新场景候选)

v3.0 §5.2 当前 7 个案例(身份欺骗 / 词法绕过 / SSRF 三阶段链 / 邮件助手记忆投毒 / ClawHavoc / 工具链组合 / 审批疲劳)**全部在单 agent 或单受害者维度**。Viral Agent Loop 是**生态级**新场景——值得在 §5.2 加一个新案例:

- **§5.2.8 Viral Agent Loop:生态级自传播(对应 AT5 + AT4 涌现态)**
  - 攻击全程:agent 输出 → 公共环境(wiki/registry)→ 下一波 agent 检索 → 再输出 → ...
  - 结构性意义:**第一种不需要漏洞、不需要恶意代码、纯靠 LLM 推理传播的蠕虫形态**
  - 防护启示:破坏 action-perception loop 的回灌路径——agent 输出在写回公共环境前需经独立审计 agent 校验(R35 提议的 Auditor-Worker 架构)

### 3.3 第 3 章 §3.5.1 攻击面派生关系(元说明加段)

⚠ **关键决策点**:Viral Agent Loop **不增 S13**,而是在 §3.5.1 加"**build-time 枚举 vs runtime 涌现**"元说明段落:

> 12 个攻击面 S1-S12 都是 **build-time 可枚举**的入口——分析者在系统部署前即可识别。R35 指出存在第二类攻击形态:**runtime 涌现型**——它不对应任何单一组件,而是组件间耦合关系在 action-perception loop 下涌现的产物(Viral Agent Loop 是范例)。本书保持 12 攻击面数字稳定性,但读者在威胁建模时**需同时审查"涌现型攻击"**;附录 A §A.5 给出涌现型攻击的检测路径——它们通常由事后层的偏离度检测先发现,无法被事前层穷举。

这一段同时澄清了 framework 的方法论边界,**承认静态枚举的局限性而不放弃枚举工具的价值**。

### 3.4 第 4 章 §4.3 S11 部署管线攻击面(MitE 互证)

§4.3.S11 当前定义为 "Provisioning Poisoning:部署管线注入、系统提示词完整性破坏、新智能体上线审核缺失",**全部 build-time 形态**。R35 的 MitE 威胁模型给出 S11 的 runtime 对偶:

- **build-time 形态**(已覆盖):管线注入 / system prompt 篡改 / 上线审核缺失
- **runtime 形态**(R35 新增):tool registry 投毒 / MCP server 上架攻击 / 公共环境(wiki/forum)投毒,这些不在部署管线但产生等效效果——"runtime supplier"

建议 §4.3.S11 描述末尾加引用:**"R35 把 S11 攻击面扩展到 runtime supplier 形态(MitE 威胁模型),其中 tool registry 与公共数据源充当 agent 的 runtime 上游,与传统部署管线产生等效威胁"**。

### 3.5 附录 A §A.4 防御机制(5 层防御对标)

v3.0 附录 A §A.4 当前以 framework 自家四层防御组织防护映射。R35 的 5 层防御提案 + Zero-Trust 架构是**外部对照**——可在 §A.4 末尾加 §A.4.x 子节,把 R35 的 5 层(密码学注册表 + 神经符号信息流 + 审计员-工人 + ...)与 framework 四层对照:

| R35 5 层 | ASF 四层 | 覆盖范围对照 |
|---|---|---|
| Cryptographic Provenance Binding Registry | 事前 + 事中 | 事前层的 runtime 延伸 |
| Neuro-Symbolic Information Flow Control | 事中(in/K) | 与 R22 CaMeL 同源 |
| Auditor-Worker Architecture | 跨智能体 + 事中 | 与 R6 AEGIS 预执行防火墙同思路,但 auditor 独立 LLM |
| ...(其余 2 层待深读) | 待补 | 待补 |

### 3.6 第 8 章 §8.3 三框架协作(Zero-Trust Runtime 是第 4 候选)

v3.0 §8.3 当前以 DefenseClaw + AGT + AEGIS 三框架协作为主线。R35 的 **Zero-Trust Agentic Runtime Architecture** 与三者不重叠:

- DefenseClaw 强 Skill 扫描(事前 / static)
- AGT 强统一策略 + 信任评分(全四层 / build-time 策略)
- AEGIS 强预执行防火墙(事中 / 规则比对)
- **R35 Zero-Trust 强 cryptographic provenance + runtime context as untrusted control flow**(全四层 / runtime 视角)

建议在 §8.3 加第 4 候选段:**"Zero-Trust Agentic Runtime Architecture(R35)— 当前为架构指导,无完整开源实现,但其 cryptographic provenance + auditor-worker 思想可作为三框架协作的'runtime 增强层'参考"**。

---

## 四、与已知 baseline 的关系

| 关系类型 | 同类工件 | 对比要点 |
|---|---|---|
| **方法论上游** | R20 OpenClaw CVE Tracker | R20 是 CVE 流(单点 build-time 漏洞观测),R35 是分类法(runtime 全景结构化);**R35 是 R20 的方法论母版** |
| **思想同源(by-design 路径)** | R22 CaMeL | 都做污点追踪:R22 在控制流/数据流分离,R35 在神经符号信息流控制;**R22 给运行原型,R35 给架构指导** |
| **范式补充(静态枚举边界)** | R7 OpenClaw 漏洞分类法 | R7 给 build-time 攻击面 S1-S10(已升核心),R35 给 runtime 供应链范式;**两者并列后才能完整覆盖 agent 攻击面** |
| **威胁模型互证** | M3 / M4 MCP 实战事件(inbox) | MitE 威胁模型直接对应 MCP 生态实战——MCP 工具描述符投毒、MCP 注册表上架攻击都是 MitE 实例 |
| **同方向 SOK** | R3 OWASP ASI 2026 / R12 Microsoft AIRT | 都是分类法,但视角不同:OWASP 按风险类型、AIRT 按失效模式、**R35 按供应链形态(runtime 切面)**;三者形成正交三视角 |
| **架构指导对照** | R5 AGT / R6 AEGIS / R4 DefenseClaw | R35 Zero-Trust 与三框架不重叠,是"第 4 候选"——架构思想较新,工程实现较弱 |

---

## 五、入库建议

### 编号与归档位置

- **R 编号**:**R35**(已分配,沿用)
- **归档目录**:`materials/03_academic_papers/`(✅ 已落)
- **PDF 文件**:`R35_supply_chain_sok_2602.19555.pdf`(✅ 已落)
- **笔记文件**:`R35_supply_chain_sok.md`(✅ 本文件)

### 在 v3.1 framework 中的集成动作

1. **Ch2 §2.1 总览表**:✅ 已加 R35 行(v3.1 Phase 1 Task 3)
2. **附录 C §C.1 矩阵**:✅ 已加 R35 行,Ch6 标 ○★(事前准入计划核心)
3. **Ch6 §6.1 事前准入层**:**扩写两个子节**(§6.1.5 Stochastic Supply Chain + §6.1.6 密码学 Provenance),见 §3.1 重写建议
4. **Ch5 §5.2 实证案例库**:加 §5.2.8 Viral Agent Loop 生态级自传播案例
5. **Ch3 §3.5.1 攻击面派生关系**:加 "build-time 枚举 vs runtime 涌现" 元说明段落(关键,避免 S13)
6. **Ch4 §4.3.S11 部署管线**:加 MitE / runtime supplier 引用
7. **Ch8 §8.3 三框架协作**:加 Zero-Trust Runtime Architecture 作为第 4 候选
8. **附录 A §A.4 防御机制**:加 5 层防御对照子节
9. **Ch10 真实案例**:若 Viral Agent Loop 实证案例可获取,可作为 §10.x 案例(目前 R35 论文未给完整案例数据,先标候选)

### 升核心层决策

**强烈推荐 R35 升核心**(详见 §七)。升核心后:

- 附录 C §C.1 矩阵 Ch6 列从 ○★ 转 ●★(章节稿落实后)
- 附录 C §C.2 核心论据列表从 6 行扩到 7 行(若 R30 同期升核心则扩到 8 行)
- §1.5 版本演进说明加 "v3.1 升核心:R35(runtime 供应链范式,补 R7 静态枚举边界)"
- **R35 与 R7 / R12 并列作为 Ch5 / Ch6 §6.1 双根基**——R7 给 build-time 攻击面、R12 给生命周期失效模式、R35 给 runtime 供应链范式,三者覆盖完整

---

## 六、当前确证范围与待深读事项

| 项 | 状态 |
|---|---|
| ✅ 论文标题 / 作者 / 机构 / arXiv ID | 首页 + 摘要确认 |
| ✅ 核心立论(Stochastic Dependency Resolution / static vs dynamic) | §1 + §2 + Table 1 明确 |
| ✅ MitE 威胁模型语义 + 与 MitM 对仗 | §2.2 明确 |
| ✅ Prompt-Data Isomorphism 概念 | §2.2 明确 |
| ✅ 数据供应链 2 子类(会话内 / 跨会话) | §3 首段 + _ANALYSIS 摘要 |
| ✅ 工具供应链 3 阶段(Discovery / Implementation / Invocation) | _ANALYSIS 摘要确认,论文 §4 未深读 |
| ✅ Viral Agent Loop 3 特征(生成式蠕虫 / 生态污染 / 拓扑转换) | _ANALYSIS 摘要,论文 §5 未深读 |
| ✅ Zero-Trust Runtime Architecture 三件套 | 摘要 + _ANALYSIS,论文 §7 未深读 |
| ⏳ 工具供应链 3 阶段的具体攻击载荷分类 | **待深读论文 §4** |
| ⏳ Viral Agent Loop 是否给出实证 / 模拟数据 | **待深读论文 §5** |
| ⏳ 5 层防御对标的完整 5 层列表 | **待深读论文 §6** |
| ⏳ Cryptographic Provenance 的工程实现指引 | **待深读论文 §7** |
| ⏳ Auditor-Worker Architecture 与 AEGIS 的具体差异 | **待深读论文 §7** |
| ⏳ 论文是否提及具体 case study / 复现实例 | **待深读论文 §5 + 附录** |

**深读优先级**:§4 工具供应链 3 阶段 → §5 Viral Agent Loop → §7 Zero-Trust 架构 → §6 防御对标。这 4 段是 framework 集成的核心依据,读完即可把本笔记 ⏳ 项全部转 ✅。

---

## 七、升核心层的论据与影响范围(v3.1 决策点)

### 7.1 升核心的 4 条论据

**论据 1:补 R7 静态枚举的范式边界**

R7 OpenClaw 漏洞分类法是 v3 framework 的核心攻击面源头,但 R7 的方法论是"build-time 可枚举"——所有 S1-S10 都假设组件在部署前可识别。R35 揭示 framework 在"**build-time / static / single-tenant 假设下的边界**":agent 运行时通过 LLM 推理动态选定依赖,这些依赖不在事前可枚举集合中。**R35 是 R7 的范式补充,不是替代**——两者并列后才完整覆盖 agent 攻击面。

**论据 2:解释了 framework 的"涌现型攻击"盲区**

framework 的 12 攻击面 + 7 类对抗技术二维矩阵在 build-time 视角下完备,但**对 Viral Agent Loop 等 runtime 涌现型攻击表达力不足**。R35 给出涌现型攻击的形式化(action-perception loop / cyclic topology)与代表性范例(Viral Agent Loop),framework 借助 R35 可以在 §3.5.1 加元说明承认这一边界,而无需破坏 12 攻击面的数字稳定性。**这是一种"承认局限即扩展能力"的论证模式**。

**论据 3:与 M3/M4 MCP 实战事件互证**

inbox 中已收的 M3 / M4 MCP 实战事件(MCP 工具描述符投毒、MCP 注册表恶意工具)在 framework 中尚无统一理论解释——它们既不是 S2 单格、也不是 S5 单格,而是 "runtime supplier" 的实证。R35 的 MitE 威胁模型直接命中——MCP 生态正是 MitE 的最完美实例化。**升核心后,framework 对 MCP 风险的描述可从"个案罗列"升级为"MitE 框架下的范例"**。

**论据 4:Zero-Trust Runtime 是 §8.3 三框架协作的第 4 候选**

framework §8.3 三框架协作(DefenseClaw + AGT + AEGIS)是 v3 的工程主线,但全部基于 build-time 策略。R35 的 Zero-Trust Runtime Architecture 提供 runtime 视角的第 4 候选(cryptographic provenance + auditor-worker),与三框架不重叠。**升核心后,§8.3 从"3 框架协作"扩为"3+1 框架/架构协作",runtime 视角被显式纳入工程蓝图**。

### 7.2 不升核心的反论据(诚实评估)

- ⚠ **作者机构权威性偏弱**:5 位作者全部署名 "Independent Researcher",虽然邮箱归属 NYU / UCSD / Northeastern / Illinois,但非任一机构官方课题组。对比 R7(三大学协作)/ R12(Microsoft Red Team)/ R22(Google DeepMind),权威性偏弱
- ⚠ **防御提案缺实现原型**:论文自承"防御提案多为架构指导,缺实现原型"。Zero-Trust Runtime 不像 R22 CaMeL 有可运行解释器、R6 AEGIS 有 48 实例集——目前是概念架构
- ⚠ **多 agent 编排未充分覆盖**:论文自承"重点在单 agent 或二元交互"。framework Ch6 §6.4 跨智能体层升核心更应该用 R30 而不是 R35(详见综合决策)
- ⚠ **关键细节未完整核实**:工具供应链 3 阶段 / Viral Agent Loop 实证 / 5 层防御对标 等关键内容需深读论文 §4-§7 才能确认,目前基于 _ANALYSIS 摘要

### 7.3 升核心的影响范围(若拍板)

**章节稿修订**:

- Ch2 §2.1 总览表:R35 行的"v3.1 计划"标记改"核心"
- Ch6 §6.1 事前准入层:**新增 §6.1.5 Stochastic Supply Chain + §6.1.6 密码学 Provenance** 两个子节 — 这是 R35 升核心的最大单点修订
- Ch5 §5.2 实证案例库:加 §5.2.8 Viral Agent Loop 案例
- Ch3 §3.5.1 攻击面派生关系:加 "build-time 枚举 vs runtime 涌现" 元说明段(**关键,避免新增 S13**)
- Ch4 §4.3.S11:加 MitE / runtime supplier 引用
- Ch8 §8.3:加 Zero-Trust Runtime Architecture 第 4 候选段
- 附录 A §A.4:加 5 层防御对照子节
- 附录 C §C.1 R35 行 ○★ → ●★
- 附录 C §C.2 核心论据从 6 行扩 7 行
- 附录 C §C.6 v3.1 追加台账更新

**总工作量**:Ch6 §6.1 两个新子节约 1 天工作量,Ch5 §5.2.8 案例约 0.5 天,其余微调约 0.5 天。**总计 2 天**。

**风险**:Stochastic Supply Chain 范式与 framework 既有"build-time 攻击面枚举"方法论存在张力,需在 §3.5.1 元说明段精确措辞,避免读者误以为 framework 否定自己的 12 攻击面坐标系。建议措辞:**"12 攻击面是 build-time 完备,涌现型攻击是 runtime 补充,两类视角并行而非替代"**。

### 7.4 我的最终建议

**强烈推荐升核心**(与 R7 / R12 并列)。理由:

- 论据 1-4 强,尤其论据 1 与 R7 形成范式互补,论据 3 解释 MCP 实战事件
- 反论据 1 是作者权威性问题,但 ICLR 2026 Workshop 接收 + 5 邮箱机构联署部分缓解
- 反论据 2 是工程成熟度问题,但 R35 作为"范式论文"而非"工程实现",反而与 R7 / R12 同源(R7 / R12 也是分类法,不是 framework 实现)
- 反论据 3 多 agent 不足由 R30 互补(R30 强 cross/I,R35 强事前准入 + 运行时供应链);**R30 + R35 同期升核心可形成完整覆盖**

**升核心后 framework 双根基结构**:

| 章节 | v3.0 核心论据 | v3.1 升核心后 |
|---|---|---|
| Ch5 威胁全景 | R3 / R7 / R8 / R12 | + R35(runtime 供应链范式) |
| Ch6 §6.1 事前准入 | R1 / R4 / R5 / R12 | + R35(Stochastic SC + 密码学 Provenance) |
| Ch6 §6.4 跨智能体 | R12 | + R30(若同期升核心,7 项需求工程清单) |

---

## 八、不应该做的事

- ❌ **不要为 Viral Agent Loop 新增 S13 攻击面** — Viral Agent Loop 是 runtime 涌现型,不与 S1-S12 同级(后者是 build-time 枚举型)。新增 S13 会打破 12 攻击面的数字稳定性,且 S13 在分类轴上与 S1-S12 不可比。**正确做法是在 §3.5.1 加"枚举型 vs 涌现型"元说明段,把 Viral Agent Loop 作为涌现型范例**

- ❌ **不要用 R35 论证否定 R7 的 12 攻击面坐标系** — R35 是 R7 的范式补充,不是替代。R7 在 build-time 视角下仍完备,framework 的攻击面坐标系仍是工程团队做威胁建模的主要工具。R35 的价值是**承认 framework 的方法论边界**,不是**推翻 framework 的方法论**

- ❌ **不要把 Zero-Trust Runtime Architecture 当作可直接生产部署的工程实现** — 论文自承"防御提案多为架构指导,缺实现原型"。在 §8.3 引用时必须明确标注"架构指导,工程实现待社区完善",避免让企业工程团队误以为 R35 提供了与 DefenseClaw / AGT / AEGIS 同等成熟度的可部署系统

- ❌ **不要把 MitE 威胁模型与 MitM 混用** — 两者攻击点位完全不同:MitM 攻陷信道,MitE 污染环境。framework 在引用时必须保持 MitE 的独立性,避免读者把它理解为 MitM 的变种。这一区分是 R35 工程价值的核心,模糊化即丧失立论

- ❌ **不要把 R35 的 Stochastic Supply Chain 与 SBOM / SCA 工具直接对比** — SBOM / SCA 是 static 工具,R35 指出 dynamic 形态根本不在 SBOM 覆盖范围。在 framework 引用时若做对比,必须明确"SBOM 在 static 部分有效,dynamic 部分需密码学 provenance 补充"——而不是"SBOM 失效需要被替换"
