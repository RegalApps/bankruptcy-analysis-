
export interface PdfTextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
}

export interface PdfTextContent {
  items: PdfTextItem[];
  styles: Record<string, any>;
}

export interface PageError {
  pageNum: number;
  error: Error;
}

export interface TextExtractionResult {
  text: string;
  successfulPages: number;
  totalPages: number;
  errors: PageError[];
}
