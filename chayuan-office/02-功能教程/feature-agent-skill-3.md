---
title: "从需求到交付：SKILL.md实操"
description: "SKILL.md实操场景实战：让编程智能体天生会用办公套件，写代码调文档 API 不用翻文档。从需求到交付的完整工作流。"
keywords: ["SKILL.md实操", "SKILL.md", "察元AI Office", "Agent技能", "技能安装"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "SKILL.md实操"
channel: "CSDN/知乎/博客"
---

# 从需求到交付：SKILL.md实操

SKILL.md实操的要义，是让一份技能文件替你记住全部操作口径：智能体装上它，生成 PPT、转 PDF、改 Word 这些动作张口就来，不必每次翻手册拼命令。这篇按「需求出现到结果交付」的顺序，把可复用的路径完整走一遍。

## 为什么值得了解

希望由 Claude Code 这类智能体代劳文档的生成与修改；在用 Claude Code / Codex / Cursor 等 AI 编码智能体，想让它们「开箱就会」操作 Office 文件（生成 PPT、转 PDF、改 Word），而不是你每次手写 chaoffice 命令；用的智能体不在 7 家之列，想手动把 skill 文件放进它的技能目录；装了新版本的本体应用，skill 有更新，想一键同步到所有在用的智能体。

## 实操全过程

方式 A · 终端 CLI：`chaoffice skill`

1. 摸底本机环境用 chaoffice skill list：它会列出 7 家目标智能体（Claude Code、Codex、Cursor、Gemini CLI、GitHub Copilot、OpenCode、Windsurf），逐行给出检测结果（以配置目录是否存在判定）、技能目录完整路径、安装状态与版本；detail 字段还带随附 skill 的版本号与 SKILL.md 路径；
2. 装载命令：chaoffice skill install <agent|all> [--dir <路径>] [--force]
3. install all 仅覆盖检测到的智能体；一台都没检测到时直接报错，并引导改用 --dir；
4. --dir <路径> 指定任意落盘位置（最终产出 <路径>/chaoffice/SKILL.md），7 家名单之外的助手走这条路；
5. 缺省 --force 时有三重防护：目标智能体未检测到（拒绝，提示 --force 才新建目录）、已装 skill 较新（拒绝降级）、文件被手改过（拒绝覆盖，同样提示 --force）、目录被其他内容占用（报 occupied）。全部目标先整体检查、后统一执行，中途拒绝不会留下半成品；
6. 参考用法：chaoffice skill install claude-code；chaoffice skill install all；
7. 查随附文件位置：chaoffice skill path 输出内置 SKILL.md 的完整路径与版本号；
8. 7 家目标与技能目录对照（CLI 与界面一致）：

| 智能体 | 技能目录 |
|---|---|
| Claude Code | `$CLAUDE_CONFIG_DIR` 或 `~/.claude/skills` |
| Codex | `$CODEX_HOME` 或 `~/.codex/skills` |
| Cursor | `~/.cursor/skills` |
| Gemini CLI | `~/.gemini/skills` |
| GitHub Copilot | `~/.copilot/skills` |
| OpenCode | `$XDG_CONFIG_HOME/opencode/skills` 或 `~/.config/opencode/skills` |
| Windsurf | `~/.codeium/windsurf/skills` |

方式 B · 图形界面：设置 ＞ 集成

1. 进入应用的设置 ＞ 集成页，顶部写明「在 AI 助手里使用 察元AIOffice」，首块即「把 skill 安装到你的助手」（右上角标着随附版本「skill <版本>」）；
2. 界面仅显示本机检测到的助手，每行按状态在右侧给按钮：
    1. 「skill 未安装」＞「安装」；
    2. 「已安装 <版本>，可更新到 <新版本>」或非本应用装的旧版 ＞「更新」；
    3. 「已安装 <版本>（已被修改）」＞「更新」（确认块会提示「会覆盖你对该文件的修改。」）；
    4. 「已安装 <版本>（比本应用附带的新）」＞「重新安装为 <版本>」；
    5. 「目录已被占用」＞「覆盖」（确认块提示「会替换该目录中现有的 SKILL.md。」）；
    6. 已装的三种正常态都有「卸载」；
    7. 点按钮后出现确认块「将写入：<SKILL.md 完全路径>」（卸载为「将删除：…」），点「确认」执行；成功显示「已安装。新开一个会话后生效。」；
    8. 「没有列出我的助手」折叠区提供三条通用路（装的都是同一份 skill，任选其一）：A「安装到其他目录…」（弹出「选择 skills 目录」选择器）、B「下载 skill（zip）」（保存 zip 后交给助手自装，完成后提示「已保存到 <路径>」）、C 用 skills 命令安装（终端运行 npx skills add zhgyuhuii/ChayuanAIOffice，需 Node.js）；
    9. 同页「试一试」区给出三句可直接复制的示例提问（「把 ~/Downloads/report.md 转成 Word 文档」「做一份 6 页的幻灯片，介绍我们第三季度的业绩」「把 budget.xlsx 转成 PDF，并在 察元AIOffice 里打开」）；
    10. 卸载只删本应用写入并记录在案的文件（按台账判定）；目录里若有其他文件会保留。

状态机（两种方式共用，`skill list` 的 `status` 字段即此）

1. 判定依据：front matter 的 name + metadata.version、文件 sha256 与台账（userData 的 app-settings.json 里 agentSkillInstalls 键，记录每次写入的版本/哈希/时间/渠道 app·zip·cli）。

| 状态 | 含义 |
|---|---|
| `missing` | 技能目录里没有 chaoffice/ |
| `installed` | 本应用写入、版本与字节和随附一致 |
| `outdated` | 本应用写入、版本比随附旧 |
| `modified` | 本应用写入、但文件被改过（与台账里的 sha256 不符） |
| `foreign` | front matter 认得是我们的 skill，但不是本应用写的（别的机器/npx/手工） |
| `newer` | 已装版本比随附还新（谁写的都算） |
| `occupied` | chaoffice/ 目录存在但不是我们的 skill |

## 关键能力点

- 7 家智能体投放
- 版本化技能包

## 实操前的边界认知

边界不认清，实操容易踩空：

- web/dsh 形态只包含五个编辑器、没有 HTML，购买与激活入口也无从谈起

## 常见问题

### 技能装好了，智能体却依旧不认 chaoffice 命令，卡在哪？

两个检查点：其一，skill 必须新开会话才生效（面板原文提示「已安装。新开一个会话后生效。」）；其二，智能体所在环境要能执行命令本体——在里面跑一遍 chaoffice --version，不通就按 O36 第 2-3 步排查。

### 安装时报「the installed skill was edited by hand; not overwriting」是什么情况？

这是已装的 SKILL.md 被你或其他工具改动过的信号。确定改动可弃就追加 --force 覆盖：chaoffice skill install <agent> --force；改动还想留，先备份再说。

### 提示「a newer skill X is installed; not downgrading」该怎么办？

本机版本新过随附版本（常见于先前装过更新的应用版本）。确要降级才加 --force；不动它也行，现有版本照常工作。

## 怎么验证装好了

验证

1. chaoffice skill list --json 里看目标智能体：status 应为 installed，installed_version 与随附版本一致；
2. 直接翻技能目录核对文件，例如 ls ~/.claude/skills/chaoffice/SKILL.md；
3. 界面里对应行的状态文字应变成「已安装 skill <版本> · 下次对话即可使用」；
4. 终极验证是给智能体新开对话，直接下指令「把桌面上的 xx.md 转成 Word」，看它自行调用 chaoffice convert（旧会话不会自动加载新 skill）。

## 补充答疑

### 手头的智能体不在那 7 家之列，还有办法装吗？

「没有列出我的助手」折叠区给了三条出路：界面「安装到其他目录…」直接指定它的 skills 目录；或 CLI 执行 chaoffice skill install --dir <它的技能目录>；或「下载 skill（zip）」拿压缩包让它自己装。凡是能读 SKILL.md 目录的助手都适用。

### 状态写着「已安装（非本应用安装）」，需要动手处理吗？

foreign 状态的含义：文件确实是这份 skill（front matter 可识别），但并非本机应用写入（可能来自别的机器或 npx 安装）。旧于随附版本时界面提供「更新」按钮；不旧就无需理会。

### 主应用升级之后这些 skill 要跟着重装吗？

不用手动重装。随附 skill 版本一升级，已装助手那行会亮出「更新」按钮（CLI 侧 skill list 显示 outdated），点击或执行 chaoffice skill install all 即完成同步；没有提示即说明仍是最新。

## 实操前的自查

- 本体应用已装好。
- skill 扮演的是说明书角色，实际执行依赖 chaoffice 命令行可达。
- CLI 与图形界面共享同一份台账文件，两端状态互通。

## 实操之外还有哪些资源

应用内手册用 F1 或 Cmd 加斜杠唤出，18 主题乘 22 语言的图文内容覆盖常见疑问；手册之外，Linux 无系统 OCR 引擎、扫描页保留位图不识别这条边界在实操中同样适用，别让智能体去碰它办不到的事。

从需求到交付的闭环，到「新开会话、下指令、看转换」这一步才算真正合拢。

---

SKILL.md 实操路径与状态判定对应 1.0.15 版本，数据截至 2026 年 10 月；本文限定从需求到交付的实操链路与验证，安装器设计与内部实现细节不在范围，版本迭代后以官方文档为准。
