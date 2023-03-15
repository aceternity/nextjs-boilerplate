import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app'

import type { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react'

import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Role } from '@prisma/client';
import AuthGuard from '@components/AuthGuard';

export type NextPageWithProps<P = {}, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean,
  roles?: Role[] | undefined;
};

export type AppPropsWithExtra<P> = AppProps<P> & { 
  Component: NextPageWithProps<P>; 
};


const queryClient = new QueryClient();


const App = ({ Component, pageProps }: AppPropsWithExtra<{ session: Session; }>) => {
  const { session } = pageProps;
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        {Component.requireAuth ? (
            <AuthGuard roles={Component.roles}>
              <Component {...pageProps} />
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
