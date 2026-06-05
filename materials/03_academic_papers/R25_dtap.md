# R25 — DecodingTrust-Agent Platform (DTap):大规模可控红队测试平台

> **Source (paper)**: https://arxiv.org/abs/2605.04808
> **Source (platform)**: https://decodingtrust-agent.com
> **Source (code)**: **https://github.com/AI-secure/DecodingTrust-Agent**(2026-05 已开源,Apache-2.0)
> **Local PDF**: `materials/03_academic_papers/R25_dtap_2605.04808.pdf`(40.2 MB / 279 页 / 148 figures)
> **License**: **Apache-2.0**(以 GitHub LICENSE 文件为准;平台首页写 MIT 系文档不一致)
> **Type**: 学术论文 + 完整开源工程实现(Docker 化仿真环境 + 红队 agent + benchmark dataset + verifiable judge)
> **Fetched at**: 2026-05-10(摘要 + PDF + 仓库核查)

---

## 一、元信息

- **作者**(17 位,12 位 Core Contributors 标星):Zhaorun Chen*, Xun Liu*, Haibo Tong*, Chengquan Guo*, Yuzhou Nie*, Jiawei Zhang*, Mintong Kang*, Chejian Xu*, Qichang Liu*, Xiaogeng Liu*, Tianneng Shi*, Chaowei Xiao, Sanmi Koyejo, **Percy Liang**, Wenbo Guo, **Dawn Song**, **Bo Li**
- **通讯作者**:Zhaorun Chen(zhaorun@uchicago.edu)/ Bo Li(boli@virtueai.com)
- **机构**(7 家):Virtue AI(Bo Li 商业化)/ University of Chicago / UIUC / UC Santa Barbara / Johns Hopkins / UC Berkeley(Dawn Song)/ Stanford(Percy Liang, Sanmi Koyejo)
- **arXiv ID**:2605.04808
- **学科**:cs.AI
- **提交日期**:2026-05-06(v1)
- **篇幅**:**279 页 / 148 figures**(平台手册 + 论文合体形态)
- **核心问题**:智能体安全评估缺乏「真实、可控、可复现」的大规模评测环境;现有基准要么场景单一(单仿真域)要么手工构造规模有限。

---

## 二、核心贡献 — 三件套

DTap 是一个**平台 + 自主红队 + 数据集**的工件三件套,目标是把"红队测试"从手工脚本规模化为可工程化的持续评估流水线。

### 2.1 DTap 平台

> "the first controllable and interactive red-teaming platform for AI agents, spanning 14 real-world domains and over 50 simulation environments that replicate widely used systems such as Google Workspace, Paypal, and Slack"

- **14 个真实领域**:覆盖办公、金融、协作、电商等场景
- **50+ 仿真环境**:Google Workspace、PayPal、Slack 等主流系统的可控复刻
- **可控可复现**:每次红队任务在仿真环境中独立运行,结果可比对、可审计

工程意义:把 R23 AgentDojo 的"4 套件 workspace/banking/slack/travel"形态扩张到一个数量级,且更贴近真实生产工作流。

### 2.2 DTap-Red — 自主红队 agent

> "the first autonomous red-teaming agent that systematically explores diverse injection vectors (e.g., prompt, tool, skill, environment, combinations) and autonomously discovers effective attack strategies tailored to varying malicious goals"

5 类 injection 向量(与 framework 的攻击面 + 对抗技术映射):

| DTap 向量 | framework 对应 | 章节 |
|--|--|--|
| **prompt** | AT4 上下文操纵 / S1 通道输入 + S3 上下文窗口 | 第 5 章 §5.1.4 |
| **tool** | AT5 供应链信任 + AT6 工具滥用 / S2 + S5 + S7 | 第 5 章 §5.1.5–6 |
| **skill** | AT5 / S2 技能分发 + S11 部署管线 | 第 5 章 §5.1.5 |
| **environment** | AT4(间接注入)/ S3 + S4 网关 API | 第 5 章 §5.1.4 |
| **combinations** | **AT3 跨层组合**(R7 SSRF→Token→Exec 链同款) | 第 5 章 §5.1.3 + 第 10 章 §10.2 |

