import "./styles/main.scss"
import "./styles/grid-system.scss"
import "./styles/header.scss"
import "./styles/footer.scss"

import "./scripts/ArticleReader"
import ExampleReactComponent from "./scripts/ExampleReactComponent"
import React from "react"
import ReactDOM from "react-dom/client"


const root = ReactDOM.createRoot(document.querySelector("#render-react-example-here"))
root.render(<ExampleReactComponent />)
