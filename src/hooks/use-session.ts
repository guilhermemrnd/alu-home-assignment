import { useEffect } from "react";

import { Headers, Rows } from "@/core/services/parser";
import { Product, Mapping } from "@/core/domain/product";

interface SessionData {
  headers: Headers;
  mapping: Mapping;
  rows: Rows;
  products: Product[];
}

export function useSession(
  headers: Headers,
  setHeaders: (h: Headers) => void,
  mapping: Mapping,
  setMapping: (m: Mapping) => void,
  rows: Rows,
  setRows: (r: Rows) => void,
  products: Product[],
  setProducts: (p: Product[]) => void
) {
  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) {
      const data: SessionData = JSON.parse(saved);
      setHeaders(data.headers || []);
      setMapping(data.mapping || {});
      setRows(data.rows || []);
      setProducts((data.products || []).map((p: any) => new Product(p)));
    }
  }, [setHeaders, setMapping, setRows, setProducts]);

  useEffect(() => {
    localStorage.setItem(
      "session",
      JSON.stringify({
        headers,
        mapping,
        rows,
        products: products.map(p => p.toObject())
      }),
    );
  }, [headers, mapping, rows, products]);
}