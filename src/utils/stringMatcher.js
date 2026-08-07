/**
 * Utility function to normalize section names for robust matching.
 * Strips citations [cite: X], parenthetical suffixes (e.g. (NH), (NW)),
 * and non-alphanumeric characters, ensuring that formatting/content edits
 * do not break routing, visualizers, or learning activities.
 */
export function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\[cite:\s*\d+\]/g, '') // remove citation footnotes
    .replace(/\([^)]*\)/g, '')      // remove anything inside parentheses
    .replace(/[^a-z0-9]/g, '')      // strip all non-alphanumeric characters
    .trim();
}

/**
 * Checks if two section names match after normalization.
 */
export function isNameMatch(nameA, nameB) {
  if (!nameA || !nameB) return false;
  const normA = normalizeName(nameA);
  const normB = normalizeName(nameB);
  return normA === normB || normA.includes(normB) || normB.includes(normA);
}
