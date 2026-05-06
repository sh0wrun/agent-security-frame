// v3 骨架对比原型 — 共享数据
// 两个骨架(A、B)使用同一份方案覆盖数据,聚合方式不同
window.V3_DATA = {
  // 7 层通用智能体参考架构(v2 §2.1.2)
  // 与 4 层防御完全不同维度:7 层 = 系统组件分层(WHAT 由什么构成),4 层 = 防御时间轴(WHEN 何时生效)
  layers7: [
    { id: 1, name: "通道接入层", en: "Channel Layer", color: "#B4D2EE", textColor: "#1F4E79",
      role: "智能体与外部世界的边界",
      duties: "桥接外部消息平台(Telegram/Slack/Web)与内部系统;接收外部输入(文本/文件/Webhook 事件)、发起者身份验证(allowlist)、会话密钥计算、标准化消息分发",
      threats: "身份冒用、恶意注入、文件携带恶意代码、消息外泄、Webhook 认证缺失",
      examples: "OpenClaw 的 15+ 平台适配器;企业 IM/Web 入口" },
    { id: 2, name: "网关控制层", en: "Gateway Layer", color: "#6B9FD3", textColor: "#FFFFFF",
      role: "中央控制平面 + 信任代理",
      duties: "认证和多路复用所有入站连接;HTTP/WebSocket 服务、节点注册表 NodeRegistry、命令审批 ExecApprovalManager、按会话串行化命令队列;企业架构还承载负载均衡 / WAF / DLP",
      threats: "WebSocket 认证绕过、SSRF、Token 泄露、策略执行不一致、全局级权限提升",
      examples: "OpenClaw Gateway;企业级 API Gateway / WAF / DLP",
      keyNote: "网关失守 = 全局沦陷" },
    { id: 3, name: "插件与技能层", en: "Plugin & Skill Layer", color: "#FAD7B0", textColor: "#7A4A1F",
      role: "智能体功能扩展模块",
      duties: "管理 Skill 加载和执行;Skill 来源:社区市场(ClawHub 23,000+)/ 智能体生成 / 企业自研;以「操作者级信任」运行——加载的 Skill 被运行时视为可信指令源",
      threats: "供应链投毒(恶意 Skill 上架)、后门与隐蔽 Prompt 注入、权限过度申请、版本篡改、自动生成代码逻辑漏洞",
      examples: "ClawHub Skill 市场;企业内部 Skill 库",
      keyNote: "R7 yahoofinance Skill 实证:ClawHub 分发的恶意 Skill 完全在 LLM 上下文内执行,绕过所有运行时执行策略" },
    { id: 4, name: "Agent 运行时层", en: "Agent Runtime Layer", color: "#F0A767", textColor: "#FFFFFF",
      role: "推理引擎 ──「LLM 推理」与「现实世界执行」的桥梁",
      duties: "组装上下文(系统提示词 + Skill 指令 + 会话历史 + 记忆) → 提交 LLM → 接收输出 → 解析工具调用 → 调度执行(进程内或转发本地执行层)",
      threats: "提示词注入(直接/间接)、上下文窗口污染、幻觉导致错误工具调用、会话死循环、超权限工具调用",
      examples: "OpenClaw / AutoClaw / LangChain Agent / CrewAI / AutoGen 运行时",
      keyNote: "核心结构性矛盾:LLM 不可信,但 Agent 运行时必须依赖 LLM 输出驱动后续行为" },
    { id: 5, name: "记忆与知识层", en: "Memory & Knowledge Layer", color: "#C97524", textColor: "#FFFFFF",
      role: "智能体的持久状态(R9 CIK 的 K 维度)",
      duties: "管理会话历史、长期记忆、启动引导文件(CLAUDE.md)、知识库(RAG)。每次启动时,系统提示词 + 已加载技能指令 + 历史对话被预置到 LLM 上下文",
      threats: "记忆投毒(注入虚假信息或恶意指令)、数据残留、跨会话上下文污染、RAG 注入",
      examples: "CLAUDE.md / 长期记忆 DB / 向量库",
      keyNote: "风险特征:延时性──攻击者注入的内容可能数天后通过记忆加载触发,潜伏式攻击" },
    { id: 6, name: "LLM 接口层", en: "LLM Provider Layer", color: "#6FC6A0", textColor: "#1A4D33",
      role: "智能体与外部大模型的 API 边界",
      duties: "通过此接口发送 prompt、接收流式补全。多模型场景还承担:模型路由、模型切换、上下文隔离、Token 配额管理",
      threats: "API 密钥泄露、模型切换上下文跨提供商泄露、Token 消耗失控(恶意刷量)、响应解析漏洞、数据跨境合规",
      examples: "Claude / GPT / Gemini / 本地部署模型",
      keyNote: "R7 190 个公告语料中此层尚无已确认漏洞,反映的是当前研究边界,不是风险缺位" },
    { id: 7, name: "本地执行层", en: "Local Execution Layer", color: "#C26B66", textColor: "#FFFFFF",
      role: "权限最高的执行内核",
      duties: "在终端用户机器以特权进程运行;接收来自网关的工具调用;通过三阶段策略管线(词法 allowlist → 审批 → 执行)决定是否执行;沙箱化通过 docker exec,非沙箱化直接 Shell",
      threats: "命令策略绕过(行续接符 / busybox / GNU 长选项)、沙箱逃逸、容器镜像篡改、宿主机提权、文件系统遍历",
      examples: "终端用户机器 / 容器 / Shell",
      keyNote: "攻击者最终目标 ── 所有攻击链的「Actions on Objectives」阶段都在此层" },
  ],

  // OpenClaw 生态架构 → 7 层映射(实例化展示用)
  // 与 openclaw_ecosystem.html 内的 SVG 一一对应
  openClawMapping: [
    { component: "Users / Messaging platforms / Moltbook", role: "外部消息平台 + 用户入口", layer: 1 },
    { component: "Channels(50+ 平台消息集成)", role: "WhatsApp / Telegram 等渠道适配器", layer: 1 },
    { component: "Clients(CLI / Control UI / WebChat)", role: "用户交互入口", layer: 1 },
    { component: "Gateway(核心控制面 :18789)", role: "WebSocket 服务、会话路由、事件调度", layer: 2 },
    { component: "Skills(内置 / ClawHub / 本地)", role: "技能加载与执行", layer: 3 },
    { component: "ClawHub", role: "技能注册与市场分发", layer: 3 },
    { component: "Model Resolver", role: "多模型调度容错", layer: 4 },
    { component: "Prompt Builder", role: "动态提示组装", layer: 4 },
    { component: "Context Guard", role: "上下文窗口管理", layer: 4 },
    { component: "Session Manager", role: "主 / 群组 / 隔离会话", layer: 4 },
    { component: "Lane Queue", role: "串行执行防竞态", layer: 4 },
    { component: "Tools(Shell / 浏览器 / FS / Cron)", role: "工具调度接口", layer: 4 },
    { component: "Memory(JSONL 转录 / MD 摘要)", role: "持久记忆与会话历史", layer: 5 },
    { component: "LLM(Anthropic / OpenAI / 本地模型)", role: "外部大模型 API 边界", layer: 6 },
    { component: "Nodes(macOS / iOS / Android / 无头服务器)", role: "节点设备 — 工具执行宿主", layer: 7 },
    { component: "Terminal devices(手机 / 电脑 / IoT)", role: "最终用户硬件", layer: 7 },
    { component: "Host FS", role: "宿主文件系统 — 文件 / 凭证读写", layer: 7 },
    { component: "External tools(OAuth / SaaS)", role: "外部服务调用 — 与 L7 同级 actuator", layer: 7 },
    { component: "External data(邮件 / 网页)", role: "外部数据抓取 — 间接注入入口", layer: 7 },
    { component: "Canvas / A2UI(:18793)", role: "可视化工作区 — 跨层 UX 组件", layer: 0 },
  ],

  // 4 层防御
  layers: [
    { id: "pre", name: "事前准入", short: "事前", color: "#185FA5" },
    { id: "in", name: "事中拦截", short: "事中", color: "#854F0B" },
    { id: "post", name: "事后运营", short: "事后", color: "#3B6D11" },
    { id: "cross", name: "跨智能体", short: "跨", color: "#A32D2D" },
  ],

  // CIK 三维(可验证性)
  // 注:id/name/desc 字段被 skeleton-A.html 矩阵渲染使用,不可改名或删除
  cik: [
    { id: "C", name: "Capability", desc: "能力 / 工具 / 权限",
      cn: "能力",
      color: "#185FA5",
      bg: "#E6F1FB",
      coreQuestion: "智能体能做什么?它的工具调用是否在被授权的意图范围内?",
      insight: "C 是行动层 —— 被攻破等于「智能体替攻击者干活」",
      layers: {
        pre:   { threats: "恶意 Skill 上架、工具供应链投毒、依赖污染",
                 protection: "Skill 静态/动态扫描、签名验证、AI BoM",
                 metric: "检出率 ≥ 99% / 误报 ≤ 2%" },
        in:    { threats: "越权工具调用、参数注入、工具链组合攻击、合法工具误用",
                 protection: "三层能力模型(工具/参数/上下文)、AEGIS 预执行防火墙、CaMeL capability 凭证",
                 metric: "拦截率 ≥ 99% / p99 ≤ 10ms" },
        post:  { threats: "Skill 静默变更、CVE 滞后响应、能力漂移",
                 protection: "Skill 使用画像、变更追踪、CVE feed 监听",
                 metric: "检出延迟 < 1 小时" },
        cross: { threats: "子智能体继承恶意 Skill、技能扩散",
                 protection: "派生时重新扫描、级联吊销",
                 metric: "100% 派生扫描覆盖" },
      },
    },
    { id: "I", name: "Identity", desc: "身份 / 信任 / 凭证",
      cn: "身份",
      color: "#854F0B",
      bg: "#FAEEDA",
      coreQuestion: "谁在做、对谁说话?智能体身份、用户授权、智能体间信任是否真实?",
      insight: "I 是信任层 —— 被攻破等于「任何后续验证都基于错的前提」",
      layers: {
        pre:   { threats: "系统提示词篡改、人格配置注入、未授权部署、DID 伪造注册",
                 protection: "身份配置基线哈希、部署管线 4 眼审核、DID 签名",
                 metric: "篡改阻断 100% / 检测延迟 < 1s" },
        in:    { threats: "Token 盗用、Ring 越级、身份切换提权、SSRF→Token→Exec 链",
                 protection: "Token 验证、Ring 0-3 隔离、动态权限升降级",
                 metric: "RCE 链阻断率 100%" },
        post:  { threats: "身份异常使用(夜间高频调用、跨租户访问、调用从未使用的 Skill)",
                 protection: "行为基线检测、Trust Decay 信任评分",
                 metric: "异常检出 ≥ 95% / 告警 ≤ 5min" },
        cross: { threats: "Agent Impersonation、消息伪造、重放攻击",
                 protection: "DID + Inter-Agent Trust Protocol、消息签名 + nonce + 时间戳",
                 metric: "伪造消息拒绝 100%" },
      },
    },
    { id: "K", name: "Knowledge", desc: "知识 / 上下文 / 记忆",
      cn: "知识",
      color: "#3B6D11",
      bg: "#EAF3DE",
      coreQuestion: "智能体看到了什么?上下文 / 记忆 / RAG 知识库的内容是否可信?",
      insight: "K 是输入层 —— 被污染则 C/I 的所有验证可能在错的前提下做出'正确'决策(§8.6 邮件助手案例)",
      layers: {
        pre:   { threats: "记忆基线篡改、启动引导文件投毒、知识库索引污染",
                 protection: "记忆文件哈希校验、知识库版本签名",
                 metric: "篡改启动拒绝 100%" },
        in:    { threats: "直接/间接提示词注入、RAG 投毒、上下文操纵",
                 protection: "上下文扫描、内容防火墙、CaMeL 数据流 taint 追踪",
                 metric: "直接 ≥ 99% / 间接 ≥ 95%" },
        post:  { threats: "记忆投毒(慢速漂移)、长期上下文中毒",
                 protection: "记忆硬化 + 漂移检测、§7.4.2 写入前/召回时双重语义校验",
                 metric: "ASR 压回基线水平(R12 数据 40-80% → ≤ 40%)" },
        cross: { threats: "共享知识库污染、Crescendo 多轮越狱",
                 protection: "知识库更新审计、轨迹级语义分析",
                 metric: "Crescendo 检出 ≥ 80%" },
      },
    },
  ],

  // CIK 三维的关键关系数据(用于 CIK tab 顶部 + 详情区)
  cikInsights: {
    asrFinding: {
      source: "R9 arXiv:2604.04759 实证",
      content: "单一 CIK 维度被攻破,ASR 即从 24.6% 跃升至 64-74% —— 三维互不替代,必须独立验证",
    },
    typicalKill: {
      title: "K → I → C 的级联攻击链",
      desc: "K 维度污染 → I 维度信任滥用 → C 维度合法工具的恶意调用。单看每步都合规,合起来是灾难。§8.6 邮件助手案例就是这条链。",
    },
    camelByDesign: {
      title: "CaMeL by-design 的反向印证",
      desc: "CaMeL(R22)的核心思想正是「强制 K 不能影响 C」—— 这正是 CIK 三维独立性的反向印证。",
    },
  },

  // 12 攻击面(摘自 v2 §2.2.2)
  // layerIds:对应 7 层架构(单层/多层/[0]=超越架构)
  surfaces: [
    { id: "S1", name: "通道输入接口", short: "通道输入", layerIds: [1],
      desc: "外部消息平台(Telegram/Slack/Web)与智能体的交互边界",
      threat: "身份冒用、恶意注入、文件携带恶意代码、Webhook 认证缺失" },
    { id: "S2", name: "插件与技能分发", short: "技能分发", layerIds: [3],
      desc: "从市场或本地目录安装技能,已有 23,000+ Skill 在野",
      threat: "恶意 Skill 上架、后门与隐蔽 Prompt 注入、版本篡改、依赖污染" },
    { id: "S3", name: "智能体上下文窗口", short: "上下文窗口", layerIds: [4, 5],
      desc: "LLM 处理的一切:提示词、技能文件、会话历史、长期记忆",
      threat: "直接/间接提示词注入、记忆文件投毒、对抗性 Token 操纵" },
    { id: "S4", name: "网关 API 接口", short: "网关 API", layerIds: [2],
      desc: "中央控制平面,所有组件的信任代理",
      threat: "WebSocket 认证绕过、SSRF、Token 泄露、全局级权限提升" },
    { id: "S5", name: "工具调度接口", short: "工具调度", layerIds: [4, 7],
      desc: "Agent 决策与工具执行之间的桥梁",
      threat: "参数篡改、工具链组合攻击、未授权调用、信任利用" },
    { id: "S6", name: "执行策略引擎", short: "策略引擎", layerIds: [7],
      desc: "命令允许列表管线,基于词法匹配的安全决策",
      threat: "三种独立绕过:行续接符、busybox 多路复用、GNU 长选项缩写" },
    { id: "S7", name: "容器边界", short: "容器", layerIds: [7],
      desc: "Docker 沙箱配置,隔离强度取决于底层运行时",
      threat: "沙箱配置注入、容器边界突破、隔离失效" },
    { id: "S8", name: "宿主操作系统接口", short: "宿主 OS", layerIds: [7],
      desc: "Shell、文件系统、网络栈 —— 攻击的最终目标",
      threat: "任意命令执行、数据外泄、持久化控制、横向移动" },
    { id: "S9", name: "LLM 提供方接口", short: "LLM 接口", layerIds: [6],
      desc: "模型 API 边界,连接智能体与大模型服务",
      threat: "模型响应篡改、API 密钥泄露、中间人攻击" },
    { id: "S10", name: "智能体间通信", short: "智能体通信", layerIds: [2, 4],
      desc: "多智能体协同场景的通信通道",
      threat: "智能体注入、智能体冒充、消息伪造、跨智能体渐进越狱、数据溯源丢失" },
    { id: "S11", name: "智能体部署管线", short: "部署管线", layerIds: [0],
      desc: "新智能体的创建、配置和上线流程",
      threat: "供应链投毒:在部署管线中植入后门,所有后续部署的智能体继承恶意指令" },
    { id: "S12", name: "智能体流程与决策逻辑", short: "流程决策", layerIds: [0],
      desc: "智能体执行流程的顺序、分支、终止条件",
      threat: "流程操纵(提前终止/重定向/跳过安全控制)、过度代理权、审批疲劳攻击" },
  ],

  // 示例方案及其覆盖
  // coverage[layer.id][cik.id] = 0/0.5/1   用于骨架 A
  // coverageBySurface[layer.id][surface.id] = 0/0.5/1   用于骨架 B
  // 0=无 / 0.5=部分 / 1=核心
  schemes: [
    {
      id: "AEGIS",
      name: "AEGIS",
      desc: "预执行防火墙 + 防篡改审计链(arXiv:2603.12621)",
      color: "#185FA5",
      bg: "#E6F1FB",
      author: "Yuan A., Su Z., Zhao Y.(2026)",
      paper: "arXiv:2603.12621",
      github: "https://github.com/Justin0504/Aegis",
      coreProblem: "工具调用前的内容扫描 + 三阶段管线(深度提取 → 内容扫描 → 策略验证),配 Ed25519 + SHA-256 防篡改审计链。48 攻击实例 100% 拦截、p99 ≤ 10ms。",
      // 骨架 A:层 × CIK   (基于 v2 §11.4.1 + §11.5.1 校准)
      coverageA: {
        "in/C": 1,      // 预执行防火墙 = C-In 旗舰
        "in/K": 1,      // 三阶段管线深度提取 + 内容扫描 = K-In 主功能
        "in/I": 0.5,    // 防火墙顺带 Token/身份过滤,非主战场
        "post/K": 1,    // 防篡改审计链 = K-Post 重点
        "post/C": 0.5,  // 审计链记录工具变更
        "post/I": 0.5,  // 审计链记录身份事件
      },
      coverageB: {
        // TODO: 骨架 B 数据待校准(若启用)
        "in/S3": 1, "in/S5": 1, "in/S6": 1, "in/S8": 0.5,
        "post/S5": 1, "post/S8": 0.5,
      },
    },
    {
      id: "AGT",
      name: "Microsoft AGT",
      desc: "Agent OS 策略引擎 + Mesh + Compliance + SRE",
      color: "#854F0B",
      bg: "#FAEEDA",
      author: "Microsoft(2026)",
      paper: "—(开源工具,非论文)",
      github: "https://github.com/microsoft/agent-governance-toolkit",
      coreProblem: "用确定性应用层策略执行替代提示词式安全(prompt-based 安全 26.67% 违反率 → 0%)。覆盖 OWASP Agentic Top 10,支持 Python/TS/.NET/Rust/Go,集成 AWS Bedrock / Azure AI / LangChain 等 20+ 框架。",
      // 基于 v2 §11.4.2 (Agent OS) + §11.4.3 (Runtime/Ring) + §11.5.2 (SRE/Trust Decay) + §11.5.3 (Compliance) + §11.5.4 (Mesh/DID/IATP)
      coverageA: {
        "pre/C": 0.5,   // 部署管线策略检查(非 Skill 扫描)
        "pre/I": 0.5,   // Mesh 部署时 DID 注册 = I-Pre 部分
        "in/C": 1,      // Agent OS 策略引擎 = C-In 主战场
        "in/I": 1,      // Runtime Ring 0-3 + 权限升降级 = I-In 主战场
        "post/C": 0.5,  // Compliance 审计涉及 Skill 变更,非主功能
        "post/I": 1,    // SRE Trust Decay = I-Post 旗舰
        "post/K": 0.5,  // Compliance 涉及知识合规
        "cross/C": 0.5, // Mesh 协议层可管制跨智能体能力传递
        "cross/I": 1,   // Mesh DID + IATP = I-Inter 旗舰
      },
      coverageB: {
        // TODO: 骨架 B 数据待校准(若启用)
        "pre/S2": 0.5,
        "in/S5": 1, "in/S6": 1, "in/S4": 1,
        "post/S5": 1, "post/S6": 1,
        "cross/S10": 1, "cross/S11": 0.5,
      },
    },
    {
      id: "DefenseClaw",
      name: "Cisco DefenseClaw",
      desc: "Skill Scanner + 沙箱 + A2A Scanner",
      color: "#3B6D11",
      bg: "#EAF3DE",
      author: "Cisco AI Defense(2026)",
      paper: "—(开源工具,非论文)",
      github: "https://github.com/cisco-ai-defense/defenseclaw",
      coreProblem: "面向 OpenClaw 的企业治理层:Skill 静态/动态扫描 + MCP 服务器验证 + 硬编码凭证检测 + Landlock LSM/seccomp-BPF 内核级沙箱 + 智能体间通信审计。覆盖事前 + 事中 + 事后三层。",
      // 基于 v2 §11.3.1-4 (Scanners + BoM + CodeGuard) + §11.4.4 (沙箱) + §11.5.5 (A2A Scanner)
      coverageA: {
        "pre/C": 1,     // Skill Scanner + AI BoM = C-Pre 主战场
        "pre/I": 0.5,   // CodeGuard 硬编码凭证扫描
        "pre/K": 1,     // MCP Scanner 知识源验证 = K-Pre 主战场
        "in/C": 1,      // 沙箱 (Landlock + seccomp-BPF) = C-In 隔离主功能
        "cross/I": 0.5, // A2A Scanner 通信审计涉及身份
        "cross/K": 0.5, // A2A Scanner 通信内容审计
      },
      coverageB: {
        // TODO: 骨架 B 数据待校准(若启用)
        "pre/S2": 1, "pre/S11": 1, "pre/S9": 0.5,
        "in/S7": 1, "in/S8": 1,
        "cross/S10": 0.5,
      },
    },
    {
      id: "Knownsec",
      name: "Knownsec(R18)",
      desc: "OpenClaw 安全实践指南 + CVE 漏洞情报订阅",
      color: "#0E7490",
      bg: "#CFFAFE",
      author: "知道创宇 Knownsec(2026)",
      paper: "—(开源工具,非论文)",
      github: "https://github.com/knownsec/openclaw-security",
      coreProblem: "面向 OpenClaw 全生命周期安全实践:CVE 漏洞数据库订阅(RSS/webhook)+ 自动化审计脚本(openclaw_security_audit.py)+ OpenClaw 安全配置指南。GitHub Advisory Database 已收录 245 个相关漏洞,本工具是企业 SIEM 的 CVE feed 来源。",
      // 基于 v2 §11.3.7 (CVE feed 事前归类) + §11.6.2 PO5 节点(实际生效在事后)+ R18 README(audit script + 实践指南)
      coverageA: {
        "pre/C": 0.5,   // 部署前查 CVE,选择无漏洞版本的 Skill
        "pre/K": 0.5,   // 安全实践指南 = 知识基线参考
        "post/C": 1,    // CVE 影响时 = Skill 变更追踪 + CVE 响应主战场
        "post/K": 1,    // CVE feed 持续更新 = 知识情报事后审计核心
      },
      coverageB: {
        // TODO: 骨架 B 数据待校准(若启用)
      },
    },
    {
      id: "CaMeL",
      name: "CaMeL(R22)",
      desc: "Capability 凭证 + 控制流/数据流分离(by-design 研究工件)",
      color: "#A32D2D",
      bg: "#FCEBEB",
      author: "Debenedetti E., Shumailov I., Carlini N., Tramèr F. 等 — Google DeepMind / ETH Zurich(2025)",
      paper: "arXiv:2503.18813",
      github: "https://github.com/google-research/camel-prompt-injection",
      coreProblem: "by-design 提示词注入防御:从可信用户查询提取控制流,不可信数据(工具返回值/网页)被打 taint 标记不允许影响控制流。AgentDojo 基准 77% 可证明安全任务完成率。研究工件,不可直接生产部署。",
      // 基于 v2 §11.4.5 (CaMeL 解释器,事中层 by-design 路径)。研究工件性质在 coreProblem 说明,不降低权重。
      coverageA: {
        "in/C": 1,      // Capability 凭证流转 + 工具调用前授权 = C-In 概念创新
        "in/K": 1,      // 控制流/数据流分离 + taint 标记 = K-In 主创新
      },
      coverageB: {
        // TODO: 骨架 B 数据待校准(若启用)
        "in/S3": 1, "in/S5": 0.5,
      },
    },
    {
      id: "AISentinel",
      name: "AI-Sentinel(AI-XDR)",
      desc: "AI 安全监测分析平台 — 流量侧 + 端侧双视角(类比 NDR + EDR)",
      color: "#6B46C1",
      bg: "#EDE9FE",
      author: "企业内部安全产品组(2026)",
      paper: "AI 安全监测分析系统 PRD v1.0",
      github: "—(企业商业产品,暂未开源)",
      coreProblem: "把 NDR(流量观测)+ EDR(端侧响应)方法论延伸到 LLM/Agent 交互层,五大独特能力:① 流量侧全量观测;② 端侧运行时防护;③ Skill 供应链安全扫描;④ 会话级攻击溯源(Kill Chain 还原);⑤ 历史回溯。平台型方案,与 AEGIS/AGT 形成「单体 vs. 平台」互补关系。",
      // 平台型 AI-XDR 覆盖面广:流量侧覆盖 K-In(Prompt Injection / 越狱),端侧覆盖 C-In(运行时拦截 / 策略下发);供应链扫描覆盖 C-Pre;会话溯源覆盖 K-Post / I-Post。
      coverageA: {
        "pre/C": 1,      // Skill 供应链安全扫描 = C-Pre 核心差异化能力
        "pre/I": 0.5,    // 三层身份模型(Agent / Skill / 会话)注册
        "in/C": 1,       // 端侧本地安全内核 + 策略下发 = C-In 主战场
        "in/I": 0.5,     // API Key/Token 泄露检测
        "in/K": 1,       // 流量侧 4 层检测(Prompt Injection / Jailbreak / DLP)= K-In 主战场
        "post/C": 1,     // 工具情报中心 + 调用链审计 = C-Post 主战场
        "post/I": 0.5,   // Agent 资产图谱 + 攻击者画像
        "post/K": 1,     // 历史回溯 + 会话级 Kill Chain 还原 = K-Post 核心
        "cross/C": 0.5,  // 跨 Agent 工具影响分析
        "cross/I": 0.5,  // 跨 Agent 横向移动检测
      },
      coverageB: {
        // TODO: 骨架 B 数据待校准(若启用)
      },
    },
  ],

  // CIK 维度的视觉色(用于骨架 B 的 cell 内小标签)
  cikColors: {
    C: { bg: "#E6F1FB", color: "#185FA5" },
    I: { bg: "#FAEEDA", color: "#854F0B" },
    K: { bg: "#EAF3DE", color: "#3B6D11" },
  },

  // 各层的主导 CIK 维度(改进 2:层主导维度色带)
  // 事前 I/C 双主导,其余单主导
  layerDominance: {
    pre: ["I", "C"],
    in: ["C"],
    post: ["K"],
    cross: ["I"],
  },

  // Cell 权重标记(实时拦截主战场 + 跨层信任锚)
  cellWeights: {
    "in/C":   { tier: "in-frontline", note: "实时拦截主战场" },
    "in/I":   { tier: "in-frontline", note: "实时拦截主战场" },
    "in/K":   { tier: "in-frontline", note: "实时拦截主战场" },
    "cross/I":{ tier: "trust-anchor", note: "跨智能体协作的信任锚" },
  },

  // Cell 描述(选中时展示)
  cellDescriptions: {
    "pre/C":   "Skill 准入扫描 + 扫描器覆盖率",
    "pre/I":   "身份配置基线 + 部署管线审核",
    "pre/K":   "记忆基线预设 + 系统提示词签名",
    "in/C":    "工具调用权限守卫 + 意图对齐",
    "in/I":    "Token 验证 + Ring 隔离 + 篡改检测",
    "in/K":    "上下文扫描 + RAG 注入检测",
    "post/C":  "Skill 使用画像 + 变更追踪",
    "post/I":  "身份异常使用 + 信任评分(Trust Decay)",
    "post/K":  "记忆硬化 + 漂移检测(矩阵核心)",
    "cross/C": "跨智能体技能继承审计",
    "cross/I": "DID + 信任协议 + 冒充检测",
    "cross/K": "跨智能体知识库污染防护",
  },

  // 4 设计原则 + 各原则下的立论(继承 v2 §4.1)
  principles: [
    {
      id: "P1",
      name: "默认零信任",
      en: "Zero Trust by Default",
      question: "信任谁?",
      stance: "谁都不信。LLM、Skill、工具返回值、记忆,全部默认不可信。",
      color: "#185FA5",
      bg: "#E6F1FB",
      sources: "AEGIS R6 + OWASP Least Agency R3 + R2 实践 + DefenseClaw R4",
      tenets: [
        { id: "1.1", title: "LLM 输出默认不可信",
          body: "LLM 作为推理引擎可能因提示词注入、幻觉或被越狱而产出有害工具调用。即使是系统自身推理引擎的产出,也必须经过独立策略验证。这一立场直接来自 AEGIS 威胁模型——把 LLM 视为不可信组件,是整个防护体系的起点。" },
        { id: "1.2", title: "每个工具调用独立验证(No Tool Call Left Unchecked)",
          body: "无论发起者是用户还是系统推理引擎,每次工具调用都经过内容风险扫描和策略验证,不因来源「可信」而豁免。继承自 AEGIS 论文的核心论点:既然 LLM 不可信,那么基于 LLM 输出做出的每一次决策都需要独立的、可审计的外部验证。" },
        { id: "1.3", title: "最小代理权(Least Agency)",
          body: "权限控制回答「能做什么」,代理权回答「能自主决定多少」。二者不可混同:一个拥有只读权限的智能体仍然可能在没有审批的情况下自主发送数百封邮件——如果没有代理权约束,最小权限并不能充分防止伤害。继承自 OWASP ASI:绿色操作自动放行;黄色操作轻量确认;红色操作强制审批(破坏性 / 外联 / 大批量)。" },
        { id: "1.4", title: "高危事前拦截优于事后观测",
          body: "安全控制点位于工具调用的执行路径上,在副作用产生之前完成拦截,且亚毫秒级决策使用户无感。「副作用产生之后再审计」对于智能体场景已经太晚——一个恶意工具调用可能在毫秒级内外泄全部凭证或删除全部数据。AEGIS 工程实践和 DefenseClaw p99 < 0.1ms 基准证明亚毫秒级事前拦截在工程上可行。" },
      ],
    },
    {
      id: "P2",
      name: "统一跨层策略执行",
      en: "Unified Cross-Layer Policy",
      question: "怎么执行?",
      stance: "一个引擎管所有层,消除跨层信任缝隙。",
      color: "#854F0B",
      bg: "#FAEEDA",
      sources: "arXiv:2603.27517 §6 防御讨论 R7 + Microsoft AGT Agent OS R5",
      tenets: [
        { id: "2.1", title: "消除层间信任缝隙",
          body: "结构性缺陷是:每一层都只验证自己的输入,不验证上游是否已验证、不感知下游是否失守。这种去中心化的信任执行是跨层组合攻击的根本原因。R7 §5.4 的三阶段 RCE 链(SSRF→Token 窃取→Exec 绕过)正是利用了网关、Token 管理、执行策略三层之间的信任假设不一致。消除唯一可靠方案:让所有跨层策略决策通过同一个策略引擎,并让每一层的策略判断都能看到全局上下文。" },
        { id: "2.2", title: "语义意图判断而非词法匹配",
          body: "R7 §5.6 证明同一套 exec allowlist 可被三种完全独立的词法技巧绕过:行续接符(\\n)、busybox 多路复用、GNU 长选项缩写。这不是「规则不全」,而是「基于字符串匹配做策略决策」本身的根本缺陷——有限的词法规则无法枚举攻击者的无限创造力。正确方向:策略以「这个操作是否在被允许的意图范围内」的语义判断为基础。" },
        { id: "2.3", title: "统一策略描述语言",
          body: "使用可审计、可版本化、可形式验证的策略语言(OPA Rego / Cedar),而非分散在各服务中的硬编码 if-else。三个好处:审计方读一份权威策略文档而非阅读多套代码;策略变更通过 Git 工作流管理;策略正确性可被形式化证明或模糊测试。" },
      ],
    },
    {
      id: "P3",
      name: "持续性安全运营",
      en: "Continuous Security Ops",
      question: "怎么运营?",
      stance: "安全是活的,不是一次性配置。",
      color: "#3B6D11",
      bg: "#EAF3DE",
      sources: "奇安信五维画像 R1 + Microsoft AGT Trust Decay R5 + CIK R9 + R2 审计实践",
      tenets: [
        { id: "3.1", title: "五维画像运营",
          body: "把安全运营落到五个可持续演进的画像:Skill 运营(全生命周期 + 风险评分)、行为运营(全链路溯源 + Trace ID)、权限运营(最小权限动态调整)、账号/设备画像(关联图谱 + 风险联动)、模型上下文运营(第五维 — 记忆完整性 + 系统提示词漂移 + 知识库更新审计)。第五维直接回应 R9 CIK 中 Knowledge 维度被长期忽视的现实——单是 K 投毒就能使 ASR 从 24.6% 跃升到 64-74%。" },
        { id: "3.2", title: "信任衰减(Trust Decay)",
          body: "信任不是布尔值,而是随行为持续更新的动态评分。一个两周前通过认证但此后从未被重新验证的身份,信任级别应当自动降级。继承自 Microsoft AGT 的 Trust Decay 设计:衰减可由时间触发,也可由异常行为触发(调用从未使用的 Skill、数据访问量突增 300%)。" },
        { id: "3.3", title: "持久状态完整性保护",
          body: "记忆、身份配置、技能库的「静息态」本身就是攻击面。R9 CIK 分类法指出:Capability、Identity、Knowledge 三维中任一维被投毒都能触发 ASR 跃升。持久状态必须有完整性校验——写入时密码学签名,读取时语义完整性对比。" },
      ],
    },
    {
      id: "P4",
      name: "可验证的安全保障",
      en: "Verifiable Security",
      question: "怎么证明有效?",
      stance: "「声称安全」与「证明安全」有本质差距。独立验证系统持续运行。",
      color: "#A32D2D",
      bg: "#FCEBEB",
      sources: "AEGIS 可验证性设计 R6 + R7 组合链分析 + R8 基准 + CIK R9",
      tenets: [
        { id: "4.1", title: "持续验证 > 一次性审计",
          body: "一次性渗透测试的结论仅对测试当天的系统配置成立;第二天一个 Skill 更新、一条策略调整、一个新智能体上线,结论就不再成立。验证必须是持续的——独立验证系统以只读方式观测整个防护体系,周期性注入标准化攻击载荷、收集决策日志、输出合规报告。验证系统本身由密码学签名和时间戳权威保护,不可被被验证系统篡改。" },
        { id: "4.2", title: "每个防护模块有明确的验证接口",
          body: "验证系统与防护系统的耦合仅限四个标准化接口:① 攻击载荷注入接口(标准化攻击用例输入格式)② 防护决策观测接口(allow/block/pending 决策日志查询 API)③ 审计链校验接口(哈希链完整性批量校验 API)④ 合规报告导出接口(签名证明的生成与验证 API)。这使得「验证团队」可以独立于「防护团队」工作。Schema 定义见 Ch6/附录。" },
        { id: "4.3", title: "攻击链整体评估",
          body: "不仅评估单个漏洞的防护情况,还要沿攻击面 × 对抗技术二维矩阵检查漏洞间的组合关系。R7 §5.4 证明三个单独看都只是「中等」的漏洞,组合起来构成未认证 RCE 链——这种系统性脆弱只能通过攻击链层面的评估发现。Ch6 的 CIK × 四层 二维矩阵正是针对这一需求设计。" },
      ],
    },
  ],

  // 工程约束(非原则,但必须兼顾)
  engineeringConstraints: [
    { name: "安全可组合性",
      desc: "防护模块独立部署、渐进采用。小型部署仅启用事前准入层;中型部署增加事中拦截;大型部署启用全部四层。继承自 Microsoft AGT 的七包架构理念。" },
    { name: "低摩擦运营",
      desc: "安全机制对正常业务尽量无感。亚毫秒级决策让用户无法感知策略检查;绿色操作自动放行让日常工作流零中断;审批流只对红色操作触发。继承自 R2 SlowMist 的「Zero-friction daily operations」实践——本项目用「低摩擦」而非「零摩擦」,因为审批永远存在摩擦,语义更精确。R2 实践:90% 自动放行换 10% 强制审批,资源集中在真正高危的操作上。" },
  ],

  // 工具链全景(沿用 v2 §11)
  toolchain: [
    {
      id: "evaluation",
      name: "类别一 · 安全评估工具",
      desc: "用于验证防护体系有效性的测试工具和基准",
      color: "#185FA5",
      bg: "#E6F1FB",
      tools: [
        { id: "R14", name: "ZeroShot",            short: "145 载荷 × 12 类攻击,多框架黑盒评估,OWASP 合规基线",          link: "https://0eroshot.com/" },
        { id: "R6",  name: "AEGIS 48 攻击实例集", short: "标准化预执行防火墙验证载荷,48 攻击 100% 拦截基线",            link: "https://github.com/Justin0504/Aegis" },
        { id: "R8",  name: "arXiv 2604.03131 基准", short: "205 用例 × 13 类 MITRE 威胁,6 框架横向评估",                link: "https://arxiv.org/abs/2604.03131" },
        { id: "R9",  name: "CIK-Bench",            short: "12 场景 × 4 模型,真实环境 (Gmail/Stripe/FS)",                link: "https://arxiv.org/abs/2604.04759" },
        { id: "R15", name: "1Password SCAM",       short: "安全认知感知度量,钓鱼 / 凭证窃取 / 社工",                    link: "https://github.com/1Password/SCAM" },
        { id: "R11", name: "PASB",                 short: "个性化 Agent 安全评估,端到端黑盒",                            link: "https://arxiv.org/abs/2602.08412" },
        { id: "R10", name: "ClawSafety 基准",     short: "120 用例 × 三维对抗,arXiv:2604.01438",                       link: "https://arxiv.org/abs/2604.01438" },
        { id: "R22", name: "AgentDojo",            short: "形式化可证明安全 + 多环境沙盒(workspace/banking/slack/travel),NeurIPS 2024", link: "https://github.com/ethz-spylab/agentdojo" },
        { id: "R19", name: "PinchBench(功能对照)", short: "53 真实任务功能基线,验证「安全加固不伤害功能」",             link: "https://github.com/pinchbench/skill" },
      ],
    },
    {
      id: "preventive",
      name: "类别二 · 事前防护工具",
      desc: "供应链扫描、准入控制、资产管理",
      color: "#854F0B",
      bg: "#FAEEDA",
      tools: [
        { id: "R4",  name: "DefenseClaw Skill Scanner", short: "Agent 技能静态 + 动态分析 (Cisco)",                      link: "https://github.com/cisco-ai-defense/defenseclaw" },
        { id: "R4",  name: "DefenseClaw MCP Scanner",   short: "MCP 服务器验证,描述符注入检测",                          link: "https://github.com/cisco-ai-defense/defenseclaw" },
        { id: "R4",  name: "DefenseClaw CodeGuard",     short: "硬编码凭证 + Agent 生成代码反模式扫描",                  link: "https://github.com/cisco-ai-defense/defenseclaw" },
        { id: "R4",  name: "DefenseClaw AI BoM",        short: "AI 资产清单 + 供应链溯源,CVE 反向定位",                  link: "https://github.com/cisco-ai-defense/defenseclaw" },
        { id: "R16", name: "ClawSafety Scanner (Rust)", short: "Rust 高性能 CI 内联扫描,3-5× Python 速度",              link: "https://github.com/relaxcloud-cn/clawsafety" },
        { id: "R17", name: "ClawSec (Prompt Security)", short: "SOUL.md / 系统提示词漂移检测,语义差异对比",              link: "https://github.com/prompt-security/clawsec" },
        { id: "R18", name: "Knownsec OpenClaw Security",short: "CVE 漏洞数据库订阅 + 自动化审计脚本 + 安全实践指南",      link: "https://github.com/knownsec/openclaw-security" },
      ],
    },
    {
      id: "in-flight",
      name: "类别三 · 事中防护工具",
      desc: "运行时拦截、策略执行、沙箱隔离",
      color: "#3B6D11",
      bg: "#EAF3DE",
      tools: [
        { id: "R6",  name: "AEGIS 预执行防火墙",         short: "三阶段管线(深度提取→内容扫描→策略验证),中位 8.3ms,48 实例 100% 拦截", link: "https://github.com/Justin0504/Aegis" },
        { id: "R5",  name: "AGT Agent OS",                short: "亚毫秒级(p99 < 0.1ms)策略引擎,OPA Rego / Cedar",       link: "https://github.com/microsoft/agent-governance-toolkit" },
        { id: "R5",  name: "AGT Agent Runtime",           short: "Ring 0-3 隔离 + 动态权限升降级 + 熔断器",                link: "https://github.com/microsoft/agent-governance-toolkit" },
        { id: "R4",  name: "DefenseClaw 沙箱",            short: "Landlock LSM + seccomp-BPF 内核级 MAC 控制",            link: "https://github.com/cisco-ai-defense/defenseclaw" },
        { id: "R22", name: "CaMeL 解释器(设计参考)",   short: "by-design 路径:Capability 凭证流转 + 控制流/数据流分离 + taint 追踪。研究工件,不可生产部署", link: "https://github.com/google-research/camel-prompt-injection" },
      ],
    },
    {
      id: "post-op",
      name: "类别四 · 事后防护工具",
      desc: "审计、监控、合规、跨智能体通信安全",
      color: "#A32D2D",
      bg: "#FCEBEB",
      tools: [
        { id: "R6",  name: "AEGIS 防篡改审计链",         short: "Ed25519 + SHA-256 哈希链,篡改检出率 100%",              link: "https://github.com/Justin0504/Aegis" },
        { id: "R5",  name: "AGT Agent SRE",               short: "运行时可靠性 + Trust Decay + Prometheus / Grafana 集成",link: "https://github.com/microsoft/agent-governance-toolkit" },
        { id: "R5",  name: "AGT Agent Compliance",        short: "OWASP ASI / EU AI Act / HIPAA / SOC 2 自动化合规验证",  link: "https://github.com/microsoft/agent-governance-toolkit" },
        { id: "R5",  name: "AGT Agent Mesh",              short: "多智能体身份信任协议 DID + Ed25519 + IATP + mTLS",      link: "https://github.com/microsoft/agent-governance-toolkit" },
        { id: "R4",  name: "DefenseClaw A2A Scanner",     short: "智能体间通信深度审计 + 拓扑分析",                        link: "https://github.com/cisco-ai-defense/defenseclaw" },
        { id: "R20", name: "OpenClaw CVE Tracker",        short: "63 天 138 CVE 持续追踪,RSS / webhook 实时订阅",          link: "https://github.com/jgamblin/OpenClawCVEs" },
        { id: "—",   name: "Splunk HEC + OTLP",           short: "企业 SIEM 集成端点,跨系统威胁关联",                      link: "https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector" },
      ],
    },
  ],

  // 12 攻击面在 (层 × CIK) 上的归属(用于攻击面双向链接)
  // 每个 surface 关联到一组 cells(layer/cik)
  surfaceToCells: {
    S1: ["pre/I", "in/I", "post/I"],          // 通道输入 → 含 I-Post 异常画像
    S2: ["pre/C", "pre/K"],
    S3: ["in/K", "post/K"],
    S4: ["pre/I", "in/I", "post/I"],          // 网关 API → 含 I-Post Token 使用模式
    S5: ["in/C", "post/C"],
    S6: ["in/C"],
    S7: ["in/C"],
    S8: ["in/C", "post/C"],
    S9: ["pre/K", "in/K"],
    S10: ["cross/I", "cross/K"],
    S11: ["pre/C", "cross/I"],
    S12: ["in/C", "cross/C", "post/I"],       // 流程决策 → 含 I-Post 决策身份审计
  },
};
