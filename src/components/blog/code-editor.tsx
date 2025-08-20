import Editor, { type EditorProps } from "@monaco-editor/react";

import { useDebounceHandler } from "~/hooks/use-debounce-handler";

import { useTheme } from "../theme-provider";

export const CodeEditor: React.FC<{ content: string; onContentChange: (content: string) => void } & EditorProps> = ({
  content,
  onContentChange,
  ...props
}) => {
  const { theme } = useTheme();
  const handleChange = useDebounceHandler(onContentChange);

  return (
    <Editor
      defaultValue={content}
      language="markdown"
      onChange={(value) => {
        if (value) handleChange(value);
      }}
      options={{
        minimap: { enabled: false },
      }}
      theme={theme === "light" ? "vs-light" : "vs-dark"}
      {...props}
    />
  );
};
