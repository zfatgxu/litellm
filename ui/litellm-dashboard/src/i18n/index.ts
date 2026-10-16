/**
 * 广西大学 AI 大模型应用网关 —— 极简 i18n
 *
 * 为什么不引入 next-intl / react-i18next：
 * 1. LiteLLM UI 有 9.5 万行代码、921 个组件，全量改造为 t() 调用不现实
 * 2. 本方案允许"渐进式翻译"：t() 未命中时回退英文原文，页面不会白屏
 * 3. 零额外依赖，不改动构建产物体积，便于跟随上游升级
 *
 * 用法：
 *   import { t } from "@/i18n";
 *   t("Usage")            // -> "用量统计"
 *   t("某个未翻译文案")    // -> "某个未翻译文案"（回退英文，不炸）
 */

import zhCN from "./zh-CN";

export type Locale = "zh-CN" | "en-US";

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

const LOCALE_STORAGE_KEY = "gxu-locale";

/** 默认语言：广西大学校内使用，默认中文 */
const DEFAULT_LOCALE: Locale = "zh-CN";

const DICTIONARIES: Record<Locale, Record<string, string>> = {
  "zh-CN": zhCN,
  "en-US": {},
};

/**
 * 翻译函数。
 * @param text 英文原文（同时作为字典 key）
 * @param locale 可选，指定语言；默认取当前语言
 * @returns 译文；字典未收录时原样返回英文
 */
export function t(text: string, locale?: Locale): string {
  const dict = DICTIONARIES[locale ?? getLocale()];
  return dict[text] ?? text;
}

export { DEFAULT_LOCALE, LOCALE_STORAGE_KEY };