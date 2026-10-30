export interface SearchDoc {
  url: string;
  title: string;
  description: string;
  tags: string[];
  categories: string[];
  lang: string;
  /** Plain text of the entry body. */
  text: string;
}

export interface Part {
  text: string;
  hit: boolean;
}

/**
 * Lower-case and drop Vietnamese diacritics one character at a time, so the result has the same
 * length as the input and match positions can be mapped back onto the original text.
 */
export function fold(s: string): string {
  let out = '';
  for (const ch of s) {
    if (ch === 'đ' || ch === 'Đ') {
      out += 'd';
      continue;
    }
    const base = ch.normalize('NFD').replace(/[̀-ͯ]/g, '');
    const lower = base.toLowerCase();
    out += lower.length === ch.length ? lower : ch;
  }
  return out;
}

const terms = (q: string) => fold(q).split(/\s+/).filter(Boolean);

/** Every term must appear somewhere; title and tags weigh more than the description and body. */
export function searchDocs(docs: SearchDoc[], query: string, limit = 8): SearchDoc[] {
  const t = terms(query);
  if (t.length === 0) return [];
  const scored: { doc: SearchDoc; score: number }[] = [];
  for (const doc of docs) {
    const title = fold(doc.title);
    const tags = fold([...doc.tags, ...doc.categories].join(' '));
    const desc = fold(doc.description);
    const body = fold(doc.text);
    let score = 0;
    let all = true;
    for (const term of t) {
      const s =
        (title.includes(term) ? 6 : 0) +
        (tags.includes(term) ? 4 : 0) +
        (desc.includes(term) ? 2 : 0) +
        (body.includes(term) ? 1 : 0);
      if (s === 0) {
        all = false;
        break;
      }
      score += s;
    }
    if (all) scored.push({ doc, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.doc);
}

/** A short passage around the first match in the body, or the description when it is not there. */
export function excerpt(doc: SearchDoc, query: string, radius = 70): string {
  const term = terms(query)[0];
  const i = term ? fold(doc.text).indexOf(term) : -1;
  if (i < 0) return doc.description;
  const start = Math.max(0, i - radius);
  const end = Math.min(doc.text.length, i + (term?.length ?? 0) + radius);
  return `${start > 0 ? '…' : ''}${doc.text.slice(start, end).trim()}${end < doc.text.length ? '…' : ''}`;
}

/** Split text into runs, marking the ones that match any search term. */
export function highlight(text: string, query: string): Part[] {
  const t = terms(query);
  if (t.length === 0) return [{ text, hit: false }];
  const folded = fold(text);
  const marked = new Array<boolean>(text.length).fill(false);
  for (const term of t) {
    let i = folded.indexOf(term);
    while (i !== -1) {
      for (let k = i; k < i + term.length; k++) marked[k] = true;
      i = folded.indexOf(term, i + term.length);
    }
  }
  const parts: Part[] = [];
  let cur = '';
  let state = false;
  for (let k = 0; k < text.length; k++) {
    if (marked[k] !== state && cur) {
      parts.push({ text: cur, hit: state });
      cur = '';
    }
    state = marked[k] ?? false;
    cur += text[k];
  }
  if (cur) parts.push({ text: cur, hit: state });
  return parts;
}

/** Markdown to searchable plain text: fences, markers and table pipes removed, capped in length. */
export function stripMarkdown(md: string, max = 4000): string {
  return md
    .replace(/```\w*/g, ' ')
    .replace(/[`*_>#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}
