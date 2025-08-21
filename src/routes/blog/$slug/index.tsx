import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { Markdown } from "~/components/ui/markdown";
import { ScreenCenter } from "~/components/ui/screen-center";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useTRPC } from "~/lib/trpc";
import { createCaller } from "~/server/caller";

const getData = createServerFn()
  .validator((id: string) => id)
  .handler(async (ctx) => {
    const slug = ctx.data;
    const request = getWebRequest();
    const caller = await createCaller(request);
    const data = await caller.blog.post.getBySlug({ slug });
    return data;
  });

export const Route = createFileRoute("/blog/$slug/")({
  component: RouteComponent,
  loader: ({ params }) => getData({ data: params.slug }),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const trpc = useTRPC();
  const blogPostQuery = useQuery(
    trpc.blog.post.getBySlug.queryOptions({ slug: data.blog_post.slug }, { initialData: data }),
  );

  return (
    <ScreenCenter>
      <ScrollArea className="w-full">
        <div className="m-4 grid grid-cols-1 gap-4">
          <Markdown html={blogPostQuery.data.blog_post.html ?? ""} />
        </div>
      </ScrollArea>
    </ScreenCenter>
  );
}
