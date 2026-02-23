import { parseMarkdown, extractMetadata } from "./utils/parser.js";
import "./components/ProjectCode.js";
import "./components/PostMeta.js";
import "./components/HandAnnotation.js";
import "./components/HandQuote.js";

const posts = [
  "posts/game-of-life.md",
  "posts/custom-parser.md",
  "posts/sibling-index.md",
  "posts/design.md"
];

const routes = {
  "/": "posts/home.md",
};

posts.forEach(post => {
  const path = "/" + post.split("/").pop().replace(".md", "");
  routes[path] = post;
});

async function renderGrid(type) {
  const gridHtml = await Promise.all(posts.map(async (file) => {
    const response = await fetch(file);
    const text = await response.text();
    const { meta } = extractMetadata(text);

    if (meta.type === type) {
      const path = "#/" + file.split("/").pop().replace(".md", "");
      return `<a class="card" href="${path}">
        <h3>${meta.title || 'Untitled'}</h3>
        <p>${meta.description || ''}</p>
        <div class="card-meta"><span>${meta.date || ''}</span></div>
      </a>`;
    }
    return '';
  }));

  const content = gridHtml.filter(html => html !== '').join('');
  return `<h1>${type === 'project' ? 'Projects' : 'Techniques'}</h1>
          <div class="grid-container">${content}</div>`;
}

async function navigate() {
  const path = window.location.hash.slice(1) || "/";

  document.querySelectorAll('nav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${path}`);
  });

  try {
    const mainAttr = document.querySelector("main");
    if (path === '/projects') {
      mainAttr.innerHTML = await renderGrid('project');
      return;
    }

    if (path === '/techniques') {
      mainAttr.innerHTML = await renderGrid('technique');
      return;
    }

    const file = routes[path];
    if (!file) throw new Error("File not found");

    const response = await fetch(file);
    if (!response.ok) throw new Error("File not found");

    const markdown = await response.text();
    mainAttr.innerHTML = parseMarkdown(markdown);

  } catch (err) {
    document.querySelector("main").innerHTML = `<h1>404</h1><p>Blueprint not found.</p>`;
  }
}

window.addEventListener("hashchange", navigate);
window.addEventListener("load", navigate);
