import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { fetchPosts } from "../utils/posts";

export const Route = createFileRoute("/posts")({
  component: PostsComponent,
  loader: async () => fetchPosts(),
});

function PostsComponent() {
  const posts = Route.useLoaderData();

  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {[...posts, { id: "i-do-not-exist", title: "Non-existent Post" }].map((post) => {
          return (
            <li className="whitespace-nowrap" key={post.id}>
              <Link
                activeProps={{ className: "text-black font-bold" }}
                className="block py-1 text-blue-800 hover:text-blue-600"
                params={{
                  postId: post.id,
                }}
                to="/posts/$postId"
              >
                <div>{post.title.substring(0, 20)}</div>
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
