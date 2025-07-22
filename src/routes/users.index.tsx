import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/users/")({
  component: UsersIndexComponent,
});

function UsersIndexComponent() {
  return (
    <div>
      Select a user or{" "}
      <a className="text-blue-800 hover:text-blue-600 underline" href="/api/users">
        view as JSON
      </a>
    </div>
  );
}
