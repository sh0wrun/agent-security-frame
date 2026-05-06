# 《自主智能体安全防护体系设计》引用材料清单

**文档版本**: v2.0-draft  
**更新日期**: 2026-04-25  
**说明**: 本文档汇总了《自主智能体安全防护体系设计》全文引用的所有信息源，按类别分组，每条记录包含完整引用信息、获取方式、核心内容摘要及其在文中的引用位置。

---

## 一、行业实践指南

### [R1] 奇安信政企版龙虾（OpenClaw）安全使用指南

- **作者/机构**: 奇安信集团
- **发布时间**: 2026 年 3 月 16 日
- **类型**: 企业安全部署指南（PDF，49 页）
- **获取方式**: 项目知识库内置文档
- **核心内容**:
  - OpenClaw 五大核心组件架构分析（Channel、Gateway、Workspace、AI Gateway、LLM 服务）
  - 九大安全面与防护体系（Skill 生态、Workspace 数据、会话安全、IM 安全、服务器安全、终端协同、网络连接、模型接入、安全运营）
  - 三大核心威胁趋势（提示词窃取篡改、内容安全绕过、间接注入攻击）
  - Skill 三层安全检测机制（静态审计 → 动态沙箱 → 专业评估）
  - Skill 分级管理体系（绿/黄/红三级）
  - 四维画像运营体系（Skill 运营、行为运营、权限运营、账号/设备画像）
  - 四级告警响应体系（P0–P3）与运营 KPI 指标
  - 三种联网模式（纯内网 / 半联网 / 全联网）与风险分析
  - 四阶段部署路线图与安全配置模板
  - 奇安信集团内部 OpenClaw 部署实践案例
- **文中引用章节**: 第 1、2、3、4、5、6、7、12 章

---

### [R2] SlowMist OpenClaw 安全实践指南

- **作者/机构**: 慢雾安全团队（SlowMist Security Team）
- **发布时间**: 2026 年 3 月（v2.7 / v2.8 Beta）
- **类型**: Agent 自防护实践指南（开源，MIT 许可证）
- **获取方式**: https://github.com/slowmist/openclaw-security-practice-guide
- **核心内容**:
  - 面向 Agent 自身（Agent-facing）的安全指南，非传统人工加固清单
  - 核心原则：零摩擦运营、高风险须确认、显式夜间审计、零信任默认
  - 三层防御矩阵（Pre-action / In-action / Post-action）
  - 行为黑名单与红线/黄线规则
  - Skill 安装审计协议（反供应链投毒）
  - 跨 Skill 预检机制（业务风险控制）
  - 夜间自动审计 13 项核心指标
  - Brain Git 灾备恢复机制
  - 红蓝对抗验证指南（Validation Guide）
  - v2.8 Beta 针对 OpenClaw 2026.4+ 的反劫持策略
- **文中引用章节**: 第 4、7、10、12 章

---

### [R3] OWASP Top 10 for Agentic Applications 2026

- **作者/机构**: OWASP GenAI Security Project — Agentic Security Initiative (ASI)
- **发布时间**: 2025 年 12 月 9 日
- **类型**: 行业风险标准（ASI01–ASI10）
- **获取方式**: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- **核心内容**:
  - ASI01 Agent Goal Hijack — 目标劫持
  - ASI02 Tool Misuse — 工具滥用
  - ASI03 Identity & Privilege Abuse — 身份与权限滥用
  - ASI04 Agentic Supply Chain Vulnerabilities — 供应链漏洞
  - ASI05 Unexpected Code Execution — 意外代码执行
  - ASI06 Memory & Context Poisoning — 记忆与上下文投毒
  - ASI07 Insecure Inter-Agent Communication — 不安全智能体间通信
  - ASI08 Cascading Failures — 级联故障
  - ASI09 Human-Agent Trust Exploitation — 人-智能体信任利用
  - ASI10 Rogue Agents — 流氓智能体
  - 设计原则：最小代理权（Least Agency）
  - 附录：与 LLM Top 10、AIVSS、CycloneDX/AIBOM、Non-Human Identities Top 10 的交叉映射
- **相关子文档**:
  - OWASP Agentic AI Threats and Mitigations (T01–T17) — 完整威胁分类法
  - OWASP FinBot CTF 平台 — 实操训练平台
  - AI Security Solutions Landscape for Agentic AI Q2 2026
