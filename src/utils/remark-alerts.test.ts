import type { Root } from 'mdast';
import { describe, expect, it } from 'vitest';
import { remarkAlerts } from './remark-alerts';

interface Node {
  data?: { hProperties: { className: string[] } };
  children: Node[];
  value?: string;
}

const quote = (text: string): Root => ({
  type: 'root',
  children: [
    {
      type: 'blockquote',
      children: [{ type: 'paragraph', children: [{ type: 'text', value: text }] }],
    },
  ],
});

/** Runs the plugin and returns the first node of the tree. */
const convert = (tree: Root): Node => {
  remarkAlerts()(tree);
  return tree.children[0] as unknown as Node;
};

describe('remarkAlerts', () => {
  it('turns a [!NOTE] quote into a labelled alert and drops the marker', () => {
    const alert = convert(quote('[!NOTE]\nI had this problem.'));
    expect(alert.data?.hProperties.className).toEqual(['alert', 'alert-note']);
    expect(alert.children[0]?.data?.hProperties.className).toEqual(['alert-title']);
    expect(alert.children[0]?.children[0]?.value).toBe('Note');
    expect(alert.children[1]?.children[0]?.value).toBe('I had this problem.');
  });

  it('is case-insensitive and supports every GitHub alert type', () => {
    for (const type of ['tip', 'IMPORTANT', 'Warning', 'caution']) {
      const alert = convert(quote(`[!${type}]\ntext`));
      expect(alert.data?.hProperties.className[1]).toBe(`alert-${type.toLowerCase()}`);
    }
  });

  it('removes the paragraph when the marker was alone on its line', () => {
    const alert = convert({
      type: 'root',
      children: [
        {
          type: 'blockquote',
          children: [
            { type: 'paragraph', children: [{ type: 'text', value: '[!TIP]' }] },
            { type: 'paragraph', children: [{ type: 'text', value: 'Body.' }] },
          ],
        },
      ],
    });
    expect(alert.children).toHaveLength(2);
    expect(alert.children[1]?.children[0]?.value).toBe('Body.');
  });

  it('leaves ordinary quotes and unknown markers alone', () => {
    expect(convert(quote('Just a quote.')).data).toBeUndefined();
    expect(convert(quote('[!SECRET]\nnope')).data).toBeUndefined();
  });
});
