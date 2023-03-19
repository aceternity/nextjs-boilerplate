import React, { useEffect } from 'react'
import { useRouter } from 'next/router';
import { Role } from '@prisma/client';
import { NextPageWithProps } from '@pages/_app';
import jsonwebtoken from 'jsonwebtoken';
import { useAcceptInvitation } from '@hooks/query/organizations';
import { Button } from '@components/elements';
import Flex from '@components/Flex';

const OrganizationInvitation: NextPageWithProps = () => {
  const router = useRouter();
  const { query } = router;

  const token: string = query.token as string;

  const { accept } = useAcceptInvitation({ token });

  useEffect(() => {
    if (!router.isReady) return;
    const { query } = router;
    if (query && !query.token) {
      router.replace('/dashboard');
      return;
    }
  }, [router.isReady]);

  return (
    <Flex classes='h-screen w-screen' justifyContent='center' alignItems='center'>
      <Button onClick={accept}>Accept Invitation</Button>
    </Flex>
  )
}

OrganizationInvitation.requireAuth = true;
OrganizationInvitation.roles = [Role.customer];
export default OrganizationInvitation;
