import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { CodeEditor } from "~/components/blog/code-editor";
import { MarkdownPreview } from "~/components/blog/preview";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useIsMobile } from "~/hooks/use-mobile";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/blog/$slug/update")({
  component: RouteComponent,
  ssr: false,
  // eslint-disable-next-line perfectionist/sort-objects
  loader: ({ context, params }) => {
    void context.queryClient.ensureQueryData(context.trpc.blog.post.getBySlug.queryOptions({ slug: params.slug }));
  },
});

function RouteComponent() {
  const isMobile = useIsMobile();
  const { slug } = Route.useParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const blogPostQuery = useSuspenseQuery(trpc.blog.post.getBySlug.queryOptions({ slug }));

  const updateBlogMutation = useMutation(
    trpc.blog.post.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.blog.post.getBySlug.queryOptions({ slug }));
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
            onContentChange={(content) => updateBlogMutation.mutate({ content, id: blogPostQuery.data.blog_post.id })}
          />
        </TabsContent>
        <TabsContent value="preview">
          <ScrollArea style={{ height: "80vh" }}>
            <MarkdownPreview html={blogPostQuery.data.blog_post.html ?? ""} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    );

  return (
    <ResizablePanelGroup
      className="rounded-base border-2 border-border text-main-foreground shadow-shadow"
      direction="horizontal"
    >
      <ResizablePanel defaultSize={50}>
        <CodeEditor
          content={blogPostQuery.data.blog_post.content ?? ""}
          height="80vh"
          onContentChange={(content) => updateBlogMutation.mutate({ content, id: blogPostQuery.data.blog_post.id })}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ScrollArea style={{ height: "80vh" }}>
          <MarkdownPreview html={blogPostQuery.data.blog_post.html ?? ""} />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
