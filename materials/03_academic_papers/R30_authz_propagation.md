# R30 — Authorization Propagation in Multi-Agent AI Systems:Identity Governance as Infrastructure

> **Source (paper)**: https://arxiv.org/abs/2605.05440
> **Local PDF**: `materials/03_academic_papers/R30_authz_propagation_2605.05440.pdf`
> **License**: arXiv 预印本(以原文版权页为准;笔记引用属合理使用)
> **Type**: 立场/形式化论文(workflow-level property 形式化 + 7 项结构需求 + 企业实证 3 案例)
> **Fetched at**: 2026-05-18(PDF 入库)
> **Note authored at**: 2026-06-04(v3.1 Phase 1)
> **本笔记基础**:论文摘要 + 首页(WebFetch 抓取)+ `_ANALYSIS_2026-05-18-asf-positioning.md` §P3 详细定位 + framework 价值分析。**论文正文未完整深读**,§六"待深读事项"已标记关键不确定点。

---

## 一、元信息

- **作者**:Krti Tallam(单作者)
- **机构**:**Kamiwaza AI**(企业 AI 平台公司,论文中"production enterprise AI platform" 即指 Kamiwaza 自家平台)
- **arXiv ID**:2605.05440(v1,2026-05-06 提交,cs.AI)
- **篇幅**:待核(中等长度,非 survey)
- **核心问题**:多代理系统中 agent 作为 non-human principal 检索数据、委托任务、综合结果时,**授权不变量(authorization invariants)跨工作流边界崩溃**——这是与提示注入并列的另一个独立安全问题,**经典 RBAC / ABAC / ReBAC 无法完整覆盖**。
- **核心论断**(摘要原文):*"Identity governance must be treated as infrastructure: evaluated continuously, enforced at every interaction boundary, and designed into the system before orchestration logic is allowed to scale."*

---

## 二、核心贡献

### 2.1 把"授权传播"形式化为 workflow-level property

论文不是工程实现而是**形式化 + 立场文**——把"agent 间委托后授权是否仍然成立"形式化为工作流级属性,定义为三个独立子问题:

| 子问题 | 工程含义 |
|---|---|
| **Transitive Delegation**(传递委托) | Agent A 把任务委托给 Agent B,B 再委托给 Agent C;C 的最终授权是 A 与 B 授权的什么函数?如何保证传递不超界? |
| **Aggregation Inference**(聚合推理) | 多个低敏感数据源被 agent 聚合后推理出高敏感结论(差分隐私 / mosaic 攻击的 agentic 版本) |
| **Temporal Validity**(时间有效性) | Agent 在 t1 时刻获得授权,t2 时刻才执行;期间用户撤销 / 角色变更 / 数据过期如何处理? |

**形式化的工程价值**:把这三个子问题作为"任何多 agent 授权架构必须显式回答"的约束,任何号称"解决了 agent 授权"的方案都可以用这三道题校验。

### 2.2 7 项结构需求(论文内部编号 R1-R7,与本书 R 编号无关)

授权传播的工程化要求,论文给出 7 项**结构性需求**(避免与本书 R 编号冲突,本节用 N1-N7 重新编号):

| 编号 | 需求 | 工程化含义 |
|---|---|---|
| **N1** | 一级代理身份(First-Class Agent Identity) | 每个 agent 实例必须有独立、可验证的身份,不能借用调用方身份 |
| **N2** | 显式有界委托(Explicit Bounded Delegation) | 委托必须显式声明范围、深度、有效期;无默认无限委托 |
| **N3** | 每数据检索边界评估(Per-Retrieval Boundary Evaluation) | 不在 session 开始时一次性授权,而在每次数据检索时重新评估 |
| **N4** | 可表达聚合策略(Expressible Aggregation Policies) | 策略语言必须能表达"组合 A + B 后禁止"这类聚合规则 |
| **N5** | 工作流作用域追踪(Workflow-Scoped Tracking) | 跟踪每条数据所属工作流,跨工作流不复用授权 |
| **N6** | 时间有效性(Temporal Validity) | 显式过期时间 + 撤销可观测 + 时钟漂移可容忍 |
| **N7** | 可追踪恢复(Traceable Recovery) | 授权失败后能定位失败点 + 回滚到一致状态 |

