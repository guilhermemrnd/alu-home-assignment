import { Headers, Rows } from "@/core/services/parser";
import { Product, Mapping } from "@/core/domain/product";
import { ChatOperation } from "@/core/domain/agent";

export interface UploadResponse {
  headers: Headers;
  mapping: Mapping;
  rows: Rows;
  products: any[];
}

export interface ChatResponse {
  assistant_message: string;
  operations: ChatOperation[];
}

class HttpClient {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async sendChatMessage(message: string, products: Product[], mapping: Mapping): Promise<ChatResponse> {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, products, mapping }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }
}

export const httpClient = new HttpClient();