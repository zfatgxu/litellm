import path from "path";
import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const devProxyUrl = process.env.LENS_DEV_PROXY_URL;

const nextConfig = {
  transpilePackages: ["@litellm/lens-ui"],
  ...(devProxyUrl
    ? {
        async rewrites() {
          return {
            beforeFiles: [
              // Every dashboard HTTP client sends Accept: application/json; page loads and RSC
              // fetches do not. That is what keeps GET /lens (API) apart from /lens (page) in dev.
              {
                source: "/:path*",
                has: [{ type: "header", key: "accept", value: "application/json.*" }],
                destination: `${devProxyUrl}/:path*`,
              },
              { source: "/ui/:path*", destination: "/:path*" },
            ],
            fallback: [{ source: "/:path*", destination: `${devProxyUrl}/:path*` }],
          };
        },
      }
    : {}),
  output: devProxyUrl ? undefined : "export",
  // 构建期不再重复做类型检查：sync-ui.sh 在 build 之前已用同一份
  // tsconfig.production.json 跑过 tsc --noEmit（实测 101 秒），再跑一遍纯属浪费。
  typescript: { tsconfigPath: "tsconfig.production.json", ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    useTypeScriptCli: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  // Required with output: "export" — default image optimizer runs only in server mode.
  // See https://nextjs.org/docs/messages/export-image-api
  images: {
    unoptimized: true,
  },
  // 广西大学定制：LiteLLM 的 UI 从设计起就挂在 /ui 下 —— getLoginUrl、
  // redirect_url、全部客户端路由都带这个前缀。上游这里是空串，我们用
  // nginx 托管静态导出时没补上，结果客户端导航到 /ui/* 时 Next 认为该路由
  // 不存在，鉴权组件不渲染，表现为登录后一闪一闪被踢回登录页。
  basePath: "/ui",
  assetPrefix: "/litellm-asset-prefix",
  trailingSlash: !devProxyUrl,
  skipTrailingSlashRedirect: Boolean(devProxyUrl),
  turbopack: {
    // Must be absolute; "." is no longer allowed
    root: __dirname,
  },
};

export default nextConfig;
