function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Matches `keyword` as a whole word/phrase inside `text`, avoiding substring collisions (e.g. "gas" inside "gastei"). */
export function containsWholeWord(text: string, keyword: string): boolean {
  return new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i').test(text);
}
