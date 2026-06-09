import { render } from "solid-js/web";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/header.css";
import "./styles/preview.css";
import "./styles/messages.css";
import "./styles/markdown.css";
import { App } from "./App";

render(() => <App />, document.body);
