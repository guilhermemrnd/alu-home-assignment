# ALU Home Assignment

A Next.js application for managing product data from spreadsheets with AI-assisted mapping and chat-based editing.

## Tech Choices

- **Next.js (App Router, TypeScript)**: For server-side rendering and API routes.
- **shadcn/ui**: For consistent, accessible UI components.
- **Tailwind CSS**: For styling, required by shadcn.
- **zod**: For schema validation, especially for LLM responses.
- **xlsx (SheetJS)**: For parsing .xlsx files.
- **papaparse**: For parsing .csv files.
- **localStorage**: For persisting session data.

## Rules-Based AI Constraint

The AI integration is designed to be rules-based, meaning the LLM never directly mutates data. Instead, it only proposes operations (like updating a field or remapping a column) in a strict JSON format. This ensures:

- Deterministic updates: Operations are applied by the domain layer.
- Safety: AI cannot invent fields or modify data arbitrarily.
- Reliability: If the AI output deviates from the schema, it's rejected with a fallback response.

The prompt enforces: "You must respond ONLY with JSON, no prose. You cannot invent fields. You cannot modify data directly. You only propose operations."

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables: Copy `.env.local` and add your OpenAI API key.
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Known Limitations

- No authentication or multi-user support.
- localStorage is used for persistence, so data is lost on browser clear.
