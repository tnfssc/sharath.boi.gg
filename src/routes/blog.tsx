import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { Markdown } from "~/components/ui/markdown";
import { ScreenCenter } from "~/components/ui/screen-center";
import { ScrollArea } from "~/components/ui/scroll-area";
import { serverEnv } from "~/env/server";
import { Outline } from "~/lib/outline";
import { remarked } from "~/lib/utils/remark";

const getData = createServerFn().handler(async () => {
  const { data } = await Outline.documents.list(serverEnv.OUTLINE_COLLECTION_ID);
  const renderedData = await Promise.all(
    data.map(async (d) => ({
      ...d,
      html: await remarked(d.text).catch(() => void 0),
    })),
  );
  return renderedData;
});

export const Route = createFileRoute("/blog")({
  component: RouteComponent,
  loader: () => getData(),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <ScreenCenter>
      <ScrollArea className="w-full">
        <div className="m-4 grid grid-cols-1 gap-4">
          {data.map((d) => (
            <div key={d.id}>
              <Markdown content={d.text} html={d.html} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </ScreenCenter>
  );
}
