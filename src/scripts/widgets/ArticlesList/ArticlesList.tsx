import React, { useState, useEffect, FC, useMemo } from "react";
import { BASE_URL, DEFAULT_IMAGE_URL } from "../../shared/consts";
import { useMethodologyTags } from "../../entities/MethodologyTags";
import Loader from "../Loader/Loader";
import { getScreenSize } from "../FrontListComponent/FrontListComponent";
import { useArticles } from "../../entities/Articles";

export const ArticlesListComponent = () => {
  const { articles, filteredArticles, currentTaxonomy, currentTag } = useArticles()

  const [screenSize, setScreenSize] = useState(
    getScreenSize(window.innerWidth),
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenSize(getScreenSize(window.innerWidth));
    });
  }, []);


  const title =
    currentTaxonomy === "methodology" && parseInt(currentTag) !== -1
      ? window.wp.i18n.__("Статьи по теме", "childlab")
      : window.wp.i18n.__("Все статьи", "childlab");

  let content = <></>;

  if (!articles.length) {
    content = <Loader fullScreen={false} />;
  } else if (!filteredArticles.length) {
    content = (
      <div className="empty-wrapper">
        <div className="empty-placeholder">
          {window.wp.i18n.__("Нет статей по этой теме", "childlab")}
        </div>
      </div>
    );
  } else if (
    filteredArticles.length < 3 ||
    screenSize == "sm" ||
    screenSize == "xs"
  ) {
    content = (
      <>
        {filteredArticles.map((art) => (
          <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
            <ArticleCardComponent key={art.id} {...art} size="default" />
          </div>
        ))}
      </>
    );
  } else {
    content = (
      <>
        <div className="col-lg-6 col-md-12">
          <ArticleCardComponent
            key={filteredArticles[0].id}
            {...filteredArticles[0]}
            size="large"
          />
        </div>
        <div class="col-lg-6 col-md-12">
          <div class="row">
            {filteredArticles.slice(1, 5).map((art) => (
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <ArticleCardComponent key={art.id} {...art} size="small" />
              </div>
            ))}
          </div>
        </div>
        {filteredArticles.slice(5).map((art) => (
          <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12">
            <ArticleCardComponent key={art.id} {...art} size="small" />
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="container">
      <div className="childlab-widget articles-list">
        <header className="articles-list__header">{title}</header>
        <div className="row">{content}</div>
      </div>
    </div>
  );
};

export const ArticleCardComponent: FC = (article) => {
  const size = article.size ?? "small";
  const imgSrc = article?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const imageUrl = imgSrc ? imgSrc : DEFAULT_IMAGE_URL;

  const excerptText = article.excerpt.rendered.replace(/<[^>]+>/g, "");
  return (
    <a className="article-card" href={article.link}>
      <div
        className={`article-img article-img__${size}`}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <ArticleTagsComponent {...article} />
      </div>
      <div className="article-details">
        <div className="article-meta childlab-text__meta">
          <ArticleMetaInfoComponent {...article} />
        </div>
        <div className="article-details__title truncate-multiline">
          {article.title.rendered}
        </div>
        <div className="article-details__subtitle truncate">
          {article.acf.subtitle}
        </div>
        <div className="article-details__excerpt truncate-multiline">
          {excerptText}
        </div>
      </div>
    </a>
  );
};

function formatDate(date) {
  if (typeof date == "number") {
    // перевести секунды в миллисекунды и преобразовать к Date
    date = new Date(date * 1000);
  } else if (typeof date == "string") {
    // строка в стандартном формате автоматически будет разобрана в дату
    date = new Date(date);
  } else if (Array.isArray(date)) {
    date = new Date(date[0], date[1], date[2]);
  }
  // преобразования для поддержки полиморфизма завершены,
  // теперь мы работаем с датой (форматируем её)

  return date.toLocaleString("ru", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  /*
  // можно и вручную, если лень добавлять в старый IE поддержку локализации
  var day = date.getDate();
  if (day < 10) day = '0' + day;

  var month = date.getMonth() + 1;
  if (month < 10) month = '0' + month;

  // взять 2 последние цифры года
  var year = date.getFullYear() % 100;
  if (year < 10) year = '0' + year;

  var formattedDate = day + '.' + month + '.' + year;

  return formattedDate;
  */
}

export const ArticleMetaInfoComponent = (article) => {
  const authors = article["article-authors"];
  const date = formatDate(article.date);
  return <div className="article-meta">{date}</div>;
};

export const ArticleTagsComponent = (article) => {
  const { methodologyTags } = useMethodologyTags();
  const articleTags = useMemo(
    () =>
      methodologyTags.filter((m) => article["methodology-tags"].includes(m.id)),
    [methodologyTags, article],
  );
  return (
    <div className="article-tags">
      {articleTags.map((m) => (
        <div
          key={m.id}
          className="article-tags__tag truncate"
          style={{ backgroundColor: m.acf.color ?? "rgba(100, 100, 100, 0.5)" }}
        >
          {m.name}
        </div>
      ))}
    </div>
  );
};
