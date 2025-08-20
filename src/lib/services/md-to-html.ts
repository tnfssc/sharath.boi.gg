import { serverEnv } from "~/env/server";
import { cached } from "~/lib/cache";

export const mdToHtml = cached({ namespace: "md-to-html", ttlMs: 30 * 24 * 60 * 60 * 1000 }, async (md: string) => {
  const res = await fetch(serverEnv.MD_TO_HTML_ENDPOINT, {
    body: md,
    headers: { "x-api-key": serverEnv.MD_TO_HTML_API_KEY },
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to convert markdown to HTML", { cause: await res.text() });
  return await res.text();
});
