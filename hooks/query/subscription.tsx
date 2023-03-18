import AxoisClient from "@lib/axios";
import { useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios";

import { UserSubscription } from "@pages/api/subscription";
import { ManageBillingData } from "@pages/api/subscription/manage";
import { useRouter } from "next/router";

const useSubscription = () => {
  const router = useRouter();

  
  const { data, isLoading, error, status } = useQuery(
    ["subscriptions"], 
    async () => {
      const { query } = router;
      
      const { data }: AxiosResponse<UserSubscription> = await AxoisClient.getInstance().get(`api/subscription`);

      return data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    }
  );

  return {
    data,
    isLoading,
    error,
    status,
  };
};

const useUserManageSubscriptionBilling = () => {
  const router = useRouter();
  const { data, isLoading, error, status, refetch } = useQuery(
    ["manageBilling"], 
    async () => {
      const { data }: AxiosResponse<ManageBillingData> = await AxoisClient.getInstance().get('api/subscription/manage');
      return data.url;
    },
    {
      initialData: null,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    }
  );

  const openBilling = async () => {
    const data = await refetch();
    
    if (data.data) router.replace(data.data);
  }

  return {
    data,
    isLoading,
    error,
    status,
    openBilling
  };
}

export {
  useSubscription,
  useUserManageSubscriptionBilling
};