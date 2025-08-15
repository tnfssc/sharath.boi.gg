import { Slot } from "@radix-ui/react-slot";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";

import { cn } from "~/lib/utils/index";
import { remarked } from "~/lib/utils/remark";

export type MarkdownProps = { asChild?: boolean; content?: string; html?: string } & React.ComponentProps<"div">;

function Markdown({ asChild = false, className, content, html, ...props }: MarkdownProps) {
  const Comp = asChild ? Slot : "div";

  const htmlQuery = useQuery({
    enabled: !!html || !!content,
    initialData: html,
    queryFn: () => html ?? remarked(content ?? ""),
    queryKey: ["remaked", html, content],
  });

  return (
    <Comp
      className={cn(
        "prose dark:prose-invert mx-auto max-w-[min(calc(100vw-32px),72ch)]",
        "prose-a:no-underline prose-a:hover:underline prose-a:break-all",
        "prose-img:rounded-xl",
        "prose-pre:mt-0 prose-pre:rounded-t-none",
        "prose-code:whitespace-pre prose-code:rounded prose-code:border-[#1e1e1e] prose-code:bg-[#1e1e1e] prose-code:p-0.5 prose-code:text-white prose-code:before:hidden prose-code:after:hidden",
        "defaults-for-unplugin-icons hide-quote-marks-inside-blockquote",
        "prose-img:my-1 prose-img:shadow-md prose-img:shadow-foreground/20 prose-a:inline-block prose-img:inline prose-hr:my-2 [&_summary]:cursor-pointer",
        "prose-img:hover:outline prose-img:outline-gray-500",
      )}
      dangerouslySetInnerHTML={{ __html: htmlQuery.data ?? "" }}
      {...props}
    />
  );
}

export { Markdown };
