import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { type } from "arktype";
import { useForm } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SubmitButton } from "~/components/ui/submit-button";
import { useTRPC } from "~/lib/trpc";
import { createCaller } from "~/server/caller";

const getData = createServerFn().handler(async () => {
  const request = getWebRequest();
  const caller = await createCaller(request);
  const data = await caller.blog.author.get();
  return data;
});

export const Route = createFileRoute("/blog/create")({
  component: RouteComponent,
  loader: () => getData(),
});

const FormArk = type({ authorId: "string", slug: "string" });

function RouteComponent() {
  const authors = Route.useLoaderData();
  const trpc = useTRPC();
  const router = useRouter();
  const authorsQuery = useQuery(trpc.blog.author.get.queryOptions(undefined, { initialData: authors }));

  const form = useForm<typeof FormArk.infer>({
    defaultValues: { authorId: authorsQuery.data.at(0)?.id ?? "", slug: "" },
    resolver: arktypeResolver(FormArk),
  });

  const createPostMutation = useMutation(
    trpc.blog.post.create.mutationOptions({
      onSuccess: async ({ id }) => {
        await router.navigate({ params: { id }, to: "/blog/$id/update" });
      },
    }),
  );

  async function onSubmit(values: typeof FormArk.infer) {
    await createPostMutation.mutateAsync(values);
  }

  return (
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
                      <SelectLabel>Authors</SelectLabel>
                      {authorsQuery.data.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          <Avatar>
                            <AvatarImage alt={author.name} src={author.image ?? undefined} />
                            <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Link className="flex items-center gap-2" to="/blog/create-author">
          <Avatar>
            <AvatarImage alt="Create new author" />
            <AvatarFallback>+</AvatarFallback>
          </Avatar>
          Create new author
        </Link>

        <SubmitButton loading={createPostMutation.isPending}>Create</SubmitButton>
      </form>
    </Form>
  );
}
