import { cn } from "~/lib/utils/index";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-base bg-secondary-background border-2 border-border", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
