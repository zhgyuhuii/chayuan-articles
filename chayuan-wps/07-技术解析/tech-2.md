---
title: "写确认纪律实现深度解析：机制、设计与取舍"
description: "写确认纪律实现深度解析：本机 MCP 服务（sidecar 0.13.0）对外暴露一套文档智能体工具：机制、设计取舍与边界一次讲清。"
keywords: ["写确认纪律实现", "察元AI文档助手", "技术解析", "原理"]
product: chayuan-wps
category: "07-技术解析"
primary_keyword: "写确认纪律实现"
channel: "CSDN/知乎/博客"
---

# 写确认纪律实现深度解析：机制、设计与取舍

直接上干货。MCP 工具面总览在察元AI文档助手里的定位一句话能说清：WPS 三端智能加载项，校对、编审、核对、脱密，一个文档智能体。具体怎么操作、有什么讲究，往下看。

## 先弄清楚它是什么

本机 MCP 服务（sidecar 0.13.0）对外暴露一套文档智能体工具：目录源码 mcp-sidecar/lib/toolCatalog.mjs 共 69 个工具定义；其中 33 个细粒度旧名已并入 17 个「域工具」（一个工具名 + action 参数区分具体动作），外部客户端 tools/list 实际可见 53 个。本文是给用户和智能体看的能力地图：能干什么、哪些动作要先确认才落盘、长任务与审计怎么走。

工具面按域聚合后好记好用，写确认纪律保证外部智能体不能悄悄改你的文档。

先把这个定位立住，再看步骤。

## 机制拆解

confirmed 标记、审计日志与外部调用被拒的边界。

工具面按域聚合后好记好用，写确认纪律保证外部智能体不能悄悄改你的文档。

能力面拆开看：69 工具全景；域聚合设计；写确认加审计。

从提问口径看，用户最关心的是MCP 都有哪些工具？能操作表格和 PPT 吗？

## 从打开到做完的每一步

按最短路径验证一遍：

以下 53 个为客户端 tools/list 实见工具名（69 = 53 + 33 个已并入域工具的细粒度旧名，如 document_add_comment＞comment(action=add)，旧名一个版本内别名兼容）。

主机与健康（2）

文字文档生命周期与读写（13，document_）*

格式与样式（5）：format_read（读格式）、format_run（字体字色加粗等文字级格式）、format_para（对齐行距等段落级格式）、format_apply_ops（批量格式写回）、system_fonts_list（系统字体清单）。改措辞用 document_*，改样子用 format_*，不要混。

1. wps_status：分层健康——sidecar / Agent（agent.agentOnline、各宿主 wps/et/wpp 在线情况）/ 活动文档 / 可见窗口。
2. wps_launch：OS 冷启动 WPS 并等待加载项连上；可指定拉起文字（wps）/表格（et）/演示（wpp）宿主。
3. 打开/切换：document_open（打开本地文档为可见活动文档，默认经 OS 拉起真窗口）、document_ensure_open（已是活动文档则空操作）、document_list_open（列出已开文档）、document_activate（在已开文档间切换）。
4. 读取：document_meta（名称/字数/段数/是否建议分块）、document_list_paragraphs（逐段列表带锚点，逐段工作流首选）、document_chunks（长文分块翻页，带 start/end 锚点）、document_get_text（全文/选区纯文本，约 8 万字符以上报 DOCUMENT_TOO_LARGE，需 force:true 或改用 chunks）、document_locate（定位字词/句，返回多命中锚点）。
5. 写入：document_replace（替换锚点文本段）、document_insert（相对锚点/文末插入）、document_apply_ops（批量写回 replace/comment/comment-replace/insert-after，一次至多 200 条操作）、document_save（保存/另存）。三者写入类均「预览＞确认」：不带 confirmed:true 只返回预览不落盘。

域聚合工具（17，一个工具 + action 参数）

校对（3，proofread_）*：proofread_run（跑错别字/语法校对，dryRun 默认 true 只返回问题清单；dryRun:false 且未确认会被拒）、proofread_apply_comments（把问题清单写成 WPS 批注，需 confirmed:true）、proofread_job_poll（轮询异步校对任务进度）。

*脱密（4，declassify_）：declassify_status（是否处于脱密态）、declassify_preview（按关键词构建遮蔽预览，不写盘）、declassify_apply（应用脱密，confirmed+password+keywords 必填，工具描述明令 Never invent a password）、declassify_restore（凭密码复原）。注意：这组工具仅限本机可信通道（带 X-Chayuan-Token）调用，外部 MCP 客户端直调会被拒绝——脱密走 WPS 内「文档脱密/脱密复原」。

知识库与助手（4）：kb_retrieve（检索知识库片段供 LLM 对照推理，只检索不写文档）；assistants_list_domains / assistants_search / assistants_get（检索并导出察元领域助手——数千个助手不注册成工具，按需检索导出提示词）。

生图与素材（2）：image_search（网络搜图存本地返回路径）、generate_image（按已配置生图模型生成，PPT 宿主自动按页面比例 16:9）。

模板与文件（2）：template_generate（按模板 pptx/docx/xlsx + 参考素材后台生成整套新文档并自动打开，自带占位残留/溢出/字体一致性等多轮核对）；file_parse（把本地文件/面板附件解析为大模型可读文本，1-8 个路径，支持 docx/xlsx/pptx/pdf/eml/zip 等，token 预算与分块翻页）。

内部（1）：chat_turn（助手面板内部用它发起对话回合，非给外部 LLM 用）。

