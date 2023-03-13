import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app'

import type { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react'

import '../styles/globals.css'

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<P> = AppProps<P> & { 
    Component: NextPageWithLayout<P>; 
}; 


const App = ({ Component, pageProps }: AppPropsWithLayout<{ session: Session; }>) => {
  const { session } = pageProps;
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;
