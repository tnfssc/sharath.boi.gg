import { createFileRoute } from "@tanstack/react-router";

import { FlipWords } from "~/components/ui/flip-words";
import { ScreenCenter } from "~/components/ui/screen-center";
export const Route = createFileRoute("/")({
  component: Home,
});

const words = ["an engineer", "a gamer", "a tinkerer", "a nerd", "an otaku"];

function Home() {
  return (
    <ScreenCenter>
      <div className="z-10 flex items-center justify-center px-4">
        <div className="text-foreground mx-auto text-3xl font-normal lg:text-5xl">
          <span>
            i am
            <FlipWords words={words} /> <br />
          </span>
          <span>i love building stuff</span>
        </div>
      </div>
    </ScreenCenter>
  );
}
