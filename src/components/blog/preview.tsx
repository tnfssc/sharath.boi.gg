import { Markdown } from "../ui/markdown";

export const MarkdownPreview: React.FC<{ html: string }> = ({ html }) => {
  return (
    <Markdown asChild html={html}>
      <article />
    </Markdown>
  );
};
