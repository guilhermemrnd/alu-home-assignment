import { useRef, useState } from "react";

import { Mapping, Product, ProductFieldName } from "@/core/domain/product";
import { ChatOperation } from "@/core/services/agent";
import { Headers, Rows } from "@/core/services/parser";

import { useChat } from "@/hooks/use-chat";
import { useSession } from "@/hooks/use-session";
import { useUpload } from "@/hooks/use-upload";

import { mapRowsToProducts } from "@/lib/utils/mapper";

export type ChatMessage = { role: "user" | "assistant"; content: string };

type State = {
  headers: Headers;
  mapping: Mapping;
  rows: Rows;
  products: Product[];
  messages: ChatMessage[];
};

function applyOperationsToState(operations: ChatOperation[], prevState: State): State {
  let nextProducts = prevState.products.map((p) => p.clone());
  let nextMapping = { ...prevState.mapping } as Mapping;

  for (const op of operations) {
    if (op.type === "updateField") {
      const idx = op.productIndex;
      if (nextProducts[idx]) {
        nextProducts[idx] = nextProducts[idx].updateField(op.field as ProductFieldName, op.value);
      }
    } else if (op.type === "remapField") {
      nextMapping = { ...nextMapping, [op.field]: op.columnId } as Mapping;
    }
  }

  // If any remapping happened, recompute products from rows + headers + mapping
  if (JSON.stringify(nextMapping) !== JSON.stringify(prevState.mapping)) {
    nextProducts = mapRowsToProducts(prevState.rows, prevState.headers, nextMapping);
  }

  return {
    ...prevState,
    products: nextProducts,
    mapping: nextMapping,
  };
}

const initialState: State = {
  headers: [],
  mapping: {} as Mapping,
  rows: [],
  products: [],
  messages: [],
};

export function useProductsData() {
  const [state, setState] = useState<State>(initialState);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist session
  useSession(state, setState);

  const uploadMutation = useUpload();
  const chatMutation = useChat();

  const handleFileChange = (file: File) => {
    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setState((prev) => ({
          ...prev,
          headers: data.headers,
          mapping: data.mapping,
          rows: data.rows,
          products: data.products.map((p) => new Product(p)),
        }));
      },
    });
  };

  const handleSendMessage = (message: string) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: "user" as const, content: message }],
    }));
    
    chatMutation.mutate(
      { message, products: state.products, mapping: state.mapping },
      {
        onSuccess: (data) => {
          setState((prev) => {
            const withAssistantMessage = {
              ...prev,
              messages: [
                ...prev.messages,
                { role: "assistant" as const, content: data.assistant_message },
              ],
            };
            return applyOperationsToState(data.operations, withAssistantMessage);
          });
        },
      },
    );
  };

  const handleReset = () => {
    setState(initialState);
    localStorage.removeItem("session");
  };

  const handleMappingChange = (field: string, value: string) => {
    setState((prev) => {
      const newMapping = { ...prev.mapping, [field]: value } as Mapping;
      const newProducts = mapRowsToProducts(prev.rows, prev.headers, newMapping);
      return {
        ...prev,
        mapping: newMapping,
        products: newProducts,
      };
    });
  };

  const uploadError = uploadMutation.error?.message || null;
  const chatError = chatMutation.error?.message || null;
  const isUploading = uploadMutation.isPending;
  const isChatting = chatMutation.isPending;

  return {
    // state
    headers: state.headers,
    mapping: state.mapping,
    rows: state.rows,
    products: state.products,
    messages: state.messages,
    // refs
    fileInputRef,
    // handlers
    handleFileChange,
    handleSendMessage,
    handleReset,
    handleMappingChange,
    // ui flags
    uploadError,
    chatError,
    isUploading,
    isChatting,
  } as const;
}
