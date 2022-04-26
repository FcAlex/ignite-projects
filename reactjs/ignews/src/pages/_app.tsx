import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import React from 'react';
import { Header } from '../components/Header';
import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={ pageProps.session }>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
