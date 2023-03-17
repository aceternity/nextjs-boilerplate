import AxoisClient from "@lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query"
import { OrganizationsData } from "@pages/api/organizations";
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { OrganizationFormValues } from "@components/forms/OrganizationForm/OrganizationForm";
import { toast } from "react-hot-toast";
import { queryClient } from "@pages/_app";

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

export {
  useOrganzations,
  useCreateOrganization,
};