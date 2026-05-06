# R16 — ClawSafety Scanner

> **Source**: https://github.com/relaxcloud-cn/clawsafety
> **Default branch**: master
> **Commit SHA (fetched)**: 6ca9aa0a74
> **Fetched at**: 2026-04-23T10:43:16Z

---

## README.md

# ClawSafety

**Security scanner for Agent Skills. Protect the Agent-Native ecosystem.**

ClawSafety scans OpenClaw Skills (and other Agent Skill formats) for security vulnerabilities, hardcoded secrets, command injection, supply chain risks, and more.

## Why ClawSafety?

The [ClawHavoc incident](https://www.digitalapplied.com/blog/ai-agent-plugin-security-lessons-clawhavoc-2026) (Jan 2026) proved that Agent Skills are the new attack surface. 341 malicious skills compromised 9,000+ installations. A Snyk audit found 47% of ClawHub skills had at least one security issue.

**ClawSafety is the `npm audit` for Agent Skills.**

## Quick Start

```bash
# Install
cargo install clawsafety

# Scan a skill
clawsafety scan ./my-skill/

# Scan all skills in a directory
clawsafety scan-all ./skills/

# Output as JSON
clawsafety scan ./my-skill/ --format json
```

## What It Scans

| Category | Rules | Examples |
|----------|-------|---------|
| **Injection** (INJ) | 4 | Shell injection, SQL injection, reverse shells |
| **Secrets** (SEC) | 4 | Hardcoded passwords, API keys, private keys |
| **Dependencies** (DEP) | 4 | Unpinned versions, known CVEs, curl-pipe-bash |
| **Permissions** (PRM) | 4 | Excessive access, sensitive paths, env abuse |
| **Config** (CFG) | 4 | Missing SKILL.md, prompt injection risks |

## Security Score

Each skill gets a score from 0-100 and a grade:

| Grade | Score | Meaning |
|-------|-------|---------|
| **A** | 90-100 | Excellent - no high-risk issues |
| **B** | 75-89 | Good - minor issues |
| **C** | 60-74 | Fair - needs attention |
| **D** | 40-59 | Poor - high-risk issues found |
| **F** | 0-39 | Dangerous - critical security risks |

## GitHub Integration

Connect your repository for automated scanning on every push and PR.

1. Install the [ClawSafety GitHub App](https://github.com/apps/clawsafety)
2. Select your skill repositories
3. Get scan results as PR comments and GitHub Check Runs

## Roadmap

- [x] v0.1 - CLI scanner with 20 rules
- [ ] v0.2 - GitHub App integration + Web Dashboard
- [ ] v0.3 - Auto-fix PRs + Public URL scanning
- [ ] v1.0 - Enterprise: team management, runtime monitoring, SBOM

## Built by

[YiSec](https://yisec.ai) - AI-native security company, pioneering Agent-Native Architecture.

## License

Apache-2.0

---

## docs/ARCHITECTURE.md

# ClawSafety - Technical Architecture

## 系统架构

```
+------------------------------------------------------------------+
|                        ClawSafety SaaS                           |
|                                                                  |
|  +------------+    +-------------+    +----------------------+   |
|  | Web UI     |    | GitHub App  |    | API Server           |   |
|  | (Next.js)  |--->| (Webhook)   |--->| (Axum)               |   |
|  +------------+    +-------------+    +----------+-----------+   |
|                                                  |               |
|                                       +----------v-----------+   |
|                                       | Scan Orchestrator    |   |
|                                       +----------+-----------+   |
|                                                  |               |
|                                       +----------v-----------+   |
|                                       | Scan Engine (Rust)   |   |
|                                       | +------------------+ |   |
|                                       | | Rule Engine      | |   |
|                                       | | Pattern Matcher  | |   |
|                                       | | Dep Analyzer     | |   |
|                                       | | Score Calculator | |   |
|                                       | +------------------+ |   |
|                                       +----------+-----------+   |
|                                                  |               |
|                                       +----------v-----------+   |
|                                       | Report Generator     |   |
|                                       | (Terminal/JSON/SARIF) |   |
|                                       +----------------------+   |
|                                                                  |
|  +------------+    +-------------+                               |
|  | PostgreSQL |    | Redis       |                               |
|  | (扫描记录)  |    | (任务队列)   |                               |
|  +------------+    +-------------+                               |
+------------------------------------------------------------------+
```

---

## 1. 核心组件

### 1.1 Scan Engine (MVP 核心)

扫描引擎是 ClawSafety 的核心，Rust 实现，同时作为 CLI 工具和 SaaS 后端的扫描模块。

```
clawsafety/
├── src/
│   ├── main.rs              # CLI 入口
│   ├── lib.rs               # 库入口（SaaS 复用）
│   ├── scanner/
│   │   ├── mod.rs            # Scanner trait + orchestrator
│   │   ├── skill_parser.rs   # 解析 SKILL.md 结构
│   │   ├── file_walker.rs    # 遍历 skill 目录
│   │   └── context.rs        # 扫描上下文（文件类型、语言检测）
│   ├── rules/
│   │   ├── mod.rs            # Rule trait + registry
│   │   ├── injection.rs      # CS-INJ-* 规则
│   │   ├── secrets.rs        # CS-SEC-* 规则
│   │   ├── dependencies.rs   # CS-DEP-* 规则
│   │   ├── permissions.rs    # CS-PRM-* 规则
│   │   └── config.rs         # CS-CFG-* 规则
│   ├── reporter/
│   │   ├── mod.rs            # Reporter trait
│   │   ├── terminal.rs       # 彩色终端输出
│   │   ├── json.rs           # JSON 报告
│   │   └── sarif.rs          # SARIF 格式（GitHub Code Scanning 兼容）
│   └── scoring/
│       └── mod.rs            # 评分计算
├── rules/                    # 外部规则定义 (YAML)
│   ├── injection.yaml
│   ├── secrets.yaml
│   ├── dependencies.yaml
│   ├── permissions.yaml
│   └── config.yaml
├── tests/
│   ├── fixtures/             # 测试用 skill 样本
│   │   ├── clean_skill/      # 无问题的 skill
│   │   ├── vulnerable_skill/ # 有各类问题的 skill
│   │   └── malicious_skill/  # 恶意 skill
│   └── integration/
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── SCAN_RULES.md
│   └── ROADMAP.md
└── Cargo.toml
```

### 1.2 Rule Engine 设计

```rust
/// 扫描规则 trait
pub trait Rule: Send + Sync {
    fn id(&self) -> &str;
    fn name(&self) -> &str;
    fn severity(&self) -> Severity;
    fn category(&self) -> Category;

    /// 对单个文件执行检查
    fn check_file(&self, ctx: &FileContext) -> Vec<Finding>;

    /// 对整个 skill 目录执行检查（用于跨文件分析）
    fn check_skill(&self, ctx: &SkillContext) -> Vec<Finding> {
        vec![] // 默认不做 skill 级检查
    }
}

/// 扫描发现
pub struct Finding {
    pub rule_id: String,
    pub severity: Severity,
    pub message: String,
    pub file: PathBuf,
    pub line: usize,
    pub column: usize,
    pub snippet: String,         // 问题代码片段
    pub fix_suggestion: String,  // 修复建议
    pub cwe: Option<String>,     // CWE 编号
}

/// 严重性等级
pub enum Severity {
    Critical,
    High,
    Medium,
    Low,
    Info,
}

/// 规则类别
pub enum Category {
    Injection,
    Secrets,
    Dependencies,
    Permissions,
    Config,
}
```

### 1.3 Pattern Matcher

基于正则的快速匹配器，支持多语言感知：

```rust
pub struct PatternRule {
    pub id: String,
    pub severity: Severity,
    pub patterns: Vec<Pattern>,
}

pub struct Pattern {
    pub regex: Regex,
    pub language: Option<Language>,  // bash, python, yaml, markdown
    pub description: String,
    pub fix_suggestion: String,
}
```

MVP 阶段以正则匹配为主，后续版本引入 tree-sitter AST 分析提高准确率。

---

## 2. CLI 接口设计

### 2.1 基本用法

```bash
# 扫描当前目录
clawsafety scan .

# 扫描指定 skill
clawsafety scan /path/to/my-skill/

# 指定输出格式
clawsafety scan . --format json
clawsafety scan . --format sarif

# 仅检查特定类别
clawsafety scan . --category injection,secrets

# 设置最低严重性
clawsafety scan . --min-severity high

# 输出到文件
clawsafety scan . --output report.json --format json

# 批量扫描（扫描目录下所有 skill）
clawsafety scan-all /path/to/skills/

# 查看规则列表
clawsafety rules list

# 查看规则详情
clawsafety rules show CS-INJ-001
```

### 2.2 终端输出示例

```
  ClawSafety v0.1.0 - Agent Skill Security Scanner

  Scanning: /path/to/url-analysis/
  Files scanned: 12
  Rules applied: 20

  CRITICAL  CS-SEC-002  Hardcoded API Key detected
            scripts/url_analyze.py:45
            > api_key = "sk-proj-abc123..."
            Fix: Use environment variable instead

  HIGH      CS-INJ-001  Shell command injection
            scripts/check_redirect.sh:23
            > curl -L "$URL" | grep $PATTERN
            Fix: Quote variables and use -- to end options

  MEDIUM    CS-DEP-002  Unpinned dependency version
            skill.yaml:8
            > requests>=2.0
            Fix: Pin to exact version (requests==2.31.0)

  ─────────────────────────────────────
  Score: 52/100 (D)
  Critical: 1 | High: 1 | Medium: 1 | Low: 0
  ─────────────────────────────────────
```

---

## 3. 技术选型

| 组件 | 选型 | 理由 |
|------|------|------|
| **扫描引擎** | Rust | 性能、安全、CLI 分发便捷 |
| **正则引擎** | `regex` crate | Rust 生态最成熟 |
| **CLI 框架** | `clap` | Rust CLI 标准 |
| **终端输出** | `colored` + `indicatif` | 彩色 + 进度条 |
| **YAML 解析** | `serde_yaml` | 规则定义解析 |
| **SARIF 输出** | 自定义 serde 序列化 | GitHub Code Scanning 兼容 |
| **Web 前端** | Next.js 15 | 与 yisec-website 同技术栈 |
| **API 服务** | Axum | Rust 异步 Web 框架 |
| **数据库** | PostgreSQL | SaaS 标配 |
| **任务队列** | Redis + Tokio | 异步扫描任务 |
| **部署** | Cloudflare Pages + Workers | 与现有基础设施一致 |

---

## 4. GitHub 集成方案

### 4.1 GitHub App

```
用户安装 ClawSafety GitHub App
        ↓
App 获取仓库访问权限
        ↓
配置 Webhook (push, pull_request)
        ↓
每次 push/PR → Webhook 触发
        ↓
API Server 接收 → 克隆仓库 → 执行扫描
        ↓
结果写入：
  - PR Comment（扫描摘要）
  - Check Run（SARIF 格式，集成 GitHub Code Scanning）
  - Dashboard（历史记录）
```

### 4.2 PR Comment 格式

```markdown
## ClawSafety Scan Report

**Score: B (78/100)**

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High     | 1 |
| Medium   | 2 |
| Low      | 1 |

### Findings

| Rule | Severity | File | Line | Description |
|------|----------|------|------|-------------|
| CS-INJ-001 | High | scripts/scan.sh | 23 | Shell command injection |
| CS-DEP-002 | Medium | skill.yaml | 8 | Unpinned dependency |
| CS-DEP-002 | Medium | skill.yaml | 12 | Unpinned dependency |
| CS-CFG-002 | Low | SKILL.md | - | Missing version |

[View full report](https://clawsafety.dev/reports/xxx)
```

---

## 5. 数据模型

### 5.1 核心表

```sql
-- 用户
CREATE TABLE users (
    id          UUID PRIMARY KEY,
    github_id   BIGINT UNIQUE NOT NULL,
    username    VARCHAR(255) NOT NULL,
    email       VARCHAR(255),
    plan        VARCHAR(20) DEFAULT 'free',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 仓库
CREATE TABLE repositories (
    id          UUID PRIMARY KEY,
    user_id     UUID REFERENCES users(id),
    github_repo VARCHAR(255) NOT NULL,  -- "owner/repo"
    default_branch VARCHAR(100) DEFAULT 'main',
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 扫描记录
CREATE TABLE scans (
    id          UUID PRIMARY KEY,
    repo_id     UUID REFERENCES repositories(id),
    commit_sha  VARCHAR(40),
    branch      VARCHAR(255),
    trigger     VARCHAR(20),  -- 'push', 'pr', 'manual', 'cli'
    score       INT,
    grade       CHAR(1),
    status      VARCHAR(20),  -- 'pending', 'running', 'completed', 'failed'
    started_at  TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 扫描发现
CREATE TABLE findings (
    id          UUID PRIMARY KEY,
    scan_id     UUID REFERENCES scans(id),
    rule_id     VARCHAR(20) NOT NULL,
    severity    VARCHAR(10) NOT NULL,
    message     TEXT NOT NULL,
    file_path   VARCHAR(500),
    line_number INT,
    snippet     TEXT,
    fix_suggestion TEXT,
    cwe         VARCHAR(20),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. MVP 开发阶段

### Phase 1: CLI 扫描器 (v0.1) — 2 周

**Week 1:**
- 项目骨架（Cargo workspace、CLI 参数解析）
- Rule trait + PatternRule 实现
- 实现 INJ 类规则（4 条）
- 实现 SEC 类规则（4 条）
- Terminal reporter

**Week 2:**
- 实现 DEP 类规则（4 条）
- 实现 PRM 类规则（4 条）
- 实现 CFG 类规则（4 条）
- 评分计算
- JSON/SARIF reporter
- 测试 + 文档 + 发布

### Phase 2: GitHub 集成 (v0.2) — 3 周

- GitHub App 注册和 OAuth
- Webhook 处理（push, pull_request）
- 异步扫描任务队列
- PR Comment 报告
- Web Dashboard（扫描历史、评分趋势）
- Badge 生成

### Phase 3: 自动修复 (v0.3) — 2 周

- 修复代码生成（LLM 辅助）
- 自动创建修复 PR
- URL 即时扫描（无需登录）
- ClawHub 全量扫描

---

## 7. 分发方式

| 渠道 | 方式 | 用户 |
|------|------|------|
| **cargo install** | `cargo install clawsafety` | Rust 开发者 |
| **Homebrew** | `brew install clawsafety` | macOS 用户 |
| **GitHub Release** | 预编译二进制 (Linux/macOS/Windows) | 所有用户 |
| **Docker** | `docker run clawsafety scan .` | CI/CD |
| **GitHub Action** | `uses: clawsafety/scan-action@v1` | GitHub 用户 |
| **SaaS** | clawsafety.dev | Web 用户 |

---

## docs/PRD.md

# ClawSafety - Product Requirements Document

## 一句话定位

**ClawSafety 是 Agent Skill 生态的安全基座，通过 GitHub 集成为 Skill 提供一键安全扫描、持续监控和自动修复。**

---

## 1. 背景与市场机会

### 1.1 市场事件

- **2026.01 ClawHavoc 事件**：341 个恶意 Skill 入侵 9,000+ OpenClaw 安装
- **Snyk 审计**：47% 的 ClawHub Skill 存在至少一个安全问题
- **800+ 恶意 Skill** 在第三方 Agent 市场被发现

### 1.2 市场规模

- AI Agent 市场：2025 年 $78 亿，2030 年预计 $526 亿
- AI Agent 安全融资仅 $4.14 亿（不到 AI 安全总融资的 5%）
- 巨大的安全缺口 = 巨大的市场机会

### 1.3 为什么是现在

- ClawHavoc 刚发生，市场恐慌期，安全需求最强烈
- Agent Skill 生态爆发（ClawHub 96,000+ skills），但安全基础设施几乎为零
- 竞品少且分散，没有一家做到 Skill 全生命周期安全

---

## 2. 用户画像

### 2.1 主要用户

| 角色 | 场景 | 痛点 | 优先级 |
|------|------|------|--------|
| **Skill 开发者** | 发布 skill 前想知道有没有安全问题 | 没有审计工具，靠人工 review | P0 |
| **Skill 使用者** | 安装 skill 前想确认安全性 | ClawHavoc 后不敢装第三方 skill | P0 |
| **企业安全管理员** | 管控团队使用的 skill 合规性 | 不知道团队装了什么、有没有风险 | P1 |
| **ClawHub 平台方** | 上架审核 | 缺乏自动化安全审核能力 | P2 |

### 2.2 用户故事

**Skill 开发者 - Alice：**
> 我写了一个新的 threat-intel skill，想在发布到 ClawHub 前确保没有安全问题。我连接 GitHub 仓库，ClawSafety 自动扫描，发现我的脚本里有一个硬编码的 API Key 和两处命令注入风险。它直接给我生成了修复 PR，我 merge 后重新扫描，拿到 A 级评分和 ClawSafety Verified 徽章。

**Skill 使用者 - Bob：**
> 我想装一个 asset-scanner skill，但 ClawHavoc 之后我不敢直接装了。我把 skill 的 GitHub URL 贴到 ClawSafety，30 秒出报告：B 级评分，有一个中等风险（依赖版本过旧），没有高危问题。我放心安装了。

**企业管理员 - Charlie：**
> 我需要知道团队 20 个 agent 里用了哪些 skill，哪些有安全风险。ClawSafety 的 Team Dashboard 让我一目了然，还能设置策略：评分低于 B 的 skill 禁止使用。

---

## 3. 产品架构

### 3.1 产品形态

```
                    +-------------------+
                    |   ClawSafety.dev  |  (SaaS Web Dashboard)
                    +-------------------+
                            |
                    +-------------------+
                    |   GitHub App      |  (OAuth + Webhook)
                    +-------------------+
                            |
              +-------------+-------------+
              |                           |
    +---------+----------+    +-----------+---------+
    | Scan Engine (Rust) |    | Report Generator    |
    +--------------------+    +---------------------+
              |
    +--------------------+
    | Rule Engine         |
    | - Static Analysis   |
    | - Dependency Audit  |
    | - Secret Detection  |
    | - Permission Check  |
    +--------------------+
```

### 3.2 两个入口

| 入口 | 用法 | 场景 |
|------|------|------|
| **GitHub 集成** | 连接仓库，自动扫描每次 push/PR | Skill 开发者（持续监控） |
| **URL 扫描** | 粘贴 GitHub URL，即时扫描 | Skill 使用者（安装前检查） |

### 3.3 核心流程

```
1. 用户 GitHub OAuth 登录
2. 选择仓库（自动识别含 SKILL.md 的仓库）
3. 触发扫描（手动 / push webhook / PR webhook）
4. 扫描引擎执行规则检查
5. 生成安全报告（评分 A~F + 漏洞列表 + 修复建议）
6. 输出到：Web Dashboard / PR Comment / 修复 PR
```

---

## 4. MVP 功能范围 (v0.1)

### 4.1 Must Have (P0)

| 功能 | 描述 |
|------|------|
| **CLI 扫描器** | `clawsafety scan <path>` 扫描本地 skill 目录 |
| **基础规则引擎** | 15-20 条核心扫描规则（见规则文档） |
| **安全评分** | A/B/C/D/F 五级评分体系 |
| **终端报告** | 彩色终端输出，按严重性排序 |
| **JSON/SARIF 输出** | 机器可读格式，支持 CI/CD 集成 |

### 4.2 Should Have (P1) - v0.2

| 功能 | 描述 |
|------|------|
| **GitHub App** | OAuth 登录，仓库连接 |
| **PR Comment** | 每次 PR 自动扫描，在 PR 中评论结果 |
| **Web Dashboard** | 扫描历史、趋势图、仓库管理 |
| **Badge** | ClawSafety 评分徽章，嵌入 README |

### 4.3 Nice to Have (P2) - v0.3

| 功能 | 描述 |
|------|------|
| **自动修复 PR** | 检测到问题后自动生成修复 PR |
| **URL 即时扫描** | 粘贴 GitHub URL，无需登录即可扫描 |
| **ClawHub 集成** | 全量 skill 评分排行榜 |

### 4.4 Future (P3) - v1.0

| 功能 | 描述 |
|------|------|
| **Team Dashboard** | 团队 skill 资产管理和合规策略 |
| **运行时监控** | Skill 执行行为监控（网络、文件、进程） |
| **自定义规则** | 用户自定义扫描规则 |
| **Skill 签名验证** | 数字签名发布和验证 |

---

## 5. 安全评分体系

### 5.1 评分维度

| 维度 | 权重 | 说明 |
|------|------|------|
| **Critical Findings** | 40% | 命令注入、硬编码凭证、恶意代码 |
| **High Findings** | 25% | SQL 注入、不安全依赖、权限过度 |
| **Medium Findings** | 20% | 未锁定版本、缺少输入验证 |
| **Low Findings** | 10% | 代码风格、文档缺失 |
| **Best Practices** | 5% | 签名、SBOM、审计日志 |

### 5.2 评分等级

| 等级 | 分数范围 | 含义 |
|------|---------|------|
| **A** | 90-100 | 优秀，无高危问题 |
| **B** | 75-89 | 良好，有少量中等问题 |
| **C** | 60-74 | 一般，存在需要关注的问题 |
| **D** | 40-59 | 较差，存在高危问题 |
| **F** | 0-39 | 危险，存在严重安全风险 |

---

## 6. 竞品对比

| 能力 | ClawSafety | SecureClaw | Cisco MCP Scanner | nono | Jozu |
|------|-----------|-----------|-------------------|------|------|
| Skill 专项扫描 | **核心能力** | 行为规则 | MCP Server | 无 | 无 |
| GitHub 集成 | **PR Comment + 修复** | 无 | 无 | 无 | 无 |
| 安全评分 | **A~F** | 无 | 无 | 无 | 无 |
| 自动修复 | **生成 PR** | 无 | 无 | 无 | 无 |
| 开源 CLI | **是** | 是 | 是 | 否 | 否 |
| 运行时防护 | v1.0 | 无 | 无 | 是 | 是 |

**差异化：** Skill 专项 + GitHub 原生集成 + 自动修复 PR。竞品要么做运行时（nono/Jozu），要么做通用扫描（Cisco），没有人做 Skill 开发者工作流闭环。

---

## 7. 商业模式

| 层级 | 内容 | 价格 | 目标用户 |
|------|------|------|---------|
| **Free** | 公开仓库扫描、基础规则、CLI 工具 | $0 | 个人开发者 |
| **Pro** | 私有仓库、高级规则、CI/CD 集成、Slack 通知 | $19/月 | 专业开发者 |
| **Team** | 团队 Dashboard、合规报告、自定义规则 | $49/月 | 小团队 |
| **Enterprise** | SBOM、审计日志、SLA、私有部署、运行时监控 | 按需报价 | 企业 |

### 增长飞轮

```
开源 CLI 免费 → 开发者使用 → GitHub Badge 传播 → 更多开发者
→ ClawHub 集成 → 平台标准 → 企业付费
```

---

## 8. 成功指标

### MVP (v0.1) - 发布后 30 天

| 指标 | 目标 |
|------|------|
| GitHub Stars | 500+ |
| CLI 下载量 | 1,000+ |
| 扫描的 Skill 数量 | 200+ |
| 社区反馈 issue | 50+ |

### v0.2 - 发布后 90 天

| 指标 | 目标 |
|------|------|
| 连接 GitHub 仓库数 | 500+ |
| 月活跃扫描次数 | 5,000+ |
| Pro 付费用户 | 50+ |

---

## 9. 风险与缓解

| 风险 | 概率 | 缓解措施 |
|------|------|---------|
| OpenClaw 官方自己做安全功能 | 中 | 先发优势 + 深度集成，争取成为官方推荐 |
| 扫描规则误报率高 | 高 | 保守策略，宁漏勿错；社区反馈快速迭代 |
| Skill 格式变更导致扫描失效 | 低 | 模块化规则引擎，适配成本低 |
| 竞品快速跟进 | 中 | 靠 GitHub 集成 + 自动修复建立壁垒 |

---

## docs/ROADMAP.md

# ClawSafety - MVP Roadmap

## 版本演进路线

```
v0.1 (CLI)  →  v0.2 (GitHub)  →  v0.3 (Auto-Fix)  →  v1.0 (Enterprise)
  2 周             3 周              2 周                4 周
```

---

## v0.1 — CLI 扫描器 (MVP)

> 目标：一行命令扫描 skill，输出安全报告

### 里程碑

| # | 任务 | 产出 | 时间 |
|---|------|------|------|
| 1 | 项目骨架 | CLI 框架 + Rule trait + Scanner trait | Day 1-2 |
| 2 | 注入类规则 (INJ) | CS-INJ-001 ~ 004，4 条规则 | Day 3-4 |
| 3 | 敏感信息规则 (SEC) | CS-SEC-001 ~ 004，4 条规则 | Day 5-6 |
| 4 | 依赖规则 (DEP) | CS-DEP-001 ~ 004，4 条规则 | Day 7-8 |
| 5 | 权限规则 (PRM) + 配置规则 (CFG) | CS-PRM-001 ~ 004 + CS-CFG-001 ~ 004 | Day 9-10 |
| 6 | 评分系统 + 报告生成 | Terminal/JSON/SARIF 输出 | Day 11-12 |
| 7 | 测试 + 文档 | 集成测试、README、发布 | Day 13-14 |

### 验收标准

- [ ] `clawsafety scan <path>` 正常运行
- [ ] 20 条规则全部实现且有测试
- [ ] 对 cybersec-skills 中 5 个 skill 进行实测，结果合理
- [ ] 终端输出彩色、可读
- [ ] JSON/SARIF 输出格式正确
- [ ] README 包含安装和使用说明
- [ ] GitHub Release 发布预编译二进制（macOS arm64 + Linux amd64）

### 发布动作

- [ ] GitHub 开源发布
- [ ] 发 Twitter 宣传（结合 ClawHavoc 事件）
- [ ] 在 OpenClaw 社区发帖
- [ ] 给 cybersec-skills 的 30+ skill 跑一遍扫描，发布安全报告

---

## v0.2 — GitHub 集成

> 目标：连接 GitHub 仓库，每次 PR 自动扫描

### 里程碑

| # | 任务 | 产出 |
|---|------|------|
| 1 | GitHub App 注册 + OAuth 流程 | 用户可以 GitHub 登录 |
| 2 | Webhook 处理 | 接收 push/PR 事件，触发扫描 |
| 3 | 异步扫描队列 | Redis + Worker，支持并发扫描 |
| 4 | PR Comment | 扫描结果自动评论到 PR |
| 5 | Check Run (SARIF) | 集成 GitHub Code Scanning |
| 6 | Web Dashboard | 扫描历史、评分趋势、仓库管理 |
| 7 | Badge API | 动态评分徽章，嵌入 README |

### 验收标准

- [ ] GitHub OAuth 登录 → 选择仓库 → 自动扫描，全流程 < 60 秒
- [ ] PR 提交后 30 秒内出扫描评论
- [ ] Dashboard 可查看历史扫描和趋势
- [ ] Badge 实时更新评分

---

## v0.3 — 自动修复 + 公开扫描

> 目标：自动生成修复 PR；任何人可以扫描任何公开 skill

### 里程碑

| # | 任务 | 产出 |
|---|------|------|
| 1 | 修复代码生成 | 基于规则自动生成修复 diff |
| 2 | 自动修复 PR | 检测到问题后自动创建修复分支和 PR |
| 3 | URL 即时扫描 | 粘贴 GitHub URL，无需登录即可扫描 |
| 4 | ClawHub 全量扫描 | 自动爬取 + 扫描所有公开 skill |
| 5 | 安全排行榜 | 公开 skill 安全评分排名 |

### 验收标准

- [ ] 自动修复 PR 覆盖 60%+ 的常见问题
- [ ] URL 扫描 < 30 秒出结果
- [ ] ClawHub Top 100 skill 全部有评分

---

## v1.0 — Enterprise

> 目标：团队管理 + 运行时监控 + 商业化

### 功能

| 功能 | 描述 |
|------|------|
| Team Dashboard | 团队 skill 资产全景、成员管理 |
| 合规策略 | 设置最低评分阈值，低于阈值自动阻断 |
| 自定义规则 | 用户编写自定义扫描规则 |
| SBOM 生成 | 生成 Skill 的 Software Bill of Materials |
| 审计日志 | 完整的操作和扫描审计记录 |
| 运行时监控 | Skill 执行行为监控（v1.0+） |
| Skill 签名 | 数字签名发布和验证 |
| 私有部署 | 支持企业私有化部署 |

---

## Do Things That Don't Scale（MVP 阶段）

在 v0.1 ~ v0.2 期间，手动完成以下动作：

| 动作 | 目的 |
|------|------|
| 手动扫描 ClawHub Top 50 skill，给作者发邮件/PR | 获取首批用户 |
| 在 ClawHavoc 相关讨论帖中发 ClawSafety | 蹭热点引流 |
| 给安全问题较多的 skill 主动提交修复 PR | 建立社区信任 |
| 在 Twitter/X 发布 skill 安全报告 | 内容营销 |
| 联系 OpenClaw 核心团队，争取官方推荐 | 平台背书 |

---

## 关键里程碑时间线

```
Week 1-2:   v0.1 CLI 扫描器发布
Week 3:     对 ClawHub Top 50 skill 跑扫描，发布安全报告
Week 4-6:   v0.2 GitHub 集成上线
Week 7:     首批 Pro 付费用户
Week 8-9:   v0.3 自动修复 + 公开扫描
Week 10-11: ClawHub 官方集成
Week 12+:   v1.0 Enterprise 功能
```

---

## docs/SCAN_RULES.md

# ClawSafety - Scan Rules Specification

## 规则体系概览

ClawSafety 扫描规则分为 5 大类，MVP 阶段实现 20 条核心规则。

每条规则包含：
- **ID**: `CS-{类别}-{编号}` (e.g., CS-INJ-001)
- **严重性**: Critical / High / Medium / Low / Info
- **扫描目标**: SKILL.md / scripts/ / config/ / dependencies
- **检测方式**: 正则匹配 / AST 分析 / 依赖查询

---

## 1. 命令注入与代码执行 (INJ)

### CS-INJ-001: Shell 命令注入
- **严重性**: Critical
- **目标**: `scripts/*.sh`, `scripts/*.py`
- **检测**: 未转义的变量直接拼入 shell 命令
- **模式**:
  ```
  # Bash: 变量未引用直接进入命令
  eval $USER_INPUT
  bash -c "$CMD"
  $(echo $PARAM)

  # Python: subprocess 使用 shell=True + 拼接
  subprocess.run(f"cmd {user_input}", shell=True)
  os.system(f"rm {filename}")
  ```
- **修复**: 使用参数化调用，避免 shell=True

### CS-INJ-002: SQL 注入
- **严重性**: Critical
- **目标**: `scripts/*.sh`, `scripts/*.py`
- **检测**: 字符串拼接构造 SQL 语句
- **模式**:
  ```
  # Bash + DuckDB/SQLite
  duckdb "$DB" "INSERT INTO t VALUES ('$NAME')"

  # Python
  cursor.execute(f"SELECT * FROM t WHERE id = '{user_id}'")
  ```
- **修复**: 使用参数化查询

### CS-INJ-003: 危险函数调用
- **严重性**: High
- **目标**: `scripts/*.py`
- **检测**: 使用 eval/exec/compile 等危险函数
- **模式**:
  ```python
  eval(user_data)
  exec(code_string)
  compile(source, filename, mode)
  __import__(module_name)
  ```
- **修复**: 使用安全的替代方案

### CS-INJ-004: 反弹 Shell / 远程代码执行
- **严重性**: Critical
- **目标**: 全部文件
- **检测**: 反弹 shell 特征模式
- **模式**:
  ```
  bash -i >& /dev/tcp/
  nc -e /bin/sh
  python -c 'import socket,subprocess'
  curl ... | bash
  wget ... -O - | sh
  ```
- **修复**: 标记为恶意，建议移除

---

## 2. 敏感信息泄露 (SEC)

### CS-SEC-001: 硬编码密码
- **严重性**: Critical
- **目标**: 全部文件
- **检测**: 密码、密钥字面量
- **模式**:
  ```
  password = "hardcoded123"
  PASSWORD="admin123"
  neo4j_password.*=.*"[^"]{4,}"
  ```
- **排除**: 明显的占位符（`changeme`、`xxx`、`TODO`）

### CS-SEC-002: 硬编码 API Key / Token
- **严重性**: Critical
- **目标**: 全部文件
- **检测**: API Key、Token、Secret 字面量
- **模式**:
  ```
  # 通用模式
  api_key\s*=\s*["'][A-Za-z0-9_\-]{20,}["']
  token\s*=\s*["'][A-Za-z0-9_\-]{20,}["']

  # 特定平台
  sk-[A-Za-z0-9]{32,}          # OpenAI
  ghp_[A-Za-z0-9]{36}          # GitHub PAT
  AKIA[0-9A-Z]{16}             # AWS Access Key
  AIza[0-9A-Za-z_\-]{35}       # Google API Key
  ```
- **修复**: 使用环境变量

### CS-SEC-003: 私钥文件
- **严重性**: Critical
- **目标**: 全部文件
- **检测**: 包含私钥内容或引用私钥文件
- **模式**:
  ```
  -----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----
  .pem, .key 文件在仓库中
  ```
- **修复**: 加入 .gitignore，使用密钥管理服务

### CS-SEC-004: URL 中包含凭证
- **严重性**: High
- **目标**: 全部文件
- **检测**: URL 中嵌入用户名密码或 key 参数
- **模式**:
  ```
  https?://[^:]+:[^@]+@          # user:pass@host
  [?&]key=[A-Za-z0-9]{16,}       # ?key=xxx
  [?&]token=[A-Za-z0-9]{16,}     # ?token=xxx
  ```
- **修复**: 使用 header 传递认证信息

---

## 3. 依赖与供应链 (DEP)

### CS-DEP-001: 不安全的依赖安装
- **严重性**: High
- **目标**: `scripts/*.sh`, `skill.yaml`
- **检测**: curl pipe bash、不验证下载内容
- **模式**:
  ```bash
  curl ... | bash
  curl ... | sh
  wget ... -O - | sh
  pip install --break-system-packages
  ```
- **修复**: 验证下载内容的签名/哈希

### CS-DEP-002: 依赖版本未锁定
- **严重性**: Medium
- **目标**: `skill.yaml`, `requirements.txt`, `pyproject.toml`
- **检测**: 版本范围过宽或无版本约束
- **模式**:
  ```
  requests>=2.0          # 范围过宽
  requests               # 无版本约束
  ```
- **修复**: 使用精确版本或窄范围（`requests==2.31.0` 或 `~=2.31`）

### CS-DEP-003: 已知漏洞依赖
- **严重性**: High (根据 CVE 等级动态调整)
- **目标**: `skill.yaml`, `requirements.txt`
- **检测**: 查询 OSV / NVD 数据库
- **实现**: 解析依赖列表 → 查询漏洞数据库 → 报告 CVE
- **修复**: 升级到修复版本

### CS-DEP-004: 从不可信源下载数据
- **严重性**: Medium
- **目标**: `skill.yaml`, `scripts/*`
- **检测**: 从非官方源下载可执行文件或配置
- **模式**:
  ```yaml
  data_files:
    - url: https://raw.githubusercontent.com/...  # 无签名验证
  ```
- **修复**: 添加 SHA256 校验

---

## 4. 权限与隔离 (PRM)

### CS-PRM-001: 权限过度申请
- **严重性**: Medium
- **目标**: `SKILL.md`
- **检测**: Skill 声明了不必要的权限
- **规则**:
  - 读取型 skill 不应申请写权限
  - 分析型 skill 不应申请网络外连权限
  - 对比 skill 描述与实际 allowed-tools

### CS-PRM-002: 访问敏感系统路径
- **严重性**: High
- **目标**: `scripts/*`
- **检测**: 读写系统敏感路径
- **模式**:
  ```
  /etc/shadow
  /etc/passwd
  ~/.ssh/
  ~/.aws/credentials
  ~/.claude/
  /proc/
  /sys/
  ```
- **修复**: 使用最小必要路径

### CS-PRM-003: 环境变量滥用
- **严重性**: Medium
- **目标**: `scripts/*`
- **检测**: 读取大量不相关的环境变量
- **规则**: skill 只应读取自己声明需要的环境变量
- **模式**:
  ```python
  os.environ  # 读取全部环境变量
  for key in os.environ:  # 遍历环境变量
  ```
- **修复**: 使用 `os.environ.get("SPECIFIC_VAR")`

### CS-PRM-004: 不安全的文件权限
- **严重性**: Low
- **目标**: `scripts/*`
- **检测**: 脚本设置过于宽松的文件权限
- **模式**:
  ```
  chmod 777
  chmod a+rwx
  os.chmod(path, 0o777)
  ```
- **修复**: 使用最小必要权限（如 0o755 或 0o600）

---

## 5. Skill 配置与规范 (CFG)

### CS-CFG-001: 缺少 SKILL.md
- **严重性**: High
- **目标**: 项目根目录
- **检测**: 没有 SKILL.md 文件
- **修复**: 创建 SKILL.md，声明 skill 基本信息

### CS-CFG-002: 缺少版本声明
- **严重性**: Low
- **目标**: `SKILL.md`
- **检测**: SKILL.md 中没有版本号
- **修复**: 在 SKILL.md 中添加版本号

### CS-CFG-003: 缺少权限声明
- **严重性**: Medium
- **目标**: `SKILL.md`
- **检测**: 没有声明 allowed-tools 或权限需求
- **修复**: 明确声明 skill 需要的工具和权限

### CS-CFG-004: SKILL.md Prompt Injection 风险
- **严重性**: Medium
- **目标**: `SKILL.md`
- **检测**: SKILL.md 中包含可能的 prompt injection 载荷
- **模式**:
  ```
  Ignore previous instructions
  You are now
  Disregard all prior
  System:
  <system>
  ```
- **修复**: 移除可疑指令

---

## 规则严重性统计

| 严重性 | 数量 | 规则 |
|--------|------|------|
| **Critical** | 5 | INJ-001, INJ-002, INJ-004, SEC-001, SEC-002, SEC-003 |
| **High** | 6 | INJ-003, SEC-004, DEP-001, DEP-003, PRM-002, CFG-001 |
| **Medium** | 6 | DEP-002, DEP-004, PRM-001, PRM-003, CFG-003, CFG-004 |
| **Low** | 3 | PRM-004, CFG-002 |

---

## 规则引擎设计

### 规则定义格式 (YAML)

```yaml
id: CS-INJ-001
name: Shell Command Injection
severity: critical
category: injection
targets:
  - "scripts/*.sh"
  - "scripts/*.py"
patterns:
  - regex: 'eval\s+\$'
    language: bash
    description: "eval with unquoted variable"
  - regex: 'subprocess\.run\(f["\'].*\{.*\}.*["\'],\s*shell\s*=\s*True'
    language: python
    description: "subprocess with shell=True and f-string"
fix_suggestion: "Use parameterized commands instead of string interpolation"
references:
  - "https://owasp.org/www-community/attacks/Command_Injection"
cwe: CWE-78
```

### 扫描流程

```
1. 解析目标目录结构
2. 识别 Skill 类型（检查 SKILL.md 存在）
3. 按文件类型匹配适用规则
4. 执行规则检查（正则 / AST / 外部查询）
5. 收集 findings
6. 计算安全评分
7. 生成报告（终端 / JSON / SARIF）
```

### 评分计算

```
base_score = 100
for finding in findings:
    if finding.severity == "critical":
        base_score -= 25
    elif finding.severity == "high":
        base_score -= 15
    elif finding.severity == "medium":
        base_score -= 8
    elif finding.severity == "low":
        base_score -= 3

final_score = max(0, base_score)

grade = match final_score:
    90..=100 => "A"
    75..=89  => "B"
    60..=74  => "C"
    40..=59  => "D"
    _        => "F"
```

