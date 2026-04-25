Adding the copy button worked cleanly as a post-render pass on `pre > code`, with a clipboard API path and a small fallback for older browsers.
Keeping the article's voice while fixing spelling was easiest by preserving the existing sections and tightening only the worst phrases.
GitHub Pages here is serving the committed tree directly because of `.nojekyll`, so excluding `doc/ia-*` needs a publish step that copies only public files; there is no simple repo-side ignore rule for already committed paths.
Using an emoji button plus a 1000px cap on the code block keeps the control visually tied to the snippet instead of floating at the page edge.
