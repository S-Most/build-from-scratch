# Building a Robust Syntax Highlighter

Syntax highlighting is notoriously difficult because regular expressions love to overlap and corrupt each other. If one pass wraps a keyword in a `<span class="hl-keyword">`, a subsequent pass searching for strings might accidentally match the `"hl-keyword"` attribute itself!

To solve this, we built a custom parser using the functional **`composeParser`** pattern. This pattern allows us to chain multiple parsing functions together.

## The Secret: Lookaheads and Safe Passes

The parser runs through multiple functional string replacement passes. Each pass skips over any pre-existing HTML tags injected by earlier passes using this regex trick: `/(<[^>]+>)|.../`

If an existing injected tag is found, it's instantly bypassed. If not, the actual syntax rule (like matching a JavaScript keyword) is executed and injected into the pipeline.

Here is some code of the syntax highlighter. In the tabs below, you can examine the core pieces of this pattern.

### Code
[code files="html-parser.js,css-parser.js,js-parser.js,helpers.js,highlight.css" path="/demos/custom-parser/" hide-result="true"]
