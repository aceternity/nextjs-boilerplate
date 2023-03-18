import React, { useState } from 'react';

import { usePlans } from '@hooks/query/plans';
import AxoisClient from '@lib/axios';
import { CheckoutBody, CheckoutData } from '@pages/api/checkout';
import { AxiosResponse } from 'axios';
import getStripe from '@lib/payments/stripe';
import PricingTable from '@components/PricingTable';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SUBSCRIPTION_PLAN } from '@lib/payments/constants';
import DialogComponent from '@components/DialogComponent';
import { OrganizationForm } from '@components/forms';
import { OrganizationFormValues } from '@components/forms/OrganizationForm/OrganizationForm';

interface PricingComponentProps {
  isOrganization?: boolean;
}

const PricingComponent: React.FC<PricingComponentProps> = (props: PricingComponentProps) => {
  const { isOrganization } = props;
  const { isLoading, data } = usePlans({ isOrganization });
  const { data: authSession } = useSession();
  const router = useRouter();

  const [selectedPriceId, setSelectedPriceId] = useState<string | undefined>(undefined);
  const [organizationFormDialogOpen, setOrganizationFormDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const onClickSubscribe = async (priceId: string | undefined, uniqueIdentifier: string) => {

    if (!authSession) {
      router.replace('/auth/login?redirect=/pricing');
      return;
    }
    
    if (uniqueIdentifier  === SUBSCRIPTION_PLAN.TEAMS) {
      setSelectedPriceId(priceId);
      setOrganizationFormDialogOpen(true);
      return;
    }
  
    await proceedToCheckout(priceId);
  }

  const proceedToCheckout = async (priceId: string | undefined, organizationValues?: OrganizationFormValues | undefined) => {

    const requestObject: CheckoutBody  = {
      priceId,
      organization: organizationValues,
    };

    const { data: { session } }: AxiosResponse<CheckoutData> = await AxoisClient.getInstance().post('api/checkout', requestObject);

    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: session.id,
    });
  }

  const onOrganizationFromOpenChange = (value: boolean) => {
    setOrganizationFormDialogOpen(value);
  }

  const onSubmit = (values: OrganizationFormValues) => {
    setLoading(true);
    proceedToCheckout(selectedPriceId, values);
  }

  return (
    <div>
      <DialogComponent open={organizationFormDialogOpen} onOpenChange={onOrganizationFromOpenChange} buttonText={null}>
        <OrganizationForm submitLabel={'Save & Proceed'} onSubmit={onSubmit} loading={loading} />
      </DialogComponent>
      {isLoading && <>Loading...</>}
      {data && <PricingTable onClickSubscribe={onClickSubscribe} data={data.plans} />}
    </div>
  );
};

PricingComponent.defaultProps = {

};

PricingComponent.propTypes = {

};

export default PricingComponent;
