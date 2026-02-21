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