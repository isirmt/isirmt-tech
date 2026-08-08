import { MetadataRoute } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { BLOG_INDEX_CACHE_TAG } from '@/lib/blogCache';
import { getPostsProps } from '@/lib/getPosts';
import { lastModified } from '@/static/constant';

const staticPaths = ['/post', '/profile', '/series', '/tags'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache';
  cacheLife({ revalidate: 1200 });
  cacheTag(BLOG_INDEX_CACHE_TAG);

  const posts = await getPostsProps();

  const baseURL = process.env.NEXT_PUBLIC_URL!;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseURL,
      priority: 1.0,
    },
  ];

  staticPaths.forEach((page) => {
    staticPages.push({
      url: baseURL + page,
      priority: 0.9,
    });
  });

  const dynamicPages: MetadataRoute.Sitemap = [];

  posts.forEach((post) => {
    dynamicPages.push({
      url: baseURL + '/post/' + post.slug,
      lastModified: post.data.date ? new Date(post.data.date) : lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    });
  });

  return [...staticPages, ...dynamicPages];
}