- **文中引用章节**: 第 2、3、4、7、8、9 章

### [R4] NIST AI 800-4 Adversarial Machine Learning

- **作者/机构**: National Institute of Standards and Technology (NIST)
- **发布时间**: 2026 年 4 月
- **类型**: 政府/行业标准指南（PDF）
- **获取方式**: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.800-4.pdf
- **核心内容**:
  - NIST 对抗性机器学习分类法与威胁模型
  - AI 系统攻防框架
  - 对抗性攻击类型分类（投毒、逃逸、模型窃取等）
  - 缓解策略与最佳实践
- **本地路径**: ~/ppt/agent-security-frame/materials/NIST.AI.800-4.pdf
- **状态**: v2 新增参考资料
- **计划整合位置**:
  - Ch2 威胁分类补充
  - Ch3 防御框架参考
  - Ch9 对抗性攻击缓解策略

---

## 二、开源治理与防护框架

### [R5] Cisco DefenseClaw

- **作者/机构**: Cisco AI Defense
- **发布时间**: 2026 年 3 月 27 日（RSA Conference 2026 发布，3/27 GitHub 上线）
- **类型**: 开源安全治理框架（Apache 2.0 许可证）
- **获取方式**: https://github.com/cisco-ai-defense/defenseclaw
- **核心内容**:
  - 定位：OpenClaw 的企业治理层，执行"未扫描不运行，危险即阻断"原则
  - 五大扫描组件：
    - Skill Scanner — Agent 技能静态分析
    - MCP Scanner — MCP 服务器验证
    - A2A Scanner — 智能体间通信审计
    - CodeGuard — 静态代码分析（硬编码凭证、Agent 生成代码扫描）
    - AI BoM — AI 资产清单自动生成
  - 三层架构：Python CLI + Go Gateway（策略执行 + 审计日志）+ TypeScript 插件
  - 沙箱隔离：Landlock LSM + seccomp-BPF
  - 运行时检查引擎：LLM 提示词/补全/工具调用实时检查
  - 准入门控：HIGH/CRITICAL 自动阻断，MEDIUM/LOW 警告放行
  - 企业集成：Splunk HEC + OTLP collector
  - 与 NVIDIA OpenShell 的沙箱集成
  - 执行动作 2 秒内完成，无需重启
- **相关资源**:
  - Cisco 官方博客: https://blogs.cisco.com/ai/defenseclaw-is-live
  - Cisco 新闻稿: https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2026/m03/cisco-reimagines-security-for-the-agentic-workforce.html
- **文中引用章节**: 第 5、7、11 章

---

### [R6] Microsoft Agent Governance Toolkit (AGT)

- **作者/机构**: Microsoft
- **发布时间**: 2026 年 4 月 2 日
- **类型**: 开源运行时治理工具包（MIT 许可证）
- **获取方式**: https://github.com/microsoft/agent-governance-toolkit
- **核心内容**:
  - 定位：首个覆盖 OWASP Agentic Top 10 全部 10/10 风险的治理工具包
  - 七大模块：
    - Agent OS — 无状态策略引擎（p99 延迟 < 0.1ms）；支持 YAML / OPA Rego / Cedar
    - Agent Mesh — 密码学身份（DID + Ed25519）、Inter-Agent Trust Protocol、mTLS
    - Agent Runtime — 动态 Ring 隔离、权限升降级
    - Agent SRE — 熔断器、SLO 监控、级联故障防护、Kill Switch
    - Agent Compliance — 自动合规评分（EU AI Act / HIPAA / SOC2）、OWASP ASI 映射
    - Agent Marketplace — 插件生命周期管理、Ed25519 签名验证
    - Agent Lightning — RL 训练治理
  - 跨语言支持：Python / TypeScript / .NET / Rust / Go
  - 框架适配器 20+：LangChain、CrewAI、Google ADK、AutoGen、OpenAI Agents、LlamaIndex 等
  - 9,500+ 测试，ClusterFuzzLite 持续 Fuzzing
  - 信任衰减机制（Trust Decay）
  - Cross-Model Verification Kernel（多数投票对抗记忆投毒）
  - 计划移交至基金会进行社区治理
