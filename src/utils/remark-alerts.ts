import type { Blockquote, Paragraph, Root, RootContent } from 'mdast';

const TYPES = ['note', 'tip', 'important', 'warning', 'caution'] as const;
const MARKER = new RegExp(`^\\[!(${TYPES.join('|')})\\][ \\t]*\\r?\\n?`, 'i');

const label = (type: string) => type[0]!.toUpperCase() + type.slice(1);

/**
 * GitHub-style alerts: a quote that opens with `[!NOTE]` (or TIP, IMPORTANT, WARNING, CAUTION)
 * becomes a labelled box. Without this plugin the marker would show up as literal text.
 * Styling lives in prose.css (`.alert`, `.alert-<type>`).
 */
export function remarkAlerts() {
  return (tree: Root) => {
    const walk = (children: RootContent[]) => {
      for (const child of children) {
        if (child.type === 'blockquote') convert(child);
        if ('children' in child) walk(child.children as RootContent[]);
      }
    };
    walk(tree.children);
  };
}

function convert(quote: Blockquote) {
  const first = quote.children[0];
  const text = first?.type === 'paragraph' ? first.children[0] : undefined;
  if (first?.type !== 'paragraph' || text?.type !== 'text') return;

  const match = MARKER.exec(text.value);
  if (!match) return;
  const type = match[1]!.toLowerCase();

  text.value = text.value.slice(match[0].length);
  if (!text.value) first.children.shift();
  if (first.children.length === 0) quote.children.shift();

  const title: Paragraph = {
    type: 'paragraph',
    children: [{ type: 'text', value: label(type) }],
    data: { hName: 'p', hProperties: { className: ['alert-title'] } },
  };
  quote.children.unshift(title);
  quote.data = { hName: 'div', hProperties: { className: ['alert', `alert-${type}`] } };
}
