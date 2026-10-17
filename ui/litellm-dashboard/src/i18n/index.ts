/**
 * 广西大学 AI 大模型应用网关 —— 极简 i18n
 *
 * 为什么不引入 next-intl / react-i18next：
 * 1. LiteLLM UI 有 9.5 万行代码、921 个组件，全量改造为 t() 调用不现实
 * 2. 本方案允许"渐进式翻译"：t() 未命中时回退英文原文，页面不会白屏
 * 3. 零额外依赖，便于跟随上游升级
 *
 * 用法：
 *   import { t } from "@/i18n";
 *   t("Usage")            // -> "用量统计"
 *   t("某个未翻译文案")    // -> "某个未翻译文案"（回退英文，不炸）
 *
 * 运行时词典：
 *   构建时把 zh-CN.ts 编译进产物，保证首屏是中文；
 *   运行时再从 /i18n/zh-CN.json 取一份覆盖词典。
 *   这样改文案只要运维改服务器上的 JSON，刷新即生效，不必重新构建 UI。
 */

import zhCN from "./zh-CN";

export type Locale = "zh-CN" | "en-US";

export const LOCALE_STORAGE_KEY = "gxu-locale";

/** 默认语言：广西大学校内使用，默认中文 */
export const DEFAULT_LOCALE: Locale = "zh-CN";

/** 运维可直接改的词典地址，不进构建产物 */
export const RUNTIME_DICT_URL = "/i18n/zh-CN.json";

/** 当前语言，从 localStorage 读取，默认中文 */
export function getLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "zh-CN" || saved === "en-US") return saved;
  } catch {
    /* SSR 或隐私模式下 localStorage 不可用，忽略 */
  }
  return DEFAULT_LOCALE;
}

export function setLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* 忽略写入失败 */
  }
}

let runtimeDict: Record<string, string> | null = null;

/**
 * 同步加载运行时词典。
 *
 * 用同步 XHR 是为了在 React 首次渲染前拿到词典，避免"先英文后中文"的闪烁。
 * 代价是阻塞主线程一次，但 JSON 只有几 KB，且仅在模块初始化时执行一次；
 * 拿不到（文件缺失 / 网络异常）就静默回退到构建内置的词典。
 */
function loadRuntimeDict(): void {
  if (typeof window === "undefined") return;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", RUNTIME_DICT_URL + "?v=" + Date.now(), false);
    xhr.send();
    if (xhr.status === 200 && xhr.responseText) {
      const parsed = JSON.parse(xhr.responseText);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        runtimeDict = parsed as Record<string, string>;
      }
    }
  } catch {
    /* 忽略：拿不到就用内置词典 */
  }
}

loadRuntimeDict();

const DICTIONARIES: Record<Locale, Record<string, string>> = {
  "zh-CN": zhCN,
  "en-US": {},
};

/**
 * 翻译函数。优先级：运行时词典 > 内置词典 > 英文原文。
 *
 * @param text 英文原文（同时作为字典 key）
 * @param locale 可选，指定语言；默认取当前语言
 * @returns 译文；字典未收录时原样返回英文
 */
export function t(text: string, locale?: Locale): string {
  const loc = locale ?? getLocale();
  if (loc !== "zh-CN") return text;
  const override = runtimeDict ? runtimeDict[text] : null;
  if (override) return override;
  const dict = DICTIONARIES[loc];
  return dict[text] ?? text;
}
