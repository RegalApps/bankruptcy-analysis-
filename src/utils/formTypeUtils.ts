// Utility functions related to form types

/**
 * Normalize a formType string into a canonical format that can be used for
 * comparisons across the code‑base.  It lowercases the string and removes all
 * non‑alphanumeric characters so that variations such as "Form‑47",
 * "form 47", "form‑47", etc. all map to the same key: "form47".
 */
export const normalizeFormType = (formType?: string): string => {
  return (formType || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};
