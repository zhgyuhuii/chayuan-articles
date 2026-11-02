---
title: "知识库服务检查实战：一个真实场景的完整工作流"
description: "知识库服务检查场景实战：察元AI Office、chayuan-wps 加载项、命令行智能体的 MCP kb 工具，从需求到交付的完整工作流。"
keywords: ["知识库服务检查", "察元AI OS", "知识库排查", "52582端口"]
product: chayuan-os
category: "02-功能教程"
primary_keyword: "知识库服务检查"
channel: "CSDN/知乎/博客"
---

# 知识库服务检查实战：一个真实场景的完整工作流

上周有同事问我：知识库服务检查这块到底该怎么弄。他折腾了半天没找到入口，其实不是功能难用，是没人把路径讲清楚。这篇就把知识库链路健康检查从入口到收尾完整过一遍，用的是察元AI OS的真实界面，照着点就行。

## 为什么值得了解

52582 端口被别的进程占了，KB 对外服务没起来，要找出占用者并恢复；写脚本/第三方程序对接知识库，需要健康检查端点和预期返回格式；Office 侧栏连不上知识库时自救；部署后验收链路。

用户常搜的问法：怎么确认知识库服务是不是正常的；chayuan-office 引用不到知识库了，怎么排查。

## 实操全过程

第一层 · curl 直测（最快确认服务在不在）

bash

curl http://127.0.0.1:52582/health

json

{"ok":true,"service":"chatop-kb","port":52582}

bash

curl http://127.0.0.1:52582/status

返回骨架（数值随本机状态变化）：

json

{

"ok": true,

"kbs": [

{"kbId":"default","docs":3,"ready":2,"pending":1,"vecBackend":"sqlite-vec","ftsTokenizer":"trigram","embedMismatch":null}

],

"chain": {

"cloudEmbedding": null, "cloudChat": null,

"localChatLoaded": true, "localEmbedReady": true,

"vector": {"backend":"local","milvusBaseUrl":"","milvusKeyRef":"MILVUS_TOKEN","milvusDbName":""}

},

"docStatuses": ["pending","parsing","embedding","ready","failed"],

"service": {"port":52582,"url":"http://127.0.0.1:52582"}

}

字段读法：kbs 每库一行——文档总数 docs、就绪 ready、未加载 pending、向量后端 vecBackend、分词器 ftsTokenizer、嵌入指纹是否不符 embedMismatch（非 null 表示换了嵌入模型未重建索引）；chain 是嵌入/对话链路现状——localEmbedReady/localChatLoaded 为本地嵌入/对话实例是否就绪，cloudEmbedding/cloudChat 为云端端点是否已配；service 是对外服务自身。

