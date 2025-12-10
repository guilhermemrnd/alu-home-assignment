import { useMutation } from "@tanstack/react-query";

import { Product, Mapping } from "@/core/domain/product";
import { httpClient, ChatResponse } from "@/lib/http-client";

type Payload = { message: string; products: Product[]; mapping: Mapping };

export function useChat() {
  return useMutation<ChatResponse, Error, Payload>({
    mutationFn: ({ message, products, mapping }) =>
      httpClient.sendChatMessage(message, products, mapping),
  });
}
