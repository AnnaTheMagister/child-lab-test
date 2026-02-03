import React, { useState, useEffect, useMemo } from "react";

export const getSearchParams = () => {
  let searchParams = new URLSearchParams(window.location.search);
  return [...searchParams.entries()];
};

export const useCurrentSearch = () => {
  const [currentSearch, setCurrentSearch] = useState(getSearchParams());

  const currentTaxonomy = useMemo(
    () => (currentSearch?.[0]?.[0] === "methodology" ? "methodology" : null),
    [currentSearch],
  );

  const currentTag = useMemo(
    () => currentSearch?.[0]?.[1] ?? null,
    [currentSearch],
  );

  useEffect(() => {
    window.addEventListener("pushstate", () => {
      setCurrentSearch(getSearchParams);
    });
  }, []);

  return {
    currentTaxonomy,
    currentTag,
  };
};
