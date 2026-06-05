# 附录 D 可执行评估分发包(asf-eval/)

---

> 本附录是 v3.1 周期新增 附录,与 附录 A(攻防全量映射表)/ 附录 B(测试库与验证接口 Schema)/ 附录 C(R 编号引用矩阵)并列。
>
> 状态:**[v3.1 完成 — 已建成并 dogfood 通过]** — Track B 评估包 `asf-eval/` 本周期已实际落地:8 子目录(`schemas/ mappings/ evaluators/ checks/ runners/ templates/ tests/` + `scripts/`)齐全,12 个 evaluator 全部交付,L0 半自动 runner(`run_l0.sh`)实现并经 **Codex 异 AI 异机 dogfood smoke test 端到端通过(L0,58/100)**,根 `.github/workflows/asf-eval-validate.yml` CI 守卫已就位。**诚实声明**:L1/L2 仍为文字流程(`L1_native_inject.md` / `L2_external_backend.md`),其活 payload 投递待测试机复测。本附录据磁盘实际文件同步,非设计意图。

---

## D.1 定位与目标

**一句话**:附录 D 描述 ASF v3.1 在书稿叙事(Track A)之外,**同时分发**的"可执行评估包" `asf-eval/` 的设计、目录结构与使用方式。

### D.1.1 为什么书稿之外还需要一个可执行包

ASF v3 / v3.1 在 Track A 上是一本"给人读的"白皮书:框架、原则、攻防映射、测试集合索引。但白皮书本身**不能直接跑**——一个企业 AI 平台团队拿到 framework,仍然需要数周时间把 12 cells 翻译成可执行的检查项、把 8 测试集合接入自家 agent、把 4 接口 Schema 实例化为 runner。

Track B 的设计目标是:**让另一个 Claude Code 实例**(运行在目标项目的工作目录中)**直接消费 `asf-eval/`,自动化完成对目标 agent 系统的 ASF 评估**。换言之,asf-eval/ 是一个 drop-in 的、机器可执行的 ASF v3.1 实例化包。

### D.1.2 与 附录 B 的关系

| 维度 | 附录 B | 附录 D / asf-eval/ |
|--|--|--|
| 形态 | 书稿章节中的 Schema 文本与样例 | 可分发的目录 + JSON/YAML/Markdown 文件 |
| 受众 | 工程团队人读 + 手工照抄落地 | 另一个 Claude Code 实例自动消费 |
| 内容 | Schema 定义、典型样例、接口契约 | Schema 的**实例化**、测试用例的**完整集合**、evaluator prompt |
| 关系 | 给"形" | 给"形 + 量 + 可运行入口" |

**关键约定**(贯穿全附录):**Track B(asf-eval/)中的 JSON / YAML 文件是"权威实体",附录 A / B 的 markdown 表是"叙事说明",后者引用前者的文件路径。**当两者出现不一致时以 asf-eval/ 为准,markdown 同步更新。

### D.1.3 与 v3.1 升核心三项的关系

- **R30 Authorization Propagation 升核心** → cross/I N1-N7 七步全链路落在 `asf-eval/evaluators/cross_I.md`(信任锚 evaluator,L1/L2 据 `mappings/test-suite-routing.json` 路由 R6/R8 等 manifest 投递)
- **R32 Confidential Computing(不升核心,§6.1.5)** → 硬件可信根属可选项,由 Apex P4 检查 `asf-eval/checks/p4_verifiability.md`(attestation / 形式化片段判定信号)涵盖,**未单设** `hardware_root_of_trust.md` 文件
- **R35 Supply Chain SOK 升核心** → 供应链 / Viral Agent Loop 场景由 `asf-eval/tests/R20_openclaw_cve.yaml`(静态供应链 CVE)与 pre/C·pre/K evaluator 覆盖,经 `test-suite-routing.json` 路由

---

## D.2 分发形态

### D.2.1 物理形态

