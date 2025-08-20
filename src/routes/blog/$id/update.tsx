import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { CodeEditor } from "~/components/blog/code-editor";
import { MarkdownPreview } from "~/components/blog/preview";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useIsMobile } from "~/hooks/use-mobile";
import { useTRPC } from "~/lib/trpc";
import { createCaller } from "~/server/caller";

const getData = createServerFn()
  .validator((id: string) => id)
  .handler(async (ctx) => {
    const id = ctx.data;
    const request = getWebRequest();
    const caller = await createCaller(request);
    const data = await caller.blog.post.getById({ id });
    return data;
  });

export const Route = createFileRoute("/blog/$id/update")({
  component: RouteComponent,
  loader: ({ params }) => getData({ data: params.id }),
  ssr: false,
});

function RouteComponent() {
  const isMobile = useIsMobile();
  const data = Route.useLoaderData();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const blogPostQuery = useQuery(trpc.blog.post.getById.queryOptions({ id: data.blog_post.id }, { initialData: data }));

  const updateBlogMutation = useMutation(
    trpc.blog.post.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.blog.post.getById.queryOptions({ id: data.blog_post.id }));
      },
    }),
  );

  if (isMobile)
    return (
      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <CodeEditor
            content={blogPostQuery.data.blog_post.content ?? ""}
            height="80vh"
            onContentChange={(content) => updateBlogMutation.mutate({ content, id: data.blog_post.id })}
          />
        </TabsContent>
        <TabsContent value="preview">
          <ScrollArea style={{ height: "80vh" }}>
            <MarkdownPreview html={blogPostQuery.data.blog_post.html} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    );

  return (
    <ResizablePanelGroup
      className="rounded-base border-border text-main-foreground shadow-shadow border-2"
      direction="horizontal"
    >
      <ResizablePanel defaultSize={50}>
        <CodeEditor
          content={blogPostQuery.data.blog_post.content ?? ""}
          height="80vh"
          onContentChange={(content) => updateBlogMutation.mutate({ content, id: data.blog_post.id })}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ScrollArea style={{ height: "80vh" }}>
          <MarkdownPreview html={blogPostQuery.data.blog_post.html} />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
