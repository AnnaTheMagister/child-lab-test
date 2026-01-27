import "./styles/main.scss";
import "./styles/grid-system.scss";
import "./styles/header.scss";

import "./scripts/ArticleReader";
import { FrontListComponent } from "./scripts/widgets";
import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(
  document.querySelector("#render-react-example-here"),
);
root.render(<FrontListComponent />);