工程意义:这是当前生态首个把"自主红队"实现为 agent 而非脚本集合的工件,与 framework 第 7 章 §7.4 红蓝对抗验证框架直接对接 — 它能持续生成新载荷,不依赖训练集泄漏。

### 2.3 DTap-Bench 数据集

数据集分类组装,各部分规模(从 PDF 实文确认):

- **335 个良性工作流任务**(benign workflow tasks,跨多 domain)
- **160 个良性测试用例**(benign task instances,组织为 6 类 customer 业务)
- **165 个红队攻击用例**(red-teaming instances,在特定威胁模型下)
- **330 个其他类别良性 instances**(在另一类别下构造)
- 每条用例配 **verifiable judge**(根据对应 security policy 自动验证攻击是否成功)
- 数据生成机制:**persona-based synthesis pipeline** — 通过采样多样化 user persona 生成初始任务条件,再用 DTap-Red 自主迭代攻击优化

工程价值:解决了 framework 第 7 章 §7.3 测试库面临的"误报 / 漏报判定靠人工"问题。verifiable judge 是 framework §7.5 接口一·评估请求接口的工程参考。

---

## 三、与 v3 framework 的对接点

DTap 在 framework 上的"防护形状"不是防御方而是**评估方** — 它是 framework 第 7 章可验证性体系的新一代基准来源。三处直接对接:

### 3.1 第 7 章 §7.3 测试库扩展(主对接点)

当前 framework 8 测试集合中:
- **R8 OpenClaw 系统性评估**(205 用例)
- **R23 AgentDojo**(4 套件,77% 可证明安全率基准)

DTap-Bench 与 R8/R23 形成**渐进式三档**:R8 提供单 agent 微观用例(205 测试),R23 提供 4 套件中等规模沙盒(workspace/banking/slack/travel),DTap 提供 50+ 环境工业级红队基准(990+ instances 跨 14 domain)。下版第 7 章 §7.3 应将 DTap-Bench 作为第 9 个测试集合纳入。

**DTap 论文对 AgentDojo 的明确超越声明**(论文原文,工程意义):
- "AgentDojo [18] and AgentHarm [6] lack dynamic environments and rely on static..."
- "AgentDojo [18] focuses on unrealistic tool-output injections by directly..."
- "Dynamic and Stateful Interactions: unlike static benchmarks such as AgentDojo..."

即 DTap 在动态性、有状态性、真实环境三个维度上对 AgentDojo 形成代际超越 — 这是把"3 档基准"作为渐进式工程演进的直接论据。

### 3.2 第 7 章 §7.4 红蓝对抗验证框架(自主红队范式)

framework 当前对红蓝对抗的工程要点定义为「红方独立 + 自动化执行 + 结论可量化」三条。DTap-Red 给出了"红方独立 + 自动化"如何工程化的具体范式:

- 红方独立 → DTap-Red 的攻击策略生成不依赖蓝方策略库
- 自动化执行 → 在 50+ 仿真环境中并行运行
- 结论可量化 → DTap-Bench 的 verifiable judge 输出三元结果

下版 §7.4 应增补「自主红队 agent 范式」段落,引用 DTap-Red 作为工程参考。

### 3.3 第 5 章 §5.1 7 类对抗技术(载荷扩充)

DTap 的 5 类 injection 向量与 framework 7 类对抗技术不是替代关系而是**正交映射**:framework 按"攻击者技术分类"组织(身份欺骗 / 策略绕过 / 跨层组合等),DTap 按"载荷植入位置"组织(prompt / tool / skill / environment / combinations)。两者结合可以给每类 AT 提供更细的载荷分类。

