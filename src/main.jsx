import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// iOS "Undo Typing" 다이얼로그 방지 (세 손가락 스와이프 / 흔들기)
document.addEventListener("beforeinput", (e) => {
  if (e.inputType === "historyUndo" || e.inputType === "historyRedo") {
    e.preventDefault();
  }
}, true);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
