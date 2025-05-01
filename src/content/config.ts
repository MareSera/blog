import { defineCollection, z } from 'astro:content';

// 文章集合配置
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
    cover: z.string().optional()
  })
});

// 说说集合配置
const moments = defineCollection({
  type: 'content',
  schema: z.object({
    mood: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(true)
  })
});

export const collections = {
  posts,
  moments
};
