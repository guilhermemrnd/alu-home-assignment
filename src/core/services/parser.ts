import * as XLSX from "xlsx";
import Papa from "papaparse";

export type Headers = string[];
export type Rows = string[][];

interface FileParser {
  canParse(file: File): boolean;
  parse(file: File): Promise<{ headers: Headers; rows: Rows }>;
}

class XLSXParser implements FileParser {
  canParse(file: File): boolean {
    return file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
  }

  async parse(file: File): Promise<{ headers: Headers; rows: Rows }> {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    return this.processRows(rawRows);
  }

  private processRows(rawRows: any[][]): { headers: Headers; rows: Rows } {
    const headers = rawRows[0].map(String);
    const rows = rawRows.slice(1).map((row) => row.map(String));
    return { headers, rows };
  }
}

class CSVParser implements FileParser {
  canParse(file: File): boolean {
    return file.name.endsWith(".csv");
  }

  async parse(file: File): Promise<{ headers: Headers; rows: Rows }> {
    const text = await file.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        complete: (results) => {
          const rawRows = results.data as string[][];
          const headers = rawRows[0].map(String);
          const rows = rawRows.slice(1).map((row) => row.map(String));
          resolve({ headers, rows });
        },
        error: reject,
        header: false,
      });
    });
  }
}

export class Parser {
  private parsers: FileParser[] = [new XLSXParser(), new CSVParser()];

  async parse(file: File): Promise<{ headers: Headers; rows: Rows }> {
    const parser = this.parsers.find((p) => p.canParse(file));
    if (!parser) {
      throw new Error("Unsupported file type. Only .xlsx, .xls, and .csv are supported.");
    }
    return parser.parse(file);
  }
}