| 域 | action（只读 | 需确认写） |
|---|---|
| comment 批注 | list | add、delete |
| revision 修订 | mode、list | apply（接受/拒绝） |
| layout 版式 | — | page（纸张页边距）、columns（分栏）、break（分隔符）、blank_page |
| nav 导航 | location、outline、pane_set | — |
| toc 目录 | — | insert、update |
| bookmark 书签 | list、goto | — |
| table 文档内表格（12 动作） | list、header_read、row_read、column_read、cell_read、export（序列化为 md/csv/json，不写文件） | insert、header_repeat、column_set_width、row_insert、column_insert、cell_merge |
| caption 题注 | list（图/表/式枚举，连续性由 LLM 判断） | — |
| field 域 | list | add（SEQ 自动编号/TOC 域） |
| image 图片 | list | insert、delete、export |
| hyperlink 超链接 | list | add、delete |
| headerfooter 页眉页脚 | get | set |
| watermark 水印 | — | set、clear |
| style 样式 | list；audit（stats/unused/purge_unused） | apply |
| export 导出 | — | file（docx/pdf，另存到指定路径） |
| spreadsheet 表格（ET 宿主，23 动作） | status、sheet_list、used_range、range_read、find、chart_list（6 只读） | sheet_add/rename/delete、range_write、find_replace、row/column_insert/delete、sort、autofilter、format、chart_add/chart_export、export、security_encrypt_save/decrypt_save（17 写；读写均支持工作簿打开密码加密/解密另存） |
| presentation 演示（WPP 宿主，23 动作） | status、slide_list、slide_read、shape_list（4 只读） | slide_add/delete/duplicate/move/layout、text_replace/text_set、textbox_add、picture_add（支持整页 cover）、table_add、notes_set（演讲备注）、format_uniform（统一字体字号）、shape_zorder、svg_add、slideshow_run（放映）、export（pdf/images）、slide_export_image、security_encrypt_save/decrypt_save（19 写） |

## 几个容易忽略的细节

边界都在这：

- 脱密占位替换是可逆设计，忘记密码没有任何免密恢复通道
- 付费四项（脱密、复原、保密检查、涉密关键词提取）没有免费额度

## 你可能会问

### 表格和演示操作没反应？

spreadsheet. 需要 WPS 表格（et）宿主在线、presentation. 需 演示（wpp）宿主在线——wps_status 的 agent.hosts 能看各宿主是否在线；可用 wps_launch 指定宿主拉起。文档内表格（文字端）则用 table 域，两者不要混。

### 出错码怎么看？

常见：WPS_AGENT_OFFLINE（WPS/加载项未连 sidecar）、DOCUMENT_TOO_LARGE（改用 chunks）、LOCATE_MISMATCH/LOCATE_NOT_FOUND（锚点失效，重新 locate）、CONFIRMATION_REQUIRED（写操作没传 confirmed）、LICENSE_REQUIRED（免费额度用尽或需授权，不弹购买窗）、MODEL_NOT_CONFIGURED（校对模型未配置）。

### 智能体说「工具不存在」或用了奇怪的工具名？

让它改用域工具 + action（如 comment(action=add) 而不是 document_add_comment——后者是旧名，仅一个版本内兼容）。服务级 instructions 与 chayuan://guide/tool-routing 都会引导模型正确选型；也可把 chayuan://guide/user-intents 喂给它。

### 怎么让校对「只挑问题、我确认后再写批注」？

直接说：「先 proofread_run dryRun 汇总问题，不要改正文；我确认后再写成批注。」dryRun 默认只出问题清单；写批注必须 confirmed:true，钉在具体文字上（含表格内）。

## 补充答疑

### 文档很长，一读就报 DOCUMENT_TOO_LARGE？

约 8 万字符以上禁止默认拉全文（防撑爆上下文）。正确姿势：document_meta 看建议 ＞ document_chunks（cursor/limit）逐块处理 ＞ 汇总带锚点的操作 ＞ document_apply_ops 一次写回。解析非当前打开的文件用 file_parse。

## 更多操作细节

写确认纪律（confirmed 协议字段）

1. 所有落盘写动作：不带 confirmed:true 时要么返回 preview:true 预览（replace/insert/apply_ops），要么直接报 CONFIRMATION_REQUIRED（加批注、校对写回、脱密等硬确认项）。
2. WPS 加载项内部链路另有一层保险：面板侧对察元写工具无条件注入 confirmed:true 且先剥除模型入参里的 confirmed（单一来源纪律），保证内部对话链路的确认由面板统一把控；外部 MCP 客户端则由调用方（智能体按用户指令）显式传 confirmed。
3. 每次确认写都会记入审计日志。

辅助发现：Resources 与 Prompts

1. Resources：chayuan://wps/health（分层健康）、chayuan://guide/user-intents（用户意图＞工具编排剧本）、chayuan://guide/tool-routing（层路由：改字 vs 改样子 vs 批注/修订 vs 版式）、chayuan://assistants/manifest、chayuan://assistants/domain/{domain}、chayuan://assistants/{id}。
2. Prompts：para_translate_insert_after（逐段翻译插段后）、open_local_document（打开本地文档）。

长任务桥与代理**

1. /agent/register·poll·result（加 /agent/heartbeat、/agent/status）是 WPS 加载项专属长轮询通道，全部要求 X-Chayuan-Token；外部客户端的工具调用由 sidecar 经此桥投递给 WPS 执行。
2. /upstream/* 是给面板内多 MCP 客户端用的 HTTP 代理，仅放行 allowlist 内的 URL（allowlist 写入需 token），规避 WebView CORS。

写确认纪律实现的能力边界也写清楚了：能做什么、不擅长什么。工具好不好用，很大程度上取决于你知不知道它的边界。

---

察元AI文档助手（Chayuan AI Document Assistant）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 6.1.2），后续版本功能可能调整。
