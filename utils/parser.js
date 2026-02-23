import { highlight } from "./highlight.js";

const extractMetadata = (str) => {
  const metaRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n*/;
  const match = str.match(metaRegex);
  const meta = {};

  if (match) {
    const lines = match[1].split(/\r?\n/);
    lines.forEach(line => {
      const [key, ...values] = line.split(':');
      if (key) {
        meta[key.trim()] = values.join(':').trim();
      }
    });
    return {
      meta,
      content: str.replace(metaRegex, '').trim()
    };
  }

  return { meta, content: str };
};

const parseMetaBlock = (str) => {
  const metaRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n*/;
  return str.replace(metaRegex, (match, metaStr) => {
    const meta = {};
    const lines = metaStr.split(/\r?\n/);
    lines.forEach(line => {
      const [key, ...values] = line.split(':');
      if (key) {
        meta[key.trim()] = values.join(':').trim();
      }
    });
    return `<post-meta title="${meta.title || ''}" type="${meta.type || ''}" date="${meta.date || ''}" description="${meta.description || ''}"></post-meta>\n\n`;
  });
};

const parseHeaders = (str) => {
  return str
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>");
};

const parseCustomElements = (str) => {
  const regex = /\[code files="(.+?)" path="(.+?)"(?: hide-result="(.+?)")?\]/g;
  return str.replace(regex, (match, files, path, hideResult) => {
    const hideAttr = hideResult ? ` hide-result="${hideResult}"` : '';
    return `<project-code files="${files}" base-path="${path}"${hideAttr}></project-code>`;
  });
};

const parseHorizontalRules = (str) => {
  return str.replace(/^---$/gim, '<div class="line"></div>');
};

const parseLists = (str) => {
  return str.replace(/(?:^[\*\-]\s.*(?:\r?\n|$))+/gim, (match) => {
    const listItems = match
      .trim()
      .split(/\r?\n/)
      .map((item) => `<li>${item.replace(/^[\*\-]\s/, "")}</li>`)
      .join("");
    return `<ul>${listItems}</ul>`;
  });
};

const parseBold = (str) =>
  str.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

const parseItalic = (str) =>
  str.replace(/\*(.*?)\*/gim, "<em>$1</em>");

const parseInlineCode = (str) =>
  str.replace(/`([^`]+)`/gim, (match, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<code>${escaped}</code>`;
  });

const parseImages = (str) => {
  const regex = /\[([^\]]+\.(?:png|jpg|jpeg|gif|svg|webp))\]/gi;
  return str.replace(regex, (match, filename) => {
    return `<div class="image-container">
      <img class="sketched-filter" src="static/${filename}" alt="${filename}">
      <div class="overlay sketched-filter"></div>
    </div>`;
  });
};

const parseAnnotations = (str) => {
  const regex = /_([^_]+)_([^_]+)_/g;
  return str.replace(regex, (match, word, annotation) => {
    return `<hand-annotation text="${annotation}">${word}</hand-annotation>`;
  });
};

const parseCodeBlocks = (str) => {
  const regex = /```(\w+)\n([\s\S]*?)```/gm;
  return str.replace(regex, (match, language, code) => {
    return `<div class="code-tab-container">
      <div class="code-tab-bar">
        <button class="code-tab active">${language}</button>
      </div>
      <pre><code>${highlight(code, language)}</code></pre>
    </div>`;
  });
};

const parseQuotes = (str) => {
  const regex = /^>\s*(.+?)\s*\|\s*(.+?)\s*\|[ \t]*$/gm;
  return str.replace(regex, (match, quote, author) => {
    return `<hand-quote author="${author.trim()}">${quote.trim()}</hand-quote>`;
  });
};

const parseParagraphs = (str) => {
  return str
    .trim()
    .split(/\r?\n\r?\n+/)
    .filter(block => block.trim())
    .map((block) => {
      return /^(<h|<ul|<p|<project-code|<div|<hr|<hand-quote|<post-meta)/.test(block.trim())
        ? block
        : `<p>${block.trim()}</p>`;
    })
    .join("\n\n");
};

const composeParser =
  (...fns) =>
    (initialContent) =>
      fns.reduce((content, fn) => fn(content), initialContent);

const parseMarkdown = composeParser(
  parseMetaBlock,
  parseQuotes,
  parseCodeBlocks,
  parseHeaders,
  parseCustomElements,
  parseImages,
  parseAnnotations,
  parseHorizontalRules,
  parseLists,
  parseBold,
  parseItalic,
  parseInlineCode,
  parseParagraphs
);

export { parseMarkdown, extractMetadata };
