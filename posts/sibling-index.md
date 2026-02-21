# The Magic of `sibling-index()` in CSS

For years, styling an element based on its position among its siblings required JavaScript or manually writing dozens of `:nth-child(n)` CSS rules.

Enter the new CSS Level 5 functions: `sibling-index()` and `sibling-count()`.

## What do they do?
- **`sibling-index()`**: Returns the 1-based index of the element among its siblings.
- **`sibling-count()`**: Returns the total number of siblings.

These evaluate to integers, which means you can use them inside `calc()` to perform math! 

## Dynamic Staggering without JS
By combining these functions with `calc()`, you can create dynamic layouts and staggering animations that automatically adjust as elements are added or removed, with zero JavaScript calculation for the layout!

In the demo below, we fan out a stack of sticky notes. The rotation, vertical offset, and background color are all calculated purely in CSS using `sibling-index()` and `sibling-count()`.

Try clicking the "Add Note" and "Remove Note" buttons and watch the CSS recalculate the spread for the entire stack!

### Interactive Demo
[code files="index.html,style.css,script.js" path="/demos/sibling-index/"]