- **相关资源**:
  - Microsoft 开源博客: https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/
  - 架构深度解读: https://techcommunity.microsoft.com/blog/linuxandopensourceblog/agent-governance-toolkit-architecture-deep-dive-policy-engines-trust-and-sre-for/4510105
- **文中引用章节**: 第 4、6、7、8、10、11 章

---

### [R7] AEGIS: No Tool Call Left Unchecked

- **作者**: Aojie Yuan, Zhiyuan Su, Yue Zhao
- **机构**: University of Southern California / University of California, Davis
- **发布时间**: 2026 年 3 月 13 日
- **类型**: 学术论文 + 开源工具（MIT 许可证）
- **论文获取**: https://arxiv.org/abs/2603.12621
- **代码获取**: https://github.com/Justin0504/Aegis
- **核心内容**:
  - 定位：AI Agent 的预执行防火墙和审计层
  - 威胁模型：LLM 视为不可信组件；SDK 和 Gateway 为可信执行组件
  - 三阶段运行时管线：
    - 深度字符串提取（参数递归解析）
    - 内容风险扫描（注入/遍历/外泄检测）
    - 可组合策略验证（allow / block / pending 三决策模型）
  - 人工审批流：高风险调用路由至 Compliance Cockpit
  - 防篡改审计链：Ed25519 签名 + SHA-256 哈希链
  - 实测数据：48 攻击实例 100% 拦截；500 正常调用 1.2% 误报；中位延迟 8.3ms
  - 跨框架支持：14 个 Agent 框架（Python / JavaScript / Go）
  - 四大组件：SDK Layer → Gateway → Tamper-Evident Audit → Compliance Cockpit
- **文中引用章节**: 第 1、2、4、6、7、10、11 章

---

## 三、学术研究论文

### [R8] A Systematic Taxonomy of Security Vulnerabilities in the OpenClaw AI Agent Framework

- **作者**: Surada Suwansathit, Yuxuan Zhang, Guofei Gu
- **机构**: SUCCESS Lab, Texas A&M University
- **发布时间**: 2026 年 3 月 29 日
- **论文编号**: arXiv:2603.27517
- **获取方式**: https://arxiv.org/abs/2603.27517
- **核心内容**:
  - 对 190 个 OpenClaw 安全公告的系统性分类
  - 二维分类框架：系统轴（10 层攻击面）× 攻击轴（对抗技术）
  - 六阶段智能体 Kill Chain（含 Context Manipulation 新阶段）
  - 三大核心发现：
    - 发现一：Gateway + Node-Host 的三个中/高危漏洞组合成完整未认证 RCE 路径（§5.4）
    - 发现二：Exec Policy Engine 的三种独立词法绕过（行续接符、busybox、GNU 长选项缩写）（§5.6）
    - 发现三：恶意 yahoofinance Skill 在 LLM 上下文内执行两阶段 dropper（§5.2）
  - 结构性根因：逐层逐调用点的信任执行 → 跨层组合攻击的系统性脆弱
  - 防御建议（§6）：统一跨层策略执行、语义命令解释、供应链完整性等
  - 公告时间线：两波（Jan 31–Feb 16 共 73 个；Feb 18–25 共 117 个）
- **文中引用章节**: 第 1、2、3、4、6、9、10 章

---

### [R8] A Systematic Security Evaluation of OpenClaw and Its Variants

- **作者**: Yuhang Wang, Haichang Gao, Zhenxing Niu, Zhaoxiang Liu, Wenjing Zhang, Xiang Wang, Shiguo Lian
- **机构**: 西安电子科技大学 / 中国联通数据与 AI 研究院
- **发布时间**: 2026 年 4 月 3 日
- **论文编号**: arXiv:2604.03131
- **获取方式**: https://arxiv.org/abs/2604.03131
- **核心内容**:
  - 对 6 个 Claw 系列框架的系统性安全评估（OpenClaw、AutoClaw、QClaw、KimiClaw、MaxClaw、ArkClaw）
  - 205 个测试用例基准数据集
  - 13 个安全风险类别（对齐 MITRE ATT&CK Enterprise）
  - 五阶段执行链分析（输入摄取 → 规划推理 → 工具执行 → 状态更新 → 结果返回）
  - 核心结论：
    - Agent 化系统风险显著高于底层模型单独使用
    - 侦察和发现行为是最常见弱点
    - 输入摄取和状态更新阶段防御成功率最低
    - 不同框架暴露截然不同的高风险特征
