# R22 — CaMeL: Defeating Prompt Injections by Design

> **Source (paper)**: https://arxiv.org/abs/2503.18813
> **Source (code)**: https://github.com/google-research/camel-prompt-injection
> **License**: Apache 2.0
> **Type**: 学术论文 + 研究工件(非产品级)
> **Fetched at**: 2026-05-05

---

## 一、元信息

- **作者**:Edoardo Debenedetti、Ilia Shumailov、Tianqi Fan、Jamie Hayes、Nicholas Carlini、Daniel Fabian、Christoph Kern、Chongyang Shi、Florian Tramèr
- **机构**:Google Research / Google DeepMind / ETH Zurich
- **arXiv**:2503.18813
- **核心问题**:LLM 智能体在与不可信环境交互时极易遭受**提示词注入攻击**(prompt injection)。已有补丁式防御无法从根本上消除该类风险。

---

## 二、核心思想 ── by-design 而非 patch

CaMeL 的核心论点:**当底层模型本身脆弱时,仍可通过外层系统设计为其提供安全保障**。

具体设计:

> "CaMeL, a robust defense that creates a protective system layer around the LLM, securing it even when underlying models are susceptible to attacks." — 论文摘要

设计原则两条:

1. **显式分离控制流与数据流(control flow vs data flow separation)**
   - 从**可信用户查询**中提取程序执行的控制流(should do what)
   - **不可信数据**(工具返回值、网页内容等)**不允许**影响控制流
   - 即使不可信数据中夹带恶意指令,也无法改变 LLM 已经规划好的动作序列

2. **能力级(capability-based)的工具调用授权**
   - 每次工具调用前由独立解释器层做能力凭证校验
   - 防止未授权的数据外泄(如私有数据被发送到攻击者控制的地址)
   - 能力凭证粒度可达"哪些数据被允许传给哪些工具"级别

---

## 三、关键机制(技术细节)

### 3.1 解释器层架构

```
[用户查询(可信)]
       │
       ▼
   ┌──────────────────────────┐
   │  CaMeL Interpreter       │  ← 独立组件,非 LLM
   │  - 解析控制流             │
   │  - 维护能力凭证表         │
   │  - 数据流追踪(taint)     │
   └──────────────────────────┘
       │           ▲
       ▼           │
   [LLM 推理]    [工具调用前授权检查]
       │           │
       ▼           │
   [候选动作] ──→ [能力检查] ──→ [允许/拒绝]
                                       │
                                       ▼
                                  [实际工具执行]
```

### 3.2 能力凭证(Capability)

- 工具调用不再是"工具白名单 + 参数过滤"
- 升级为"**意图约束**":每个数据对象携带一组能力凭证(可被哪些工具读、可被发往哪些目的地)
- 凭证从可信用户查询源头授予,在数据流转过程中**只能收紧、不能放宽**(类似 capability 静态降权语义)

### 3.3 数据流追踪

- 不可信工具返回的数据被打上 taint 标记
- 任何依赖 tainted 数据的后续操作都受限于该数据的能力凭证
- LLM 即使被注入误导,**也无法生成绕过凭证检查的工具调用**——因为检查在解释器层、不在 LLM 层

---

## 四、AgentDojo 评估结果

CaMeL 在 **AgentDojo** 智能体沙盒基准上的表现(论文摘要披露):

| 指标 | CaMeL 防御 | 无防御基线 |
|--|--|--|
| 任务完成率(provable security 模式) | **77%** | 84% |
| 安全保障 | 形式化可证明 | 无 |

解读:**用 7% 的任务成功率换形式化可证明的安全性**——对中高敏感度场景(金融、医疗、企业内部数据)是合算的工程权衡。

AgentDojo 本身亦是评估提示词注入防御的标准基准之一,与零样本注入(R14)、PinchBench(R19)的定位互补。

---

## 五、与本书 v2 体系的对应关系

