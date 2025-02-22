
// Basic configuration without worker settings (worker is configured in pdfUtils.ts)
export const PDF_CONFIG = {
  cMapUrl: new URL(
    'pdfjs-dist/cmaps/',
    import.meta.url
  ).toString(),
  cMapPacked: true,
  standardFontDataUrl: new URL(
    'pdfjs-dist/standard_fonts/',
    import.meta.url
  ).toString(),
  enableWorker: true,
  useWorker: true,
  disableFontFace: false,
  isEvalSupported: true,
  useSystemFonts: false,
};
