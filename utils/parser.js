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
  return str.replace(/^---$/gim, '<hr class="line">');
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

const parseParagraphs = (str) => {
  return str
    .trim()
    .split(/\r?\n\r?\n+/)
    .filter(block => block.trim())
    .map((block) => {
      return /^(<h|<ul|<p|<project-code|<div|<hr)/.test(block.trim())
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
  parseHeaders,
  parseCustomElements,
  parseHorizontalRules,
  parseLists,
  parseBold,
  parseItalic,
  parseInlineCode,
  parseParagraphs
);

export { parseMarkdown };
