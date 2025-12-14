import { createFileRoute } from "@tanstack/react-router";

import { authServer } from "~/lib/server/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => {
        return authServer.handler(request);
      },
      POST: ({ request }) => {
        return authServer.handler(request);
      },
    },
  },
});
