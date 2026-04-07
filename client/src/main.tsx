import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import styles from "./index.module.scss";
import App from "./App.tsx";

console.log(styles);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