- **文中引用章节**: 第 1、2、3、9、10 章

---

## 四、补充学术参考

### [R8] Your Agent, Their Asset: A Real-World Safety Analysis of OpenClaw

- **作者**: Vijayvargiya, P., et al.
- **发布时间**: 2026 年 4 月
- **论文编号**: arXiv:2604.04759
- **获取方式**: https://arxiv.org/abs/2604.04759
- **核心内容**:
  - CIK 分类法：Capability（可执行技能）、Identity（人格配置）、Knowledge（长期记忆）
  - 首个在真实部署环境中的 OpenClaw 安全评估（连接真实 Gmail、Stripe、本地文件系统）
  - 12 个攻击场景 × 4 个骨干模型（Claude Sonnet 4.5, Opus 4.6, Gemini 3.1 Pro, GPT-5.4）
  - 核心数据：单一 CIK 维度投毒后攻击成功率从 24.6% 跃升至 64%–74%
  - 三种 CIK 对齐防御策略 + 文件保护机制的评估
- **文中引用章节**: 第 1、2 章（风险量化数据）

---

### [R10] ClawSafety: "Safe" LLMs, Unsafe Agents

- **发布时间**: 2026 年 4 月
- **论文编号**: arXiv:2604.01438
- **获取方式**: https://arxiv.org/abs/2604.01438
- **核心内容**:
  - 120 个对抗性测试用例基准
  - 三维组织：危害领域 × 攻击向量 × 有害行为类型
  - 五个前沿模型评估（GPT-5.4, Claude Opus 4.6, Gemini 3.0, Qwen 3.5, Kimi K2.5）
  - 三种攻击向量：Skill 文件注入、邮件注入、网页注入
  - 聊天 vs. Agent 安全差距分析
- **文中引用位置**: 测试库分析章节

---

### [R11] From Assistant to Double Agent (PASB)

- **发布时间**: 2026 年 2 月
- **论文编号**: arXiv:2602.08412
- **获取方式**: https://arxiv.org/abs/2602.08412
- **核心内容**:
  - Personalized Agent Security Bench (PASB) — 个性化 Agent 安全评估框架
  - 端到端黑盒评估，覆盖用户提示词处理、外部内容访问、工具调用、记忆行为
  - 长程交互中攻击的跨阶段传播和累积分析
- **文中引用位置**: 测试库分析章节

---

## 五、补充行业参考

### [R12] Taxonomy of Failure Mode in Agentic AI Systems (Microsoft Whitepaper)

- **作者/机构**: Microsoft AI Red Team (AIRT)
  - 核心作者：Pete Bryan, Giorgio Severi, Joris de Gruyter, Daniel Jones, Blake Bullwinkel, Amanda Minnich, Shiven Chawla, 等 25+ 位贡献者
  - 跨部门协作：Microsoft Research、Microsoft AI、Azure Research、Microsoft Security、Microsoft Security Response Center (MSRC)、Office of Responsible AI、Office of the Chief Technology Officer (CTO)
