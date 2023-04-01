import AxoisClient from "@lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { queryClient } from "@pages/_app";

import { OrganizationsData } from "@pages/api/organizations";
import { OrganizationSubscription } from "@pages/api/organizations/[id]/subscription";
import { OrganizationMembersData } from "@pages/api/organizations/[id]/members";
import { OrganizationInvitationsMembersData } from "@pages/api/organizations/[id]/invitations";
import { OrganizationMemberData } from "@pages/api/organizations/[id]/member";

import { OrganizationFormValues } from "@components/forms/OrganizationForm/OrganizationForm";
import { OrganizationMemberInviteFormValues } from "@components/forms/OrganizationMemberInviteForm/OrganizationMemberInviteForm";
import { UseFormReturn } from "react-hook-form";

const useOrganizations = () => {
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

  const createOrganization = async (data: OrganizationFormValues,  setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    const promise = mutateAsync(data);
    toast.promise(promise, {
      loading: 'Please wait...',
      success: 'Organization created Successfully',
      error: (err) => `${err?.response?.data?.message || err || 'something went wrong!'}`,
    }).then(async (value) => {
      if (value.status === 200) {
        await queryClient.invalidateQueries(['organizations']);
        setOpen(false);
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

export interface useOrganizationSubscriptionProps {
  organizationId: string;
}
const useOrganizationSubscription = ({ organizationId }: useOrganizationSubscriptionProps) => {
  const { data, isLoading, error, status } = useQuery(
    [`${organizationId}_subscriptions`], 
    async () => {
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
    active: organizationId ? true: false,
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
        `api/organizations/${organizationId}/invitations`
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

export interface useInviteMemberToOrganizationProps {
  organizationId: string;
}
const useInviteMemberToOrganization = ({ organizationId }: useInviteMemberToOrganizationProps) => {
  const { mutateAsync, isLoading, error, status } = useMutation(
    async (data: OrganizationMemberInviteFormValues) => {
      return AxoisClient.getInstance().post(`api/organizations/${organizationId}/invitations/send`, { ...data });
    }
  );

  const invite = async (
    data: OrganizationMemberInviteFormValues,
    formInstance: UseFormReturn<OrganizationMemberInviteFormValues, any>,
    setInviteForm: React.Dispatch<React.SetStateAction<boolean>> | undefined
    ) => {
    const promise = mutateAsync(data);
    toast.promise(promise, {
      loading: 'Please wait...',
      success: 'Member invited Successfully',
      error: (err) => `${err?.response?.data?.message || err || 'something went wrong!'}`,
    }).then(async (value) => {
      if (value.status === 200) {
        setInviteForm && setInviteForm(false);
        formInstance.reset();
        await queryClient.invalidateQueries([`${organizationId}_invitations`]);
      }
    }).catch(() => {
    });
  };

  return {
    invite,
    isLoading,
    error,
    status,
  };
}

export interface useCancelMemberInvitationProps {
  organizationId: string;
}

interface CancelInvitation {
  invitationId: string;
}

const useCancelMemberInvitation = ({ organizationId }: useCancelMemberInvitationProps) => {

  const { mutateAsync, isLoading: isCancelLoading, error, status } = useMutation(
    async (data: CancelInvitation) => {
      return AxoisClient.getInstance().post(`api/organizations/${organizationId}/invitations/cancel`, { ...data });
    }
  );

  const cancelInvitation = async (data: CancelInvitation) => {
    const promise = mutateAsync(data);
    toast.promise(promise, {
      loading: 'Please wait...',
      success: 'Member inivitation canceled Successfully',
      error: (err) => `${err?.response?.data?.message || err || 'something went wrong!'}`,
    }).then(async (value) => {
      if (value.status === 200) {
        await queryClient.invalidateQueries([`${organizationId}_invitations`]);
      }
    }).catch(() => {
    });
  };

  return {
    cancelInvitation,
    isCancelLoading,
    error,
    status,
  };
}

export interface useAcceptInvitationProps {
  token: string;
}
const useAcceptInvitation = ({ token }: useAcceptInvitationProps) => {
  const router = useRouter();
  const { mutateAsync, isLoading, error, status } = useMutation(
    async () => {
      return AxoisClient.getInstance().post(`api/invitations/accept`, { token });
    }
  );

  const accept = async () => {
    const promise = mutateAsync();
    toast.promise(promise, {
      loading: 'Please wait...',
      success: 'Member invited Successfully',
      error: (err) => `${err?.response?.data?.message || err || 'something went wrong!'}`,
    }).then(async (value) => {
      if (value.status === 200) {
        const { organizationId } = value.data;
        router.replace(`/organizations/${organizationId}/`);
      }
    }).catch(() => {
      router.replace(`/dashboard`);
    });
  };

  return {
    accept,
    isLoading,
    error,
    status,
  };
}

export interface useOrganizationMemberProps {
  organizationId: string;
}
const useOrganizationMember = ({ organizationId }: useOrganizationSubscriptionProps) => {
  const { data, isLoading, error, status } = useQuery(
    [`${organizationId}_currentmember`], 
    async () => {
      const { data }: AxiosResponse<OrganizationMemberData> = 
      await AxoisClient.getInstance().get(`api/organizations/${organizationId}/member`);
      return data.data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    }
  );

  return {
    active: organizationId ? true: false,
    data,
    isLoading,
    error,
    status,
  };
};

export interface useRemoveOrganizationMemberProps {
  organizationId: string;
  memberId: string;
}
const useRemoveOrganizationMember = ({ organizationId, memberId }: useRemoveOrganizationMemberProps) => {
  const router = useRouter();
  const { mutateAsync, isLoading, error, status } = useMutation(
    async () => {
      return AxoisClient.getInstance().delete(`api/organizations/${organizationId}/members/${memberId}`);
    }
  );

  const remove = async () => {
    const promise = mutateAsync();
    toast.promise(promise, {
      loading: 'Please wait...',
      success: 'Member deleted Successfully',
      error: (err) => `${err?.response?.data?.message || err || 'something went wrong!'}`,
    }).then(async (value) => {
      if (value.status === 200) {
        await queryClient.invalidateQueries([`${organizationId}_members`]);
      }
    }).catch(() => {
      router.replace(`/dashboard`);
    });
  };

  return {
    remove,
    isLoading,
    error,
    status,
  };
};

export {
  useOrganizationSubscription,
  useOrganizations,
  useCreateOrganization,
  useOrganizationMembers,
  useOrganizationInvitationsMembers,
  useInviteMemberToOrganization,
  useAcceptInvitation,
  useOrganizationMember,
  useCancelMemberInvitation,
  useRemoveOrganizationMember,
};