import type { Html, Root, RootContent } from 'mdast';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Turn ```mermaid fences into `<pre class="mermaid">` before Expressive Code sees them.
 * The diagram is drawn in the browser by MermaidRenderer, only on pages that contain one;
 * without JS the source stays readable as text.
 */
export function remarkMermaid() {
  return (tree: Root) => {
    const walk = (children: RootContent[]) => {
      children.forEach((child, i) => {
        if (child.type === 'code' && child.lang === 'mermaid') {
          const html: Html = {
            type: 'html',
            value: `<pre class="mermaid" data-pagefind-ignore>${escapeHtml(child.value)}</pre>`,
          };
          children[i] = html;
        } else if ('children' in child) {
          walk(child.children as RootContent[]);
        }
      });
    };
    walk(tree.children);
  };
}
