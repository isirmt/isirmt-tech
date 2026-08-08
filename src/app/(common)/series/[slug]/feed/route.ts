import { cacheLife, cacheTag } from 'next/cache';
import { NextRequest } from 'next/server';
import Rss from 'rss';
import { BLOG_INDEX_CACHE_TAG, getBlogSeriesCacheTag } from '@/lib/blogCache';
import { getSeries } from '@/lib/getPosts';
import { siteName } from '@/static/constant';
import { lastModified } from '@/static/constant';

const baseURL = process.env.NEXT_PUBLIC_URL!;
const feedRevalidateSeconds = 1200;

async function getFeedXml(slug: string, encodedSlug: string) {
  'use cache';
  cacheLife({ revalidate: feedRevalidateSeconds });
  cacheTag(BLOG_INDEX_CACHE_TAG, getBlogSeriesCacheTag(slug));

  const seriesPosts = await getSeries(slug);

  const feed = new Rss({
    title: `${siteName}のシリーズ「${seriesPosts.meta.name}」の新着投稿`,
    description: `「${siteName}」のシリーズ${seriesPosts.meta.description ? ': ' + seriesPosts.meta.description : ''}`,
    feed_url: `${baseURL}/series/${encodedSlug}/feed`,
    site_url: baseURL,
    language: 'ja',
  });

  seriesPosts.posts.forEach((post) =>
    feed.item({
      title: post.data.title,
      description: post.excerpt,
      url: `${baseURL}/post/${encodeURIComponent(post.slug)}`,
      date: post.data.date ? new Date(post.data.date).toISOString() : new Date(lastModified).toISOString(),
    }),
  );

  return feed.xml();
}

export async function GET(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug: encodedSlug } = await context.params;
  const slug = decodeURIComponent(encodedSlug);
  const feedXml = await getFeedXml(slug, encodedSlug);

  return new Response(feedXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `s-maxage=${feedRevalidateSeconds}, stale-while-revalidate`,
    },
  });
}
