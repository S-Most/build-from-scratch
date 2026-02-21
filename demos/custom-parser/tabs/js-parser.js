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