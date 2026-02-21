const composeParser = (...fns) => (initialContent) =>
    fns.reduce((content, fn) => fn(content), initialContent);

const escapeHtmlPass = (str) => {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
};

const parseHtmlComments = (str) =>
    str.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hl-comment">$1</span>');

const parseHtmlTags = (str) => {
    return str.replace(/(&lt;\/?)([\w-]+)(.*?)(\/?&gt;)/g, (match, start, tagName, inner, end) => {
        let parsedInner = inner.replace(/([\w-]+)(?:\s*(=)\s*(["'][^"']*["']|[^\s]+))?/g, (m, attr, eq, val) => {
            let result = `<span class="hl-attribute">${attr}</span>`;
            if (eq) {
                result += eq;
                if (val) {
                    result += `<span class="hl-string">${val}</span>`;
                }
            }
            return result;
        });
        return `${start}<span class="hl-tag">${tagName}</span>${parsedInner}${end}`;
    });
};

const highlightHTML = composeParser(
    escapeHtmlPass,
    parseHtmlComments,
    parseHtmlTags
);

const parseCssComments = (str) =>
    str.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="hl-comment">$1</span>');

const parseCssStrings = (str) => {
    const regex = /(<[^>]+>)|(["'][^"']*["'])/g;
    return str.replace(regex, (match, tag, strMatch) => {
        if (tag) return tag;
        return `<span class="hl-string">${strMatch}</span>`;
    });
};

const parseCssBlocks = (str) => {
    const regex = /(<[^>]+>)|([^\{\}]+)(\{[\s\S]*?\})/g;
    return str.replace(regex, (match, tag, selector, block) => {
        if (tag) return tag;
        let parsedBlock = block.replace(/(<[^>]+>)|([\w-]+)(\s*:)([^;\}]+)(;?)/g, (m, t, prop, colon, val, semi) => {
            if (t) return t;
            return `<span class="hl-property">${prop}</span>${colon}<span class="hl-value">${val}</span>${semi}`;
        });
        return `<span class="hl-selector">${selector}</span>${parsedBlock}`;
    });
};

const highlightCSS = composeParser(
    escapeHtmlPass,
    parseCssComments,
    parseCssStrings,
    parseCssBlocks
);

const parseJsComments = (str) =>
    str.replace(/(\/\*[\s\S]*?\*\/|\/\/.*)/g, '<span class="hl-comment">$1</span>');

const parseJsStrings = (str) => {
    const regex = /(<[^>]+>)|("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/g;
    return str.replace(regex, (match, tag, strMatch) => {
        if (tag) return tag;
        return `<span class="hl-string">${strMatch}</span>`;
    });
};

const parseJsKeywords = (str) => {
    const keywords = ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "extends", "import", "export", "from", "new", "this", "super", "true", "false", "null", "undefined", "try", "catch", "await", "async", "switch", "case", "break", "default", "continue", "yield", "document", "window", "console", "Math", "Object", "Array", "String"].join("|");
    const regex = new RegExp(`(<[^>]+>)|\\b(${keywords})\\b`, 'g');
    return str.replace(regex, (match, tag, keyword) => {
        if (tag) return tag;
        return `<span class="hl-keyword">${keyword}</span>`;
    });
};

const parseJsNumbers = (str) => {
    const regex = /(<[^>]+>)|(\b\d+(?:\.\d+)?\b)/g;
    return str.replace(regex, (match, tag, num) => {
        if (tag) return tag;
        return `<span class="hl-number">${num}</span>`;
    });
};

const parseJsFunctions = (str) => {
    const regex = /(<[^>]+>)|(\b[a-zA-Z_$][0-9a-zA-Z_$]*)(?=\s*\()/g;
    return str.replace(regex, (match, tag, func) => {
        if (tag) return tag;
        if (["if", "for", "while", "switch", "catch", "function"].includes(func)) return `<span class="hl-keyword">${func}</span>`;
        return `<span class="hl-function">${func}</span>`;
    });
};

const highlightJS = composeParser(
    escapeHtmlPass,
    parseJsComments,
    parseJsStrings,
    parseJsFunctions,
    parseJsKeywords,
    parseJsNumbers
);

export function highlight(code, language) {
    if (!code) return "";

    if (language === 'html' || language === 'htm') return highlightHTML(code);
    if (language === 'css') return highlightCSS(code);
    if (language === 'js' || language === 'javascript') return highlightJS(code);

    return escapeHtmlPass(code);
}