工程意义:**这 7 项是判断任何多 agent 系统授权是否"达标"的核查清单**——直接可作为 v3.1 Ch6 §6.4 跨智能体层的工程实操章节骨架。

### 2.3 4 问责约束(Accountability Constraints)

论文进一步给出 4 条问责约束(具体内容待深读 PDF 核实),作为 N1-N7 的运营层补充。

### 2.4 关键实证数据

| 数据点 | 含义 |
|---|---|
| **3 个企业生产违规案例** | 来自 Kamiwaza AI 实际部署,展示"正常系统行为(非对抗)" 已产出 N1-N7 预测的失败——会话绑定失败 / 委托报告成功未执行 / 基础设施身份间隙 |
| **SIF 攻击 14 场景 71% 成功率** | **Semantic Intent Fragmentation** 攻击:把恶意意图碎片化,每片单独看合规,聚合后越界。这是本论文新提出的攻击类别 |
| **MCP 威胁分析覆盖 177,000+ 工具** | 论文对 MCP 生态做了大规模威胁建模,规模显著大于 OX Security MCP advisory 的 20 万实例统计 |
| **PCAS:48% → 93%** | **Policy Compliance via Aggregation Surveillance**:依赖图监控工具,把策略合规率从基线 48% 提升到 93%(具体测试集合待核) |

### 2.5 引用的同期工作(论文摘要点名)

论文摘要直接点名 4 项同期工作,展示"领域正在收敛但尚未统一":

- **Prakash 2026** — invocation-bound capability tokens
- **Sharma et al. 2026** — task-scoped authorization envelopes
- **Palumbo et al. 2026** — dependency-graph policy enforcement
- **Parakhin 2026** — execution-count revocation

工程价值:这 4 篇是 R30 的"近邻文献",若 v3.1 升 R30 为核心,这 4 篇也是顺手要追的候选材料(可能进 v3.2 inbox)。

### 2.6 论文自述的局限

论文摘要承认 3 项不解决:
- 不解决通用聚合推理(N4 提出问题但不给完整算法)
- 不取代提示注入防御(本论文与 prompt injection 防御正交)
- 不提议最终策略语言(策略语言是开放问题)

---

## 三、与 v3 framework 的对接点

R30 在 framework 上的"防护形状" = **以 I 维度(Identity)为主轴的跨智能体层全面工程化**。五处对接:

### 3.1 第 6 章 §6.4 跨智能体层(主对接点,**升核心后需重写**)

v3.0 §6.4 当前内容:DID + IATP / Agent Impersonation 检测 / Crescendo 检测 / 知识库污染防护(留 cross/K 产业空白小节)。这一节当前是**点状描述**,缺工程化骨架。

R30 提供的 7 项需求(N1-N7)恰好是 §6.4 缺失的工程化骨架:

| §6.4 现有内容 | R30 对应需求 | v3.1 重写建议 |
|---|---|---|
| DID + IATP 段 | **N1** 一级代理身份 | 加 "DID + IATP 是 N1 的实现形态" 说明 |
| (新) | **N2** 显式有界委托 | 全新小节,R5 AGT 的 capability token / R12 IATP 委托段作工程参考 |
| (新) | **N3** 每数据检索边界评估 | 全新小节,与 R22 CaMeL 的污点传播形成跨域呼应 |
| (新) | **N4** 可表达聚合策略 | 全新小节,讨论 OPA Rego / Cedar 在聚合策略表达上的不足 |
| Crescendo 检测段 | **N5** 工作流作用域追踪 | 升级:Crescendo 检测是 N5 的特例 |
| (新) | **N6** 时间有效性 | 全新小节,R5 AGT Trust Decay 是 N6 的实现形态 |
| Agent Impersonation 检测段 | **N7** 可追踪恢复 | 升级:冒充检测是 N7 的特例(检测到后能回到一致状态) |
| cross/K 产业空白 | (论文未直接处理) | 保留,但 N4 聚合策略对 cross/K 防护有间接价值 |

**v3.1 §6.4 章节结构重写建议**:

