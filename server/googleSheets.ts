import axios from 'axios';

// Configuration for the 4 Google Sheets
export const SHEETS_CONFIG = [
  {
    id: '1RuaeeCO2jWz-IHnoYqX6rS5dj2JKRRorOObOWWua7_A',
    name: 'Graduate & Postgraduate Students',
    category: 'student' as const,
  },
  {
    id: '1JP6dyZn7nmzR32h1zHGNjlzL4dsYIGBr_KgLk_rNY4Y',
    name: 'Faculty Members (Internal)',
    category: 'faculty' as const,
  },
  {
    id: '1w42s7UiVgViluPGhEp0AWCaV9xbDSDBIOMj7oZIPtGw',
    name: 'External Researchers',
    category: 'external' as const,
  },
  {
    id: '1h9VB23Ib_0WxCd_vsl9uY1oTXWIN2-7Kt4_a-EEpqC8',
    name: 'Industry Partners',
    category: 'industry' as const,
  },
];

export type SheetCategory = 'student' | 'faculty' | 'external' | 'industry';

export interface SheetRow {
  timestamp: string;
  fullNameEnglish: string;
  fullNameArabic: string;
  email: string;
  phone: string;
  affiliation: string;
  participationType?: string;
  researchTitle?: string;
  researchAbstract?: string;
  [key: string]: any; // For additional fields
}

/**
 * Fetch data from a Google Sheet using CSV export
 */
export async function fetchSheetData(sheetId: string): Promise<SheetRow[]> {
  try {
    // Google Sheets CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    const response = await axios.get(csvUrl, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const csvData = response.data;
    
    // Parse CSV
    const rows = parseCSV(csvData);
    
    if (rows.length === 0) {
      return [];
    }

    // First row is headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Convert rows to objects
    const data: SheetRow[] = dataRows.map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[normalizeHeader(header)] = row[index] || '';
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.error(`Error fetching sheet ${sheetId}:`, error);
    throw new Error(`Failed to fetch sheet data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Simple CSV parser
 */
function parseCSV(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        if (currentRow.some(f => f.trim())) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      }
      // Skip \r\n
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
    } else {
      currentField += char;
    }
  }

  // Add last field and row if any
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim())) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Normalize header names to camelCase field names
 */
function normalizeHeader(header: string): string {
  // Common mappings
  const mappings: Record<string, string> = {
    'timestamp': 'timestamp',
    'full name (english)': 'fullNameEnglish',
    'full name (arabic)': 'fullNameArabic',
    'الاسم بالعربي': 'fullNameArabic',
    'الاسم بالإنجليزي': 'fullNameEnglish',
    'email': 'email',
    'email address': 'email',
    'البريد الإلكتروني': 'email',
    'phone': 'phone',
    'phone number': 'phone',
    'mobile': 'phone',
    'رقم الهاتف': 'phone',
    'affiliation': 'affiliation',
    'institution': 'affiliation',
    'university': 'affiliation',
    'الجامعة': 'affiliation',
    'المؤسسة': 'affiliation',
    'participation type': 'participationType',
    'نوع المشاركة': 'participationType',
    'research title': 'researchTitle',
    'عنوان البحث': 'researchTitle',
    'abstract': 'researchAbstract',
    'research abstract': 'researchAbstract',
    'الملخص': 'researchAbstract',
  };

  const normalized = header.toLowerCase().trim();
  return mappings[normalized] || toCamelCase(header);
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

/**
 * Sync all Google Sheets and return registration data
 */
export async function syncAllSheets(): Promise<{
  category: SheetCategory;
  sheetName: string;
  data: SheetRow[];
  rowCount: number;
}[]> {
  const results = [];

  for (const config of SHEETS_CONFIG) {
    try {
      const data = await fetchSheetData(config.id);
      results.push({
        category: config.category,
        sheetName: config.name,
        data,
        rowCount: data.length,
      });
    } catch (error) {
      console.error(`Failed to sync sheet ${config.name}:`, error);
      results.push({
        category: config.category,
        sheetName: config.name,
        data: [],
        rowCount: 0,
      });
    }
  }

  return results;
}
