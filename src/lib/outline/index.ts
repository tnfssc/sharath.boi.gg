import { serverEnv } from "~/env/server";

export interface DocumentListResponse {
  data: Array<{
    collaboratorIds: Array<string>;
    collectionId: string;
    color?: string;
    createdAt: string;
    deletedAt?: string;
    icon?: string;
    id: string;
    publishedAt: string;
    text: string;
    title: string;
    updatedAt: string;
    url: string;
    urlId: string;
  }>;
}

export const Outline = {
  collections: {
    documents: async (collectionId: string) => {
      const response = await fetch(`${serverEnv.OUTLINE_API_BASE}/collections.documents`, {
        body: JSON.stringify({ id: collectionId }),
        headers: { Authorization: `Bearer ${serverEnv.OUTLINE_API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to fetch documents", { cause: await response.text() });
      return await response.json();
    },
    info: async (collectionId: string) => {
      const response = await fetch(`${serverEnv.OUTLINE_API_BASE}/collections.info`, {
        body: JSON.stringify({ id: collectionId }),
        headers: { Authorization: `Bearer ${serverEnv.OUTLINE_API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to fetch collection info", { cause: await response.text() });
      return await response.json();
    },
  },
  documents: {
    export: async (documentId: string) => {
      const response = await fetch(`${serverEnv.OUTLINE_API_BASE}/documents.export`, {
        body: JSON.stringify({ id: documentId }),
        headers: { Authorization: `Bearer ${serverEnv.OUTLINE_API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to export document", { cause: await response.text() });
      return await response.json();
    },
    info: async (documentId: string) => {
      const response = await fetch(`${serverEnv.OUTLINE_API_BASE}/documents.info`, {
        body: JSON.stringify({ id: documentId }),
        headers: { Authorization: `Bearer ${serverEnv.OUTLINE_API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to fetch document info", { cause: await response.text() });
      return await response.json();
    },
    list: async (collectionId: string) => {
      const response = await fetch(`${serverEnv.OUTLINE_API_BASE}/documents.list`, {
        body: JSON.stringify({ collectionId, direction: "DESC", limit: 100, sort: "createdAt" }),
        headers: { Authorization: `Bearer ${serverEnv.OUTLINE_API_KEY}`, "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to fetch document list", { cause: await response.text() });
      return (await response.json()) as DocumentListResponse;
    },
  },
};
