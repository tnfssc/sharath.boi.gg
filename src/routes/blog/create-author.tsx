import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type } from "arktype";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { SubmitButton } from "~/components/ui/submit-button";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/blog/create-author")({
  component: RouteComponent,
});

const FormArk = type({ image: "string.url", name: "0 < string < 128", social: "string.url | string.email" });

function RouteComponent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<typeof FormArk.infer>({
    defaultValues: { image: "", name: "", social: "" },
    resolver: arktypeResolver(FormArk),
  });

  const createAuthorMutation = useMutation(
    trpc.blog.author.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.blog.author.get.queryOptions());
        await router.navigate({ to: "/blog/create" });
      },
    }),
  );

  async function onSubmit(values: typeof FormArk.infer) {
    await createAuthorMutation.mutateAsync({
      ...values,
      image: values.image,
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/tnfssc.png" {...field} />
              </FormControl>
              <FormDescription>Your avatar image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="social"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/tnfssc" {...field} />
              </FormControl>
              <FormDescription>Your social media handle.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton loading={createAuthorMutation.isPending}>Create</SubmitButton>
      </form>
    </Form>
  );
}
