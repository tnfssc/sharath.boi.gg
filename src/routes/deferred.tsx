import { Await, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Suspense, useState } from "react";

const personServerFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(({ data: name }) => {
    return { name, randomNumber: Math.floor(Math.random() * 100) };
  });

const slowServerFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: name }) => {
    await new Promise((r) => setTimeout(r, 1000));
    return { name, randomNumber: Math.floor(Math.random() * 100) };
  });

export const Route = createFileRoute("/deferred")({
  component: Deferred,
  loader: async () => {
    return {
      deferredPerson: slowServerFn({ data: "Tanner Linsley" }),
      deferredStuff: new Promise<string>((r) => setTimeout(() => r("Hello deferred!"), 2000)),
      person: await personServerFn({ data: "John Doe" }),
    };
  },
});

function Deferred() {
  const [count, setCount] = useState(0);
  const { deferredPerson, deferredStuff, person } = Route.useLoaderData();

  return (
    <div className="p-2">
      <div data-testid="regular-person">
        {person.name} - {person.randomNumber}
      </div>
      <Suspense fallback={<div>Loading person...</div>}>
        <Await
          children={(data) => (
            <div data-testid="deferred-person">
              {data.name} - {data.randomNumber}
            </div>
          )}
          promise={deferredPerson}
        />
      </Suspense>
      <Suspense fallback={<div>Loading stuff...</div>}>
        <Await children={(data) => <h3 data-testid="deferred-stuff">{data}</h3>} promise={deferredStuff} />
      </Suspense>
      <div>Count: {count}</div>
      <div>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    </div>
  );
}