```
§6.4 跨智能体层(v3.1 重写)
  §6.4.1 层职责定位:授权传播是与提示注入并列的独立问题(R30 立论)
  §6.4.2 N1 一级代理身份:DID + IATP 工程实现
  §6.4.3 N2 显式有界委托:R5 AGT capability token + 委托深度限制
  §6.4.4 N3 每数据检索边界评估:每检索而非每会话授权
  §6.4.5 N4 可表达聚合策略:聚合规则的策略语言挑战
  §6.4.6 N5 工作流作用域追踪:跨工作流不复用授权 + Crescendo 检测
  §6.4.7 N6 时间有效性:Trust Decay + 撤销可观测
  §6.4.8 N7 可追踪恢复:Agent Impersonation 检测 + 一致状态回滚
  §6.4.9 cross/K 产业空白(沿用 v3.0)+ 与 N4 的关联
  §6.4.10 7 需求与 Core 矩阵 4 cells(cross/C / cross/I / cross/K + post/I 信任锚)的映射
```

### 3.2 第 3 章 §3.2.1 P1 默认零信任 + §3.4.2 CIK I 维度论证

R30 论断"**身份治理必须作为基础设施嵌入系统设计**"是 P1 的工程化推论。具体注入点:

- **§3.2.1 立论 1.x**:可加新立论 1.5(或 1.3 扩展)**"信任评估必须发生在每个交互边界(per-boundary),不在 session 边界"**——直接引用 R30 N3
- **§3.4.2 CIK 三维介绍处**:加一句"**在多 agent 场景下 I 维度的复杂度显著高于 C/K,详见 Ch6 §6.4**",让 CIK 的对称呈现承认实际权重差异
- **§3.2 末"P1 与 P2 + P4 的依存关系"**:R30 把 P1 + P2 + P4 三者绑定——零信任(P1)需要 every-boundary 评估(P3 持续运营)+ workflow 级追踪(P2 统一跨层)+ 可追踪恢复(P4 可验证)。这一绑定可在 §3.2.5 加段说明

### 3.3 第 5 章 §5.1.1 AT1 身份欺骗 + §5.1.4 AT4 上下文操纵(新攻击子类)

**SIF 攻击(Semantic Intent Fragmentation)** 是 R30 新提出的攻击类别。在 framework 7 类对抗技术中归位:

| 候选归位 | 论据 | 建议 |
|---|---|---|
| AT4 上下文操纵 | SIF 通过碎片化"上下文"逃避 | ⚠ 部分契合 |
| AT1 身份欺骗 | SIF 利用聚合后授权失效 | ⚠ 部分契合 |
| **新建 AT8 聚合诱导** | 7 类对抗技术之外的新形态 | **不建议**(打破 AT1-AT7 数字稳定性) |

**最终建议**:在 §5.1.4 AT4 末尾加子节 **"AT4.5 SIF 语义意图碎片化"**,标 R30 为来源,71% 攻击成功率作论据。

### 3.4 第 4 章 §4.3 S12 流程操纵攻击面

R30 N5 工作流作用域追踪 + N7 可追踪恢复 都直接对应 **S12 智能体流程与决策逻辑** 攻击面。建议在 §4.3.12 S12 描述末尾加引用:**"R30 给出 S12 攻击面在多 agent 委托链上的形式化模型"**。

### 3.5 附录 A §A.2 7 类对抗技术 × 12 攻击面映射表

若 §3.3 决定加 AT4.5 SIF 子类,附录 A §A.2 需要更新——SIF 触达攻击面应为 S1 + S3 + S10 + S12(用户输入 + 上下文窗口 + 智能体通信 + 流程决策)。

---

## 四、与已知 baseline 的关系

| 关系类型 | 同类工件 | 对比要点 |
|---|---|---|
| **理论根基(已有)** | R9 Your Agent, Their Asset / CIK | R9 给"I 维度独立性"的实证(单维度投毒 ASR 24.6%→64-74%),R30 给"I 维度工程化结构"(7 项需求);**两者形成"理论根基 + 工程清单"双源** |
| **同方向工程实现** | R5 Microsoft AGT IATP + DID | R5 是协议层(IATP 通信 + DID 身份),R30 是不变量层(workflow-level property);**抽象层级互补** |
| **同方向问题命名** | R12 Microsoft AIRT Agent Impersonation | R12 命名问题(Agent Impersonation 是 7 类 cross-agent 威胁之一),R30 给出问题的形式化与 7 项需求;**R30 是 R12 的下游工程化** |
| **概念同源** | R22 CaMeL by-design 控制流分离 | R22 解决"K → C 不能传染"(数据流不影响控制流),R30 解决"授权不变量跨边界传播";**都是 by-design 思路,作用维度不同** |
| **同期收敛工作** | Prakash 2026 / Sharma et al. 2026 / Palumbo et al. 2026 / Parakhin 2026 | 论文摘要点名的 4 项同期工作,展示领域正在收敛但未统一;**R30 是综合性框架** |

