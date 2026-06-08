import type { GroupProps, PanelProps, SeparatorProps } from "react-resizable-panels";

import { GripVertical } from "lucide-react";
import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

import { cn } from "~/lib/utils/index";

function ResizableHandle({
  className,
  withHandle,
  ...props
}: {
  className?: string;
  withHandle?: boolean;
} & SeparatorProps) {
  return (
    <Separator
      className={cn(
        "relative flex w-0.5 items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-1 focus-visible:outline-none data-[panel-group-direction=vertical]:h-0.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className,
      )}
      data-slot="resizable-handle"
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-base border bg-border">
          <GripVertical className="size-2.5" />
        </div>
      )}
    </Separator>
  );
}

function ResizablePanel({ className, ...props }: PanelProps) {
  return <Panel className={cn(className)} data-slot="resizable-panel" {...props} />;
}

function ResizablePanelGroup({ className, ...props }: GroupProps) {
  return (
    <Group
      className={cn("flex size-full font-base data-[panel-group-direction=vertical]:flex-col", className)}
      data-slot="resizable-panel-group"
      {...props}
    />
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
