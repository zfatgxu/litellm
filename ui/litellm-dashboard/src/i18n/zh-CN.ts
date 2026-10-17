/**
 * 广西大学 AI 大模型应用网关 —— 中文化词条表
 *
 * 设计原则：
 * 1. 词条以英文原文为 key，未命中时回退英文原文，保证未翻译部分不炸
 * 2. 分批覆盖：导航 → 登录 → 高频页面 → 长尾
 * 3. 术语统一：Gateway=网关，Team=团队（对应学校"学院/课题组"），
 *    Key=密钥，Usage=用量，Budget=预算，Guardrail=合规护栏
 */

export const zhCN: Record<string, string> = {
  // ============ 导航分组 ============
  "AI GATEWAY": "AI 网关",
  OBSERVABILITY: "运行观测",
  "ACCESS CONTROL": "权限管控",
  "DEVELOPER TOOLS": "开发者工具",
  SETTINGS: "系统设置",

  // ============ AI 网关 ============
  "AI Gateway": "AI 网关",
  Overview: "总览",
  Home: "首页",
  "Virtual Keys": "虚拟密钥",
  "API Keys": "密钥管理",
  Models: "模型管理",
  "Models & Endpoints": "模型与端点",
  "Model Hub": "模型中心",
  "AI Hub": "模型中心",
  "MCP Servers": "MCP 服务",
  Agents: "智能体",
  "Tool Policies": "工具策略",

  // ============ 运行观测 ============
  Usage: "用量统计",
  "Usage Dashboard": "用量看板",
  "Model Leaderboard": "模型排行",
  "Cost Optimization": "成本优化",
  Logs: "调用日志",
  "Request Logs": "请求日志",
  Lens: "链路追踪",
  "Guardrails Monitor": "合规监控",
  "Cost Tracking": "成本核算",
  "Model Insights": "模型洞察",

  // ============ 权限管控 ============
  Teams: "学院/团队",
  Projects: "项目",
  "Internal Users": "内部用户",
  Users: "用户",
  Organizations: "组织机构",
  "Access Groups": "权限组",
  Budgets: "预算额度",

  // ============ 开发者工具 ============
  "API Reference": "接口文档",
  "Learning Resources": "学习资源",
  "Response Cache": "响应缓存",
  Experimental: "实验功能",
  Prompts: "提示词",
  "API Playground": "接口调试台",
  "Tag Management": "标签管理",
  "Old Usage": "旧版用量",
  Webhooks: "事件回调",
  Caching: "缓存",

  // ============ 系统设置 ============
  Settings: "系统设置",
  "General Settings": "通用设置",
  "SSO Settings": "单点登录",
  "Alerting Settings": "告警设置",
  "Pass-Through Settings": "透传设置",

  // ============ 登录页 ============
  Login: "登录",
  "Sign In": "登录",
  "Sign in": "登录",
  Username: "用户名",
  Password: "密码",
  "Enter your username": "请输入用户名",
  "Enter your password": "请输入密码",
  "Forgot password?": "忘记密码？",
  "Change Password": "修改密码",
  "Sign Out": "退出登录",
  Logout: "退出登录",
  "Logging in...": "正在登录…",
  "Invalid credentials": "用户名或密码错误",

  // ============ 通用操作 ============
  Create: "新建",
  Edit: "编辑",
  Delete: "删除",
  Save: "保存",
  Cancel: "取消",
  Confirm: "确认",
  Search: "搜索",
  Filter: "筛选",
  Export: "导出",
  Refresh: "刷新",
  Loading: "加载中",
  "No data": "暂无数据",
  "No results found": "未找到结果",
  Submit: "提交",
  Close: "关闭",
  Copy: "复制",
  Copied: "已复制",
  Retry: "重试",
  Enable: "启用",
  Disable: "停用",
  Status: "状态",
  Name: "名称",
  Description: "描述",
  Actions: "操作",
  Created: "创建时间",
  "Created At": "创建时间",
  "Last Updated": "更新时间",
  Total: "合计",
  All: "全部",
  Yes: "是",
  No: "否",
  Optional: "可选",
  Required: "必填",

  // ============ 用量与计费 ============
  Tokens: "词元",
  "Input Tokens": "输入词元",
  "Output Tokens": "输出词元",
  "Total Tokens": "词元合计",
  Requests: "请求次数",
  Spend: "消费金额",
  Cost: "成本",
  "Max Budget": "预算上限",
  "Budget Duration": "预算周期",
  "Remaining Budget": "剩余额度",
  "Reset Budget": "重置额度",
  "Rate Limit": "速率限制",
  "TPM Limit": "每分钟词元上限",
  "RPM Limit": "每分钟请求上限",
  "Model Alias": "模型别名",
  Provider: "服务商",
  "Cost per Token": "单价",

  // ============ 合规与审计 ============
  Guardrails: "合规护栏",
  Guardrail: "护栏规则",
  "Content Filter": "内容过滤",
  "Sensitive Content": "敏感内容",
  Blocked: "已拦截",
  Passed: "已通过",
  Violation: "违规",
  "Audit Log": "审计日志",
  "Compliance Review": "合规审核",

  // ============ 异构算力（广西大学定制）============
  "Compute Pool": "算力池",
  "NVIDIA Pool": "NVIDIA 算力池",
  "Ascend Pool": "昇腾算力池",
  "GPU Node": "GPU 节点",
  "Node Health": "节点状态",
  "Routing Strategy": "路由策略",
  "Fallback Enabled": "已启用降级",

  // ============ 登录页与通用操作 ============
  "Access your LiteLLM Admin UI.": "登录以访问 LiteLLM 管理界面",
  "Default Credentials": "默认凭据",
  "By default, Username is": "默认情况下，用户名为",
  "and Password is your set LiteLLM Proxy": "，密码为你配置的 LiteLLM 代理",
  "Need to set UI credentials or SSO?": "需要修改界面凭据或配置单点登录？",
  "Check the documentation": "查看官方文档",
  "Admin UI Disabled": "管理界面已停用",
  "The Admin UI has been disabled by the administrator. To re-enable it, please update the following": "管理界面已被管理员停用。如需重新启用，请调整以下",
  "environment variable:": "环境变量：",
  Worker: "工作节点",
  "Choose a worker to connect to": "选择要连接的工作节点",
  "Sign in with SSO": "使用统一身份认证登录",
  "Forgot your password?": "忘记密码？",
  "Please enter your username": "请输入用户名",
  "Please enter your password": "请输入密码",
  "Invalid username or password": "用户名或密码不正确",
  "Something went wrong": "操作失败",
};

export default zhCN;