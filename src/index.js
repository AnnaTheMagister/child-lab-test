import "./styles/main.scss";
import "./styles/grid-system.scss";
import "./styles/header.scss";
import "./styles/courses-list.scss";
import "./scripts/ui-kit/Button/Button.scss";
import "./scripts/ui-kit/ButtonGroup/ButtonGroup.scss";
import "./scripts/ui-kit/Tag/Tag.scss";
import "./scripts/widgets/CoursesList/CourseCard/CourseCard.scss";
import "./scripts/widgets/CourseBanner/CourseBanner.scss";

import "./scripts/ArticleReader";
import "./scripts/shared/switcher";
import { ArticlesListComponent, CoursesListComponent, FrontListComponent, MethodologyTreeComponent } from "./scripts/widgets";
import { CourseBanner } from "./scripts/widgets/CourseBanner";
import { CourseContextProvider } from "./scripts/entities/Course";
import React from "react";
import ReactDOM from "react-dom/client";
import { MethodologyTagsContextProvider } from "./scripts/entities/MethodologyTags";
import { ArticlesContextProvider } from "./scripts/entities/Articles";
import { CoursesContextProvider } from "./scripts/entities/Courses";
import ErrorBoundary from "./scripts/widgets/ErrorBoundary/ErrorBoundary";

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

try {
  const coursesContainer = ReactDOM.createRoot(
    document.querySelector("#courses-list-component"),
  );

  coursesContainer.render(
    <ErrorBoundary name="Courses">
      <CoursesContextProvider>
        <CoursesListComponent />
      </CoursesContextProvider>
    </ErrorBoundary>
  );
} catch (e) {
  console.error("ErrorRenderingReactComponent :: CoursesList ", e);
}

renderComponent("#methodology-tree-component", <MethodologyTreeComponent />)

try {
  const bannerContainer = document.querySelector("#course-banner-component");
  if (bannerContainer) {
    const postId = parseInt(bannerContainer.getAttribute("data-post-id") || "0", 10);
    const root = ReactDOM.createRoot(bannerContainer);
    root.render(
      <CourseContextProvider postId={postId}>
        <CourseBanner />
      </CourseContextProvider>
    );
  }
} catch (e) {
  console.error("ErrorRenderingReactComponent :: CourseBanner ", e);
}

