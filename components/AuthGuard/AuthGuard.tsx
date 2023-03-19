import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

export const getLogoutCallbackUrl = (role: string) => {
  switch (role) {
    case Role.superadmin:
      return "/";
    case Role.customer:
      return "/";
    default:
      return "/";
  }
};

interface AuthGuardProps {
  children: JSX.Element | JSX.Element[];
  roles: Role[] | undefined;
}

const AuthGuard: React.FC<AuthGuardProps> = (props: AuthGuardProps) => {
  const { children, roles } = props;
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <h1>Loading...</h1>;
  }


  if (status === 'unauthenticated') {
    router.replace(`/auth/register?redirect=${router.asPath}`);
    return <></>;
  }
  
  if (status === 'authenticated') {
    const { role: currentUserRole } = session?.user;
    if (!roles) return <>{children}</>;

    if (roles && roles.includes(currentUserRole as Role)) {
      return <>{children}</>;
    } else {
      router.replace("/403");
    }
  }

  return <></>;
};

AuthGuard.defaultProps = {

};

AuthGuard.propTypes = {

};

export default AuthGuard;
