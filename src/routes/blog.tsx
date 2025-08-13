import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { ScreenCenter } from "~/components/ui/screen-center";
import { ScrollArea } from "~/components/ui/scroll-area";
import { serverEnv } from "~/env/server";
import { Outline } from "~/lib/outline";

const getData = createServerFn().handler(async () => {
  const data = await Outline.documents.list(serverEnv.OUTLINE_COLLECTION_ID);
  return data;
});

export const Route = createFileRoute("/blog")({
  component: RouteComponent,
  loader: () => getData(),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <ScreenCenter>
      <ScrollArea>
        <div className="m-4 grid grid-cols-1 gap-4">
          {data.data.map((d) => (
            <div key={d.id}>
              <code>
                <pre className="whitespace-pre-wrap">{JSON.stringify(d, null, 2)}</pre>
              </code>
            </div>
          ))}
        </div>
      </ScrollArea>
    </ScreenCenter>
  );
}
