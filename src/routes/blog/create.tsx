import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { type } from "arktype";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScreenCenter } from "~/components/ui/screen-center";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { SubmitButton } from "~/components/ui/submit-button";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/blog/create")({
  component: RouteComponent,
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(context.trpc.blog.author.get.queryOptions(undefined));
  },
});

const FormArk = type({ authorId: "string", slug: "string" });

function RouteComponent() {
  const trpc = useTRPC();
  const router = useRouter();
  const authorsQuery = useSuspenseQuery(trpc.blog.author.get.queryOptions(undefined));

  const form = useForm<typeof FormArk.infer>({
    defaultValues: { authorId: authorsQuery.data.at(0)?.id ?? "", slug: "" },
    resolver: arktypeResolver(FormArk),
  });

  const createPostMutation = useMutation(
    trpc.blog.post.create.mutationOptions({
      onSuccess: async ({ slug }) => {
        await router.navigate({ params: { slug }, to: "/blog/$slug/update" });
      },
    }),
  );

  async function onSubmit(values: typeof FormArk.infer) {
    await createPostMutation.mutateAsync(values);
  }

  return (
    <ScreenCenter>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Post slug like `asdf-intro`" {...field} />
                </FormControl>
                <FormDescription>This is the URL slug for the post.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {authorsQuery.data.map((author) => (
                          <SelectItem key={author.id} value={author.id}>
                            {author.name}
                          </SelectItem>
                        ))}
                        <Button
                          asChild
                          className="m-2 w-[calc(100%-16px)]"
                          onClick={(e) => {
                            e.preventDefault();
                            void router.navigate({ to: "/blog/create-author" });
                          }}
                          size="sm"
                        >
                          <Link to="/blog/create-author">+ author</Link>
                        </Button>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton loading={createPostMutation.isPending}>Create</SubmitButton>
        </form>
      </Form>
    </ScreenCenter>
  );
}
