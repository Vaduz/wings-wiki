import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Script from 'next/script'
import AuthenticatedComponent from '../components/global/AuthenticatedComponent'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <AuthenticatedComponent>
          <Component {...pageProps} />
        </AuthenticatedComponent>
      </SessionProvider>
    </>
  )
}