- **顶层目录**:`asf-eval/`,可作为 git submodule、npm/pip 包或纯 zip 分发
- **入口文件**:`asf-eval/CLAUDE.md` — drop-in 的项目级 Claude Code 指令,描述"如果你看到这个目录,请按以下流程执行 ASF 评估"
- **元数据**:`asf-eval/README.md`(人读)+ `asf-eval/CLAUDE.md` 的 YAML frontmatter(机读,声明 `asf_version` / `distribution_form` / `supported_levels` / `report_outputs` / `upstream`)。**注**:本周期未单设 `manifest.json`;版本与覆盖矩阵真值分散在 `CLAUDE.md` frontmatter + `mappings/test-suite-routing.json`(cell→manifest 路由真值表)

### D.2.2 消费者(Consumer)模型

```
[目标项目工作目录]
├── src/                  # 目标 agent 系统的源码
├── asf-eval/             # ← 拖入或 git submodule
│   ├── CLAUDE.md         # 触发指令
│   ├── schemas/ ...
│   └── ...
└── (Claude Code 实例在此目录运行)
```

当用户在该目录启动 Claude Code,Claude Code 读到 `asf-eval/CLAUDE.md`,即知道:"本项目内含 ASF v3.1 评估包,等待用户触发评估指令"。

### D.2.3 触发方式

| 触发方式 | 说明 | 适用场景 |
|--|--|--|
| 自然语言 | "帮我用 ASF 评估一下这个 agent 系统" | 探索式 / 首次使用 |
| `/asf-evaluate` 命令 | 通过 Claude Code skill 注册的 slash command,可带参数(L0/L1/L2、特定 cell 子集) | 重复 / 集成场景 |
| CI 调用 | 根 `.github/workflows/asf-eval-validate.yml` 已实现:跑 `scripts/check-routing.py`(路径契约)+ schema 自检 + golden 报告回归 + `runners/run_l0.sh` 端到端跑夹具并 `validate-report.sh` 校验 | 持续回归(已就位) |

### D.2.4 输出形态

固定两份产物落到目标项目根目录:

- `./asf-eval-report.md` — 人读报告,包含 Apex 四原则合规 + 12 cells 覆盖度 + 通过/失败用例 + 修复建议
- `./asf-eval-report.json` — 机读结果,字段对齐 asf-eval/schemas/report.schema.json,供 dashboard / CI / GRC 系统消费

---

## D.3 三级 Runner(L0 / L1 / L2)

asf-eval/ 提供三个递进的评估级别,消费者按可用资源选择:

| 级别 | 外部依赖 | 做什么 | 评估深度 | 典型时长 |
|--|--|--|--|--|
| **L0 静态** | 0(只用消费者 Claude Code 自身能力) | 读目标代码识别架构 → 12 攻击面适用性映射 → Apex 四原则形式合规检查 | 弱(无运行时证据) | 5–15 min |
| **L1 原生注入** | 0(Claude Code 自调用目标 agent + LLM-as-judge 评判) | 加载 `tests/*.yaml`,自动触发目标 agent,基于 evaluator prompt 评判输出 | 中(实际触发但判定主观) | 30–90 min |
| **L2 外部 backend** | promptfoo / DTap / Garak 之一 | 把 tests/ 转译为外部 engine 的格式,对接成熟红队工业管线 | 强(工业级 spectrum + 可重复) | 数小时,需配置 |

**默认级别**:**L0**(zero-dep,仅需消费者 Claude Code;CLAUDE.md §4 锁定为默认)。升级到 L1/L2 需用户显式指令。

每级 runner 的入口(实际文件名):`asf-eval/runners/L0_static_scan.md`、`L1_native_inject.md`、`L2_external_backend.md`,均为 Claude Code 可直接 follow 的 prompt 化操作指南。**L0 额外有半自动脚手架** `asf-eval/runners/run_l0.sh`(已实现:`detect_target` + 12-cell 痕迹 grep → 产出 `schemas/report.schema.json` 合规的报告骨架,`cell.score=null` 待消费 AI 据 evidence + `checks/*.md` 补全)。L1/L2 暂无 `run_l1.sh` / `run_l2.sh`,其活 payload 投递按 `mappings/test-suite-routing.json` 路由,待测试机复测。

