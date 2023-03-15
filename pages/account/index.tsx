import { MainLayout, Tabs } from '@components/index';
import { TabItem } from '@components/Tabs/Tab';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const UserAccount = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/account/profile');
  }, []);
  return (
    <MainLayout>
    </MainLayout>
  )
}

export default UserAccount;
