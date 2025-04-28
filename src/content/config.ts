import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content', // 必须明确指定类型
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
    cover: z.string().optional()
  })
});

export const collections = { posts };