特别注意:DTap 的 **combinations**(组合向量)与 framework AT3 跨层组合 + 第 10 章 §10.2 SSRF→Token→Exec 案例完全契合 — DTap 提供了把这类组合攻击规模化复现的工程基础。

### 3.4 第 8 章 §8.6 cross/K 产业空白

PDF 核查后(从仿真环境清单):DTap **覆盖共享业务平台**(Google Drive / Google Sheets / Slack / GitHub / GitLab / Atlassian / Snowflake / PayPal 等),这些是 cross/K(共享 RAG 知识库 / 跨 agent 信息流)的天然场景。论文区分 **indirect threat model**(攻击者通过环境注入间接影响 agent)与 **direct threat model**(攻击者直接以用户身份作恶),前者正是 cross/K 单元格上的核心威胁形态。

下版 framework §8.6.3 自研建议三可由"推动 R23 AgentDojo 类基准扩展共享知识库场景"升级为"DTap-Bench 已在 indirect threat model 下提供这类场景,需要的是把 DTap 评估结果按 cross/K 视角再分析"。

### 3.5 第 4 章 §4.4 信任流分析(新对接点)

PDF 核查后新发现:DTap 区分 **indirect threat model + direct threat model** 两种威胁模型,与 framework 第 4 章 §4.4 信任流分析的"工具返回值不可信"立论高度契合。下版第 4 章 §4.4 可引用 R25 作为"两种威胁模型分类"的工程证据来源(此前 framework 是按 7 类对抗技术 AT 和 6 阶段 Kill Chain 组织,缺少更宏观的"二分威胁模型"视角)。

---

## 四、与已知 baseline 的关系

| 关系类型 | 同类工件 | 对比要点 |
|--|--|--|
| **直接前身** | R23 AgentDojo | DTap 是 AgentDojo 思路的规模化升级:从 4 套件 → 50+ 环境;从静态用例 → 自主红队 agent 动态生成 |
| **同类基准** | R8 OpenClaw 205 用例 | R8 微观,DTap 工业级;两者覆盖粒度互补 |
| **互补关系** | R6 AEGIS 48 实例集 | AEGIS 用于事中防火墙的回归基准,DTap 用于全栈红蓝对抗 |
| **共同源系** | DecodingTrust(NeurIPS 2023)| 同 Bo Li / Dawn Song 团队的延续工作,从 LLM 评估扩展到 agent 评估 |

---

## 五、入库建议

### 编号与归档位置

- **R 编号**:**R25**(R24 已留给 AARM v1)
- **归档目录**:`materials/03_academic_papers/`(论文身份优先,与 R23 AgentDojo 同目录)
- **PDF 文件**:暂未下载;若版权许可,放 `materials/03_academic_papers/R25_dtap_2605.04808.pdf`(279 页注意体积,需评估)

### 在下版 framework 中的集成动作

1. **第 2 章 §2.1 总览表**:R25 DecodingTrust-Agent Platform / 学术论文(平台型)/ 第 5 章 §5.1 + 第 7 章 §7.3 §7.4 + 第 8 章 §8.6
2. **第 5 章 §5.1**:在 7 类对抗技术开篇加一段说明 5 向量 × 7 AT 的正交映射,引用 R25 作为载荷分类的工程依据
3. **第 7 章 §7.3**:加为第 9 个测试集合(R23 AgentDojo 之后),给出"3 档基准"(R8 / R23 / R25)的工程定位
4. **第 7 章 §7.4**:增补「自主红队 agent 范式」段落,引用 DTap-Red
5. **第 10 章 §10.6**:案例运营复现章节增补"DTap-Red 可作为长期红队基准"的工程建议
6. **附录 B §B.1**:测试库索引追加 R25 一行(用例数 / 覆盖 cell / 接入方式 待 PDF 核查)
7. **附录 C 引用矩阵**:R25 行,核心引用 = 第 5 章 + 第 7 章(●★)+ 第 10 章 §10.6(●)

---

## 六、PDF 核查后的关键事实(2026-05-10)

