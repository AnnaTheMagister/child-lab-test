import { useState, useEffect, useMemo, useCallback } from "react";

/**
 * Хук для чтения параметров URL (search string).
 *
 * Используется вместо прямого `URLSearchParams`, чтобы компонент
 * перерендеривался при изменении URL (popstate / pushstate).
 *
 * @example
 * const { currentTaxonomy, currentTag, getParam } = useCurrentSearch();
 * const audience = getParam('audience'); // 'parents' | null
 *
 * // Backward-compatible для ?methodology=<id>
 * // currentTaxonomy → 'methodology' | null
 * // currentTag      → '<id>' | null
 */
export const useCurrentSearch = () => {
  const [searchParams, setSearchParams] = useState(
    () => new URLSearchParams(window.location.search),
  );

  useEffect(() => {
    // Обновляем состояние при навигации (браузерные кнопки Назад/Вперёд)
    // или при программном pushState (с последующим dispatch pushstate).
    const handleChange = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handleChange);
    window.addEventListener("pushstate", handleChange);

    return () => {
      window.removeEventListener("popstate", handleChange);
      window.removeEventListener("pushstate", handleChange);
    };
  }, []);

  // Для обратной совместимости: ?methodology=<id>
  const currentTaxonomy = useMemo(
    () => (searchParams.get("methodology") ? "methodology" : null),
    [searchParams],
  );

  const currentTag = useMemo(
    () => searchParams.get("methodology") ?? null,
    [searchParams],
  );

  // Утилита для чтения любого именованного параметра
  const getParam = useCallback(
    (name: string): string | null => searchParams.get(name),
    [searchParams],
  );

  return {
    currentTaxonomy,
    currentTag,
    getParam,
  };
};
