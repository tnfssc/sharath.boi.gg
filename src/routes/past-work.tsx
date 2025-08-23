import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { MarkdownPreview } from "~/components/blog/preview";
import { ScreenCenter } from "~/components/ui/screen-center";
import { mdToHtml } from "~/lib/services/md-to-html";

const getData = createServerFn().handler(async () => {
  return await fetch("https://raw.githubusercontent.com/tnfssc/tnfssc/refs/heads/main/RESUME-unredacted.md")
    .then((res) => res.text())
    .then(mdToHtml);
});

export const Route = createFileRoute("/past-work")({
  component: RouteComponent,
  loader: () => getData(),
});

function RouteComponent() {
  const content = Route.useLoaderData();
  return (
    <ScreenCenter>
      <MarkdownPreview html={content.html} />
    </ScreenCenter>
  );
}
