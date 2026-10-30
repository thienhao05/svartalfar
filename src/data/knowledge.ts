import { getCollection, type CollectionEntry } from 'astro:content';
import { byDateDesc, isPublished } from '../utils/content';

export type Knowledge = CollectionEntry<'knowledge'>;

/** Published knowledge entries, newest first. Drafts appear only in `astro dev`. */
export async function getKnowledge(): Promise<Knowledge[]> {
  return byDateDesc(await getCollection('knowledge', (e) => isPublished(e)));
}

export const areaLabels = {
  learning: 'Learning',
  experience: 'Experience',
  projects: 'Projects',
  personal: 'Personal',
} as const;

export const areaNotes = {
  learning: 'Concepts, study notes and the fundamentals behind the tools.',
  experience: 'What work taught: problems met, how they were solved, what stuck.',
  projects: 'Builds and experiments, with the decisions behind them.',
  personal: 'Learning methods, roadmaps and reflections.',
} as const;
