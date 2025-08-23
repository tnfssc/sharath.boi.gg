import * as React from "react";

import { cn } from "~/lib/utils";

// import { TextHoverEffect } from "./text-hover-effect";

/**
 * Center content without JS-computed insets.
 * The surrounding layout (SidebarInset + fixed sidebar) already manages spacing.
 */
export const ScreenCenter: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-1 snap-start flex-col items-center justify-center overflow-clip", className)}>
      {children}
      {/* <div className="pointer-events-none absolute bottom-0 flex h-32 max-w-xl items-center justify-center">
        <TextHoverEffect text="boi.gg" />
      </div> */}
    </div>
  );
};
