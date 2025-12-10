import { useRef, useState } from "react";

import { Headers, Rows } from "@/core/services/parser";
import { Mapping, Product, ProductFieldName } from "@/core/domain/product";
import { ChatOperation } from "@/core/services/agent";
import { useSession } from "@/hooks/use-session";
import { useUpload } from "@/hooks/use-upload";
import { useChat } from "@/hooks/use-chat";
import { mapRowsToProducts } from "@/lib/utils/mapper";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function applyOperations(
  operations: ChatOperation[],
  products: Product[],
  mapping: Mapping,
  rows: Rows,
  headers: Headers,
): { products: Product[]; mapping: Mapping } {
  let nextProducts = products.map((p) => p.clone());
  let nextMapping = { ...mapping } as Mapping;

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
  if (JSON.stringify(nextMapping) !== JSON.stringify(mapping)) {
    nextProducts = mapRowsToProducts(rows, headers, nextMapping);
  }

  return { products: nextProducts, mapping: nextMapping };
}

export function useProductsData() {
  const [headers, setHeaders] = useState<Headers>([]);
  const [mapping, setMapping] = useState<Mapping>({} as Mapping);
  const [rows, setRows] = useState<Rows>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist session
  useSession(headers, setHeaders, mapping, setMapping, rows, setRows, products, setProducts);

  const uploadMutation = useUpload();
  const chatMutation = useChat();

  const handleFileChange = (file: File) => {
    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setHeaders(data.headers);
        setMapping(data.mapping);
        setRows(data.rows);
        setProducts(data.products.map((p) => new Product(p)));
      },
    });
  };

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    chatMutation.mutate(
      { message, products, mapping },
      {
        onSuccess: (data) => {
          setMessages((prev) => [...prev, { role: "assistant", content: data.assistant_message }]);
          const result = applyOperations(
            data.operations,
            products,
            mapping,
            rows,
            headers,
          );
          setMapping(result.mapping);
          setProducts(result.products);
        },
      },
    );
  };

  const handleReset = () => {
    setHeaders([]);
    setMapping({} as Mapping);
    setRows([]);
    setProducts([]);
    setMessages([]);
    localStorage.removeItem("session");
  };

  const handleMappingChange = (field: string, value: string) => {
    const newMapping = { ...mapping, [field]: value } as Mapping;
    setMapping(newMapping);
    const newProducts = mapRowsToProducts(rows, headers, newMapping);
    setProducts(newProducts);
  };

  const uploadError = uploadMutation.error?.message || null;
  const chatError = chatMutation.error?.message || null;
  const isUploading = uploadMutation.isPending;
  const isChatting = chatMutation.isPending;

  return {
    // state
    headers,
    mapping,
    rows,
    products,
    messages,
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
