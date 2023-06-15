/**
 * Generates slug based on passed text.
 * @param text
 * @returns {string} - Generated slug.
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
