import { parseMarkdown } from "./utils/parser.js";
import "./compoments/ProjectCode.js";

const routes = {
  "/": "posts/home.md",
  "/game-of-life": "posts/game-of-life.md",
  "/custom-parser": "posts/custom-parser.md",
  "/sibling-index": "posts/sibling-index.md",
};

async function navigate() {
  const path = window.location.hash.slice(1) || "/";
  const file = routes[path];

  document.querySelectorAll('nav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${path}`);
  });

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("File not found");

    const markdown = await response.text();
    document.querySelector("main").innerHTML = parseMarkdown(markdown);

  } catch (err) {
    document.getElementById("content").innerHTML = `<h1>404</h1><p>Blueprint not found.</p>`;
  }
}

window.addEventListener("hashchange", navigate);
window.addEventListener("load", navigate);
