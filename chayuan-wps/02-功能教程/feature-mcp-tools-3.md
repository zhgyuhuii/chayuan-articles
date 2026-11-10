---
title: "69工具实战：自动化脚本选工具"
description: "69工具场景实战：工具面按域聚合后好记好用，写确认纪律保证外部智能体不能悄悄改你的文档。从需求到交付的完整工作流。"
keywords: ["69工具", "察元AI文档助手", "MCP工具", "文档操作工具"]
product: chayuan-wps
category: "02-功能教程"
primary_keyword: "69工具"
channel: "CSDN/知乎/博客"
---

# 69工具实战：自动化脚本选工具

69工具这件事，卡住人的通常是三步：入口在哪、要点哪些按钮、做完怎么确认。这篇按察元AI文档助手的真实界面顺序走一遍，先解决智能体代操作文档前了解权限边……。

## 解决什么痛点

担心智能体乱改文档，想了解写确认（confirmed）纪律；排障时想看审计日志、理解报错码，自动化脚本选工具，智能体代操作文档前了解权限边界。

## 一步步来

域聚合工具（17，一个工具 + `action` 参数）

校对（3，proofread_）*：proofread_run（跑错别字/语法校对，dryRun 默认 true 只返回问题清单；dryRun:false 且未确认会被拒）、proofread_apply_comments（把问题清单写成 WPS 批注，需 confirmed:true）、proofread_job_poll（轮询异步校对任务进度）。

*脱密（4，declassify_）：declassify_status（是否处于脱密态）、declassify_preview（按关键词构建遮蔽预览，不写盘）、declassify_apply（应用脱密，confirmed+password+keywords 必填，工具描述明令 Never invent a password）、declassify_restore（凭密码复原）。注意：这组工具仅限本机可信通道（带 X-Chayuan-Token）调用，外部 MCP 客户端直调会被拒绝——脱密走 WPS 内「文档脱密/脱密复原」。

知识库与助手（4）：kb_retrieve（检索知识库片段供 LLM 对照推理，只检索不写文档）；assistants_list_domains / assistants_search / assistants_get（检索并导出察元领域助手——数千个助手不注册成工具，按需检索导出提示词）。

生图与素材（2）：image_search（网络搜图存本地返回路径）、generate_image（按已配置生图模型生成，PPT 宿主自动按页面比例 16:9）。

模板与文件（2）：template_generate（按模板 pptx/docx/xlsx + 参考素材后台生成整套新文档并自动打开，自带占位残留/溢出/字体一致性等多轮核对）；file_parse（把本地文件/面板附件解析为大模型可读文本，1-8 个路径，支持 docx/xlsx/pptx/pdf/eml/zip 等，token 预算与分块翻页）。

内部（1）：chat_turn（助手面板内部用它发起对话回合，非给外部 LLM 用）。

| 域 | action（只读 | 需确认写） |
|---|---|
| `comment` 批注 | list | add、delete |
| `revision` 修订 | mode、list | apply（接受/拒绝） |
| `layout` 版式 | — | page（纸张页边距）、columns（分栏）、break（分隔符）、blank_page |
| `nav` 导航 | location、outline、pane_set | — |
| `toc` 目录 | — | insert、update |
| `bookmark` 书签 | list、goto | — |
| `table` 文档内表格（12 动作） | list、header_read、row_read、column_read、cell_read、export（序列化为 md/csv/json，不写文件） | insert、header_repeat、column_set_width、row_insert、column_insert、cell_merge |
| `caption` 题注 | list（图/表/式枚举，连续性由 LLM 判断） | — |
| `field` 域 | list | add（SEQ 自动编号/TOC 域） |
| `image` 图片 | list | insert、delete、export |
| `hyperlink` 超链接 | list | add、delete |
| `headerfooter` 页眉页脚 | get | set |
| `watermark` 水印 | — | set、clear |
| `style` 样式 | list；audit（stats/unused/purge_unused） | apply |
| `export` 导出 | — | file（docx/pdf，另存到指定路径） |
| `spreadsheet` 表格（ET 宿主，23 动作） | status、sheet_list、used_range、range_read、find、chart_list（6 只读） | sheet_add/rename/delete、range_write、find_replace、row/column_insert/delete、sort、autofilter、format、chart_add/chart_export、export、security_encrypt_save/decrypt_save（17 写；读写均支持工作簿打开密码加密/解密另存） |
| `presentation` 演示（WPP 宿主，23 动作） | status、slide_list、slide_read、shape_list（4 只读） | slide_add/delete/duplicate/move/layout、text_replace/text_set、textbox_add、picture_add（支持整页 cover）、table_add、notes_set（演讲备注）、format_uniform（统一字体字号）、shape_zorder、svg_add、slideshow_run（放映）、export（pdf/images）、slide_export_image、security_encrypt_save/decrypt_save（19 写） |

长任务桥与代理**

