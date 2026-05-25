/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useCurrentSearch } from "./useCurrentSearch";

/**
 * Вспомогательная функция: меняет URL и уведомляет хук через dispatchEvent.
 * Имитирует поведение компонентов (FrontList, CoursesList), которые
 * делают pushState + dispatchEvent(new Event('pushstate')).
 */
function setUrl(search: string) {
  window.history.pushState({}, "", search);
  window.dispatchEvent(new Event("pushstate"));
}

beforeEach(() => {
  // Сбрасываем URL на пустой перед каждым тестом
  window.history.replaceState({}, "", "/");
});

describe("useCurrentSearch", () => {
  describe("currentTaxonomy", () => {
    it('returns null when no ?methodology= param', () => {
      const { result } = renderHook(() => useCurrentSearch());
      expect(result.current.currentTaxonomy).toBeNull();
    });

    it('returns "methodology" when ?methodology= is present', () => {
      setUrl("?methodology=42");
      const { result } = renderHook(() => useCurrentSearch());
      expect(result.current.currentTaxonomy).toBe("methodology");
    });
  });

  describe("currentTag", () => {
    it("returns null when no ?methodology= param", () => {
      const { result } = renderHook(() => useCurrentSearch());
      expect(result.current.currentTag).toBeNull();
    });

    it("returns the methodology tag id from URL", () => {
      setUrl("?methodology=42");
      const { result } = renderHook(() => useCurrentSearch());
      expect(result.current.currentTag).toBe("42");
    });

    it("updates when URL changes via pushstate", () => {
      const { result } = renderHook(() => useCurrentSearch());
      expect(result.current.currentTag).toBeNull();

      act(() => {
        setUrl("?methodology=7");
      });

      expect(result.current.currentTag).toBe("7");
    });
  });

  describe("getParam", () => {
    it("returns null for a missing param", () => {
      const { result } = renderHook(() => useCurrentSearch());
      expect(result.current.getParam("audience")).toBeNull();
    });

    it("returns the value of any named param", () => {
      setUrl("?audience=parents");
      const { result } = renderHook(() => useCurrentSearch());
      expect(result.current.getParam("audience")).toBe("parents");
    });

    it("returns null after param is removed from URL", () => {
      setUrl("?audience=parents");
      const { result } = renderHook(() => useCurrentSearch());

      expect(result.current.getParam("audience")).toBe("parents");

      act(() => {
        setUrl("/");
      });

      expect(result.current.getParam("audience")).toBeNull();
    });

    it("works with multiple params", () => {
      setUrl("?methodology=3&audience=teachers");
      const { result } = renderHook(() => useCurrentSearch());

      expect(result.current.getParam("methodology")).toBe("3");
      expect(result.current.getParam("audience")).toBe("teachers");
    });

    it("is a stable function reference across renders", () => {
      const { result, rerender } = renderHook(() => useCurrentSearch());

      const first = result.current.getParam;
      rerender();
      expect(result.current.getParam).toBe(first);
    });
  });

  describe("popstate event", () => {
    it("reacts to popstate (browser back/forward)", () => {
      setUrl("?audience=parents");
      const { result } = renderHook(() => useCurrentSearch());
      expect(result.current.getParam("audience")).toBe("parents");

      // Меняем URL и имитируем popstate (как при нажатии «Назад»)
      act(() => {
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new Event("popstate"));
      });

      expect(result.current.getParam("audience")).toBeNull();
    });
  });

  describe("backward compatibility", () => {
    it("returns both currentTaxonomy and getParam('methodology') consistently", () => {
      setUrl("?methodology=15");
      const { result } = renderHook(() => useCurrentSearch());

      expect(result.current.currentTaxonomy).toBe("methodology");
      expect(result.current.currentTag).toBe("15");
      expect(result.current.getParam("methodology")).toBe("15");
    });
  });
});