- **发布时间**: 2026 年
- **类型**: 官方技术白皮书（Whitepaper）
- **获取方式**: Microsoft 官方下载
- **原始链接（英文官方版）**: https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Taxonomy-of-Failure-Mode-in-Agentic-AI-Systems-Whitepaper.pdf
- **核心内容**:
  - **五大核心能力定义**：Autonomy（自主性）、Environment Observation（环境观察）、Environment Interaction（环境交互）、Memory（记忆）、Collaboration（协作）
  - **六种系统类型**：User Driven（用户驱动）、Event Driven（事件驱动）、Declarative（声明式）、Evaluative（评估式）、User Collaborative（协作式）、Multi-Agent（多智能体，分为 Hierarchical、Collaborative、Distributive 三种）
  - **二维故障分类框架**：
    * 第一维：Security Failures（安全性故障）vs Safety Failures（安全性故障）
    * 第二维：Novel Failure Modes（新型故障模式）vs Existing Failure Modes（现有故障模式）
  - **十大新型安全威胁**：
    1. Agent Compromise（智能体妥协）
    2. Agent Injection（智能体注入）
    3. Agent Impersonation（智能体冒充）
    4. Agent Flow Manipulation（智能体流程操控）
    5. Agent Provisioning Poisoning（智能体配置中毒）
    6. Memory Poisoning and Theft（记忆中毒与盗取）
    7. Targeted Knowledge Base Poisoning（目标知识库中毒）
    8. Cross Domain Prompt Injection (XPIA)（跨域提示词注入）
    9. Human-in-the-loop Bypass（人在环路绕过）
    10. Function Compromise and Malicious Functions（功能妥协与恶意功能）
  - **六大新型安全性威胁**：Intra-Agent Responsible AI Issues、Harms of Allocation、Organizational Knowledge Loss、Prioritization Leading to Safety Issues、Multi-Agent Jailbreaks 等
  - **传统问题的新挑战**：AI Hallucinations（幻觉）、Bias Amplification（偏见放大）、User Impersonation（用户冒充）、Misinterpretation of Instructions（指令误解）、Excessive Agency（过度代理）、Parasocial Relationships（寄生关系）等
  - **八种故障影响类型**：Agent Misalignment、System Failures、Cascading Failures、Uncontrolled Behavior 等
  - **实战案例分析**：Memory Poisoning Attack on an Agentic AI Email Assistant（邮件助手的记忆投毒攻击），详细分析攻击机制、观察结果和防护策略
  - **防护设计指引**：关键技术控制（Technical Controls）和架构设计建议（Design Considerations）
  - **局限性分析与建议**：明确说明分析的边界和后续研究方向
- **文中引用章节**: 
  - 第 1、2、3 章：理论基础、故障模式分类、新型威胁分析
  - 第 4 章：防护框架设计的核心理论依据
  - 第 10 章：可验证性设计的参考标准
- **重要说明**: 
  - 这是微软官方发布的权威白皮书，代表 Microsoft AI Red Team 对智能体系统安全的最新认知
  - 白皮书提供了系统性的失败模式分类法，为防护体系设计奠定了坚实的理论基础
  - 包含具体的案例研究和防护建议，具有高度的实用性和参考价值

---

### [R13] 腾讯大模型与智能体安全风险治理与防护

- **作者/机构**: 腾讯安全
- **类型**: 行业白皮书（PDF）
- **获取方式**: 项目知识库内置文档
- **核心内容**:
  - 智能体应用场景主要风险点架构图（交互层、认知层、工具交互层、环境交互层）
  - 天御大模型安全网关：以规则 + 模型为核心的三道安全防线
  - 智能体身份管理：Agent ID、生命周期、权限控制、跨平台认证
  - 大模型安全防护整体架构（五大重点领域）
- **文中引用章节**: 第 2 章（四层架构模型的参考来源之一）

---

### [R13] AI 智能体安全治理白皮书

- **类型**: 行业白皮书（PDF）
- **获取方式**: 项目知识库内置文档
- **核心内容**:
  - MCP 协议安全缺陷分析（权限继承漏洞、工具调用劫持）
  - 多智能体协议中毒风险
  - 决策层风险、通信信道劫持、目标函数篡改
  - 级联资源耗尽
  - 国际 AI 智能体安全标准（WDTA AI-STR-04、ITU-T 等）
- **文中引用章节**: 背景参考

---

## 六、开源安全测试与扫描工具

### [R14] Zeroshot 安全基准测试

- **类型**: Agent 安全基准测试工具
- **攻击载荷**: 145 个，覆盖 12 个攻击类别
- **已测框架**: OpenClaw、PicoClaw、ZeroClaw、IronClaw、Minion
- **文中引用位置**: 测试库分析章节

### [R15] 1Password SCAM

- **获取方式**: https://github.com/1Password/SCAM
- **类型**: 安全认知感知度量基准
- **说明**: 测试 Agent 在日常工作任务中应对钓鱼、凭证窃取、社会工程等安全威胁的能力
- **文中引用位置**: 测试库分析章节

### [R16] ClawSafety 扫描器

- **获取方式**: https://github.com/relaxcloud-cn/clawsafety
- **类型**: Rust 编写的 Agent Skill 安全扫描器
- **安装**: `cargo install clawsafety`
- **文中引用位置**: 测试库分析章节

### [R17] ClawSec (Prompt Security)

