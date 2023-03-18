import React from 'react';
import { SUBSCRIPTION_PLAN } from '@lib/payments/constants';
import { useSubscription } from '@hooks/query/subscription';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Role } from '@prisma/client';

interface SubscriptionGuardProps {
  children: JSX.Element | JSX.Element[];
  plans: SUBSCRIPTION_PLAN[] | undefined;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = (props: SubscriptionGuardProps) => {
  const { children, plans } = props;
  const { data, status } = useSubscription();
  const { data: session } = useSession();
  const router = useRouter();
  

  if (status === 'loading') {
    return <h1>Loading...</h1>;
  }

  if (status === 'error') {
    return <>Error loading subscriptions</>;
  }
  
  if (!data) {
    return <>{children}</>;
  }

  if (!plans) return <>{children}</>;

  if (!data.subscription)  {
    router.replace("/pricing");
    return <></>;
  }

  const { product } = data.subscription;
  if (plans.some((plan) => plan?.includes(product.uniqueIdentifier))) {
    return <>{children}</>;
  } else {
    if (session?.user.role === Role.superadmin) {
      return <>{children}</>;
    }
    router.replace("/pricing");
    return <></>;
  }
};


SubscriptionGuard.defaultProps = {

};

SubscriptionGuard.propTypes = {

};

export default SubscriptionGuard;
