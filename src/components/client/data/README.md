
# Client Data Templates

## Design

This directory holds all static and default client data (documents, info, tasks).
- Each data aspect is split into its own file (`clientDocumentTemplates.ts`, `clientInfoTemplates.ts`, `clientTaskTemplates.ts`).
- To add support for dynamic/async sources (API, DB, etc), add a new utility (e.g., `getDynamicClientDocuments`) and direct consumers to call it. The function signatures should remain as close as possible.
- Form 47 and 31 templates are handled explicitly in `clientDocumentTemplates.ts` for maintainability and easy future conversion to async.
