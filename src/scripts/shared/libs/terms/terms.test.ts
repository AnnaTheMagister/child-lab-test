import { getTermNameBySlug } from './terms';

const mockTerms = [
  { name: 'Вебинар', slug: 'online' },
  { name: 'Офлайн', slug: 'offline' },
  { name: 'Запись', slug: 'recorded' },
];

describe('getTermNameBySlug', () => {
  it('returns name for a matching slug', () => {
    expect(getTermNameBySlug('online', mockTerms)).toBe('Вебинар');
    expect(getTermNameBySlug('offline', mockTerms)).toBe('Офлайн');
    expect(getTermNameBySlug('recorded', mockTerms)).toBe('Запись');
  });

  it('returns null for a non-matching slug', () => {
    expect(getTermNameBySlug('nonexistent', mockTerms)).toBeNull();
  });

  it('returns null for empty slug', () => {
    expect(getTermNameBySlug('', mockTerms)).toBeNull();
  });

  it('returns null for null slug', () => {
    expect(getTermNameBySlug(null, mockTerms)).toBeNull();
  });

  it('returns null for undefined slug', () => {
    expect(getTermNameBySlug(undefined, mockTerms)).toBeNull();
  });

  it('returns null for empty terms array', () => {
    expect(getTermNameBySlug('online', [])).toBeNull();
  });

  it('returns null for null terms', () => {
    expect(getTermNameBySlug('online', null as any)).toBeNull();
  });
});
