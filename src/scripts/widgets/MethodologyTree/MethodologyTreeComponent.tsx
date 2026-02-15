import { useState, useEffect, useMemo } from "react";
import { initialConnections, initialTags } from "./graphConfig";
import { useCurrentSearch } from "../../shared/useCurrentSearch";
import { TagsGraph } from "./TagsGraph";
import { useMethodologyTags } from "../../entities/MethodologyTags";
import { useArticles } from "../../entities/Articles";
import { getScreenSize } from "../FrontListComponent/FrontListComponent";
import { ArticleCardComponent } from "../ArticlesList/ArticlesList";

const TREE_IMAGE = themeData.templateUrl + "/assets/images/tree.png";

const NO_TAG_PLACEHOLDER = <div className="empty-placeholder">{window.wp.i18n.__('Выберите элемент на дереве, чтобы прочитать о нём подробнее', 'childlab')}</div>;
export const MethodologyTreeComponent = () => {
    const { articles, articlesLoading, filteredArticles, currentTag, currentTaxonomy } = useArticles()

    const [screenSize, setScreenSize] = useState(
        getScreenSize(window.innerWidth),
    );

    useEffect(() => {
        window.addEventListener("resize", () => {
            setScreenSize(getScreenSize(window.innerWidth));
        });
    }, []);

    return <div className="container">
        <div className="childlab-widget methodology">
            <div className="row">
                {(!currentTag || screenSize === 'lg' || screenSize === 'xlg') && <div
                    className="col-12 order-md-2 order-lg-1 order-xlg-1 order-sm-2 order-xs-2">
                    <div className="methodology__header">
                        <h1>{window.wp.i18n.__("Методология", "childlab")}</h1>
                        {!currentTag && (screenSize === 'sm' || screenSize === 'xs' || screenSize === 'md') && NO_TAG_PLACEHOLDER}
                    </div>
                </div>}

                <MethodologyTree />
                <ArticlesList />
            </div>
        </div>
    </div>
}



export const ArticlesList = () => {
    const { articles, articlesLoading, currentTag, currentTaxonomy } = useArticles()
    const { methodologyTags } = useMethodologyTags()

    const [screenSize, setScreenSize] = useState(
        getScreenSize(window.innerWidth),
    );

    useEffect(() => {
        window.addEventListener("resize", () => {
            setScreenSize(getScreenSize(window.innerWidth));
        });
    }, []);

    const filteredArticles = useMemo(() => {
        if (!articles || !methodologyTags) return [];
        console.log('!!', currentTag, methodologyTags.map(it => it.slug))
        const currentId = methodologyTags.find(it => it.slug?.toLowerCase() === currentTag?.toLowerCase())?.id

        console.log(currentId, articles)
        if (currentId) {
            const y = articles.filter(
                (art) =>
                    art["methodology-tags"]?.some(
                        (tag) => { console.log('!t', tag, currentTag, tag === currentTag); return tag === currentId },
                    ),
            );

            console.log('!y', y)
            return y;
        }
        return [];
    }, [articles, currentTaxonomy, currentTag, methodologyTags]);

    console.log('!!', filteredArticles);
    let content = <></>

    if (!currentTag && (screenSize === 'sm' || screenSize === 'xs' || screenSize === 'md')) {
        return;
    }

    if (!currentTag && (screenSize === 'lg' || screenSize === 'xlg')) {
        content = <div class="childlab-widget methodology__description">{NO_TAG_PLACEHOLDER}</div>
    } else if (!filteredArticles.length && !(!currentTag && (screenSize === 'lg' || screenSize === 'xlg'))) {
        content = <div class="childlab-widget methodology__description"><div className="empty-placeholder">{window.wp.i18n.__('Статья скоро появится', 'childlab')}</div></div>
    } else {
        content = <div className="container">
            <div className="childlab-widget articles-list">
                <header className="articles-list__header">{window.wp.i18n.__("Статьи по теме", "childlab")}</header>
                <div className="row">
                    {
                        filteredArticles.map((art) => (
                            <div className="col-12">
                                <ArticleCardComponent key={art.id} {...art} size="default" />
                            </div>
                        ))
                    }</div>
            </div>
        </div>




    }
    return <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 order-xs-3 order-sm-3 order-md-3 order-lg-3">{content}</div>
}

export const MethodologyTree = () => {
    const { currentTaxonomy, currentTag } = useCurrentSearch();
    const [graphRef, setGraphRef] = useState();

    useEffect(() => {
        if (graphRef?.clientWidth) {
            // setTimeout(() => {
                console.log('!!!gra', graphRef.clientWidth)
                const graph = new TagsGraph({
                    container: graphRef,
                    activeTagSlug: currentTag ?? "Agency",
                    tags: JSON.parse(JSON.stringify(initialTags)),
                    connections: JSON.parse(JSON.stringify(initialConnections)),
                    curveIntensity: 0.7,
                    lineWidth: 2,
                    textOrientation: "horizontal",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    interactive: true,
                    onTagClick: (tag) => {
                        history.pushState({}, "", `?methodology=${tag.id}`);
                        window.dispatchEvent(new Event("pushstate"));
                        selectedTagId = tag.id;
                        console.log("Выбран тег:", tag.name);
                    },
                    onTagDrag: (tag, x, y) => {
                        console.log(`Перемещение ${tag.name}`);
                    },
                    onTagDirectionChange: (tag) => {
                        console.log(`Направление ${tag.name} изменено на: ${tag.direction}`);
                    },
                    onTagTextOrientationChange: (tag) => {
                        console.log(
                            `Ориентация текста ${tag.name} изменена на: ${tag.textOrientation}`,
                        );
                    },
                });
            // }, 50)

            // graph.resizeCanvas();
            // graph.calculateLayout();
            // graph.render();
        }
    }, [graphRef?.clientWidth])

    return <div className="col-lg-7 col-md-12 col-sm-12 col-xs-12 order-xs-1 order-sm-1 order-md-1 order-lg-2">
        <div className="methodology__tree-wrapper">
            <div className="methodology__tree">
                <img className="methodology__tree-image"
                    src={TREE_IMAGE} alt="tree" />
                <div ref={(r) => { setGraphRef(r); }} className="methodology__graph-container"></div>
            </div>
        </div>
    </div>
}