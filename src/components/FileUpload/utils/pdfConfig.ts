
// Basic configuration without worker settings (worker is configured in pdfUtils.ts)
export const PDF_CONFIG = {
  cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/standard_fonts/',
  enableWorker: true,
  useWorker: true,
  disableFontFace: false,
  isEvalSupported: true,
  useSystemFonts: false,
};
