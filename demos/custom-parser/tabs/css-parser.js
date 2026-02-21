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