| 本书章节 | 对应 CaMeL 概念 | 落点 |
|--|--|--|
| Ch4 §4.1.1 立论 1.2「每个工具调用独立验证」 | 解释器层的工具调用前授权检查 | 印证立论的可实现性 |
| Ch6 §6.2.2 能力模型(CapabilityModel) | CaMeL 的 capability 凭证体系 | **直接对应**,作为参考实现 |
| Ch6 §6.2.3 语义 vs 词法根治专题 | CaMeL 的 by-design 路线 | 工程化案例 |
| Ch10 CIK × 四层验证矩阵 测试库合集 | AgentDojo 基准 | 加为第 7 个评估基准 |
| Ch11 事中防护工具类 | CaMeL 解释器 | **第三个开源选项**(在 AEGIS / AGT 之外) |

---

## 六、安装与使用(摘自上游 README)

### 安装

1. 按官方文档安装 `uv`(Python 包管理器)
2. 重命名 `.env.example` → `.env`,填入 LLM API key
3. 首次运行时 `uv` 自动装依赖

### 运行

```bash
uv run --env-file .env main.py MODEL_NAME [options]
```

主要选项:

- `--use-original` — 使用原始(无防御)模式作对比基线
- `--ad_defense` — 启用 AgentDojo 防御评估模式
- `--reasoning-effort` — 推理强度档位
- `--thinking_budget_tokens` — 思考 token 预算上限
- `--run-attack` — 跑攻击对抗测试
- `--replay-with-policies` — 用策略重放历史轨迹
- `--eval_mode` — 评估模式开关

完整选项见 `--help`。

### 工程能力

- 模型配置管理
- 与 AgentDojo 的集成(防御测试)
- 多 LLM provider / 推理模型支持
- 测试套件 + lint 基础设施

---

## 七、定位与局限(企业引入须读)

### 上游官方声明

> "This is a research artifact. The code likely contains bugs. It is not an officially supported Google product and receives no planned maintenance."

### 企业落地的取舍

- ✅ **思想可借鉴**:capability-based 解释器、控制流/数据流分离、taint 追踪——这些设计原理可指导自研事中拦截层。
- ⚠️ **代码不可直接生产部署**:研究工件级别,无 SLA、无安全维护承诺。
- ⚠️ **77% 任务完成率**:对低敏感度高频任务(信息检索、写作辅助)代价偏高,需结合具体场景做防御档位选择。
- ✅ **可作为参考实现 + 红队演练靶子**:将其能力模型作为自研系统的设计参考、并把 AgentDojo + CaMeL 作为内部红队基准。

### 与 AGT、AEGIS 的差异定位

| 维度 | AEGIS (R6) | AGT (R5) | CaMeL (R22) |
|--|--|--|--|
| 性质 | 学术原型 | 微软产品级 SDK | 学术研究工件 |
| 防御路径 | 多轨道意图监控 | 确定性策略引擎 | by-design 控制流分离 |
| 部署成熟度 | 概念验证 | 公开 Preview / 多语言 | 研究复现用 |
| 形式化保证 | 无 | 部分(策略层确定性) | 有(provable security 模式) |
| 适合场景 | 研究、轻量原型 | 企业生产部署 | 设计借鉴、红队验证、高敏感场景 PoC |

三者**不冲突、可并用**:AGT 做生产层确定性策略,CaMeL 思想做高敏感链路的二道闸,AEGIS 提供研究侧的多轨道监控视角。

---

## 八、入档说明

- **本笔记**:基于 arXiv:2503.18813 摘要 + GitHub 上游 README 综合整理。
- **整合状态**:v2.2 已正式整合到 Ch6 §6.2.2、Ch10 测试库、Ch11 事中工具类(对应 commit:`feat(ch6/10/11): integrate R22 CaMeL`)。
- **后续追踪**:若上游论文有更新版或社区出现工业级实现,以新 R 编号补充,不修改本文。
