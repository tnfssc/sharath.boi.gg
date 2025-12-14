import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// Lazy load to prevent SSR issues with Three.js
const LiquidSimulation = lazy(() =>
  import("~/components/liquid-simulation").then((m) => ({
    default: m.LiquidSimulation,
  })),
);

export const Route = createFileRoute("/+internal/expt/001")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense>
      <LiquidSimulation />
    </Suspense>
  );
}
