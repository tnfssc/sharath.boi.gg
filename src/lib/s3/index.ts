import type { ReadableStream as ReadableWebStream } from "node:stream/web";

import * as Minio from "minio";
import { Readable } from "node:stream";

import { serverEnv } from "~/env/server";

const minio = new Minio.Client({
  accessKey: serverEnv.R2_ACCESS_KEY_ID,
  endPoint: `${serverEnv.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  secretKey: serverEnv.R2_SECRET_ACCESS_KEY,
});

export const S3 = {
  put: async (key: string, data: ReadableWebStream) => {
    const stream = Readable.fromWeb(data);
    await minio.putObject(serverEnv.R2_BUCKET_NAME, key, stream);
    return "ok" as const;
  },
};
