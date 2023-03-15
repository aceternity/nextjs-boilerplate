import { MainLayout, Tabs } from '@components/index';
import { TabItem } from '@components/Tabs/Tab';
import { NextPageWithProps } from '@pages/_app';
import { Role } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const UserAccount: NextPageWithProps = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/account/profile');
  }, []);
  return (
    <MainLayout>
    </MainLayout>
  )
}
UserAccount.requireAuth = true;
UserAccount.roles = [
  Role.customer,
  Role.superadmin
];
export default UserAccount;
