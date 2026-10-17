import { jwtDecode } from "jwt-decode";

/**
 * 广西大学定制 —— 网关场景下的令牌处理
 *
 * 背景：开源版 LiteLLM 没有可用的 JWT 会话机制。
 *   /v2/login 只会签发 JWT，而解析 JWT 需要 general_settings.enable_jwt_auth，
 *   该开关是企业版功能，开源版一律返回 403 "JWT Auth is an enterprise only feature"；
 *   不开这个开关时后端又把 JWT 当虚拟密钥，返回 401 "expected to start with 'sk-'"。
 *   两条路都走不通。
 *
 * 因此登录时不再调用 /v2/login，而是把用户输入的虚拟密钥直接存进 cookie。
 * 本文件负责让全站正确理解"cookie 里放的是虚拟密钥而不是 JWT"这件事。
 *
 * 关键原则：令牌真伪不由前端判断。前端只负责"有没有令牌"，
 * 令牌是否有效、属于谁、能调哪些模型，全部由后端在每个 API 上校验。
 * 前端自作聪明地解析/判过期，反而会在后端根本认得这个 key 时误判未授权。
 */

/** 是否为 LiteLLM 虚拟密钥（以 sk- 开头） */
export function isVirtualKey(token: string | null | undefined): boolean {
  return typeof token === "string" && token.trim().startsWith("sk-");
}

/**
 * 虚拟密钥没有 exp 字段，不存在过期问题。
 * 其余情况按 JWT 的 exp 字段判断。
 */
export function isJwtExpired(token: string): boolean {
  if (isVirtualKey(token)) return false;
  try {
    const decoded: any = jwtDecode(token);
    if (decoded && typeof decoded.exp === "number") {
      return decoded.exp * 1000 <= Date.now();
    }
    return false;
  } catch {
    return true;
  }
}

/**
 * 解出会话信息。
 * 存的是虚拟密钥时没有 JWT claims 可解，合成一份等价的会话对象，
 * 否则 useAuthorized 取不到 key、菜单与权限判断也会失效。
 */
export function decodeToken(token: string | null): Record<string, any> | null {
  if (!token) return null;
  if (isVirtualKey(token)) {
    return {
      user_id: "default_user_id",
      key: token,
      user_role: "proxy_admin",
      user_email: null,
      premium_user: false,
      login_method: "api_key",
      auth_metadata: {},
    };
  }
  try {
    return jwtDecode(token) as Record<string, any>;
  } catch {
    return null;
  }
}

/**
 * 只要带着令牌就算已登录。
 * 有效性交给后端判断 —— 后端会用真实校验决定每个接口能否访问，
 * 前端拦截只会造成"后端认得这个 key，页面却把你踢回登录页"。
 */
export function checkTokenValidity(token: string | null): boolean {
  if (!token || !token.trim()) return false;
  if (isVirtualKey(token)) return true;
  return !isJwtExpired(token);
}
