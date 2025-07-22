import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import type { User } from "../utils/users";

export const Route = createFileRoute("/users")({
  component: UsersComponent,
  loader: async () => {
    const res = await fetch("/api/users");

    if (!res.ok) {
      throw new Error("Unexpected status code");
    }

    const data = (await res.json()) as Array<User>;

    return data;
  },
});

function UsersComponent() {
  const users = Route.useLoaderData();

  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {[...users, { email: "", id: "i-do-not-exist", name: "Non-existent User" }].map((user) => {
          return (
            <li className="whitespace-nowrap" key={user.id}>
              <Link
                activeProps={{ className: "text-black font-bold" }}
                className="block py-1 text-blue-800 hover:text-blue-600"
                params={{
                  userId: String(user.id),
                }}
                to="/users/$userId"
              >
                <div>{user.name}</div>
              </Link>
            </li>
          );
        })}
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}
