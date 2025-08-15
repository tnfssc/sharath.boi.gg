import { transformerCopyButton } from "@rehype-pretty/transformers";
import rehypeShiki from "@shikijs/rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkCodeTitle from "remark-code-title";
import remarkFrontmatter from "remark-frontmatter";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { rehypeImg } from "./rehype-img";

export const remarked = (md: string): Promise<string> =>
  unified()
    .use(remarkParse, { fragment: true })
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkGemoji)
    .use(remarkCodeTitle)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeShiki, {
      themes: { dark: "dark-plus", light: "dark-plus" },
      transformers: [transformerCopyButton({ feedbackDuration: 3000, visibility: "always" })],
    })
    .use(rehypeImg)
    .use(rehypeStringify)
    .process(md)
    .then(String);
