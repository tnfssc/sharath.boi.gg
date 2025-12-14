import { createFileRoute } from "@tanstack/react-router";

import { FlipWords } from "~/components/ui/flip-words";
import { ScreenCenter } from "~/components/ui/screen-center";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <ScreenCenter>
      <div className="z-10 flex items-center justify-center px-4">
        <div className="mx-auto text-3xl font-normal text-foreground lg:text-5xl">
          <span>
            i am
            <FlipWords words={["Sharath", "an engineer", "a gamer", "a tinkerer", "a nerd", "a crafter"]} /> <br />
          </span>
          <span>i love building stuff</span>
        </div>
      </div>
    </ScreenCenter>
  );
}
