import { cacheLife } from 'next/cache';
import { PostMarkdown } from './MarkdownElements';

export default async function CachedPostMarkdown({ content }: { content: string }) {
  'use cache';
  cacheLife('max');

  return <PostMarkdown content={content} />;
}
