import { arktypeResolver } from "@hookform/resolvers/arktype";
// import { Turnstile } from "@marsidev/react-turnstile";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerOnlyFn } from "@tanstack/react-start";
import { useServerFn } from "@tanstack/react-start";
// import { getHeader } from "@tanstack/react-start/server";
import { type } from "arktype";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScreenCenter } from "~/components/ui/screen-center";
import { SubmitButton } from "~/components/ui/submit-button";
import { Textarea } from "~/components/ui/textarea";
// import { clientEnv } from "~/env/client";
import { serverEnv } from "~/env/server";
// import { verifyTurnstile } from "~/lib/server/turnstile";
import { waitFor } from "~/lib/utils";

const FormDataArk = type({
  email: "string.email",
  idempotencyKey: "string",
  message: "0 < string < 1024",
  "turnstileToken?": "string",
});

const sendToDiscordServerFn = createServerOnlyFn(async (data: typeof FormDataArk.infer) => {
  if (!serverEnv.DISCORD_WEBHOOK_URL) return "not configured";

  // if (serverEnv.TURNSTILE_SECRET_KEY) {
  //   if (!data.turnstileToken) return "turnstile token not provided";
  //   const clientIp = getHeader("CF-Connecting-IP");
  //   if (!clientIp) return "client ip not provided";
  //   const isSuccess = await verifyTurnstile({
  //     clientIp,
  //     idempotencyKey: data.idempotencyKey,
  //     token: data.turnstileToken,
  //   });
  //   if (!isSuccess) return "turnstile token invalid";
  // }

  const response = await fetch(serverEnv.DISCORD_WEBHOOK_URL, {
    body: JSON.stringify({ content: `**${data.email}** sent a message:\n${data.message}` }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) {
    console.error(await response.text());
    return "error";
  }
  return "ok";
});

export const Route = createFileRoute("/ping")({ component: RouteComponent, ssr: false });

function RouteComponent() {
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  const sendToDiscord = useServerFn(sendToDiscordServerFn);

  const sendToDiscordMutation = useMutation({
    mutationFn: sendToDiscord,
    onSuccess: () => {
      void waitFor(3000).then(() => {
        sendToDiscordMutation.reset();
      });
    },
  });

  const form = useForm<typeof FormDataArk.infer>({
    defaultValues: { email: "", idempotencyKey, message: "", turnstileToken: "" },
    resolver: arktypeResolver(FormDataArk),
  });

  function onSubmit(values: typeof FormDataArk.infer) {
    sendToDiscordMutation.mutate(values);
  }

  return (
    <ScreenCenter>
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="me@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Hi, can you help us with <your problem>?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* {clientEnv.VITE_TURNSTILE_SITE_KEY && (
            <Turnstile
              onSuccess={(token) => form.setValue("turnstileToken", token)}
              siteKey={clientEnv.VITE_TURNSTILE_SITE_KEY}
            />
          )} */}
          <SubmitButton disabled={sendToDiscordMutation.isSuccess} loading={sendToDiscordMutation.isPending}>
            {sendToDiscordMutation.isSuccess ? "Thanks" : "Submit"}
          </SubmitButton>
        </form>
      </Form>
    </ScreenCenter>
  );
}