---

## D.4 asf-eval/ 目录结构(实际磁盘状态,本周期已建成)

```
asf-eval/
├── CLAUDE.md                         # drop-in 项目级指令(YAML frontmatter + 触发说明 + 流程总览)
├── README.md                         # 人读说明
├── schemas/
│   ├── case.schema.json              # 测试用例 schema
│   ├── api.openapi.yaml              # 标准接口 OpenAPI
│   └── report.schema.json            # 报告 schema(CellCoverage 已扩 6 透明度字段)
├── mappings/
│   ├── test-suite-routing.json       # cell→manifest 路由真值表(L1/L2 定位 payload)
│   ├── attack-surfaces.json          # S1-S12 攻击面
│   ├── adversarial-techniques.json   # AT1-AT7 对抗技术
│   └── defense-tools.json            # 防护方案/工具
├── evaluators/                       # 12 cells 各一份(下划线命名)
│   ├── pre_C.md  pre_I.md  pre_K.md
│   ├── in_C.md   in_I.md   in_K.md
│   ├── post_C.md post_I.md post_K.md
│   └── cross_C.md cross_I.md cross_K.md
├── checks/                           # Apex P1-P4 静态检查清单
│   ├── p1_zero_trust.md  p2_unified_policy.md
│   └── p3_continuous_ops.md  p4_verifiability.md
├── runners/
│   ├── run_l0.sh                     # L0 半自动脚手架(已实现)
│   ├── L0_static_scan.md             # L0 操作 prompt
│   ├── L1_native_inject.md           # L1 文字流程(待测试机复测)
│   └── L2_external_backend.md        # L2 文字流程(待测试机复测)
├── scripts/
│   ├── validate-report.sh            # 报告 schema 校验(python3 + jsonschema)
│   └── check-routing.py              # 路径契约完整性(RISK-ASF-002 回归守卫)
├── templates/
│   ├── report.template.md            # 报告模板
│   └── remediation.template.md       # 修复建议模板
└── tests/                            # 按源平铺的 R<n>_*.yaml manifest(非按 cell 分目录)
    ├── R6_aegis.yaml   R8_openclaw_eval.yaml  R10_clawsafety.yaml
    ├── R11_pasb.yaml   R14_zeroshot.yaml       R15_1password_scam.yaml
    ├── R19_pinchbench.yaml(utility 基线)  R20_openclaw_cve.yaml  R23_agentdojo.yaml
    └── golden/                       # fixture_target/ + sample-l0-dogfood-report.json + README.md

# CI: 根 .github/workflows/asf-eval-validate.yml(非 asf-eval/ 内)
```

| 子目录 | 一句话职责(实际) |
|--|--|
| `schemas/` | `case.schema.json` / `api.openapi.yaml` / `report.schema.json` 三份权威 schema;`report.schema.json` 的 `CellCoverage` 已扩 6 个透明度字段:`confidence` / `applicability` / `low_confidence` / `skipped_reason` / `core_cell` / `industry_wide_gap` |
| `mappings/` | `test-suite-routing.json`(cell↔manifest 唯一权威映射)+ `attack-surfaces.json`(S1-S12)+ `adversarial-techniques.json`(AT1-AT7)+ `defense-tools.json` |
| `tests/` | 9 个 `R<n>_*.yaml` manifest 按源平铺(R6/R8/R10/R11/R14/R15/R19/R20/R23);R19_pinchbench 为 utility/误伤基线,不计攻击拦截率;cell↔manifest 映射见 `mappings/test-suite-routing.json`;含 `golden/` 回归基线 |
| `evaluators/` | 12 cells 各一份 evaluator(下划线命名 `pre_C.md`…`cross_K.md`);cross/I N1-N7(R30 升核)落在 `cross_I.md` |
| `checks/` | Apex P1-P4 静态检查清单(`p1_zero_trust.md` 等);R32 硬件可信根由 `p4_verifiability.md` 涵盖,未单设文件 |
| `runners/` | `run_l0.sh`(已实现脚手架)+ L0/L1/L2 三份操作 prompt;L1/L2 暂无 shell 实现 |
| `scripts/` | `validate-report.sh`(报告 schema 校验)+ `check-routing.py`(路径契约完整性) |
| `templates/` | `report.template.md`、`remediation.template.md` |