- **获取方式**: https://github.com/prompt-security/clawsec
- **类型**: OpenClaw/NanoClaw 安全技能套件
- **说明**: SOUL.md 漂移检测、自动审计、技能完整性验证
- **文中引用位置**: 测试库分析章节

### [R18] Knowsec OpenClaw Security

- **获取方式**: https://github.com/knownsec/openclaw-security
- **类型**: 漏洞数据库 + 安全分析报告
- **说明**: 结构化 CSV 漏洞数据（openclaw_vulnerabilities.csv），含 CVE 分类统计
- **文中引用位置**: 测试库分析章节

### [R19] PinchBench

- **获取方式**: https://github.com/pinchbench/skill
- **类型**: OpenClaw Agent 功能评估基准（非安全专项）
- **说明**: 真实任务评估 LLM 作为 Agent 大脑的实际表现；公开排行榜 pinchbench.com
- **文中引用位置**: 测试库分析章节

### [R20] OpenClaw CVE 追踪器

- **获取方式**: https://github.com/jgamblin/OpenClawCVEs
- **类型**: CVE 持续追踪仓库
- **数据**: 截至 2026 年 4 月 6 日记录 138 个 CVE（63 天，约 2.2 个/天）
- **文中引用位置**: 背景参考

---

## 七、企业评估框架

### [R21] CLAW-10 企业就绪度评估矩阵

- **作者/机构**: Onyx AI
- **获取方式**: https://onyx.app/insights/openclaw-enterprise-evaluation-framework
- **类型**: 厂商中立的 10 维度评分体系
- **说明**: 用于评估 OpenClaw 或任何自主 AI Agent 是否达到企业部署标准
- **文中引用位置**: 测试库分析章节

---

## 八、v2.2 新增整合(R22 / R23)

本节材料在 v2.2 迭代正式整合到 Ch6 / Ch10 / Ch11。详细笔记见 `02_opensource_frameworks/R22_camel.md`。

### [R22] CaMeL: Defeating Prompt Injections by Design ✅ 已整合

- **作者/机构**: Google Research / Google DeepMind / ETH Zurich
- **核心作者**: Edoardo Debenedetti、Ilia Shumailov、Tianqi Fan、Jamie Hayes、Nicholas Carlini、Daniel Fabian、Christoph Kern、Chongyang Shi、Florian Tramèr
- **类型**: 学术论文 + 开源研究工件(Apache 2.0)
- **论文获取**: arXiv:2503.18813
- **代码获取**: https://github.com/google-research/camel-prompt-injection
- **本地笔记**: `02_opensource_frameworks/R22_camel.md`
- **核心内容**:
  - 定位:**by-design** 的提示词注入防御,而非补丁式响应
  - 关键机制:**Capability-based 安全解释器** —— 在 LLM 与工具调用之间构建独立的解释器层,对调用做能力级别的权限与数据流校验;显式分离控制流(可信)与数据流(不可信)
  - 评估:基于 **AgentDojo** 基准(智能体沙盒环境),**77% 可证明安全任务完成率**(对比无防御 84%)
- **v2.2 整合状态**:
  - Ch6 §6.2.2 ✅ 能力模型补充"CaMeL 解释器(by-design 路线)"子段,作为参考实现
  - Ch11 §11.4.5 ✅ 事中防护工具新增 CaMeL,定位"设计参考"(非生产部署)
  - Ch11 §11.1 全景图 ✅ 类别三事中防护 4→5
  - Ch11 §11.9 选型决策树 ✅ 金融/医疗/政府线加挂 CaMeL 设计原理
- **重要说明**:这是研究工件,非产品级代码;上游声明不提供维护、可能含 bug;企业整合应以**设计原理为参考**,而非直接部署该代码。

### [R23] AgentDojo: Dynamic Environment for LLM Agent Eval ✅ 已整合

- **作者/机构**: Google DeepMind / ETH Zurich(与 R22 部分作者重叠)
- **核心作者**: Edoardo Debenedetti、Jie Zhang、Mislav Balunović、Luca Beurer-Kellner、Marc Fischer、Florian Tramèr
- **类型**: 论文 + 开源基准(MIT License)
- **论文获取**: arXiv:2406.13352(NeurIPS 2024 Datasets and Benchmarks Track)
- **代码获取**: https://github.com/ethz-spylab/agentdojo
- **本地笔记**: 在 R22_camel.md 第四节内联描述(R22 与 R23 紧密耦合,不重复立卷)
- **核心内容**:
  - 智能体提示词注入防御的动态沙盒评估环境
  - 多环境套件:office workspace / banking / slack / travel
  - 支持"防御启用 vs 关闭"对比评估,可输出形式化可证明安全指标
