import { createFileRoute } from "@tanstack/react-router";
import { NotFound } from "src/components/NotFound";
import { UserErrorComponent } from "src/components/UserError";

export const Route = createFileRoute("/users/$userId")({
  component: UserComponent,
  errorComponent: UserErrorComponent,
  loader: async ({ params: { userId } }) => {
    try {
      const res = await fetch("/api/users/" + userId);
      if (!res.ok) {
        throw new Error("Unexpected status code");
      }

      const data = (await res.json()) as Record<string, string>;

      return data;
    } catch {
      throw new Error("Failed to fetch user");
    }
  },
  notFoundComponent: () => {
    return <NotFound>User not found</NotFound>;
  },
});

function UserComponent() {
  const user = Route.useLoaderData();

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{user.name}</h4>
      <div className="text-sm">{user.email}</div>
      <div>
        <a className="text-blue-800 hover:text-blue-600 underline" href={`/api/users/${user.id}`}>
          View as JSON
        </a>
      </div>
    </div>
  );
}
