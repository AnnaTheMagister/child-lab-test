export interface Term {
  name: string;
  slug: string;
}

export function getTermNameBySlug(
  slug: string | undefined | null,
  terms: Term[],
): string | null {
  if (!slug || !terms?.length) return null;
  return terms.find((t) => t.slug === slug)?.name ?? null;
}
