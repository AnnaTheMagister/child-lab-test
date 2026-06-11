import React, { useState, useEffect, createContext, useContext, useMemo } from "react";
import { BASE_URL } from "../shared/consts";
import { useCurrentSearch } from "../shared/hooks";

interface Article {
    id: string
}

export const ArticlesContext = createContext({
    articles: [],
    articlesLoading: true,
    currentTaxonomy: 'methodology',
    filteredArticles: [],
    currentTag: -1,
});

export const ArticlesContextProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);
    const [articlesLoading, setArticlesLoading] = useState(true);

    const { currentTaxonomy, currentTag } = useCurrentSearch();

    useEffect(() => {
        fetch(BASE_URL + "/wp-json/wp/v2/articles?per_page=100&_embed")
            .then((response) => response.json())
            .then((data: Article[]) => {
                setArticles(data);
                setArticlesLoading(false);
            });
    }, []);

    const filteredArticles = useMemo(() => {
        if (!articles) return [];
        
        if (currentTaxonomy === "methodology") {
            if (parseInt(currentTag) > 0) {
                return articles.filter(
                    (art) =>
                        art["methodology-tags"]?.some(
                            (tag) => tag === parseInt(currentTag),
                        ),
                );
            } else {
                return articles;
            }
        }
        return articles;
    }, [articles, currentTaxonomy, currentTag]);

    const context = {
        articles,
        articlesLoading,
        currentTaxonomy,
        filteredArticles,
        currentTag
    };

    return (
        <ArticlesContext.Provider value={context}>
            {children}
        </ArticlesContext.Provider>
    );
};

export const useArticles = () => useContext(ArticlesContext);