1. /agent/register·poll·result（加 /agent/heartbeat、/agent/status）是 WPS 加载项专属长轮询通道，全部要求 X-Chayuan-Token；外部客户端的工具调用由 sidecar 经此桥投递给 WPS 执行。
2. /upstream/* 是给面板内多 MCP 客户端用的 HTTP 代理，仅放行 allowlist 内的 URL（allowlist 写入需 token），规避 WebView CORS。

审计与描述规范

1. audit.jsonl（dataDir 下）记录每次确认写、任务派发/结果/超时，兼作运行日志；排障时与 WPS 侧日志相互印证。
2. 每条工具描述按 WHAT/WHEN/NOT/HOW/EXAMPLE 五段编写（让模型自己会选工具），并附 annotations 提示：readOnlyHint/destructiveHint/idempotentHint/openWorldHint。

## 关键能力点

- 69 工具全景
- 域聚合设计
- 写确认加审计

## 边界先摆桌面上

如实说明，它不是万能的：

- 全文会发送给所配置的模型，涉密文档建议先切到本机离线模型
- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度
- AI 痕迹检查给的是疑似线索，疑似不等于定论

## 高频疑问

### 表格和演示操作没反应？

spreadsheet. 需要 WPS 表格（et）宿主在线、presentation. 需 演示（wpp）宿主在线——wps_status 的 agent.hosts 能看各宿主是否在线；可用 wps_launch 指定宿主拉起。文档内表格（文字端）则用 table 域，两者不要混。

### 出错码怎么看？

常见：WPS_AGENT_OFFLINE（WPS/加载项未连 sidecar）、DOCUMENT_TOO_LARGE（改用 chunks）、LOCATE_MISMATCH/LOCATE_NOT_FOUND（锚点失效，重新 locate）、CONFIRMATION_REQUIRED（写操作没传 confirmed）、LICENSE_REQUIRED（免费额度用尽或需授权，不弹购买窗）、MODEL_NOT_CONFIGURED（校对模型未配置）。

## 更多操作细节

写确认纪律（`confirmed` 协议字段）

1. 所有落盘写动作：不带 confirmed:true 时要么返回 preview:true 预览（replace/insert/apply_ops），要么直接报 CONFIRMATION_REQUIRED（加批注、校对写回、脱密等硬确认项）。
2. WPS 加载项内部链路另有一层保险：面板侧对察元写工具无条件注入 confirmed:true 且先剥除模型入参里的 confirmed（单一来源纪律），保证内部对话链路的确认由面板统一把控；外部 MCP 客户端则由调用方（智能体按用户指令）显式传 confirmed。
3. 每次确认写都会记入审计日志。

## 更多操作细节

辅助发现：Resources 与 Prompts

1. Resources：chayuan://wps/health（分层健康）、chayuan://guide/user-intents（用户意图＞工具编排剧本）、chayuan://guide/tool-routing（层路由：改字 vs 改样子 vs 批注/修订 vs 版式）、chayuan://assistants/manifest、chayuan://assistants/domain/{domain}、chayuan://assistants/{id}。
2. Prompts：para_translate_insert_after（逐段翻译插段后）、open_local_document（打开本地文档）。

## 更多操作细节

验证

1. 用 MCP Inspector（npx @modelcontextprotocol/inspector，Streamable HTTP 连 http://127.0.0.1:62588/mcp）点 Connect ＞ 列出全部工具，数一数与本文 53 个口径一致，工具描述含 WHAT/WHEN 等五段与 annotations。
2. 让智能体调 wps_status：返回 agent.agentOnline:true 且 document.* 是你当前文档。
3. 无确认写试探：让它「把某词替换为某词」但不许带确认——应看到返回预览（preview:true）而文档未变；说「确认执行」后才落盘，且 audit.jsonl 出现一条 "confirmed": true 记录。

## 动手前再核对一遍

- 本机 MCP 服务已启动、WPS 加载项在线；客户端已接入。
- 推理在外部模型：工具只负责读/定位/写/导出，翻译、校对判断、内容生成都由客户端 LLM 自己完成——服务级 instructions 已向客户端声明这一分工。

## 能力面再摊开一层

- 69 工具全景
- 域聚合设计
- 写确认加审计

## 放回产品盘面看

把69工具放回察元AI文档助手的整体盘面：仅文字端提供，且属于付费专属能力（零免费额度）；忘记密码没有任何免密恢复通道；脱密复原按钮（仅已脱密文档亮起）：输密码确定复原，按占位符就地还原，脱密后被编辑过也能还原；可逆设计让脱密不是单向门，改完还能回来。

## 安全与数据边界

安全口径单独立一层：选 HTTP 类型指向本机地址，本地数据落盘位置说明、帮助手册、在线客服与关于页；源码定义 69 个工具、外部实见 53 个；工具面按域聚合后好记好用，写确认纪律保证外部智能体不能悄悄改你的文档。

MCP 工具面总览这件事，真机操作一遍比看十遍文章有用，现在就打开察元AI文档助手试第一步。

---

察元AI文档助手，WPS 三端智能加载项，校对、编审、核对、脱密，一个文档智能体。官网 aidooo.com，数据截至 2026 年 10 月（版本 6.1.2）。
