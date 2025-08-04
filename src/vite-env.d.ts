/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly DISCORD_WEBHOOK_URL: string;
  readonly TURNSTILE_SECRET_KEY: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
}

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}
