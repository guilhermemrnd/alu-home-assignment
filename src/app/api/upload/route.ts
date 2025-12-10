import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import { Agent } from "@/core/domain/agent";
import { Parser } from "@/core/services/parser";

import { mapRowsToProducts } from "@/lib/utils/mapper";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const agent = new Agent(openai);
const parser = new Parser();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const { headers, rows } = await parser.parse(file);
    const mapping = await agent.inferMapping(headers);
    const products = mapRowsToProducts(rows, headers, mapping);

    return NextResponse.json({ headers, mapping, rows, products });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
