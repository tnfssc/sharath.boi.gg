import { createFileRoute } from "@tanstack/react-router";

import { ScreenCenter } from "~/components/ui/screen-center";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <ScreenCenter>
      <div className="p-2">
        <h3>Welcome Home!!!</h3>
      </div>
    </ScreenCenter>
  );
}