---

## D.5 与既有 附录 B / 附录 A 的交叉同步

下表确立 markdown 叙事文件与 asf-eval/ 权威实体的双向引用关系。**修订规则:先改 asf-eval/,再回头同步 markdown。**

| 书稿位置 | asf-eval/ 中对应权威实体 | 同步方向 |
|--|--|--|
| 附录 B §B.2 测试用例 YAML Schema | `asf-eval/schemas/case.schema.json` | B 引用文件路径 |
| 附录 B §B.3 4 标准接口 JSON Schema | `asf-eval/schemas/api.openapi.yaml` | B 引用文件路径 |
| 附录 B §B.1 测试集合索引 | `asf-eval/tests/R<n>_*.yaml`(9 manifest)+ `mappings/test-suite-routing.json`(cell→manifest) | B 给出索引,文件内容与 cell 映射以 tests/ + routing.json 为准 |
| 附录 A §A.1 攻击面 ↔ cell lookup | `asf-eval/mappings/attack-surfaces.json`(S1-S12) | A 表格与 mappings/ 对齐 |
| 附录 A §A.2 防护方案 ↔ cell lookup | `asf-eval/mappings/defense-tools.json` | A 表格与 mappings/ 对齐 |
| 附录 A §A.3 AT1-AT7 ↔ cell lookup | `asf-eval/mappings/adversarial-techniques.json` | A 表格与 mappings/ 对齐 |
| 第 6 章 §6.1.5 硬件可信根(R32,不升核) | `asf-eval/checks/p4_verifiability.md`(attestation 信号) | 章节给设计意图,P4 check 给可执行判定;未单设硬件可信根文件 |
| 第 6 章 cross/I N1-N7(R30 升核) | `asf-eval/evaluators/cross_I.md` | 章节给设计意图,信任锚 evaluator 给判定准则 |

---

## D.6 评估流程草图

**输入**:消费者项目工作目录 + asf-eval/ + 用户触发指令(自然语言或 `/asf-evaluate`)

**处理(7 步)**:

1. **Discover** — 读 `asf-eval/CLAUDE.md` frontmatter 确认版本与 supported_levels;ls 目标项目识别语言 / 框架 / agent 入口(L0 可直接 `runners/run_l0.sh` 机械完成 detect + 痕迹 grep)
2. **Profile** — 静态扫描目标代码,识别架构属于哪类(单 agent / multi-agent / MCP-based / RAG-heavy / …),输出 profile.json
3. **Scope** — 基于 profile 与 `mappings/attack-surfaces.json`(S1-S12),确定本次评估需覆盖哪些 cells 与 surfaces(可被用户参数收窄)
4. **Plan** — 选择 runner 级别(L0/L1/L2),从 `tests/` 选取适用用例,从 `checks/` 选取适用合规项,从 `evaluators/` 加载对应 prompt
5. **Execute** — 按 runner 入口执行:L0 只做静态判定;L1 自动触发目标 agent + LLM-as-judge;L2 转译给外部 engine
6. **Judge** — 对每条用例输出 pass / fail / N/A + 证据 + 引用的 cell / surface / AT
7. **Report** — 按 `templates/report.template.md` 与 `schemas/report.schema.json` 生成 `./asf-eval-report.{md,json}`,落到目标项目根;产出可经 `scripts/validate-report.sh` 校验

