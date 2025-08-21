import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { Markdown } from "~/components/ui/markdown";
import { ScreenCenter } from "~/components/ui/screen-center";
import { ScrollArea } from "~/components/ui/scroll-area";
import { createCaller } from "~/server/caller";

const getData = createServerFn().handler(async () => {
  const request = getWebRequest();
  const caller = await createCaller(request);
  const data = await caller.blog.post.get();
  return data;
});

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
  loader: () => getData(),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <ScreenCenter>
      <ScrollArea className="w-full">
        <div className="m-4 grid grid-cols-1 gap-4">
          {data.map((d) => (
            <div key={d.blog_post.slug}>
              <span>{d.blog_post.slug}</span>
              <Markdown html={d.blog_post.html ?? ""} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </ScreenCenter>
  );
}
