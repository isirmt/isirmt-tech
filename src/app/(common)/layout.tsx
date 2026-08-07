import '@/styles/globals.css';
import * as React from 'react';
import NextTopLoader from 'nextjs-toploader';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Menu from '@/components/layout/Menu';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NextTopLoader
        color='#3B82F6'
        template='<div style="height: .15rem;" class="bar" role="bar"><div class="peg"></div></div> 
                    <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        shadow={false}
        showSpinner={false}
        zIndex={100}
      />
      <Header />
      <div className='justify-center bg-gray-100 transition-colors dark:bg-slate-900 md:flex'>
        <Menu />
        {children}
      </div>
      <Footer />
    </>
  );
}
