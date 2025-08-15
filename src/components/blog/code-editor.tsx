import { useEffect, useState } from "react";

import { Textarea } from "~/components/ui/textarea";
import { useDebounceHandler } from "~/hooks/use-debounce-handler";

export const CodeEditor: React.FC<{ content: string; onContentChange: (content: string) => void }> = ({
  content,
  onContentChange,
}) => {
  const [value, setValue] = useState(content);
  useEffect(() => {
    setValue(content);
  }, [content]);
  const handleChange = useDebounceHandler(onContentChange);

  return (
    <Textarea
      onChange={(e) => {
        setValue(e.target.value);
        handleChange(e.target.value);
      }}
      value={value}
    />
  );
};
