import { cacheLife, cacheTag } from 'next/cache';
import Rss from 'rss';
import { BLOG_INDEX_CACHE_TAG } from '@/lib/blogCache';
import { getPostsProps } from '@/lib/getPosts';
import { siteName } from '@/static/constant';
import { lastModified } from '@/static/constant';

const baseURL = process.env.NEXT_PUBLIC_URL!;
const feedRevalidateSeconds = 1200;

async function getFeedXml() {
  'use cache';
  cacheLife({ revalidate: feedRevalidateSeconds });
  cacheTag(BLOG_INDEX_CACHE_TAG);

  const feed = new Rss({
    title: `${siteName}の新着投稿`,
    description: `「${siteName}」の投稿フィード`,
    feed_url: `${baseURL}/feed`,
    site_url: baseURL,
    language: 'ja',
  });

  const posts = await getPostsProps();

  posts.forEach((post) =>
    feed.item({
      title: post.data.title,
      description: post.excerpt,
      url: `${baseURL}/post/${encodeURIComponent(post.slug)}`,
      date: post.data.date ? new Date(post.data.date).toISOString() : new Date(lastModified).toISOString(),
    }),
  );

  return feed.xml();
}

export async function GET() {
  const feedXml = await getFeedXml();

  return new Response(feedXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `s-maxage=${feedRevalidateSeconds}, stale-while-revalidate`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
