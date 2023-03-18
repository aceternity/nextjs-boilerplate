import AxoisClient from "@lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query"
import { OrganizationsData } from "@pages/api/organizations";
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { OrganizationFormValues } from "@components/forms/OrganizationForm/OrganizationForm";
import { toast } from "react-hot-toast";
import { queryClient } from "@pages/_app";
import { OrganizationSubscription } from "@pages/api/organizations/[id]/subscription";
import { OrganizationMembersData } from "@pages/api/organizations/[id]/members";
import { OrganizationInvitationsMembersData } from "@pages/api/organizations/[id]/invitations";

const useOrganzations = () => {
  const { data, isLoading, error } = useQuery(
    ["organizations"], 
    async () => {
      const { data }: AxiosResponse<OrganizationsData> = await AxoisClient.getInstance().get('api/organizations');
      return data;
    },
    {
      refetchOnWindowFocus: false
    }
  );

  return {
    data,
    isLoading,
    error,
  };
};


const useCreateOrganization = () => {
  const router = useRouter();
  const { mutateAsync, isLoading, error, status } = useMutation(
    async (data: OrganizationFormValues) => {
      return AxoisClient.getInstance().post('api/organizations', { ...data });
    }
  );

  const createOrganization = async (data: OrganizationFormValues) => {
    const promise = mutateAsync(data);
    toast.promise(promise, {
      loading: 'Please wait...',
      success: 'Organization created Successfully',
      error: (err) => `${err?.response?.data?.message || err || 'something went wrong!'}`,
    }).then(async (value) => {
      if (value.status === 200) {
        await queryClient.invalidateQueries(['organizations']);
      }
    }).catch(() => {
    });
  };

  return {
    createOrganization,
    isLoading,
    error,
    status,
  };
}

const useOrganizationSubscription = () => {
  const router = useRouter();
  const { query } = router;
  const { data, isLoading, error, status } = useQuery(
    [`${query.organizationId}_subscriptions`], 
    async () => {
      const { organizationId } = query;
      const { data }: AxiosResponse<OrganizationSubscription> = await AxoisClient.getInstance().get(`api/organizations/${organizationId}/subscription`);
      return data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    }
  );

  return {
    active: query.organizationId ? true: false,
    data,
    isLoading,
    error,
    status,
  };
};


export interface useOrganizationMembersProps {
  organizationId: string;
}
const useOrganizationMembers = ({ organizationId }: useOrganizationMembersProps) => {

  const { data, isLoading, error } = useQuery(
    [`${organizationId}_members`], 
    async () => {
      const { data }: AxiosResponse<OrganizationMembersData> = await AxoisClient.getInstance().get(
        `api/organizations/${organizationId}/members`
      );
      return data;
    },
    {
      refetchOnWindowFocus: false
    }
  );

  return {
    data,
    isLoading,
    error,
  };
};

export interface useOrganizationInvitationsMembersProps {
  organizationId: string;
}
const useOrganizationInvitationsMembers = ({ organizationId }: useOrganizationInvitationsMembersProps) => {

  const { data, isLoading, error } = useQuery(
    [`${organizationId}_invitations`], 
    async () => {
      const { data }: AxiosResponse<OrganizationInvitationsMembersData> = await AxoisClient.getInstance().get(
        `api/organizations/${organizationId}/invitaions`
      );
      return data;
    },
    {
      refetchOnWindowFocus: false
    }
  );

  return {
    data,
    isLoading,
    error,
  };
};


export {
  useOrganizationSubscription,
  useOrganzations,
  useCreateOrganization,
  useOrganizationMembers,
  useOrganizationInvitationsMembers,
};