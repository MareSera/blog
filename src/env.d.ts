/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
      post: {
        id: string;
        slug: string;
        rawBody: () => string;
        data: {
          title: string;
          pubDate: Date;
          description: string;
          tags: string[];
          cover?: string;
        };
      };
    }
  }
  