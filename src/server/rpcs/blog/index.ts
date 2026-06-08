import { init as CUID2 } from "@paralleldrive/cuid2";

const createId = () => CUID2()();
import { TRPCError } from "@trpc/server";
import { type } from "arktype";

import { db, orm, schema } from "~/db/index";
import { mdToHtml } from "~/lib/services/md-to-html";
import { BlogPostFrontmatterArk } from "~/lib/types";
import { ownerProcedure, publicProcedure, router } from "~/server/trpc";

export const blogRouter = router({
  author: {
    create: ownerProcedure
      .input(type({ "image?": "string.url", name: "string", social: "string.email | string.url" }))
      .mutation(async ({ input }) => {
        const data = await db
          .insert(schema.blog_author)
          .values({
            id: createId(),
            image: input.image ?? null,
            name: input.name,
            social: input.social,
          })
          .returning()
          .execute();
        const result = data.at(0);
        if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create post" });
        return result;
      }),
    get: publicProcedure.query(async () => {
      const data = await db.select().from(schema.blog_author).execute();
      return data;
    }),
    update: ownerProcedure
      .input(
        type({
          id: "0 < string < 128",
          "image?": "string.url",
          name: "string",
          social: "string.email | string.url",
        }),
      )
      .mutation(async ({ input }) => {
        const data = await db
          .update(schema.blog_author)
          .set({ image: input.image ?? null, name: input.name, social: input.social, updatedAt: new Date() })
          .where(orm.eq(schema.blog_author.id, input.id))
          .returning()
          .execute();
        const result = data.at(0);
        if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create post" });
        return result;
      }),
  },
  post: {
    create: ownerProcedure
      .input(type({ authorId: "0 < string < 128", slug: "0 < string < 128" }))
      .mutation(async ({ input }) => {
        const content = `---\nauthorId: ${input.authorId}\n---\n\n# Untitled post`;
        const data = await db
          .insert(schema.blog_post)
          .values({ authorId: input.authorId, content, id: createId(), slug: input.slug })
          .returning()
          .execute();
        const result = data.at(0);
        if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create post" });
        return result;
      }),
    get: publicProcedure.query(async () => {
      const data = await db
        .select()
        .from(schema.blog_post)
        .where(orm.isNotNull(schema.blog_post.publishedAt))
        .leftJoin(schema.blog_author, orm.eq(schema.blog_post.authorId, schema.blog_author.id))
        .execute();
      return data;
    }),
    getBySlug: publicProcedure.input(type({ slug: "0 < string < 128" })).query(async ({ input }) => {
      const data = await db
        .select()
        .from(schema.blog_post)
        .where(orm.eq(schema.blog_post.slug, input.slug))
        .leftJoin(schema.blog_author, orm.eq(schema.blog_post.authorId, schema.blog_author.id))
        .execute();
      const result = data.at(0);
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      if (!result.blog_author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unexpected: author not found for post ${input.slug}`,
        });
      return result;
    }),
    update: ownerProcedure.input(type({ "content?": "string", id: "0 < string < 128" })).mutation(async ({ input }) => {
      const { frontmatter, html } = await mdToHtml(input.content ?? "");
      const matter = BlogPostFrontmatterArk(frontmatter);
      if (matter instanceof type.errors) throw new TRPCError({ code: "BAD_REQUEST", message: matter.summary });
      const { authorId, date, description, heroImage, public: isPublic, tags, title } = matter;
      const data = await db
        .update(schema.blog_post)
        .set({
          authorId,
          content: input.content,
          description,
          heroImg: heroImage,
          html,
          publishedAt: isPublic ? date : null,
          tags: tags?.join(","),
          title,
          updatedAt: new Date(),
        })
        .where(orm.eq(schema.blog_post.id, input.id))
        .returning()
        .execute()
        .catch((cause: unknown) => {
          throw new TRPCError({ cause, code: "BAD_REQUEST", message: "Failed to update post" });
        });
      const result = data.at(0);
      if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create post" });
      return result;
    }),
  },
});
