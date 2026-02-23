import { parseMarkdown, extractMetadata } from "./utils/parser.js";
import "./components/ProjectCode.js";
import "./components/PostMeta.js";
import "./components/HandAnnotation.js";
import "./components/HandQuote.js";

const posts = [
  "posts/game-of-life.md",
  "posts/custom-parser.md",
  "posts/sibling-index.md",
  "posts/design.md",
  "posts/web-components.md",
  "posts/vanilla-router.md",
  "posts/virtual-dom.md",
  "posts/canvas-loop.md",
  "posts/state-machines.md",
  "posts/ml-api.md",
  "posts/3d-engine.md",
  "posts/oauth-server.md",
  "posts/kv-store.md"
];

const routes = {
  "/": "posts/home.md",
};

let overlays = {
  "technique": [
    `
        <svg class="tech-overlay" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g class="tech-group" stroke="rgba(0,0,0,0.06)" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M 0 30 L 40 30 L 60 50 L 200 50 M 140 0 L 140 30 L 160 50 L 160 200" />
            <path d="M 0 160 L 30 160 L 50 180 L 200 180 M 180 80 L 170 80 L 150 100 L 150 200" />

            <circle cx="40" cy="30" r="4" fill="rgba(0,0,0,0.06)" />
            <circle cx="140" cy="30" r="3" />
            <circle cx="30" cy="160" r="5" />
            <circle cx="170" cy="80" r="4" fill="rgba(0,0,0,0.06)" />

            <!-- Large Gear -->
            <path d="M 140 140 L 145 130 L 155 130 L 160 140 L 170 145 L 170 155 L 160 160 L 155 170 L 145 170 L 140 160 L 130 155 L 130 145 Z" />
            <circle cx="150" cy="150" r="6" />
            <circle cx="150" cy="150" r="16" />

            <!-- Small Gear -->
            <path d="M 125 125 L 128 118 L 134 118 L 137 125 L 144 128 L 144 134 L 137 137 L 134 144 L 128 144 L 125 137 L 118 134 L 118 128 Z" />
            <circle cx="131" cy="131" r="3" />
            <circle cx="131" cy="131" r="9" />

            <!-- Circuit Nodes -->
            <path d="M 70 110 L 90 90 L 120 90" stroke-dasharray="4 4" />
            <rect x="118" y="88" width="8" height="4" fill="rgba(0,0,0,0.06)" />

            <path d="M 80 160 L 100 140 L 110 140" />
            <path d="M 50 80 L 70 100 L 70 120" />
            <circle cx="50" cy="80" r="2" />

            <path d="M 180 120 L 190 130 M 120 180 L 130 190" stroke-width="1" />
          </g>
        </svg>
    `,
    `
        <svg class="tech-overlay" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g class="tech-group" stroke="rgba(0,0,0,0.06)" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Ruler -->
            <path d="M 20 180 L 180 20" />
            <path d="M 30 190 L 190 30" />
            <path d="M 20 180 L 30 190 M 180 20 L 190 30" />
            <!-- Ruler marks -->
            <path d="M 40 160 L 47 167 M 60 140 L 65 145 M 80 120 L 87 127 M 100 100 L 105 105 M 120 80 L 127 87 M 140 60 L 145 65 M 160 40 L 167 47" />
            <!-- Compass -->
            <path d="M 100 40 L 60 150 M 100 40 L 140 150" />
            <!-- Compass Joint -->
            <circle cx="100" cy="40" r="8" />
            <path d="M 100 32 L 100 20" />
            <!-- Compass Arc -->
            <path d="M 60 150 Q 100 170 140 150" stroke-dasharray="5 5" />
            <circle cx="60" cy="150" r="3" />
            <circle cx="140" cy="150" r="3" fill="rgba(0,0,0,0.06)" />
          </g>
        </svg>
    `,
    `
        <svg class="tech-overlay" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g class="tech-group" stroke="rgba(0,0,0,0.06)" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Logic Gates -->
            <path d="M 160 60 L 160 80" />
            <path d="M 160 60 A 15 15 0 0 1 160 90" />
            <path d="M 160 90 L 160 80" />
            <path d="M 160 60 L 140 60 M 160 90 L 140 90 M 175 75 L 190 75" />

            <!-- Nodes -->
            <path d="M 30 140 Q 40 150 30 160 Q 50 160 60 150 Q 50 140 30 140" />
            <path d="M 30 145 L 10 145 M 30 155 L 10 155 M 60 150 L 80 150" />

            <!-- Traces -->
            <path d="M 40 80 L 20 80 L 20 40 L 80 40" stroke-dasharray="4 4" />
            <circle cx="20" cy="40" r="3" fill="rgba(0,0,0,0.06)" />
            <rect x="70" y="70" width="40" height="40" rx="4" />
            <path d="M 70 80 L 50 80 M 70 100 L 50 100 M 110 80 L 130 80 M 110 100 L 130 100" />
            <path d="M 80 110 L 80 130 M 100 110 L 100 130 M 80 70 L 80 50 M 100 70 L 100 50" />
          </g>
        </svg>
    `
  ],
  "project": [
    `
        <svg class="tech-overlay" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g class="tech-group" stroke="rgba(0,0,0,0.06)" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Tower Base -->
            <path d="M 60 200 L 60 40 M 80 200 L 80 40" />

            <!-- Tower Cross-bracing -->
            <path d="M 60 40 L 80 50 M 60 50 L 80 60 M 60 60 L 80 70 M 60 70 L 80 80 M 60 80 L 80 90 M 60 90 L 80 100 M 60 100 L 80 110 M 60 110 L 80 120 M 60 120 L 80 130 M 60 130 L 80 140 M 60 140 L 80 150 M 60 150 L 80 160 M 60 160 L 80 170 M 60 170 L 80 180 M 60 180 L 80 190 M 60 190 L 80 200" stroke-width="1.5" />
            <path d="M 80 40 L 60 50 M 80 50 L 60 60 M 80 60 L 60 70 M 80 70 L 60 80 M 80 80 L 60 90 M 80 90 L 60 100 M 80 100 L 60 110 M 80 110 L 60 120 M 80 120 L 60 130 M 80 130 L 60 140 M 80 140 L 60 150 M 80 150 L 60 160 M 80 160 L 60 170 M 80 170 L 60 180 M 80 180 L 60 190 M 80 190 L 60 200" stroke-width="1.5" />
            <path d="M 80 55 L 95 55 L 95 70 L 80 70" />
            <rect x="83" y="58" width="9" height="9" fill="rgba(0,0,0,0.06)" />

            <!-- Front Jib -->
            <path d="M 80 40 L 190 40 L 190 45 L 80 50" />

            <!-- Jib Bracing -->
            <path d="M 90 40 L 85 49 M 100 40 L 95 48 M 110 40 L 105 47 M 120 40 L 115 46 M 130 40 L 125 45 M 140 40 L 135 44 M 150 40 L 145 44 M 160 40 L 155 43 M 170 40 L 165 42 M 180 40 L 175 41" stroke-width="1" />
            <path d="M 80 50 L 90 40 M 85 49 L 100 40 M 95 48 L 110 40 M 105 47 L 120 40 M 115 46 L 130 40 M 125 45 L 140 40 M 135 44 L 150 40 M 145 44 L 160 40 M 155 43 L 170 40 M 165 42 L 180 40" stroke-width="1" />

            <!-- Back Jib -->
            <path d="M 60 40 L 20 40 L 20 45 L 60 50" />
            <path d="M 50 40 L 55 49 M 40 40 L 45 47 M 30 40 L 35 46" stroke-width="1" />
            <path d="M 60 50 L 50 40 M 55 49 L 40 40 M 45 47 L 30 40 M 35 46 L 20 40" stroke-width="1" />

            <!-- Counterweights -->
            <rect x="15" y="45" width="10" height="15" fill="rgba(0,0,0,0.06)" />
            <rect x="26" y="45" width="8" height="15" fill="rgba(0,0,0,0.06)" />

            <!-- Tower Apex -->
            <path d="M 60 40 L 70 20 L 80 40" />
            <path d="M 70 20 L 70 40" stroke-width="1.5" />

            <!-- Tension Cables -->
            <path d="M 70 20 L 30 40" stroke-width="1" />
            <path d="M 70 20 L 120 40" stroke-width="1" />
            <path d="M 70 20 L 160 40" stroke-width="1" />

            <!-- Lifting Hook and Cables -->
            <path d="M 140 44 L 140 120" stroke-width="1" />
            <path d="M 145 44 L 145 120" stroke-width="1" />
            <path d="M 138 120 L 147 120" />
            <circle cx="142.5" cy="125" r="5" />
            <path d="M 142.5 130 L 142.5 135 Q 147 135 147.5 140 Q 147 145 142.5 145" />

            <circle cx="70" cy="20" r="2" />
          </g>
        </svg>
    `,
    `
        <svg class="tech-overlay" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g class="tech-group" stroke="rgba(0,0,0,0.06)" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Road -->
            <path d="M 0 120 L 200 120" stroke-width="3" />
            <path d="M 0 125 L 200 125" stroke-width="1.5" />
            <!-- Pillars -->
            <path d="M 50 120 L 50 200 M 70 120 L 70 200" />
            <path d="M 130 120 L 130 200 M 150 120 L 150 200" />
            <!-- Cross bracing in pillars -->
            <path d="M 50 130 L 70 150 M 50 150 L 70 170 M 50 170 L 70 190" stroke-width="1" />
            <path d="M 70 130 L 50 150 M 70 150 L 50 170 M 70 170 L 50 190" stroke-width="1" />
            <path d="M 130 130 L 150 150 M 130 150 L 150 170 M 130 170 L 150 190" stroke-width="1" />
            <path d="M 150 130 L 130 150 M 150 150 L 130 170 M 150 170 L 130 190" stroke-width="1" />
            <!-- Suspension Cables -->
            <path d="M 60 30 Q 100 110 140 30" stroke-width="2" />
            <path d="M 60 30 Q 30 70 0 90" stroke-width="2" />
            <path d="M 140 30 Q 170 70 200 90" stroke-width="2" />
            <!-- Towers -->
            <path d="M 50 30 L 50 120 M 70 30 L 70 120" />
            <path d="M 130 30 L 130 120 M 150 30 L 150 120" />
            <!-- Tower Top -->
            <path d="M 45 30 L 75 30 M 125 30 L 155 30" />
            <circle cx="60" cy="25" r="5" />
            <circle cx="140" cy="25" r="5" />
            <!-- Vertical Suspenders -->
            <path d="M 20 80 L 20 120" stroke-width="1" />
            <path d="M 40 55 L 40 120" stroke-width="1" />
            <path d="M 80 75 L 80 120" stroke-width="1" />
            <path d="M 100 100 L 100 120" stroke-width="1" />
            <path d="M 120 75 L 120 120" stroke-width="1" />
            <path d="M 160 55 L 160 120" stroke-width="1" />
            <path d="M 180 80 L 180 120" stroke-width="1" />
          </g>
        </svg>
    `,
    `
        <svg class="tech-overlay" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g class="tech-group" stroke="rgba(0,0,0,0.06)" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Ground -->
            <path d="M 10 180 L 190 180" stroke-width="3" />
            <!-- Foundation -->
            <rect x="30" y="160" width="140" height="20" />
            <!-- Wall studs -->
            <path d="M 30 80 L 30 160 M 170 80 L 170 160" />
            <path d="M 50 80 L 50 160 M 70 80 L 70 160 M 90 80 L 90 160 M 110 80 L 110 160 M 130 80 L 130 160 M 150 80 L 150 160" stroke-width="1" />
            <!-- Top and Bottom Plates -->
            <path d="M 25 80 L 175 80" stroke-width="2" />
            <path d="M 25 85 L 175 85" stroke-width="1" />
            <!-- Roof Trusses -->
            <path d="M 20 80 L 100 20 L 180 80 Z" />
            <path d="M 40 65 L 100 80 L 160 65" />
            <path d="M 100 20 L 100 80" />
            <path d="M 70 42 L 70 80 M 130 42 L 130 80" stroke-width="1" />
            <path d="M 40 65 L 70 80 M 160 65 L 130 80" stroke-width="1" />
            <!-- Door opening -->
            <rect x="70" y="100" width="40" height="60" fill="white" />
            <path d="M 70 100 L 110 100 L 110 160 M 70 160 L 70 100" stroke-dasharray="3 3" />
            <path d="M 70 100 L 110 160" stroke-dasharray="2 2" stroke-width="1" />
            <!-- Window framing -->
            <path d="M 130 100 L 150 100 L 150 130 L 130 130 Z" />
            <path d="M 140 100 L 140 130 M 130 115 L 150 115" stroke-width="1" />
            <path d="M 30 100 L 50 100 L 50 130 L 30 130" />
            <path d="M 40 100 L 40 130 M 30 115 L 50 115" stroke-width="1" />
          </g>
        </svg>
    `
  ]
};