下载完整 PDF 后核查的事项,**1-6 项已确认**,仅余 1 项待深读(读完论文实验章节):

1. ✅ **PDF 全文已下载**:`R25_dtap_2605.04808.pdf`(40.2 MB / 279 页 / 148 figs / Title 与 metadata 字节级一致)
2. ✅ **DTap-Bench 规模**:总 990+ instances(335 + 160 + 165 + 330 分类组装),覆盖 14 真实 domain
3. ✅ **平台开源 URL**:https://decodingtrust-agent.com(论文文末明确开源)
4. ⏳ **License 字段**:论文前 30 页未明示;以 decodingtrust-agent.com 平台标注为准(待访问)
5. ✅ **是否覆盖跨智能体场景**:**是**。50+ 仿真环境含 Google Workspace / Slack / GitHub / Google Drive / Atlassian / Snowflake 等多用户 + 共享数据场景;论文明确区分 indirect / direct 两种威胁模型,前者是跨 agent 注入的核心
6. ✅ **机构归属**:7 家(Virtue AI / U Chicago / UIUC / UC Santa Barbara / Johns Hopkins / UC Berkeley / Stanford)
7. ⏳ **DTap-Bench 的 judge 实现机制**:论文确认每条用例配 verifiable judge,但 judge 内部实现细节(rule-based / LLM-based / hybrid)需读论文 §3 §5 章节

## 七、PDF 核查带来的额外发现

读 PDF 首 15 页 + 全文 grep 后,补充以下信息(原 v1 笔记未覆盖):

### 7.1 受测 agent 框架(50+ 环境的 agent backbone)

DTap 评估覆盖**主流 agentic 框架**:
- OpenClaw(本书 framework 的核心案例对象)
- Claude Code
- Google ADK
- OpenAI Agents SDK
- Claude Cowork
- LangChain Agents
- 其他 agentic frameworks

**评估的 backbone 模型**:GPT-5.5 / Gemini-3-Pro / Claude-Sonnet-4.5(closed-source)+ DeepSeek-V4-Pro(open-source 代表)

### 7.2 关键发现(摘自论文实文)

> "Open-source agent backbones are more susceptible to direct misuse. Agents built on open-source models such as DeepSeek-V4-Pro exhibit the highest ASR under the direct threat model"

> "OpenClaw with open-source backbones such as DeepSeek-V4-Pro exhibits strong instruction-following (83.3% BSR)"

工程意义:**开源 backbone 在 direct threat model(用户主动作恶)下显著更脆弱**,这一发现给 framework 第 9 章 §9.1.3 大型部署的 backbone 选型决策树提供了实证依据 — 高敏感链路应优先用 closed-source backbone 或同时增强事中拦截层。

### 7.3 危害分类(verifiable judge 的 8+ 类)

论文 §3 / §5 列出的危害类别:
- Financial Fraud(金融欺诈)
- Unsafe Content(不安全内容)
- Data Exfiltration(数据外泄)
- Copyright / IP Infringement(版权 / 知识产权侵权)
- Phishing(钓鱼)
- Malware & similar malicious content(恶意软件)
- Spam & bulk mail(垃圾邮件)
- Child safety(儿童安全)
- Sensitive content / Private information / regulated goods or services(其他规制内容)

这一分类**与 OWASP ASI(R3)、MITRE ATT&CK、Microsoft AIRT(R12)**形成第四套独立分类体系。下版第 5 章 §5.4 三方映射可扩为四方映射(加 R25 DTap 危害分类视角)。

### 7.4 论文章节结构

- §1 Introduction
- §2(隐去,可能是 Related Work / Background)
- §3 DTap: Unified Platform for Agent Red-Teaming
- §4 DTap-Red: Autonomous Red-Teaming Agent for Agentic Systems
- §5 DTap-Bench: Benchmarking AI Agents with Advanced Red-Teaming
- §6 Experiments(主体实验数据)
- §7 Conclusions
- 附录(279 页中的大半,含各 domain 详细测试结果)

