import { Button } from '@components/elements';
import { useUserManageSubscriptionBilling, useSubscription } from '@hooks/query/subscription';
import { getPrice } from '@utils/pricing';
import React from 'react';
import PricingComponent from '@components/PricingComponent';
import { useOrganizationSubscription } from '@hooks/query/organizations';

interface CurrentPlanCardProps {
  isOrganization?: boolean;
}

const CurrentPlanCard: React.FC<CurrentPlanCardProps> = (props: CurrentPlanCardProps) => {

  const { isOrganization } = props;

  const { openBilling, isLoading: apiLoading } = useUserManageSubscriptionBilling();
  const { data: subscriptionData, isLoading } = isOrganization ? useOrganizationSubscription():  useSubscription();

  if (isLoading) {
    return <>Please wait...</>;
  }
  
  if (!subscriptionData || !subscriptionData.subscription) {
    return <PricingComponent isOrganization />
  }
  const { subscription } = subscriptionData;

  return (
    <>
    <div className='flex justify-between shadow flex-col md:flex-row gap-2 border max-w-lg p-4'>
      <div className='flex flex-col gap-2'>
        <span className='text-sm'>Active Plan: </span>
        <div className='flex flex-col bg-cyan-100 px-10 py-2'>
          {subscription.product.name}
          <div className='text-xs'>
            {getPrice(subscription.price && subscription.price.unitAmount || 0, subscription.price.currency)}/
          {subscription.price.interval_count && subscription.price.interval_count > 1 ? 
          subscription.price.interval_count: '' } {subscription.price.interval}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <Button size="sm" onClick={() => openBilling()} disabled={apiLoading}>Manage Billing</Button>
      </div>
    </div>
    </>
  )
};

CurrentPlanCard.defaultProps = {

};

CurrentPlanCard.propTypes = {

};

export default CurrentPlanCard;
