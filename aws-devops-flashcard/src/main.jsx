import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../aws_devops_flashcards.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);