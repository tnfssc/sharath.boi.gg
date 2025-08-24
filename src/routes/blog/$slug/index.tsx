import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
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

  const post = blogPostQuery.data.blog_post;
  const author = blogPostQuery.data.blog_author;
  const tags = post.tags ? post.tags.split(",").filter(Boolean) : [];
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null;

  return (
    <ScreenCenter>
      <ScrollArea className="w-full">
        <article className="container mx-auto max-w-2xl px-4 py-8">
          {/* Hero Section */}
          <header className="mb-8">
            {post.heroImg && (
              <div className="rounded-base mb-6 aspect-video overflow-hidden">
                <img
                  alt={post.title ?? "Blog post hero image"}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  src={post.heroImg}
                />
              </div>
            )}

            <div className="space-y-4">
              <h1 className="text-4xl leading-tight font-bold md:text-5xl">{post.title ?? "Untitled Post"}</h1>

              {post.description && <p className="text-muted-foreground text-xl leading-relaxed">{post.description}</p>}

              {/* Author Info */}
              {author && (
                <div className="mb-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage alt={author.name} src={author.image ?? undefined} />
                    <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">{author.name}</span>
                    {publishedDate && (
                      <time className="text-muted-foreground text-sm">
                        {publishedDate.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge className="px-3 py-1" key={tag} variant="neutral">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <Markdown html={post.html ?? ""} />
          </div>
        </article>
      </ScrollArea>
    </ScreenCenter>
  );
}
