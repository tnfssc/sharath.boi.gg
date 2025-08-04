import { useAtomValue } from "jotai";
import * as React from "react";

import { currentInsetAtom } from "~/components/sidebar";

import { TextHoverEffect } from "./text-hover-effect";

/**
 * Hydration-safe version:
 * - SSR renders with neutral insets (0,0) to avoid mismatch.
 * - After mount, reads app-computed insets from Jotai and updates inline styles.
 */
export const ScreenCenter: React.FC<React.PropsWithChildren> = ({ children }) => {
  const inset = useAtomValue(currentInsetAtom);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Neutral insets for SSR; use actual app-computed insets only after mount
  const vertical = mounted ? inset.vertical : "0px";
  const horizontal = mounted ? inset.horizontal : "0px";

  return (
    <div
      className="flex snap-start flex-col items-center justify-center overflow-clip"
      style={{ height: `calc(100vh - ${vertical})`, width: `calc(100vw - ${horizontal})` } as React.CSSProperties}
    >
      {children}
      <div className="absolute bottom-0 flex h-32 max-w-xl items-center justify-center">
        <TextHoverEffect text="boi.gg" />
      </div>
    </div>
  );
};
