import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CopyCheckIcon, CopyIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { CheckCircle2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "~/components/ui/file-upload";
import { ScreenCenter } from "~/components/ui/screen-center";
import { useCopy } from "~/hooks/use-copy";
import { useTRPC } from "~/lib/trpc";

export const Route = createFileRoute("/upload-to-cdn")({
  component: RouteComponent,
});

function RouteComponent() {
  const [file, setFile] = React.useState<File | null>(null);
  const [copied, copyToClipboard] = useCopy();
  const trpc = useTRPC();

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  const uploadToCdnMutation = useMutation(trpc.owner.uploadToCDN.mutationOptions());

  const onSubmit = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    uploadToCdnMutation.mutate(formData, {
      onSuccess: (data) => {
        copyToClipboard(data.url);
        setFile(null);
      },
    });
  };

  const files = file ? [file] : [];

  return (
    <ScreenCenter>
      <FileUpload
        className="w-full max-w-md"
        maxFiles={1}
        maxSize={100 * 1024 * 1024}
        multiple
        onFileReject={onFileReject}
        onValueChange={(f) => setFile(f.at(0) ?? null)}
        value={files}
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <UploadCloudIcon className="text-muted-foreground size-6" />
            </div>
            <p className="text-sm font-medium">Drag & drop files here</p>
          </div>
          <FileUploadTrigger asChild>
            <Button className="mt-2 w-fit" size="sm">
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
        <FileUploadList>
          {files.map((file, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <FileUploadItem className="animate-in fade-in" key={index} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button className="size-7" size="icon">
                  <XIcon />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>

      <Button className="mt-4 w-fit" disabled={!file || uploadToCdnMutation.isPending} onClick={onSubmit} size="sm">
        Upload
      </Button>

      {uploadToCdnMutation.isSuccess && (
        <Alert className="animate-in fade-in mt-4 max-w-md">
          <CheckCircle2Icon />
          <AlertTitle>Success! Your file has been uploaded</AlertTitle>
          <AlertDescription>
            <Button className="mt-2 w-fit" onClick={() => copyToClipboard(uploadToCdnMutation.data.url)} size="sm">
              {uploadToCdnMutation.data.url}
              {copied ? <CopyCheckIcon className="ml-2 inline-block" /> : <CopyIcon className="ml-2 inline-block" />}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </ScreenCenter>
  );
}
