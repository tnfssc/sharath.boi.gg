import { Markdown } from "../ui/markdown";

export const MarkdownPreview: React.FC<{ html: string }> = ({ html }) => {
  return <Markdown html={html} />;
};
