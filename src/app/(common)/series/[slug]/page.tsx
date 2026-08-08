import { cache } from 'react';
import React from 'react';
import { Metadata } from 'next';
import TipsCard from '@/components/TipsCard';
import { ExplainingBanner } from '@/components/UserBanner';
import { Main, Section, Side, Title } from '@/components/layout/PageLayout';
import FeedButton from '@/components/post/FeedButton';
import PostPaging from '@/components/post/PostPaging';
import { generateMetadataTemplate } from '@/lib/SEO';
import { getSeries } from '@/lib/getPosts';
import { siteName } from '@/static/constant';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const getContents = cache(async (slug: string) => {
  return getSeries(slug);
});

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);
  const series = await getContents(slug);

  return {
    ...generateMetadataTemplate({
      title: `「${series.meta.name}」シリーズの投稿一覧`,
      description: `${series.meta.description ? series.meta.description : `「${siteName}」内の「${slug}」シリーズの投稿一覧`}`,
      url: `/series/${params.slug}`,
    }),
    icons: {
      other: [
        {
          url: `/series/${params.slug}/feed`,
          rel: 'alternate',
          type: 'application/atom+xml',
        },
      ],
    },
  };
}

export default async function PostListWithTag(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);
  const series = await getContents(slug);

  const posts = series.posts;

  return (
    <Main>
      <Side>
        <TipsCard>シリーズはナンバリングされており、後ろに日付順、日付なしで並んでいます。</TipsCard>
        <TipsCard>タグをクリックすると「タグ検索」が可能です。</TipsCard>
      </Side>
      <Section>
        <Title>
          <span className='flex flex-wrap items-center'>
            <span className='mr-3 rounded-md bg-slate-200 px-1.5 py-1 align-middle text-base transition-colors dark:bg-slate-700'>
              シリーズ
            </span>
            <span>
              {series.meta.name}
              <FeedButton url={`/series/${params.slug}/feed`} />
            </span>
          </span>
        </Title>
        {series.meta.description ? (
          <div className='my-3 bg-slate-100 p-2 text-gray-800 transition-colors dark:bg-slate-700 dark:text-slate-400'>
            {series.meta.description}
          </div>
        ) : (
          <></>
        )}
        {posts.length > 0 ? (
          <PostPaging posts={posts} useIndex useRouting postsPerPage={20} />
        ) : (
          <ExplainingBanner>シリーズ「{series.meta.name}」の投稿は見つかりませんでした。</ExplainingBanner>
        )}
      </Section>
    </Main>
  );
}
