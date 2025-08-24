/* eslint-disable perfectionist/sort-interfaces */
/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  // Client
  readonly VITE_TURNSTILE_SITE_KEY: string;
  readonly VITE_PUBLIC_POSTHOG_KEY: string;

  // Server
  readonly DISCORD_WEBHOOK_URL: string;
  readonly TURNSTILE_SECRET_KEY: string;
  readonly LIBSQL_URL: string;
  readonly LIBSQL_SECRET: string;
}

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}
