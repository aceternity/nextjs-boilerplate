import AxoisClient from "@lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios";
import toast from 'react-hot-toast';
import { useRouter } from "next/router";
import { queryClient } from "@pages/_app";
import { signIn } from "next-auth/react";
import { UseFormReturn } from "react-hook-form";

import { UserData } from "@pages/api/users/currentUser";
import { ProfileFormValues } from "@components/forms/ProfileForm/ProfileForm";
import { ChangePasswordFormValues } from "@components/forms/ChangePasswordForm/ChangePasswordForm";
import { LoginFormValues } from "@components/forms/LoginForm/LoginForm";
import { RegisterFormValues } from "@components/forms/RegisterForm/RegisterForm";
import { ForgotPasswordFormValues } from "@components/forms/ForgotPasswordForm/ForgotPasswordForm";
import { ResetPasswordFormValues } from "@components/forms/ResetPasswordForm/ResetPasswordForm";


const useUser = () => {
  const { data, isLoading, error } = useQuery(
    ["user"], 
    async () => {
      const { data }: AxiosResponse<UserData> = await AxoisClient.getInstance().get('api/users/currentUser');
      return data;
    },
    {
      refetchOnWindowFocus: false
    }
  );

  const { mutateAsync, isLoading: isUpdateLoading } = useMutation(
    (updatedData: ProfileFormValues) => {
      return AxoisClient.getInstance().patch('api/users/currentUser', { ...updatedData });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["user"]);
      }
    }
  );

  const updateUser = (user: ProfileFormValues) => {
    const promise = mutateAsync(user);
    toast.promise(promise, {
      loading: 'Updating profile...',
      success: 'Profile updated successfully!',
      error: 'Failed to update profile.',
    });
  };

  return {
    data,
    isUpdateLoading,
    isLoading,
    error,
    updateUser,
  };
};

const useUpdatePassword = () => {
  const { mutateAsync, isLoading: isUpdateLoading, error } = useMutation(
    (updatedData: ChangePasswordFormValues) => {
      return AxoisClient.getInstance().patch('api/auth/change-password', { ...updatedData });
    }
  );

  const updatePassword = async (updatedData: ChangePasswordFormValues) => {
    const promise = mutateAsync(updatedData);
    toast.promise(promise, {
      loading: 'Updating password...',
      success: 'Password updated successfully!',
      error: (err) => `${err.response.data.message || 'something went wrong!'}`,
    });
  };

  return {
    updatePassword,
    isUpdateLoading,
    error,
  };
}

const useResetPassword = () => {
  const { mutateAsync, isLoading: isUpdateLoading, error } = useMutation(
    (updatedData: ResetPasswordFormValues & { token: string }) => {
      return AxoisClient.getInstance().post('api/auth/reset', { ...updatedData });
    }
  );

  const updatePassword = async (updatedData: ResetPasswordFormValues, token: string) => {
    const promise = mutateAsync({token, ...updatedData});
    toast.promise(promise, {
      loading: 'Updating password...',
      success: 'Password reset successfully!',
      error: (err) => `${err.response.data.message || 'something went wrong!'}`,
    });
  };

  return {
    updatePassword,
    isUpdateLoading,
    error,
  };
}


const useSignIn = () => {
  const router = useRouter();
  const { query } = router;
  const { mutateAsync, isLoading, error } = useMutation(
    async (data: LoginFormValues) => {
      const response = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password
      });

      if (response?.error) {
        throw new Error(response.error)
      }
    }
  );

  const login = async (data: LoginFormValues) => {
    const promise = mutateAsync(data);
    toast.promise(promise, {
      loading: 'Please wait...',
      success: 'Logged In...',
      error: (err) => `${err?.response?.data?.message || err || 'something went wrong!'}`,
    }).then(() => {
      const { redirect } = query;

      if (redirect) {
        router.replace(redirect as string);
      } else {
        router.replace('/dashboard');
      }
    }).catch((e) => {

    });
  };

  return {
    login,
    isLoading,
    error,
  };
}

const useSignup = () => {
  const router = useRouter();
  const { mutateAsync, isLoading, error, status } = useMutation(
    async (data: RegisterFormValues) => {
      return AxoisClient.getInstance().post('api/auth/register', { ...data });
    }
  );

  const signup = async (data: RegisterFormValues,  formInstance: UseFormReturn<RegisterFormValues, any>) => {
    const promise = mutateAsync(data);
    toast.promise(promise, {
      loading: 'Please wait...',
      success: 'Registered Successfully',
      error: (err) => `${err?.response?.data?.message || err || 'something went wrong!'}`,
    }).then((value) => {
      if (value.status === 200) {
        formInstance.reset();
        router.replace('/auth/login');
      }
    }).catch(() => {
      formInstance.setError('email', {  message: 'Email already used' });
    });
  };

  return {
    signup,
    isLoading,
    error,
    status,
  };
}

const useForgotPassword = () => {
  const { mutateAsync, isLoading, error, status, data } = useMutation(
    (data: ForgotPasswordFormValues) => {
      return AxoisClient.getInstance().post('api/auth/forgot', { ...data });
    }
  );

  const forgot = async (data: ForgotPasswordFormValues) => {
    const promise = mutateAsync(data);
    toast.promise(promise, {
      loading: 'Please wait...',
      success: 'Password reset link sent to your mail.',
      error: (err) => `${err?.response?.data?.message || err || 'something went wrong!'}`,
    });
  };

  return {
    forgot,
    isLoading,
    error,
    status,
    data,
  };
}

export {
  useUser,
  useUpdatePassword,
  useSignIn,
  useSignup,
  useForgotPassword,
  useResetPassword
};
