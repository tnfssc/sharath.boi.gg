import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
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

  // Filter only published posts and sort by published date
  const publishedPosts = data
    .filter((d) => d.blog_post.publishedAt)
    .sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const dateA = new Date(a.blog_post.publishedAt!).getTime();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const dateB = new Date(b.blog_post.publishedAt!).getTime();
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
              const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null;

              return (
                <Card className="flex flex-col transition-shadow duration-200 hover:shadow-lg" key={post.slug}>
                  {post.heroImg && (
                    <div className="rounded-t-base aspect-video overflow-hidden">
                      <img
                        alt={post.title ?? "Blog post hero image"}
                        className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                        referrerPolicy="no-referrer"
                        src={post.heroImg}
                      />
                    </div>
                  )}

                  <CardHeader className="flex-1">
                    <div className="mb-3 flex items-center gap-2">
                      {author && (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage alt={author.name} src={author.image ?? undefined} />
                            <AvatarFallback className="text-xs">{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{author.name}</span>
                            {publishedDate && (
                              <span className="text-muted-foreground text-xs">
                                {publishedDate.toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            )}
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
                        Read More
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
