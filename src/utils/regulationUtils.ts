
/**
 * Formats a BIA regulation reference to a search query
 */
export const getBIALink = (regulation: string) => {
  if (!regulation) return "#";
  
  // Clean up the regulation text to make it consistent for searching
  const cleanRegulation = regulation
    .replace(/BIA\s+/i, '')
    .replace(/section/i, '')
    .replace(/subsection/i, '')
    .trim();

  // Use the official Canadian laws website for BIA references
  // Adding anchor to help users locate the specific section
  return `https://laws-lois.justice.gc.ca/eng/acts/b-3/page-1.html#${cleanRegulation}`;
};

export const isValidBIAReference = (text: string): boolean => {
  if (!text) return false;
  return /BIA|Bankruptcy.*(Act|section|subsection)/i.test(text);
};
