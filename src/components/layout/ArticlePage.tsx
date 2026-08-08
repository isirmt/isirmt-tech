import React, { Suspense } from 'react';
import '@/styles/post/style.css';
import Image from 'next/image';
import Link from 'next/link';
import DateCard from '@/components/post/DateCard';
import TagBanner from '@/components/tag/TagBanner';
import { getCommentList } from '@/lib/commentIssueManager';
import { getSeries } from '@/lib/getPosts';
import { PostData } from '@/static/postType';
import LoadingCircle from '../LoadingCircle';
import { ExplainingBanner } from '../UserBanner';
import CachedPostMarkdown from '../post/CachedPostMarkdown';
import { CommentForm, CommentFormNoPosting } from '../post/CommentForm';
import SeriesCard from '../post/SeriesCard';

export default async function Article({ data, content, slug }: { data: PostData; content: string; slug?: string }) {
  const series = data.series ? await getSeries(data.series) : undefined;
  const issue = slug ? await getCommentList(slug) : undefined;

  return (
    <article className='relative mx-auto w-full overflow-clip rounded-3xl bg-white transition-colors dark:bg-slate-800 md:w-[34rem] lg:w-[44rem] xl:m-0'>
      {slug && (
        <div className='relative flex h-[calc(100vw_*_9_/_16_*_0.75)] w-full select-none items-center justify-center overflow-hidden md:h-[calc(34rem_*_9_/_16_*_0.6)] lg:h-[calc(44rem_*_9_/_16_*_0.5)]'>
          <Image loading='lazy' alt={data.title} width={1200} height={630} src={`/api/ogp-posts/${slug}`} />
        </div>
      )}
      <div className='w-full p-8'>
        <div className='mb-2 flex flex-col justify-start md:flex-row md:items-center'>
          <DateCard date={data.date} />
          <h1 className='my-4 text-3xl transition-colors dark:text-white'>{data.title}</h1>
        </div>
        <div className='flex flex-wrap gap-4 text-sm text-gray-600 transition-colors dark:text-slate-500'>
          {issue && !issue.locked ? (
            <Link href='#user-comments' className='underline'>
              <span className='i-tabler-bubble-filled mr-2 size-4 bg-gray-600 transition-colors dark:bg-slate-500' />
              コメント: {issue.comments.length}件
            </Link>
          ) : (
            <></>
          )}
        </div>
        {data.tags ? (
          <div className='ml-3 mt-4 flex flex-wrap gap-3'>
            {data.tags?.map((tag, i) => <TagBanner tag={tag} key={i} />)}
          </div>
        ) : (
          <></>
        )}
        {series && data.series && slug ? (
          <div className='mt-5'>
            <SeriesCard slug={data.series} index={series.posts.findIndex((item) => item.slug === slug)} />
          </div>
        ) : (
          <></>
        )}
        <CachedPostMarkdown content={content} />
        <Suspense fallback={<LoadingCircle />}>
          {issue && slug ? (
            issue.state === 'closed' ? (
              <ExplainingBanner>コメントは無効です</ExplainingBanner>
            ) : issue.locked ? (
              <CommentFormNoPosting comments={issue.comments} />
            ) : (
              <CommentForm initialComments={issue.comments} slug={slug} />
            )
          ) : (
            <></>
          )}
        </Suspense>
      </div>
    </article>
  );
}
