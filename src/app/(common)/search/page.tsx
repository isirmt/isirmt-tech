import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SearchResult from '@/components/SearchResults';
import TipsCard from '@/components/TipsCard';
import { Main, Section, Side, Title } from '@/components/layout/PageLayout';
import { generateMetadataTemplate } from '@/lib/SEO';
import { getPostsProps } from '@/lib/getPosts';
import { siteName } from '@/static/constant';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export async function generateMetadata(props: { searchParams: Promise<{ [key: string]: string }> }): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const query = searchParams['q'] ?? '';
  const keywords = Array.from(
    new Set(
      decodeURIComponent(query)
        .split(/[\u0020\u3000]+/)
        .filter((keyword) => keyword !== ''),
    ),
  );

  return generateMetadataTemplate({
    title: `「${keywords?.join(' ')}」の検索結果`,
    description: `「${siteName}」内にあるタグや投稿の検索結果（${keywords?.join(' ')}）`,
    url: `/search?q=${searchParams['q']}`,
  });
}

export default async function SearchPage(props: { searchParams: Promise<{ [key: string]: string }> }) {
  const searchParams = await props.searchParams;
  const posts = await getPostsProps();
  const query = searchParams['q'] ?? '';
  const keywords = Array.from(
    new Set(
      decodeURIComponent(query)
        .split(/[\u0020\u3000]+/)
        .filter((keyword) => keyword !== ''),
    ),
  );

  if (keywords.length === 0) notFound();

  return (
    <Main>
      <Side>
        <TipsCard>検索はスペース区切りのAND検索です。</TipsCard>
      </Side>
      <Section>
        <Title>検索結果</Title>
        <SearchResult posts={posts} keywords={keywords} />
      </Section>
    </Main>
  );
}
