# 自主智能体安全防护体系设计

> 一本面向工程团队的 Agent 安全设计手册——把分散在论文、白皮书、开源工具中的 25 份材料(R1-R23),收敛为可直接落地的 framework。

📘 **整本 PDF**:见 [Releases 页](../../releases) 下载最新整本(137 页 / ~7 MB)

🌐 **在线浏览交互式原型**:打开 [prototypes/v3-skeleton/v3-prototype.html](prototypes/v3-skeleton/v3-prototype.html)(7 个 tab,含全景图、攻击面、CIK 验证矩阵、6 方案"防护形状"对比、28 工具栈)

---

## 全书结构(10 章 + 3 附录)

| | 章节 | 主要内容 |
|--|--|--|
| 第 1 章 | [范式转移与全书摘要](v3_第1章_范式转移与全书摘要.md) | 能力跃迁、攻击面扩展、三个根本命题、四层结构概览 |
| 第 2 章 | [材料综述与归类](v3_第2章_材料综述与归类.md) | 25 份材料的索引 / 类型 / 核心引用 |
| 第 3 章 | [Agent 安全框架](v3_第3章_Framework.md) | 顶层 4 设计原则 / 核心矩阵 / 叠加层 / 派生层 |
| 第 4 章 | [架构建模与攻击面](v3_第4章_架构建模与攻击面.md) | 7 层智能体参考架构 + 12 攻击面 + Kill Chain |
| 第 5 章 | [威胁全景与攻击场景](v3_第5章_威胁全景与攻击场景.md) | 7 类对抗技术 × 12 攻击面;OWASP/MITRE/AIRT 三方映射 |
| 第 6 章 | [四层防御实施](v3_第6章_四层防御实施.md) | 事前 / 事中 / 事后 / 跨智能体 + 跨层协同 |
| 第 7 章 | [安全可验证性设计](v3_第7章_安全可验证性设计.md) | CIK × 4 层 = 12 验证单元格 + 8 测试集合 + 红蓝对抗 |
| 第 8 章 | [工具链选型与方案对比](v3_第8章_工具链选型与方案对比.md) | 28 工具 / 6 方案"防护形状" / 三框架协作 / cross/K 产业空白 |
| 第 9 章 | [部署模式与企业适配](v3_第9章_部署模式与企业适配.md) | 三档蓝图 / 五行业垂直 / 合规对接 / CLAW-10 评估 / 五阶段路线图 |
| 第 10 章 | [真实案例深析](v3_第10章_真实案例深析.md) | 邮件助手记忆投毒 / SSRF→Token→Exec / Crescendo / yahoofinance Skill |
| 附录 A | [攻防全量映射表](v3_附录A_攻防全量映射表.md) | 12 攻击面 × 4 层 / 7 对抗技术触达表 / 三方分类法索引 |
| 附录 B | [测试库与验证接口 Schema](v3_附录B_测试库与验证接口Schema.md) | 8 测试集合速查 / YAML 用例 Schema / 4 接口 JSON Schema |
| 附录 C | [R 编号 × 章节 引用矩阵](v3_附录C_R编号引用矩阵.md) | 25 × 10 引用矩阵 + 核心论据材料 |

---

## 核心设计

```
顶层 ── 4 设计原则:默认零信任 / 统一跨层策略执行 / 持续性安全运营 / 可验证的安全保障
   │
核心矩阵 ── 4 层防御 × CIK 三维 = 12 单元格
   │           4 层:事前准入 / 事中拦截 / 事后运营 / 跨智能体
   │           CIK:能力 (Capability) / 身份 (Identity) / 知识 (Knowledge)
   │
叠加层 ── 12 攻击面 S1-S12 + 6 主流防护方案的"防护形状"
   │
派生层 ── 5 维智能体画像 + 28 工具栈 + 8 测试集合
```

---

## 本地构建 PDF

```bash
# 依赖:python3 + pip install weasyprint markdown pypdf
#       chromium(供截图)+ optional mmdc(供 Mermaid → PNG)

cd agent-security-frame
python3 tools/build_book.py
# 输出:output/自主智能体安全防护体系设计_完整版.pdf
```

如需重新生成 prototypes 的 7 张配图截图:

```bash
cd prototypes/v3-skeleton && python3 -m http.server 8000 &
cd ../../
python3 tools/screenshot_v3_tabs.py    # 截图 → figures/v3/
python3 tools/trim_screenshots.py      # 裁白边
```

---

## 引用材料说明

本书引用的 25 份原始材料(R1-R23)中,部分材料(R1 / R13a / R13b 内部文档,以及版权受限的厂商白皮书 / arXiv 预印本 / NIST 公开标准)**未直接随仓库分发**。读者可凭 R 编号在 [`materials/materials-outline.md`](materials/materials-outline.md) 中查到对应的来源链接(arXiv URL、GitHub 仓库、官方下载页),自行获取原文。

仓库中保留的 `materials/**/R*.md` 是**研究笔记**(我对各份材料的精炼摘要 + 工程视角分析),非原文转载。

---

## 许可证

本仓库采用**双许可证**模式:

- **代码部分** (`tools/`、`prototypes/`) — [MIT License](LICENSE)
- **内容部分** (`v3_*.md` 章节文本、`figures/v3/*.png` 截图、`materials/**/*.md` 研究笔记) — [Creative Commons Attribution 4.0](LICENSE-CONTENT.md)(允许复制 / 改编 / 商业使用,要求署名)

---

## 引用本书

```bibtex
@book{agentsec2026,
  title  = {自主智能体安全防护体系设计},
  author = {showrun.lee},
  year   = {2026},
  url    = {https://github.com/<your-org>/agent-security-frame},
  note   = {137 页;10 章 + 3 附录}
}
```

---

## 贡献与反馈

欢迎以 issue / discussion 形式提:

- 章节疑问与勘误
- 新材料推荐(R24+)
- cross/K 产业空白方向的研究 / 工程进展
- 真实案例补充

PR 请优先使用既有的"R 编号 + 章节 §X.Y"引用约定,以保持全书的引用一致性。
