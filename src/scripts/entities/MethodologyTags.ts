// types/methodology-tag.types.ts

export interface MethodologyTagTargetHint {
  allow: string[];
}

export interface MethodologyTagLinkItem {
  href: string;
  targetHints?: MethodologyTagTargetHint;
}

export interface MethodologyTagLinks {
  self: MethodologyTagLinkItem[];
  collection: MethodologyTagLinkItem[];
  about: MethodologyTagLinkItem[];
  "wp:post_type": MethodologyTagLinkItem[];
  curies: Array<{
    name: string;
    href: string;
    templated: boolean;
  }>;
}

export interface MethodologyTagACF {
  color: string;
  svg_pattern: string;
  order: string;
}

export interface MethodologyTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[]; // Можно уточнить тип, если известна структура meta
  acf: MethodologyTagACF;
  _links: MethodologyTagLinks;
}

// Тип для массива тегов
export type MethodologyTags = MethodologyTag[];

// Тип для ответа API (если используется WordPress REST API)
export interface MethodologyTagsResponse {
  data: MethodologyTag[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

// Тип для фильтрации тегов
export interface MethodologyTagFilters {
  search?: string;
  taxonomy?: string;
  page?: number;
  per_page?: number;
  orderby?: "name" | "count" | "id" | "include" | "slug";
  order?: "asc" | "desc";
}

// Тип для создания/обновления тега
export interface CreateMethodologyTagData {
  name: string;
  description?: string;
  slug?: string;
  acf?: Partial<MethodologyTagACF>;
}

export interface UpdateMethodologyTagData
  extends Partial<CreateMethodologyTagData> {
  id: number;
}

// Тип для группировки тегов (например, по цветам или порядку)
export interface GroupedMethodologyTags {
  [key: string]: MethodologyTag[];
}

// Тип для сортировки тегов
export type SortMethodologyTagsBy = "name" | "count" | "order" | "id";

// Хелперы для работы с тегами
export const getSortedTags = (
  tags: MethodologyTag[],
  sortBy: SortMethodologyTagsBy = "order",
): MethodologyTag[] => {
  return [...tags].sort((a, b) => {
    switch (sortBy) {
      case "order":
        return parseInt(a.acf.order) - parseInt(b.acf.order);
      case "name":
        return a.name.localeCompare(b.name);
      case "count":
        return b.count - a.count;
      case "id":
        return a.id - b.id;
      default:
        return 0;
    }
  });
};

export const getTagsByColor = (
  tags: MethodologyTag[],
): GroupedMethodologyTags => {
  return tags.reduce((acc, tag) => {
    const color = tag.acf.color;
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push(tag);
    return acc;
  }, {} as GroupedMethodologyTags);
};

export const filterTagsBySearch = (
  tags: MethodologyTag[],
  searchTerm: string,
): MethodologyTag[] => {
  if (!searchTerm.trim()) return tags;

  const term = searchTerm.toLowerCase();
  return tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(term) ||
      tag.description.toLowerCase().includes(term) ||
      tag.slug.toLowerCase().includes(term),
  );
};

// Тип для пропсов компонента тега
export interface MethodologyTagProps {
  tag: MethodologyTag;
  onClick?: (tag: MethodologyTag) => void;
  className?: string;
  showCount?: boolean;
  showDescription?: boolean;
  showPattern?: boolean;
}

// Тип для пропсов компонента списка тегов
export interface MethodologyTagsListProps {
  tags: MethodologyTag[];
  loading?: boolean;
  error?: string | null;
  onTagClick?: (tag: MethodologyTag) => void;
  emptyMessage?: string;
  className?: string;
  sortBy?: SortMethodologyTagsBy;
  searchable?: boolean;
}

// Тип для состояния тегов в Redux/Context/Zustand
export interface MethodologyTagsState {
  items: MethodologyTag[];
  loading: boolean;
  error: string | null;
  filters: MethodologyTagFilters;
  selectedTags: number[]; // Массив ID выбранных тегов
}

// Тип для хука useMethodologyTags
export interface UseMethodologyTagsReturn {
  tags: MethodologyTag[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  selectedTags: MethodologyTag[];
  toggleTag: (tagId: number) => void;
  clearSelection: () => void;
}

// Тип для API запросов
export interface MethodologyTagApi {
  fetchTags: (filters?: MethodologyTagFilters) => Promise<MethodologyTag[]>;
  fetchTagById: (id: number) => Promise<MethodologyTag>;
  createTag: (data: CreateMethodologyTagData) => Promise<MethodologyTag>;
  updateTag: (data: UpdateMethodologyTagData) => Promise<MethodologyTag>;
  deleteTag: (id: number) => Promise<void>;
}

// Тип для компонента предварительного просмотра тега
export interface MethodologyTagPreviewProps {
  tag: MethodologyTag;
  variant?: "default" | "compact" | "detailed";
  onClose?: () => void;
}

// Тип для статистики тегов
export interface MethodologyTagsStats {
  totalTags: number;
  totalArticles: number; // Общее количество статей по всем тегам
  averageArticlesPerTag: number;
  mostPopularTag?: MethodologyTag;
  leastPopularTag?: MethodologyTag;
  tagsByTaxonomy: Record<string, number>;
}
