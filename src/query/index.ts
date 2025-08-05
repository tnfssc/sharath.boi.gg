import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const queries = {
  isOwner: () =>
    queryOptions({
      queryFn: async () => {
        const response = await fetch("/api/access-control/");
        return response.ok;
      },
      queryKey: ["is-owner"],
    }),
};

export const mutations = {
  uploadToCDN: () =>
    mutationOptions({
      mutationFn: async (file: File) => {
        const ext = file.name.split(".").pop() ?? "unknown";
        const response = await fetch("/api/s3/?ext=" + ext, {
          body: file,
          headers: { "Content-Type": file.type },
          method: "PUT",
        });
        if (!response.ok) throw new Error("Failed to upload to CDN");
        return response.json() as Promise<{ url: string }>;
      },
      mutationKey: ["upload-to-cdn"],
    }),
};
