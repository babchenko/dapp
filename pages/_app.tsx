import type { AppProps } from 'next/app'

import 'semantic-ui-css/semantic.css';
import '../styles/globals.css'


function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
