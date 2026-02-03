import "./styles/main.scss";
import "./styles/grid-system.scss";
import "./styles/header.scss";

import "./scripts/ArticleReader";
import "./scripts/shared/switcher";
import { ArticlesListComponent, FrontListComponent } from "./scripts/widgets";
import React from "react";
import ReactDOM from "react-dom/client";
import { MethodologyTagsContextProvider } from "./scripts/entities/MethodologyTags";

const methodologyTagsMenu = ReactDOM.createRoot(
  document.querySelector("#methodology-tags-menu"),
);
methodologyTagsMenu.render(
  <MethodologyTagsContextProvider>
    <FrontListComponent />
  </MethodologyTagsContextProvider>,
);

const articlesList = ReactDOM.createRoot(
  document.querySelector("#articles-list-component"),
);

articlesList.render(
  <MethodologyTagsContextProvider>
    <ArticlesListComponent />
  </MethodologyTagsContextProvider>,
);