posts.forEach(post => {
  const path = "/" + post.split("/").pop().replace(".md", "");
  routes[path] = post;
});

let postMetas = null;

async function getPostMetas() {
  if (postMetas) return postMetas;
  const metas = await Promise.all(posts.map(async (file) => {
    try {
      const response = await fetch(file);
      const text = await response.text();
      const { meta } = extractMetadata(text);
      const path = "#/" + file.split("/").pop().replace(".md", "");
      return { path, meta, type: meta.type };
    } catch (e) {
      return null;
    }
  }));
  postMetas = metas.filter(item => item !== null);
  return postMetas;
}

async function renderGrid(type) {
  const allPosts = await getPostMetas();
  const validPosts = allPosts.filter(post => post.type === type);

  const content = validPosts.map((post, index) => {
    let overlay = '';

    if (index % 2 === 1) {
      const arr = overlays[post.type];
      if (arr && arr.length) {
        overlay = arr[Math.floor(index / 2) % arr.length];
      }
    }

    return `<a class="card" href="${post.path}">
      ${overlay}
      <h3>${post.meta.title || 'Untitled'}</h3>
      <p>${post.meta.description || ''}</p>
      <div class="card-meta"><span>${post.meta.date || ''}</span></div>
    </a>`;
  }).join('');
  return `<h1>${type === 'project' ? 'Projects' : 'Techniques'}</h1>
          <div class="grid-container">${content}</div>`;
}

