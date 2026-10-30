import type { APIRoute } from 'astro';
import { getKnowledge } from '../data/knowledge';
import { getProjects } from '../data/projects';
import { stripMarkdown, type SearchDoc } from '../utils/search';
import { withBase } from '../utils/url';

/** Lightweight index the search dialog falls back to when Pagefind has not been built (dev). */
export const GET: APIRoute = async () => {
  const [entries, projects] = await Promise.all([getKnowledge(), getProjects()]);
  const docs: SearchDoc[] = entries.map((e) => ({
    url: withBase(`/knowledge/${e.id}/`),
    title: e.data.title,
    description: e.data.description,
    tags: e.data.tags,
    categories: e.data.categories,
    lang: e.data.lang,
    text: stripMarkdown(e.body ?? ''),
  }));
  docs.push(
    ...projects.map((p) => ({
      url: withBase(`/projects/${p.id}/`),
      title: p.data.title,
      description: p.data.description,
      tags: p.data.stack,
      categories: ['Projects'],
      lang: 'en',
      text: stripMarkdown(p.body ?? ''),
    })),
  );
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } });
};