**输出**:两份 report + 可选的 traces/ 子目录(每条用例的完整 I/O 记录,便于复盘)

---

## D.7 12 cells × evaluator prompt 映射(已交付)

下表声明 12 cells 与 `asf-eval/evaluators/` 中 evaluator prompt 文件的一一对应。**实际文件名为下划线式 `<phase>_<axis>.md`**(`pre_C.md` … `cross_K.md`),12 份全部已落地。每份 evaluator 内含:cell 定义回顾、判定准则、典型攻击模式清单、引用的 R 编号、输出片段。攻击面坐标系严格限于 S1-S12,对抗技术限于 AT1-AT7。

| Cell | 主防攻击面 | Evaluator 文件(实际) | v3.1 状态 |
|--|--|--|--|
| pre/C | 部署期/供应链投毒 | `asf-eval/evaluators/pre_C.md` | 已交付 |
| in/C ⭐ | 工具调用滥用 | `asf-eval/evaluators/in_C.md` | 已交付 |
| post/C | 副作用/工具审计 | `asf-eval/evaluators/post_C.md` | 已交付 |
| cross/C | 跨 agent 工具委派 | `asf-eval/evaluators/cross_C.md` | 已交付 |
| pre/I | 身份签发/伪造 | `asf-eval/evaluators/pre_I.md` | 已交付 |
| in/I ⭐ | 实时鉴权/会话劫持 | `asf-eval/evaluators/in_I.md` | 已交付 |
| post/I | 行为基线/凭证泄漏 | `asf-eval/evaluators/post_I.md` | 已交付 |
| **cross/I**(信任锚) | **委托链滥用**(R30 N1-N7) | `asf-eval/evaluators/cross_I.md` | 已交付(升核 N1-N7 全链路) |
| pre/K | 知识源准入/知识库投毒 | `asf-eval/evaluators/pre_K.md` | 已交付 |
| in/K ⭐ | Prompt/Tool 注入(prompt injection) | `asf-eval/evaluators/in_K.md` | 已交付 |
| **post/K**(矩阵核心) | **记忆投毒**(memory poisoning) | `asf-eval/evaluators/post_K.md` | 已交付(矩阵核心格) |
| **cross/K**(产业空白) | **跨 agent 知识污染** | `asf-eval/evaluators/cross_K.md` | 已交付(报告中标 `industry_wide_gap` 为预期) |

---

## D.8 v3.1 周期的完成度状态

本附录采用三级状态标记,便于读者快速识别 v3.1 周期内哪些是已落地的、哪些是设计意图。

| 标记 | 含义 |
|--|--|
| **[v3.1 完成]** | 在 v3.1 发布时已有可消费的内容(无论是 markdown 文本还是 asf-eval/ 中的实体文件) |
| **[v3.1 部分完成]** | 骨架与代表性样例已就位,完整覆盖待 Track B 后续 Phase |
| **[v3.1 占位]** | 仅有设计意图与目录预留,具体内容在 Track B 工作流中产出 |

| 章节 | 当前状态 | 说明 |
|--|--|--|
| D.1 定位与目标 | [v3.1 完成] | 设计意图已敲定;D.1.3 升核三项已对齐实际落点(cross/I→evaluators/cross_I.md;R32→p4_verifiability.md;R35→R20 manifest) |
| D.2 分发形态 | [v3.1 完成] | 物理形态、元数据(CLAUDE.md frontmatter)、CI 触发已与磁盘一致 |
| D.3 三级 Runner | [v3.1 部分完成] | L0 半自动脚手架 `run_l0.sh` 已实现并 dogfood 通过;**L1/L2 仍为文字流程,待测试机复测**(无 run_l1.sh/run_l2.sh) |
| D.4 目录结构 | [v3.1 完成] | 8 子目录(含 scripts/)实际文件树已填实 |
| D.5 与附录 A/B 交叉同步 | [v3.1 完成] | 同步规则锁定,mappings/schemas 文件名已校正为实际名 |
| D.6 评估流程草图 | [v3.1 完成] | 7 步流程锁定,引用文件名已校正 |
| D.7 12 cells × evaluator 映射 | [v3.1 完成] | **12 个 evaluator 全部交付**(下划线命名 `pre_C.md`…`cross_K.md`) |
| D.8 完成度状态 | [v3.1 完成] | 本节(即元描述) |

