
// Basic configuration without worker settings (worker is configured in pdfUtils.ts)
export const PDF_CONFIG = {
  // Use consistent URL construction for all paths
  cMapUrl: new URL(
    'pdfjs-dist/cmaps/',
    import.meta.url
  ).toString(),
  cMapPacked: true,
  standardFontDataUrl: new URL(
    'pdfjs-dist/standard_fonts/',
    import.meta.url
  ).toString(),
  // Core PDF.js configuration
  enableWorker: true,
  useWorker: true,
  disableFontFace: false,
  isEvalSupported: true,
  useSystemFonts: false,
};
