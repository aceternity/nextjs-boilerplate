import React from 'react'

import { NextPage } from 'next';
import { Button } from '@components/elements';
import { useRouter } from 'next/router';

const Dashboard: NextPage = () => {
  const router = useRouter();
  return (
    <div className='flex justify-center h-screen flex-col gap-10 items-center'>
      <span className='text-3xl text-red-500 font-bold'>403 - Access Denied</span>
      <div><Button onClick={() => router.replace('/dashboard')}>GO Back</Button></div>
    </div>
  )
}

export default Dashboard;
