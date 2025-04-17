
/**
 * Formats a BIA regulation reference to a search query
 */
export const getBIALink = (regulation: string) => {
  // Clean up the regulation text to make it consistent for searching
  const cleanRegulation = regulation
    .replace(/BIA\s+/i, '')
    .replace(/section/i, '')
    .replace(/subsection/i, '')
    .trim();

  const query = `Bankruptcy and Insolvency Act section ${cleanRegulation}`;
  return `https://laws-lois.justice.gc.ca/eng/acts/b-3/page-1.html#${cleanRegulation}`;
};

export const isValidBIAReference = (text: string): boolean => {
  return /BIA|Bankruptcy.*(Act|section|subsection)/i.test(text);
};
