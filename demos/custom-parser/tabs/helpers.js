const composeParser = (...fns) => (initialContent) =>
    fns.reduce((content, fn) => fn(content), initialContent);

const escapeHtmlPass = (str) => {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
};

export function highlight(code, language) {
    if (!code) return "";

    if (language === 'html') return highlightHTML(code);
    if (language === 'css') return highlightCSS(code);
    if (language === 'js') return highlightJS(code);

    return escapeHtmlPass(code);
}