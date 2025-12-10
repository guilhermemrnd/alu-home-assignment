import { z } from "zod";

import { ProductFieldName } from "@/core/domain/product";

const productFields: ProductFieldName[] = [
  'purchase_order', 'product_name', 'country_of_origin', 'supplier', 'supplier_email',
  'certifications', 'status_of_certifications', 'material_composition', 'season', 'group_id'
]; // prettier-ignore

const chatOperationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("updateField"),
    productIndex: z.number(),
    field: z.enum(productFields),
    value: z.string(),
  }),
  z.object({
    type: z.literal("remapField"),
    field: z.enum(productFields),
    columnId: z.string(),
  }),
]);

export const chatResponseSchema = z.object({
  assistant_message: z.string(),
  operations: z.array(chatOperationSchema),
});
