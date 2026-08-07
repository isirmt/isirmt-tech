import { Metadata } from 'next';
import TipsCard from '@/components/TipsCard';
import { Main, Section, Side, Title } from '@/components/layout/PageLayout';
import SeriesCard from '@/components/post/SeriesCard';
import { generateMetadataTemplate } from '@/lib/SEO';
import { getSeriesProps } from '@/lib/getPosts';
import { siteName } from '@/static/constant';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataTemplate({
    title: `シリーズ一覧`,
    description: `「${siteName}」内で投稿されているシリーズ`,
    url: `/series`,
  });
}

export default async function TagList() {
  const seriesNames = await getSeriesProps();

  return (
    <Main>
      <Side>
        <TipsCard>各シリーズごとに最初の記事を表示しています。</TipsCard>
      </Side>
      <Section>
        <Title>シリーズ一覧</Title>
        <div className='flex flex-col gap-4'>
          {seriesNames.map((slug, i) => {
            return <SeriesCard key={i} slug={slug} />;
          })}
        </div>
      </Section>
    </Main>
  );
}
