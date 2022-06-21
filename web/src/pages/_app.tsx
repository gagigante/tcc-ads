import type { AppProps } from 'next/app'

import { AppProvider } from '../contexts'

import '../styles/globals.scss'

function MyApp({ Component, pageProps }: any) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  )
}

export default MyApp