---

## v3.1 周期产出追踪

> 本节是附录 D 与 Track B 工作流之间的"账本",每次 Track B Phase 完成后回填。

### 已交付(本 v3.1 周期实际落地,以磁盘为准)

- 本附录 D 全文(D.1–D.8)已由占位 SYNC 为实际状态
- `asf-eval/` 8 子目录(`schemas/ mappings/ evaluators/ checks/ runners/ templates/ tests/` + `scripts/`)+ CLAUDE.md + README.md 全部就位
- **schemas/**:`case.schema.json` / `api.openapi.yaml` / `report.schema.json`(后者 `CellCoverage` 已扩 6 个透明度字段)
- **mappings/**:`test-suite-routing.json`(cell→manifest 路由真值)/ `attack-surfaces.json` / `adversarial-techniques.json` / `defense-tools.json`
- **tests/**:9 个 `R<n>_*.yaml` manifest(R6/R8/R10/R11/R14/R15/R19/R20/R23)+ `golden/`(fixture_target + sample-l0-dogfood-report.json)
- **evaluators/**:12 个 cell evaluator 全部交付(下划线命名);cross/I N1-N7 落 `cross_I.md`
- **checks/**:Apex `p1_zero_trust.md` / `p2_unified_policy.md` / `p3_continuous_ops.md` / `p4_verifiability.md`
- **runners/**:`run_l0.sh`(已实现半自动脚手架)+ L0/L1/L2 操作 prompt
- **scripts/**:`validate-report.sh` + `check-routing.py`
- **templates/**:`report.template.md` + `remediation.template.md`
- **CI**:根 `.github/workflows/asf-eval-validate.yml`(routing 契约 + schema 自检 + golden 回归 + run_l0 端到端)
- **dogfood**:Codex 异 AI 异机 L0 smoke test 端到端通过(58/100)

### 未交付 / 待复测(诚实标注)

| 细分项 | 落点 | 状态 |
|--|--|--|
| L1 活 payload 投递(native inject) | asf-eval/runners/L1_native_inject.md | **文字流程已写,待测试机复测**(无 run_l1.sh) |
| L2 外部 backend 对接(promptfoo/DTap 等) | asf-eval/runners/L2_external_backend.md | **文字流程已写,待测试机复测**(无 run_l2.sh) |
| 全量 payload 字典生成(各 manifest 的 loader_hint 从 source 拉取) | asf-eval/tests/ | sample_case 已落地,全量生成待 L1/L2 复测时验证 |
| `/asf-evaluate` slash command 注册 | 消费者项目侧 | CLAUDE.md/README 已声明触发方式,正式 skill 注册在消费侧 |
| `manifest.json` / 硬件可信根独立文件 / 按 cell 分目录的 tests | — | **本周期决定不单设**(版本走 frontmatter;R32 并入 P4 check;tests 按源平铺) |

### 同步动作清单(每次 Track B Phase 完成后必做)

1. 回填本节"已交付"列表
2. 在受影响的章节(D.3 / D.4 / D.7)把 [v3.1 占位] 升级为 [v3.1 部分完成] / [v3.1 完成]
3. 同步修订 附录 A / 附录 B 的引用路径(若 asf-eval/ 内文件路径有调整)
4. 在 `asf-eval/CLAUDE.md` frontmatter 的 `asf_version` 提升对应版本号(本周期未用 manifest.json)
