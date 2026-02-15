import "./styles/main.scss";
import "./styles/grid-system.scss";
import "./styles/header.scss";

import "./scripts/ArticleReader";
import "./scripts/shared/switcher";
import { ArticlesListComponent, FrontListComponent, MethodologyTreeComponent } from "./scripts/widgets";
import React from "react";
import ReactDOM from "react-dom/client";
import { MethodologyTagsContextProvider } from "./scripts/entities/MethodologyTags";
import { ArticlesContextProvider } from "./scripts/entities/Articles";

const renderComponent = (selector, render) => {
  try {
    const container = ReactDOM.createRoot(
      document.querySelector(selector),
    );

    container.render(
      <MethodologyTagsContextProvider>
        <ArticlesContextProvider>
          {render}
        </ArticlesContextProvider>
      </MethodologyTagsContextProvider>
    );
  } catch (e) {
    console.error('ErrorRenderingReactComponent :: methodologyTagsMenu ', e)
  }
}


renderComponent("#methodology-tags-menu", <FrontListComponent />)


renderComponent("#articles-list-component", <ArticlesListComponent />)


renderComponent("#methodology-tree-component", <MethodologyTreeComponent />)

