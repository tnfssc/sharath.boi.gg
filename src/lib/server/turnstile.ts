import { serverEnv } from "~/env/server";

interface VerifyTurnstileParams {
  clientIp: string;
  idempotencyKey: string;
  token: string;
}

export async function verifyTurnstile({ clientIp, idempotencyKey, token }: VerifyTurnstileParams) {
  if (!serverEnv.TURNSTILE_SECRET_KEY) throw new Error("TURNSTILE_SECRET_KEY not configured");

  const formData = new FormData();
  formData.append("secret", serverEnv.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", clientIp);
  formData.append("idempotency_key", idempotencyKey);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const response = await fetch(url, {
    body: formData,
    method: "POST",
  });

  const outcome = (await response.json()) as { success: boolean };
  return outcome.success;
}
