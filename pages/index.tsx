import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Next.js Serverless Boilerplate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Next.js Serverless Boilerplate</h1>
    </div>
  )
}

export default Home
