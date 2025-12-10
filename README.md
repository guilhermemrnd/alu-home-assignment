# ALU Home Assignment

A Next.js app for AI-assisted product data management from spreadsheets.

## Features

- File upload (CSV/XLSX)
- AI mapping of columns to fields
- Data preview and editing
- Chat-based AI interactions for updates
- Session persistence via localStorage

## Summary of Your Solution

Upload files, map columns with AI, preview data, and chat to edit via proposed operations. AI is rules-based: proposes JSON operations only, no direct mutations. Ensures safety and determinism.

## Tech Choices

- Next.js (App Router, TypeScript) for SSR and APIs
- shadcn/ui + Tailwind CSS for UI
- zod for validation
- xlsx/papaparse for parsing
- OpenAI for AI features
- localStorage for persistence

## Setup

### Prerequisites
- Node.js 22.11+
- npm/yarn
- OpenAI API key

### Installation
1. Clone repo
2. `npm install`
3. Copy `.env.local`, add OPENAI_API_KEY
4. `npm run dev`
5. Visit http://localhost:3000

## Testing

Run `npm run test` (Playwright E2E tests).

## Known Limitations

- No auth/multi-user
- Data lost on browser clear

## Next Steps

- Add auth and database
- Enhance AI features