- **v2.2 整合状态**:
  - Ch10 §10.4.1 ✅ 测试库合集第 7 个评估基准
  - Ch11 §11.2.9 ✅ 安全评估工具类新增条目
  - Ch11 §11.1 全景图 ✅ 类别一安全评估 7→8

---

## 附：信息源在各章的分布矩阵

| 章节 | R1 奇安信 | R2 SlowMist | R3 OWASP | R4 DefenseClaw | R5 AGT | R6 AEGIS | R7 2603.27517 | R8 2604.03131 |
|-----|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 第1章 | ●★ | | | | | ● | ● | ●★ |
| 第2章 | ● | | ●★ | | | | ●★ | ● |
| 第3章 | ● | | ●★ | | | | ●★ | ●★ |
| 第4章 | | ●★ | ●★ | ● | ● | ●★ | ● | |
| 第5章 | ●★ | | ● | ●★ | | | | |
| 第6章 | ●★ | | | | ●★ | ●★ | ● | |
| 第7章 | ●★ | ●★ | | ● | ●★ | ● | | |
| 第8章 | ● | | ● | ● | ●★ | | | |
| 第9章 | | | ●★ | | | | ●★ | ●★ |
| 第10章 | | ●★ | | | ● | ● | ●★ | ●★ |
| 第11章 | | | | ●★ | ●★ | ●★ | | |
| 第12章 | ●★ | ● | | | | | | |

> ●★ = 该章核心依据来源 · ● = 辅助引用

---

## 附：引用格式参考

学术论文引用格式（按文中出现顺序编号）：

```
[1] 奇安信. 政企版龙虾（OpenClaw）安全使用指南. 奇安信集团, 2026年3月.

[2] OWASP GenAI Security Project. OWASP Top 10 for Agentic Applications 
    2026 (ASI01–ASI10). OWASP Foundation, 2025年12月.

[3] OWASP Agentic Security Initiative. Agentic AI Threats and Mitigations 
    (T01–T17). OWASP Foundation, 2025.

[4] Vijayvargiya, P., et al. Your Agent, Their Asset: A Real-World Safety 
    Analysis of OpenClaw. arXiv:2604.04759, 2026.

[5] Suwansathit, S., Zhang, Y., and Gu, G. A Systematic Taxonomy of 
    Security Vulnerabilities in the OpenClaw AI Agent Framework. 
    arXiv:2603.27517, 2026.

[6] Cisco AI Defense. DefenseClaw: Security Governance for Agentic AI. 
    GitHub, 2026年3月. https://github.com/cisco-ai-defense/defenseclaw

[7] Wang, Y., et al. A Systematic Security Evaluation of OpenClaw and 
    Its Variants. arXiv:2604.03131, 2026.

[8] Microsoft. Agent Governance Toolkit. GitHub, 2026年4月. 
    https://github.com/microsoft/agent-governance-toolkit

[9] Siddique, I. Introducing the Agent Governance Toolkit: Open-source 
    runtime security for AI agents. Microsoft Open Source Blog, 2026年4月.

[10] Yuan, A., Su, Z., and Zhao, Y. AEGIS: No Tool Call Left Unchecked — 
     A Pre-Execution Firewall and Audit Layer for AI Agents. 
     arXiv:2603.12621, 2026.

[11] 慢雾安全团队. OpenClaw Security Practice Guide v2.7/v2.8. GitHub, 
     2026年3月. https://github.com/slowmist/openclaw-security-practice-guide

[12] Microsoft AI Red Team. Taxonomy of Failure Mode in Agentic AI 
     Systems Whitepaper. Microsoft Corporation, 2026. 
     https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/
     microsoft/final/en-us/microsoft-brand/documents/Taxonomy-of-
     Failure-Mode-in-Agentic-AI-Systems-Whitepaper.pdf

[13] 腾讯安全. 大模型与智能体安全风险治理与防护. 2026.
```