下版集成时阅读优先级:§3 §4 §5(各 ≤ 30 页)+ §6 重点实验 → 即可获得集成所需的全部细节;附录可选读。

---

## 八、工程化路径(2026-05-10 GitHub 仓库核查后补)

### 8.1 开源工件状态

仓库 https://github.com/AI-secure/DecodingTrust-Agent 是接近"产品早期版本"的工程实现,**不是单纯的 research artifact**:

| 组件 | 状态 |
|--|--|
| Docker 化仿真环境(`dt_arena/`)| ✅ 含动态端口编排 `env_up.py` |
| 多 SDK agent 支持(`agent/`)| ✅ OpenAI / Claude / LangChain |
| Benchmark 数据集(`dataset/`)| ✅ benign + malicious 任务结构 |
| Verifiable judge | ✅ 每任务 `judge.py` 含 `task_success()` + `attack_success()` |
| Hook 系统 | ✅ 工具调用拦截 + 审计日志(可挂自研防护) |
| MCP 服务器 | ✅ FastMCP HTTP 集成 |
| pip 包 | ❌ 无,需克隆运行 |
| Docs | 🟡 quickstart + hooks.md(精简) |

**仓库活跃度**:Apache-2.0 / 14 stars / 10 commits on main(2026-05 刚开源)。早期阶段,生态主要是作者团队 + 早期采用者。

### 8.2 仅靠论文复现的可行性 — 不建议

**不建议自实现**,三个具体障碍:

1. **50+ 仿真环境的工程细节不在论文里** — 每个 environment 的 API schema / 端口编排 / Mock 数据 / 状态机 / 超时策略只在 `dt_arena/` 代码内。论文给的是"覆盖 14 个 domain"的摘要描述。
2. **verifiable judge 是工程产物不是论文产物** — `judge.py` 中 `task_success` / `attack_success` 的具体实现(rule-based vs LLM-based,具体 prompt 与阈值)论文不会给。**无 judge 代码 → DTap-Bench 990+ 用例只是描述,不是可执行基准**。
3. **结果不可比** — 即便复现出"形似"系统,与作者公布的 Leaderboard 数据无法横向对照,失去基准的工程价值。

**正确路径**:直接 `git clone github.com/AI-secure/DecodingTrust-Agent` 跑 Quickstart,如:

```bash
python eval/evaluation.py --task-file tasks.jsonl --model gpt-4o --max-parallel 4
# 需要 OPENAI_API_KEY 或同级别 backbone
# 仿真环境通过 dt_arena/env_up.py 起 Docker
```

### 8.3 在 framework 工程实践中的 4 种用法

按第 7 章 §7.4 红蓝对抗工程要点(红方独立 + 自动化 + 结论可量化),DTap 的对接方式:

| 应用场景 | 用 DTap 做什么 |
|--|--|
| **企业内部红队基准月度跑** | 直接用 GitHub 仓库,选 14 domain 子集运行,周期性评估 ASR |
| **新 backbone 选型** | DTap 已支持主流闭源 / 开源 backbone,复用其评估管线对比 |
| **新防护层接入回归** | DTap 的 Hook 系统天然支持把企业自研防护层挂进去做端到端测试 |
| **第 7 章 §7.5 四接口对接** | 把 DTap evaluation.py 的输入输出包装成 framework §B.3 的 4 个 JSON Schema 接口 |

### 8.4 不应该做的事

- **不要"内部从零实现简化 DTap"** — 投入产出比极差,且每年作者会更新 benchmark,自实现版本快速落后
- **不要把 DTap 直接嵌入生产防护链路** — 当前 14 stars / 10 commits 的仓库稳定性不足以做生产关键路径,定位是"内部红队 + 学术参考"
- **不要把 DTap 的 ASR 指标当生产 KPI** — 它是研究基准,实验室条件下的 ASR 不能直接外推到生产环境;但作为"内部相对趋势监测"完全合用
