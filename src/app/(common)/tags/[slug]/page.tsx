import { Metadata } from 'next';
import TipsCard from '@/components/TipsCard';
import { ExplainingBanner } from '@/components/UserBanner';
import { Main, Section, Side, Title } from '@/components/layout/PageLayout';
import FeedButton from '@/components/post/FeedButton';
import PostPaging from '@/components/post/PostPaging';
import SubscribeTagButton from '@/components/tag/SubscribeTagButton';
import { generateMetadataTemplate } from '@/lib/SEO';
import { getPostsProps } from '@/lib/getPosts';
import { siteName } from '@/static/constant';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);

  return {
    ...generateMetadataTemplate({
      title: `タグ「${slug}」の投稿一覧`,
      description: `「${siteName}」内のタグ「${slug}」が付いた投稿一覧`,
      url: `/tags/${params.slug}`,
    }),
    icons: {
      other: [
        {
          url: `/tags/${params.slug}/feed`,
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
  const posts = await getPostsProps();
  const filteredPosts = posts.filter((post) => (post.data.tags ? post.data.tags.some((tag) => tag === slug) : false));

  return (
    <Main>
      <Side>
        <TipsCard>メニューバーに登録する場合は「お気に入り登録」を押します。</TipsCard>
      </Side>
      <Section>
        <Title>
          タグ「#{slug}」の投稿一覧
          <FeedButton url={`/tags/${params.slug}/feed`} />
        </Title>
        {filteredPosts.length > 0 ? (
          <>
            <SubscribeTagButton tag={slug} />
            <PostPaging posts={filteredPosts} useRouting />
          </>
        ) : (
          <ExplainingBanner>タグ「#{slug}」の投稿は見つかりませんでした。</ExplainingBanner>
        )}
      </Section>
    </Main>
  );
}
