import PostCard from '@/components/post/PostCard';
import SubscribeTagButton from '@/components/tag/SubscribeTagButton';
import TipsCard from '@/components/TipsCard';
import { getPostsProps } from '@/lib/getPosts';
import { Main, Section, Side, Title } from '@/components/layout/PageLayout';
import { Metadata } from 'next';
import { generateMetadataTemplate } from '@/lib/SEO';
import { siteName } from '@/static/constant';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);

  return generateMetadataTemplate({
    title: `タグ「${slug}」の投稿一覧`,
    description: `「${siteName}」内のタグ「${slug}」が付いた投稿一覧`,
    url: `/tags/${params.slug}`
  });
}

export default async function PostListWithTag({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const posts = await getPostsProps();
  const filteredPosts = posts.filter((post) => post.data.tags ? post.data.tags.some((tag) => tag === slug) : false);

  return <Main>
    <Side>
      <TipsCard>メニューバーに登録する場合は「お気に入り登録」を押します。</TipsCard>
    </Side>
    <Section>
      <Title>タグ「#{slug}」の投稿一覧</Title>
      <SubscribeTagButton tag={slug} />
      <div className='flex flex-col gap-y-3'>
        {filteredPosts.map((post, i) => <PostCard post={post} key={i} />)}
      </div>
    </Section>
  </Main>
}