async function updateFooter(currentPath) {
  const footer = document.querySelector('footer');
  if (!footer) return;

  const currentHash = "#" + currentPath;
  const allPosts = await getPostMetas();
  const currentPostIndex = allPosts.findIndex(p => p.path === currentHash);

  let sameTypePosts = allPosts;
  let typeIndex = -1;

  if (currentPostIndex !== -1) {
    const currentPost = allPosts[currentPostIndex];
    sameTypePosts = allPosts.filter(p => p.type === currentPost.type);
    typeIndex = sameTypePosts.findIndex(p => p.path === currentHash);
  } else if (currentPath.startsWith('/projects')) {
    sameTypePosts = allPosts.filter(p => p.type === 'project');
  } else if (currentPath.startsWith('/techniques')) {
    sameTypePosts = allPosts.filter(p => p.type === 'technique');
  }

  let pTarget = allPosts[allPosts.length - 1];
  let nTarget = allPosts[0];

  if (sameTypePosts.length > 0) {
    if (typeIndex !== -1) {
       pTarget = typeIndex > 0 ? sameTypePosts[typeIndex - 1] : sameTypePosts[sameTypePosts.length - 1];
       nTarget = typeIndex < sameTypePosts.length - 1 ? sameTypePosts[typeIndex + 1] : sameTypePosts[0];
    } else {
       pTarget = sameTypePosts[sameTypePosts.length - 1];
       nTarget = sameTypePosts[0];
    }
  }

  const icons = {
    "prev":`
      <a href="${pTarget.path}" class="icon-link" aria-label="Previous Article">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
      </a>`,
    "projects": `
      <a href="#/projects" class="icon-link ${currentPath.startsWith('/projects') ? 'active' : ''}" aria-label="Projects">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
      </a>`,
    "home": `
      <a href="#/" class="icon-link ${currentPath === '/' ? 'active' : ''}" aria-label="Home">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
      </a>`,
    "technique": `
      <a href="#/techniques" class="icon-link ${currentPath.startsWith('/techniques') ? 'active' : ''}" aria-label="Techniques">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
      </a>`,
    "next": `
      <a href="${nTarget.path}" class="icon-link" aria-label="Next Article">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
      </a>`
  }

  footer.innerHTML = `
      ${icons.prev}
      ${icons.projects}
      ${icons.home}
      ${icons.technique}
      ${icons.next}
  `;
}

async function navigate() {
  const path = window.location.hash.slice(1) || "/";

  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href').replace('#', '');

    let isActive = false;
    if (href === '/') {
      isActive = path === '/';
    } else {
      isActive = path.startsWith(href);
    }

    link.classList.toggle('active', isActive);
  });

  try {
    const mainAttr = document.querySelector("main");
    if (path === '/projects') {
      mainAttr.innerHTML = await renderGrid('project');
      await updateFooter(path);
      return;
    }

    if (path === '/techniques') {
      mainAttr.innerHTML = await renderGrid('technique');
      await updateFooter(path);
      return;
    }

    const file = routes[path];
    if (!file) throw new Error("File not found");

    const response = await fetch(file);
    if (!response.ok) throw new Error("File not found");

    const markdown = await response.text();
    mainAttr.innerHTML = parseMarkdown(markdown);
    await updateFooter(path);

  } catch (err) {
    document.querySelector("main").innerHTML = `<h1>404</h1><p>Blueprint not found.</p>`;
    await updateFooter(path);
  }
}

window.addEventListener("hashchange", navigate);
window.addEventListener("load", navigate);
