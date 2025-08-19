import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { type } from "arktype";

import { db, orm, schema } from "~/db/index";
import { mdToHtml } from "~/lib/services/md-to-html";
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
        return data[0];
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
        return data[0];
      }),
  },
  post: {
    create: ownerProcedure
      .input(
        type({
          authorId: "0 < string < 128",
          "content?": "string",
          "description?": "string",
          "heroImg?": "string",
          "publishedAt?": "Date",
          slug: "0 < string < 128",
          "tags?": "string",
          "title?": "string",
        }),
      )
      .mutation(async ({ input }) => {
        const data = await db
          .insert(schema.blog_post)
          .values({
            authorId: input.authorId,
            content: input.content ?? null,
            description: input.description ?? null,
            heroImg: input.heroImg ?? null,
            id: createId(),
            publishedAt: input.publishedAt ?? null,
            slug: input.slug,
            tags: input.tags ?? null,
            title: input.title ?? null,
          })
          .returning()
          .execute();
        return data[0];
      }),
    get: publicProcedure.query(async () => {
      const data = await db
        .select()
        .from(schema.blog_post)
        .leftJoin(schema.blog_author, orm.eq(schema.blog_post.authorId, schema.blog_author.id))
        .execute();
      const result = await Promise.all(
        data.map(async (d) => {
          const html = await mdToHtml(d.blog_post.content ?? "");
          return { ...d, blog_post: { ...d.blog_post, html } };
        }),
      );
      return result;
    }),
    getById: publicProcedure.input(type({ id: "string" })).query(async ({ input }) => {
      const data = await db
        .select()
        .from(schema.blog_post)
        .where(orm.eq(schema.blog_post.id, input.id))
        .leftJoin(schema.blog_author, orm.eq(schema.blog_post.authorId, schema.blog_author.id))
        .execute();
      const result = data.at(0);
      if (!result) throw new TRPCError({ code: "NOT_FOUND" });
      if (!result.blog_author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Unexpected: author not found for post ${input.id}`,
        });
      const html = await mdToHtml(result.blog_post.content ?? "");
      return {
        ...result,
        blog_author: result.blog_author,
        blog_post: { ...result.blog_post, html },
      };
    }),
    update: ownerProcedure
      .input(
        type({
          "authorId?": "0 < string < 128",
          "content?": "string",
          "description?": "string",
          "heroImg?": "string",
          id: "0 < string < 128",
          "publishedAt?": "Date",
          "slug?": "0 < string < 128",
          "tags?": "string",
          "title?": "string",
        }),
      )
      .mutation(async ({ input }) => {
        const data = await db
          .update(schema.blog_post)
          .set({
            authorId: input.authorId,
            content: input.content,
            description: input.description,
            heroImg: input.heroImg,
            publishedAt: input.publishedAt,
            slug: input.slug,
            tags: input.tags,
            title: input.title,
            updatedAt: new Date(),
          })
          .where(orm.eq(schema.blog_post.id, input.id))
          .returning()
          .execute();
        return data[0];
      }),
  },
});
