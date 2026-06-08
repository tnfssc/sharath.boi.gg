import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { ScreenCenter } from "~/components/ui/screen-center";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/blog/")({
  component: RouteComponent,
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(context.trpc.blog.post.get.queryOptions());
  },
});

function RouteComponent() {
  const trpc = useTRPC();
  const publishedPostsQuery = useSuspenseQuery(trpc.blog.post.get.queryOptions());

  // Filter only published posts and sort by published date
  const publishedPosts = publishedPostsQuery.data
    .filter((d) => d.blog_post.publishedAt)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((d) => ({ ...d, blog_post: { ...d.blog_post, publishedAt: d.blog_post.publishedAt! } }))
    .sort((a, b) => {
      const dateA = new Date(a.blog_post.publishedAt).getTime();

      const dateB = new Date(b.blog_post.publishedAt).getTime();
      return dateB - dateA; // Most recent first
    });

  return (
    <ScreenCenter>
      <ScrollArea className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedPosts.map((d) => {
              const post = d.blog_post;
              const author = d.blog_author;
              const tags = post.tags ? post.tags.split(",").filter(Boolean) : [];
              const publishedDate = post.publishedAt;

              return (
                <Card className="flex flex-col transition-shadow duration-200 hover:shadow-lg" key={post.slug}>
                  {post.heroImg && (
                    <div className="aspect-video overflow-hidden rounded-t-base">
                      <img
                        alt={post.title ?? "Blog post hero image"}
                        className="size-full object-cover transition-transform duration-200 hover:scale-105"
                        referrerPolicy="no-referrer"
                        src={post.heroImg}
                      />
                    </div>
                  )}

                  <CardHeader className="flex-1">
                    <div className="mb-3 flex items-center gap-2">
                      {author && (
                        <>
                          <Avatar className="size-8">
                            <AvatarImage alt={author.name} src={author.image ?? undefined} />
                            <AvatarFallback className="text-xs">{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{author.name}</span>
                            <span className="text-muted-foreground text-xs">
                              {publishedDate.toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <CardTitle className="mb-2 line-clamp-2 text-xl">{post.title ?? "Untitled Post"}</CardTitle>

                    {post.description && <CardDescription className="line-clamp-3">{post.description}</CardDescription>}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {tags.slice(0, 5).map((tag) => (
                          <Badge key={tag} variant="default">
                            {tag.trim()}
                          </Badge>
                        ))}
                        {tags.length > 3 && <Badge variant="default">+{tags.length - 3} more</Badge>}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild className="w-full" variant="neutral">
                      <Link className="w-full" params={{ slug: post.slug }} to={`/blog/$slug`}>
                        Read More<span className="sr-only"> about {post.title}</span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </ScreenCenter>
  );
}
