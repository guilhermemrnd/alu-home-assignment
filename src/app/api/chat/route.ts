import OpenAI from 'openai';

import { Agent } from '@/core/services/agent';
import { Product } from '@/core/domain/product';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const agent = new Agent(openai);

export async function POST(request: Request) {
  try {
    const { message, products: productDto, mapping } = await request.json();

    const products = productDto.map((p: any) => new Product(p));
    const response = await agent.chat(message, products, mapping);

    return Response.json(response);
  } catch (error) {
    console.error(error);
    // Fallback
    return Response.json({
      assistant_message: "I'm sorry, I couldn't process that request. Please try again.",
      operations: [],
    });
  }
}
