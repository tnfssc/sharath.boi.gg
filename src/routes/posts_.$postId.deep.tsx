import { createFileRoute, Link } from "@tanstack/react-router";

import { PostErrorComponent } from "~/components/PostError";

import { fetchPost } from "../utils/posts";

export const Route = createFileRoute("/posts_/$postId/deep")({
  component: PostDeepComponent,
  errorComponent: PostErrorComponent,
  loader: async ({ params: { postId } }) =>
    fetchPost({
      data: postId,
    }),
});

function PostDeepComponent() {
  const post = Route.useLoaderData();

  return (
    <div className="p-2 space-y-2">
      <Link className="block py-1 text-blue-800 hover:text-blue-600" to="/posts">
        ← All Posts
      </Link>
      <h4 className="text-xl font-bold underline">{post.title}</h4>
      <div className="text-sm">{post.body}</div>
    </div>
  );
}
