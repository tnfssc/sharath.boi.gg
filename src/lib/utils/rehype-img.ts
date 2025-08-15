import type { Plugin } from "unified";

import { visit } from "unist-util-visit";

export const rehypeImg: Plugin = () => {
  return (rootNode) => {
    visit(rootNode, (node) => {
      if (node.type !== "element") return;
      // @ts-expect-error - node is an html element
      if (node.tagName !== "img") return;
      // @ts-expect-error - node is an html element
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      node.properties.referrerpolicy = "no-referrer";
      // @ts-expect-error - node is an html element
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      node.properties.class = "w-full rounded-xl";
    });
    return rootNode;
  };
};
