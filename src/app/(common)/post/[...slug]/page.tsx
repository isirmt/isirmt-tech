import React, { cache } from 'react';
import '@/styles/post/style.css';
import { Metadata } from 'next';
import { BlogPosting, WithContext } from 'schema-dts';
import JsonLd from '@/components/JsonLd';
import ShareButtons from '@/components/ShareButtons';
import Article from '@/components/layout/ArticlePage';
import { Main, SideMDShown } from '@/components/layout/PageLayout';
import PostIndex from '@/components/post/PostIndex';
import { generateMetadataTemplate } from '@/lib/SEO';
import { getPost, getPostsProps } from '@/lib/getPosts';
import { author } from '@/static/constant';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const revalidate = 300;
export const dynamicParams = true;

const getFileContent = cache(async (path: string) => {
  const postPath = `${process.env.GIT_POSTS_DIR!}/${path}.md`;
  return await getPost(postPath);
});

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const posts = await getPostsProps();
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug.join('/'));
  const { data, excerpt } = await getFileContent(slug);

  return generateMetadataTemplate({
    title: `${data.title}`,
    description: `${excerpt}`,
    url: `/post/${params.slug.join('/')}`,
    imageURL: `/api/ogp-posts/${slug}`,
    keywords: data.tags,
    type: 'article',
  });
}

export default async function Post(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug.join('/'));
  const { data, content } = await getFileContent(slug);

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    datePublished: data.date ? new Date(data.date).toISOString() : undefined,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    keywords: data.tags,
  };

  return (
    <Main>
      <JsonLd jsonLd={jsonLd} />
      <SideMDShown>
        <PostIndex content={content} title={data.title} />
        <div className='p-3'>
          <div className='hidden md:block'>共有</div>
          <ShareButtons path={`/post/${slug}`} title={data.title} />
        </div>
      </SideMDShown>
      <Article data={data} content={content} slug={slug} />
    </Main>
  );
}
