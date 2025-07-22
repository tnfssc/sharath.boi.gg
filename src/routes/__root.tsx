/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Link, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";

import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

export const Route = createRootRoute({
  errorComponent: DefaultCatchBoundary,
  head: () => ({
    links: [
      { href: appCss, rel: "stylesheet" },
      {
        href: "/apple-touch-icon.png",
        rel: "apple-touch-icon",
        sizes: "180x180",
      },
      {
        href: "/favicon-32x32.png",
        rel: "icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        href: "/favicon-16x16.png",
        rel: "icon",
        sizes: "16x16",
        type: "image/png",
      },
      { color: "#fffff", href: "/site.webmanifest", rel: "manifest" },
      { href: "/favicon.ico", rel: "icon" },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      ...seo({
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
        title: "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
      }),
    ],
    scripts: [
      {
        src: "/customScript.js",
        type: "text/javascript",
      },
    ],
  }),
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            activeOptions={{ exact: true }}
            activeProps={{
              className: "font-bold",
            }}
            to="/"
          >
            Home
          </Link>{" "}
          <Link
            activeProps={{
              className: "font-bold",
            }}
            to="/posts"
          >
            Posts
          </Link>{" "}
          <Link
            activeProps={{
              className: "font-bold",
            }}
            to="/users"
          >
            Users
          </Link>{" "}
          <Link
            activeProps={{
              className: "font-bold",
            }}
            to="/route-a"
          >
            Pathless Layout
          </Link>{" "}
          <Link
            activeProps={{
              className: "font-bold",
            }}
            to="/deferred"
          >
            Deferred
          </Link>
        </div>
        <hr />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
