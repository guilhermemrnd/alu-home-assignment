import { useEffect } from "react";

import { Mapping, Product } from "@/core/domain/product";
import { Headers, Rows } from "@/core/services/parser";
import { ChatMessage } from "@/hooks/use-products-data";

type State = {
  headers: Headers;
  mapping: Mapping;
  rows: Rows;
  products: Product[];
  messages: ChatMessage[];
};

export function useSession(state: State, setState: (updater: (prev: State) => State) => void) {
  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) {
      const data: State = JSON.parse(saved);
      setState(() => ({
        ...data,
        products: (data.products || []).map((p: any) => new Product(p)),
      }));
    }
  }, [setState]);

  useEffect(() => {
    localStorage.setItem(
      "session",
      JSON.stringify({
        ...state,
        products: state.products.map((p) => p.toObject()),
      }),
    );
  }, [state]);
}
