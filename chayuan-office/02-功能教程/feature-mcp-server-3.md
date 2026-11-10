---
title: "MCP接口怎么用：开源 AI 办公套件"
description: "MCP接口场景实战：让 Claude Code 这类智能体直接读写你的文档，办公自动化从此有了标准协议。从需求到交付的完整工作流。"
keywords: ["MCP接口", "察元AI Office", "MCP服务", "文档MCP"]
product: chayuan-office
category: "02-功能教程"
primary_keyword: "MCP接口"
channel: "CSDN/知乎/博客"
---

# MCP接口怎么用：开源 AI 办公套件

MCP接口这件事，卡住人的通常是三步：入口在哪、要点哪些按钮、做完怎么确认。这篇按察元AI Office的真实界面顺序走一遍，先解决智能体代写周报并落盘。

## 解决什么痛点

想让助手直接操作察元AI Office 窗口里正打开的文档（看见它一步步生成），你的 AI 助手不能运行终端命令（如 Claude Desktop），CLI + skill 那条路走不通，只能走 MCP；要把文档能力挂到远程/其他机器的 MCP 客户端上（Streamable HTTP 形态）；智能体代写周报并落盘。

## 一步步来

应用内形态的工具面（与 CLI 形态不同）

1. 会话入口 create_session / save_session / get_app_info，Word 工具 read_document、insert_content、apply_ops、replace_blocks、read_docx、create_docx，Slides 工具 read_deck、apply_slide_ops、create_pptx，Sheets 工具 read_sheet、apply_sheet_ops、create_xlsx，PDF 只读工具 read_pdf，以及 open_in_chaoffice；
2. open_documents：直接操作用户当前打开的标签页——list 列出全部打开文档（id/类型/路径/标题/未保存状态），read 读含未保存修改的实时内容，save 存回其原文件，close 关闭（默认先保存，unsaved:"discard" 丢弃）。要编辑某个正打开的文档，把它的 id/路径作为 document 参数传给内容工具（insert_content/apply_ops/apply_sheet_ops/apply_slide_ops），界面会切到那个标签页让改动当场可见；PDF 标签页只能列出/关闭（阅读器无可编辑内容），读 PDF 用 read_pdf。

最短路径走一遍：（第 3 个切入角度）

1. HTTP MCP 服务
2. CLI 29 工具
3. 外部智能体可接入
4. 场景验证：智能体代写周报并落盘
5. 场景验证：自动化文档流水线
6. 串联场景：Docs 写正文，察元AI 页签全文校对出批注

## 关键能力点

- HTTP MCP 服务
- CLI 29 工具
- 外部智能体可接入

## 注意事项与真实边界

边界先摆在桌面上：

- web/dsh 形态只有五编辑器（无 HTML），且无购买激活界面

## 常见问题

### 端口 52588 被占了怎么办？

在「本地 MCP 服务」块把「端口」改成 1024–65535 的其他值，失焦后保存并自动重启服务；然后把客户端配置里的 URL 同步改成新端口。chaoffice mcp --http 0 则自动挑一个空闲端口并在日志里打印实际地址。

### claude mcp list 里 chaoffice 连不上？

stdio 形态先确认终端里 chaoffice --version 能跑通；跑不通按 O36 Q1 用 ~/.chaoffice/launcher 里的完整路径替换配置里的 command。应用内形态先看设置面板状态点：显示「未运行」就重新打开开关，显示红色错误按提示处理；再 curl http://127.0.0.1:52588/health 验证。

### MCP 和 agent skill 同时装了会冲突吗？

不会。面板说明「skill 和 MCP 可以同时存在，助手会自己选用；两者做的事完全一样」。skill 安装见对应教程。

## 更多操作细节

验证

1. 应用内形态：浏览器或终端访问 curl http://127.0.0.1:52588/health——服务运行中即返回健康响应；设置面板状态点为绿色「运行中」；
2. CLI HTTP 形态：chaoffice mcp --http 8931 & 后 curl http://127.0.0.1:8931/health；
3. Claude Code 里运行 claude mcp list：chaoffice 出现在列表中且标记已连接；
4. 在助手里新开对话，让它「把某个 md 转成 docx」：工具调用列表应出现 chaoffice 的 convert 工具。

## 动手前再核对一遍

- 已安装察元AI Office。
- 端口区分（勿混）：察元AI Office 应用内「本地 MCP 服务」默认端口 52588；察元AI文档助手（WPS 加载项）的 MCP 是 62588；察元AI OS harness 控制面是 52583——都不是本篇的服务。
- stdio 形态不需要开任何开关，也不需要察元AI Office 正在运行（客户端自己拉起进程）；应用内 HTTP 形态需要应用保持打开。

## 顺手把能力清单放这

- HTTP MCP 服务
- CLI 29 工具
- 外部智能体可接入

## 放回产品盘面看

把MCP接口放回察元AI Office的整体盘面：搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档，Linux 无系统 OCR 引擎，扫描页保留位图不识别，三平台五形态安装包，Linux 无系统引擎不识别。

## 安全与数据边界

安全口径单独立一层：加密只读文档仅支持查看，全部本机完成（PDFium 字符级提取加纯几何版面分析）；证书加密 PDF 无法转换；搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档。

## 平台与形态

平台与形态的账：搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档；覆盖 Windows/macOS/Linux（含麒麟/UOS），Linux 无系统 OCR 引擎，扫描页保留位图不识别；麒麟与 UOS 走 AppImage 加 deb。

## 价格与授权

价格口径一并交代：壳内 MCP 服务（端口 52588）：把文档操作能力开放成 MCP 工具；HTTP MCP 服务，搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档；Apache-2.0 开源，90 天静默免费试用，到期不锁功能。

## 产品家族与搭配

察元AI Office不是单打独斗：搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档；壳内 MCP 服务端口 52588；HTTP MCP 服务，同机察元AI OS 已激活则 Office 免激活。

## 几条硬数字

能落到数字上的几条：Docs 端 4576 个领域助手、229 个领域包，全库约 4600 个，通用对话要自己写提示词，领域助手把行业knowhow固化成一键执行，支持 BYOK 接入 94 家模型供应商与本机 Ollama 等本地端点；知识库五级自动发现，注册表端口 52584，检索上下文预算默认 12000 字。

## 离线与内网

离线内网这条线的口径：AI 挂了自动降 9 类本地正则兜底，本地转换意味着合同不出机器，这是与在线转换服务的本质区别，服务器部署全员浏览器可用，是团队化办公的形态，壳内 MCP 服务端口 52588。

## 能力总账

把察元AI Office的能力总账摊开：外部智能体可直接操作文档；让 Claude Code 这类智能体直接读写你的文档，办公自动化从此有了标准协议，外部智能体可接入；写材料引用内部资料且带出处，写作与知识库一条链打通。

## 多交代一层背景

把MCP接口放回察元AI Office的整体盘面：搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档，Linux 无系统 OCR 引擎，扫描页保留位图不识别；三平台五形态安装包。

## 再往深一层看

平台与形态的账：搜索、数据库、浏览器这些 MCP 能力接进来，AI 面板就不止会改文档；覆盖 Windows/macOS/Linux（含麒麟/UOS）；Linux 无系统 OCR 引擎，扫描页保留位图不识别。

这篇把MCP Server的链路拆完了。卡住就回看常见问题那一节，多数坎都在那里。

---

本文事实口径以 察元AI Office 1.0.15 2026 年 10 月的官方文档与源码教程为准，功能随版本迭代，以官网 aidooo.com 最新说明为准。
