import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { iconNames } from './config/icons';

export const knowledgeAreas = ['learning', 'experience', 'projects', 'personal'] as const;

const knowledge = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/knowledge' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      lang: z.enum(['vi', 'en']),
      area: z.enum(knowledgeAreas),
      categories: z.array(z.string()).default([]),
      /** A named series this entry belongs to, read in `seriesOrder` (else by date). */
      series: z.string().optional(),
      seriesOrder: z.number().int().optional(),
      tags: z.array(z.string()).default([]),
      /** Ids of related knowledge entries, e.g. "linux/permissions". */
      related: z.array(z.string()).default([]),
      heroImage: image().optional(),
      toc: z.boolean().default(true),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    status: z.enum(['active', 'done', 'archived']).default('active'),
    /** Icon shown on the project card. */
    icon: z.enum(iconNames).default('folder'),
    /** Technologies used, shown as small tags. */
    stack: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
});

export const collections = { knowledge, projects };
