import { Product, ProductFieldName, Mapping } from "@/core/domain/product";
import { Headers, Rows } from "@/core/services/parser";

export function mapRowsToProducts(rows: Rows, headers: Headers, mapping: Mapping): Product[] {
  return rows.map((row) => {
    const product = new Product();

    for (const [field, columnId] of Object.entries(mapping)) {
      const index = headers.indexOf(columnId);
      if (index !== -1 && row[index]) {
        product[field as ProductFieldName] = row[index];
      }
    }

    return product;
  });
}