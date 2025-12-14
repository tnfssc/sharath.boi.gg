import { AwsClient } from "aws4fetch";

import { serverEnv } from "~/env/server";

const R2_URL = `https://${serverEnv.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${serverEnv.R2_BUCKET_NAME}`;

const client = new AwsClient({
  accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
  region: "auto",
  secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
  service: "s3",
});

export const S3 = {
  presignedPut: async (key: string, exp = 3600) => {
    const response = await client.sign(
      new Request(`${R2_URL}/${key}?X-Amz-Expires=${exp}`, {
        method: "PUT",
      }),
      { aws: { signQuery: true } },
    );
    const signedUrl = response.url;
    return signedUrl;
  },
  put: async (key: string, data: Blob | ReadableStream) => {
    const signedPutUrl = await S3.presignedPut(key);
    const response = await fetch(signedPutUrl, { body: data, method: "PUT" });
    if (!response.ok) {
      const responseText = await response.text();
      throw new Error("Failed to upload file", { cause: responseText });
    }
    return "ok" as const;
  },
};
