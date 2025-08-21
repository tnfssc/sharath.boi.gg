import { type } from "arktype";

export const BlogPostFrontmatterArk = type({
  authorId: "string",
  date: type("Date | string").pipe((x) => new Date(x)),
  description: "0 < string < 1024",
  heroImage: "string.url",
  public: "boolean",
  tags: "(0 < string < 128)[]",
  title: "0 < string < 128",
}).partial();
