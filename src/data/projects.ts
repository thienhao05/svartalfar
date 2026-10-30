import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Published projects, newest first. Drafts appear only in `astro dev`. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', (e) => !import.meta.env.PROD || !e.data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const statusLabels = {
  active: 'Active',
  done: 'Done',
  archived: 'Archived',
} as const;
