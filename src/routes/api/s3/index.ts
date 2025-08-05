import { init as CUID2 } from "@paralleldrive/cuid2";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { serverEnv } from "~/env/server";
import { isOwner } from "~/lib/auth/access-control";
import { S3 } from "~/lib/s3";
import { authServer } from "~/lib/server/auth";

const createId = CUID2({ length: 5 });

export const ServerRoute = createServerFileRoute("/api/s3/").methods({
  PUT: async ({ request }) => {
    const auth = await authServer.api.getSession({ headers: request.headers });
    const emailAddress = auth?.user.email;
    if (!emailAddress) return new Response("Unauthorized", { status: 401 });
    if (!isOwner(emailAddress)) return new Response("Unauthorized", { status: 401 });

    if (!request.body) return new Response("No body", { status: 400 });

    const url = new URL(request.url);
    const ext = url.searchParams.get("ext") ?? "unknown";

    const today = new Date();
    const key = today.getFullYear().toString() + (today.getMonth() + 1).toString() + `-${createId()}.${ext}`;

    await S3.put(key, request.body);

    return Response.json({ url: new URL(key, serverEnv.CDN_BASE_URL) });
  },
});
