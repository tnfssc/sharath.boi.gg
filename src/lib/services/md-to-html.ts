import { serverEnv } from "~/env/server";

export const mdToHtml = async (md: string) => {
  const res = await fetch(serverEnv.MD_TO_HTML_ENDPOINT, {
    body: md,
    headers: { "x-api-key": serverEnv.MD_TO_HTML_API_KEY },
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to convert markdown to HTML", { cause: await res.text() });
  return await res.text();
};