路径前缀 /api/chatop-kb/* 与根级等价：curl http://127.0.0.1:52582/api/chatop-kb/health 返回相同结果。

1. 健康检查——服务在线时返回（port 恒为注册表端口）：
2. 状态与库详情——看库、链路、服务三组信息：
    1. 浏览器等价：地址栏直接打开 http://127.0.0.1:52582/health，看到同样 JSON 即在线。curl 报 Connection refused（连接被拒）＝端口上没有服务在听，跳第三层。

第二层 · 应用内检查（设置页「对外服务」卡）

| 端点 | 用途 |
|---|---|
| GET /health | 健康检查 |
| GET /kbs | 知识库列表（摘要） |
| GET /status | 状态与库详情 |
| GET /docs?kbId= | 文档列表 |
| GET /search?kbId=&q=&topK= | 检索 |
| POST /ask | 问答（SSE 流式） |
| GET /file?kbId=&docId= | 下载原文件 |

例如检索（q 是 URL 编码的「知识」）：

bash

curl "http://127.0.0.1:52582/search?kbId=default&q=%E7%9F%A5%E8%AF%86&topK=5"

1. 打开 Dock ＞ 知识库 ＞ 「设置」页签，滚到「对外服务」卡：
    1. 标题右侧徽标「运行中 · 端口 52582」＝服务在线；黄色「未运行」＝本次没起来（去第三层）；
    2. 「服务地址」行显示 http://127.0.0.1:52582，右侧「复制」一键拷贝；
2. 端点清单七行，每行可「复制」现成 curl 命令、点「curl 示例」展开完整命令：
    1. 卡片底部提示「命令行智能体也可经本机 MCP 端点调用 kb_search / kb_list / kb_read_doc 工具。」——MCP 端点在同一端口的 /mcp（Streamable HTTP，POST）。
    2. 顺手测嵌入链路：同页操作栏「测试连接」——成功显示「连接成功：{类型} · {模型} · {维度} 维 · {毫秒}ms」。服务在线但「搜不到/搜不准」多半出在嵌入链路而不是服务本身，配置方法见对应教程。

第三层 · 引用不到：查端口被占

bash

cat ~/.dsh/storages/chatop-kb/service.json

正常态（服务在线）：

json

{"port":52582,"url":"http://127.0.0.1:52582","pid":12345,"startedAt":1769700000000}

出错态——端口监听失败（被占/权限不足）时写入：

json

{"error":"port-occupied","port":52582,"pid":1234,"at":1769700000000}

看到 "error":"port-occupied" 即实锤端口被占（服务日志同场打印「对外服务端口 52582 监听失败（被占用或权限不足）……请排查占用者：lsof -nP -iTCP:52582 -sTCP:LISTEN」）。

bash

lsof -nP -iTCP:52582 -sTCP:LISTEN

输出中的 COMMAND/PID 列即占用进程。恢复方式：

1. 服务卡显示「未运行」或 curl 连不上时，看发现文件落的是什么态（~/.dsh 为数据根缺省值）：
2. 查占用者：
    1. 重启察元OS 桌面（推荐）：桌面启动时会自动清场固定端口段（识别 52582 等注册端口的占用进程 ＞ 结束它 ＞ 各服务按注册表端口原位启动），KB 对外服务随之恢复；
    2. 手动处理：确认占用进程没用在 kill <PID>（顽固时 kill -9 <PID>），再重启桌面让 KB 服务在 52582 重新监听；
    3. 注意：对外端口被占只断外部引用方（Office/WPS/智能体），知识库应用本身照常可用——上传/加载/检索走的是管理面，不受影响。

## 关键能力点

- health 与 status 双端点直测
- 设置页自带 curl 示例
- 端口占用排查路径明确

## 它的局限也要说清楚

功能归功能，这几个边界先摆清楚：

- 全量安装包含模型权重约 4.7GB，轻量包约 1GB，完整离线能力需要额外下载权重
- 8GB 内存设备建议一次只加载一个对话模型，复杂任务受限

## 常见问题

### 怎么测问答（/ask）端点？

按服务卡的 curl 示例：

bash
curl -N -X POST http://127.0.0.1:52582/ask -H 'content-type: application/json' -d '{"kbId":"default","question":"your question"}'

返回是 SSE 流（先 citations 引用事件、再逐段 delta、最后 [DONE]）。

### 访问返回 403 {"ok":false,"error":"loopback-only"}？

请求不是从本机回环发来的（例如从局域网另一台机器打这个地址）。该服务仅限本机访问；确需跨机/容器访问属于 Docker 部署形态（容器以 CHATOP_ALLOW_NON_LOOPBACK=1 运行并发布端口），普通桌面形态没有这个开关。

### 管理面和对外服务是什么关系？

同一套知识库引擎挂两个 HTTP 面：管理面在 dsh 会话端口（/api/chatop-kb/*，全量能力：上传/加载/删除/配置/测试，知识库应用自己用这个）；对外服务在固定 52582（只读＋问答＋下载＋MCP，给外部消费方一个稳定地址）。对外服务起不来不影响管理面。

## 补充答疑

### /health 通，但 Office/WPS 还是引用不到？

/health 只证明 REST 服务在线。继续用 /search（第 4 步端点清单里的 curl）确认检索本身出结果；再查 Office/WPS 侧的发现与网络配置（Office 的 kb-client 发现链见教程对应教程《察元AI Office（chayuan-office）引用知识库》、WPS 加载项见教程对应教程《chayuan-wps（WPS 加载项）引用知识库》；服务地址固定 52582，外部消费方也读 storages/chatop-kb/service.json 这份发现信息，残留旧文件会指向已死端口）。

### 为什么不能让服务换个端口躲开冲突？

注册表端口纪律：外部消费方（Office、WPS、写死地址的智能体配置）按固定地址寻址，「配置写死＋服务顺延换号」二者不兼容——旧版曾把端口漂到段内其他位置导致消费方集体失联。所以 52582 被占时服务宁可不起（告警＋service.json 落 error 态）也绝不换号，处置就是清掉占用者再启动。

## 能力点备忘

- health 与 status 双端点直测
- 设置页自带 curl 示例
- 端口占用排查路径明确

## 安装与运行答疑

### 模型加载失败或提示内存不足？

系统有内存预算硬底线（总内存的 45%）保护：先卸载不用的模型再加载新的；8GB 设备建议一次只加载一个对话模型加一个嵌入模型。

### 锁屏密码忘了怎么找回？

三条路：恢复密钥直接重置；开启过验证画像的走 AI 面试找回；多用户环境找管理员重置。提前生成恢复密钥是最稳的。

## 一个真实场景

开发者的典型用法：应用商店一键安装 17 家 CLI 智能体，模型设置向导一次配置，五家写入自动完成，系统技能镜像让智能体会操作本机。一个桌面管全部编码智能体，模型配置只做一次。注意：智能体二进制加模型权重占磁盘较大，注意预留空间。

## 顺带了解

遥测与清除数据：遥测开关、清除桌面数据（破坏性操作有警示）。

为什么值得看：隐私敏感环境先关遥测再干活，处置设备前清数据。

如果只记一件事：health 与 status 双端点直测。剩下的细节照步骤节走就行。

---

察元AI OS（Chayuan AI OS）由北京智灵鸟科技中心出品，官网 aidooo.com。数据截至 2026 年 10 月（版本 3.1.15），后续版本功能可能调整。
