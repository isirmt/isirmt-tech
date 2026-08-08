import '@/styles/globals.css';
import * as React from 'react';
import NextTopLoader from 'nextjs-toploader';
import DashboardMenu from '@/components/layout/DashboardMenu';
import Header from '@/components/layout/Header';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className='relative flex min-h-svh flex-col bg-white'>
      <NextTopLoader
        color='#3B82F6'
        template='<div style="height: .15rem;" class="bar" role="bar"><div class="peg"></div></div> 
                    <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        shadow={false}
        showSpinner={false}
        zIndex={100}
      />
      <Header />
      <div className='flex-grow justify-center bg-white transition-colors dark:bg-slate-900 sm:flex'>
        <DashboardMenu />
        <div className='flex-1'>{children}</div>
      </div>
    </div>
  );
}
