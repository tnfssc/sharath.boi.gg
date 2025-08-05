import { createServerFileRoute } from "@tanstack/react-start/server";

import { isOwner } from "~/lib/auth/access-control";
import { authServer } from "~/lib/server/auth";

export const ServerRoute = createServerFileRoute("/api/access-control/").methods({
  GET: async ({ request }) => {
    const auth = await authServer.api.getSession({ headers: request.headers });
    const emailAddress = auth?.user.email;

    if (!emailAddress) return new Response("Unauthorized", { status: 401 });
    return new Response(isOwner(emailAddress).toString(), { status: 200 });
  },
});
