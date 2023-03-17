import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app'

import type { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react'

import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Role } from '@prisma/client';
import AuthGuard from '@components/AuthGuard';
import { Toaster } from 'react-hot-toast';

import { SUBSCRIPTION_PLAN } from '@lib/payments/constants';
import SubscriptionGuard from '@components/SubscriptionGuard';

export type NextPageWithProps<P = {}, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean,
  roles?: Role[] | undefined;

  requireSubscription?: boolean;
  plans?: SUBSCRIPTION_PLAN[]
};

export type AppPropsWithExtra<P> = AppProps<P> & { 
  Component: NextPageWithProps<P>; 
};

export const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppPropsWithExtra<{ session: Session; }>) => {
  const { session } = pageProps;
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        {Component.requireAuth ? (
            <AuthGuard roles={Component.roles}>
              {Component.requireSubscription ? (
                <SubscriptionGuard plans={Component.plans}>
                  <Component {...pageProps} />
                </SubscriptionGuard>
                ): (
                <Component {...pageProps} />
              )}
            </AuthGuard>
          ) : (
            <Component {...pageProps} />
          )}
          <Toaster />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