---

## 五、入库建议

### 编号与归档位置

- **R 编号**:**R30**(已分配,沿用)
- **归档目录**:`materials/03_academic_papers/`(✅ 已落)
- **PDF 文件**:`R30_authz_propagation_2605.05440.pdf`(✅ 已落)
- **笔记文件**:`R30_authz_propagation.md`(✅ 本文件)

### 在 v3.1 framework 中的集成动作

1. **Ch2 §2.1 总览表**:✅ 已加 R30 行(v3.1 Phase 1 Task 3)
2. **附录 C §C.1 矩阵**:✅ 已加 R30 行,标 ○★(cross/I 计划核心)
3. **Ch6 §6.4 跨智能体层**:**全章节重写**,见 §3.1 重写建议(10 个子节)
4. **Ch3 §3.2.1 P1 默认零信任**:加立论 1.5(或扩展立论 1.3)"per-boundary 评估"
5. **Ch3 §3.4.2 CIK I 维度**:加多 agent 场景下 I 维度权重说明 + 指向 §6.4
6. **Ch3 §3.2.5 P1-P4 依存关系**:加"R30 三原则绑定"段
7. **Ch5 §5.1.4 AT4 上下文操纵**:加 AT4.5 SIF 子类
8. **Ch4 §4.3.12 S12 流程决策攻击面**:加 R30 形式化模型引用
9. **附录 A §A.2 对抗技术 × 攻击面**:更新 SIF 触达攻击面
10. **附录 B**(可选):若 N1-N7 与四接口 Schema 有对接关系,在 §B.3 加说明

### 升核心层决策

**强烈推荐 R30 升核心**(详见 §七)。升核心后:

- 附录 C §C.1 矩阵 Ch6 列从 ○★ 转 ●★(章节稿落实后)
- 附录 C §C.2 核心论据列表从 6 行扩到 7 行
- §1.5 版本演进说明加"v3.1 升核心:R30(I 维度工程化结构)"

---

## 六、当前确证范围与待深读事项

| 项 | 状态 |
|---|---|
| ✅ 论文标题 / 作者 / 机构 / arXiv ID | 摘要 + 首页确认 |
| ✅ 核心立论(authorization propagation 形式化) | 摘要明确 |
| ✅ 3 形式化子问题(transitive delegation / aggregation inference / temporal validity) | 摘要明确 |
| ✅ 7 项结构需求(N1-N7)与其语义 | 摘要明确 + _ANALYSIS 详细 |
| ✅ 同期收敛工作 4 项 | 摘要点名 |
| ✅ 关键数据(3 案例 / SIF 71% / MCP 177K / PCAS 48→93) | _ANALYSIS 摘要 |
| ⏳ N1-N7 各自的精确语义 + 工程实现示例 | **待深读论文 §3-§4** |
| ⏳ SIF 攻击 14 场景的具体类型 + 攻击载荷 | **待深读论文 §5 或附录** |
| ⏳ PCAS 工具的实现机制 + 测试集合 | **待深读论文 §6 实验** |
| ⏳ 4 问责约束的具体内容 | **待深读论文 §4** |
| ⏳ 3 企业实证案例的具体场景 | **待深读论文 §6 或附录** |
| ⏳ Kamiwaza AI 平台对 R30 框架的实际部署形态 | 待补(可能需查 Kamiwaza 官网) |

**深读优先级**:§3-§4(N1-N7 精确定义)+ §5(SIF 攻击)+ §6 实验 PCAS 数据。这三段约 20-30 页,读完即可把本笔记的 ⏳ 项全部转 ✅。

---

## 七、升核心层的论据与影响范围(v3.1 决策点)

### 7.1 升核心的 4 条论据

