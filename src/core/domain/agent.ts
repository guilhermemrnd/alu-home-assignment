import OpenAI from 'openai';

import { Headers } from '@/core/services/parser';
import { chatResponseSchema } from '@/lib/zod-schemas/chat-response.schema';

import { Product, ProductFieldName, Mapping } from './product';

export type ChatOperation =
  | { type: "updateField"; productIndex: number; field: ProductFieldName; value: string }
  | { type: "remapField"; field: ProductFieldName; columnId: string };

export type ChatResponse = {
  assistant_message: string;
  operations: ChatOperation[];
}

export class Agent {
  constructor(private openai: OpenAI) {}

  async inferMapping(headers: Headers): Promise<Mapping> {
    const fields = ['purchase_order', 'product_name', 'country_of_origin', 'supplier', 'supplier_email', 'certifications', 'status_of_certifications', 'material_composition', 'season', 'group_id'] as const;

    const prompt = `
      You are an AI assistant helping to map CSV/XLSX headers to product fields.

      Available headers: ${JSON.stringify(headers)}

      Available fields: ${JSON.stringify(fields)}

      Map each field to the best matching header. If no good match, use an empty string.

      Respond ONLY with JSON: { "mapping": { "field": "header", ... } }
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: prompt }],
      temperature: 1,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) throw new Error('No response');

    const parsed = JSON.parse(responseText);
    return parsed.mapping as Mapping;
  }

  async chat(message: string, products: Product[], mapping: Mapping): Promise<ChatResponse> {
    const prompt = `
      You are an AI assistant helping to manage product data.

      Current products: ${JSON.stringify(products.map(p => p.toObject()))}

      Current mapping: ${JSON.stringify(mapping)}

      User message: ${message}

      You must respond ONLY with JSON in this format:

      {
        "assistant_message": "Your response to the user",
        "operations": [
          { "type": "updateField", "productIndex": 0, "field": "product_name", "value": "New Name" }
          or
          { "type": "remapField", "field": "product_name", "columnId": "Product Name" }
        ]
      }

      Rules:
      - You cannot invent fields. Only use existing fields: purchase_order, product_name, country_of_origin, supplier, supplier_email, certifications, status_of_certifications, material_composition, season, group_id
      - You cannot modify data directly. Only propose operations.
      - If remapping, use existing columnIds from mapping values.
      - Respond ONLY with JSON, no prose.
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: prompt }],
      temperature: 1,
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) throw new Error('No response');

    const parsed = JSON.parse(responseText);
    const validated = chatResponseSchema.parse(parsed);

    return validated;
  }
}