**论据 1:I 维度的工程化结构空白**
v3.0 framework 的 Core 矩阵把 CIK 三维并列,但 §6.4 跨智能体层只用了 6 个点状描述(DID / IATP / Crescendo / Agent Impersonation / cross/K 空白 / 等),**没有任何一份既有 R 编号提供过 I 维度的工程化结构清单**。R30 的 N1-N7 直接填这个空白。

**论据 2:与 R9(已升核心)形成对仗双源**
R9 是 CIK 三维独立性的实证根基(单维度 ASR 跃升);R30 是 I 维度的工程化清单。两者一个"为什么 I 重要"一个"I 该怎么做",在 framework 论证链上对仗完整。**核心论据列表从 6 行扩到 7 行,只增不挤压**。

**论据 3:形式化 + 实证双重证据**
R30 既是形式化论文(workflow-level property + N1-N7)又有实证(3 企业案例 + SIF 71% + PCAS 48→93)。这是 framework 偏好的论文类型——既能引用结构,也能引用数字。

**论据 4:补 Apex 三原则的依存关系**
R30 把 P1 + P2 + P4 三原则在多 agent 场景下绑定为一组——零信任(P1)需要每边界评估(P3 + N3)+ workflow 级追踪(P2 + N5)+ 可追踪恢复(P4 + N7)。这一绑定是 v3.0 §3.2.5 "4 原则依存关系" 段欠的论证。

### 7.2 不升核心的反论据(诚实评估)

- ⚠ **论文是 single-author + 单作者机构(Kamiwaza)**:不是大学协作或厂商权威,在"权威性"上弱于 R7(三大学)/ R9(多机构)/ R12(Microsoft Red Team)/ R22(Google DeepMind)
- ⚠ **关键数据未完整核实**:SIF / PCAS 等数据是 _ANALYSIS 摘要,需深读论文实验部分确认
- ⚠ **N1-N7 编号与本书 R 编号撞名**:在书里引用时必须显式说明"论文内部编号 N1-N7,与本书 R1-R36 无关",增加读者认知负担

### 7.3 升核心的影响范围(若拍板)

**章节稿修订**:

- Ch2 §2.1 总览表:R30 行的"v3.1 计划"标记改"核心"
- Ch6 §6.4 全章节重写(本文 §3.1 给的 10 子节结构)— 这是 v3.1 最大单点修订
- Ch3 §3.2.1 立论 1.5 + §3.4.2 注解 + §3.2.5 依存关系段
- Ch5 §5.1.4 AT4.5 SIF 子类
- Ch4 §4.3.12 S12 引用
- 附录 A §A.2 SIF 触达攻击面更新
- 附录 C §C.1 R30 行 ○★ → ●★
- 附录 C §C.2 核心论据从 6 行扩 7 行
- 附录 C §C.6 v3.1 追加台账更新

**总工作量**:Ch6 §6.4 重写约 1-2 天工作量,其余微调约 0.5 天。

**风险**:N1-N7 需要在 framework 内一致命名(避免与本书 R 编号混淆)。建议正式写章节时**全文用 "R30-N1" 至 "R30-N7" 形式引用**,避免歧义。

### 7.4 我的最终建议

**升核心**。理由:论据 1-4 强;反论据 1-2 可通过深读 PDF 缓解;反论据 3 是命名问题非内容问题。**Ch6 §6.4 全章重写**是 v3.1 必做事项之一,即使不升核心 R30 也要重写——升核心只是把"重写依据"从隐式变显式。

---

## 八、不应该做的事

- ❌ **不要把 N1-N7 写成 ASF v3.1 的新设计原则** — N1-N7 是工程检查清单层级,不是与 P1-P4 同级的设计原则。混淆层级会让 framework 失去层级感
- ❌ **不要让 Ch6 §6.4 重写淹没 cross/K 产业空白说明** — cross/K 空白是 framework 自承的 long-standing 缺口,R30 不解决它,重写时要保留这一段
- ❌ **不要用 R30 论证否定 R22 CaMeL** — 两者作用维度不同(R22 解 K→C 控制流,R30 解 I 跨边界);framework 内并列引用,不互相替代
- ❌ **不要把 SIF 攻击当作"全新攻击范式"过度营销** — SIF 是 71% 成功率,有效但不是 zero-day 级;在 §5.1.4 引用应说明"R30 论文中报告的实验室数据,生产环境可能因部署细节差异"
