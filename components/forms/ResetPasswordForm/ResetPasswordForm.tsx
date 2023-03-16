import { Button, Input } from '@components/elements';
import Flex from '@components/Flex';
import useYupValidationResolver from '@hooks/useYupValidationResolver';
import React from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import * as yup from 'yup';

export type ResetPasswordFormValues = {
  password: string;
  reEnterpassword: string;
};

interface ResetPasswordFormProps {
  onSubmit: (values: ResetPasswordFormValues) => void;
  loading?: boolean;
}

const validationSchema: yup.ObjectSchema<ResetPasswordFormValues> = yup.object({
  password: yup.string().required("Required").min(8),
  reEnterpassword: yup.string().required("Required").min(8),
});

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = (props: ResetPasswordFormProps) => {
  const resolver = useYupValidationResolver(validationSchema);

  const { onSubmit, loading } = props;

  const methods = useForm<ResetPasswordFormValues>({
    defaultValues: {},
    resolver
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Reset your password
          </h1>
          <div>
          <Controller
            control={methods.control}
            name="password"
            render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <Input 
              type="password" 
              placeholder="Enter new passsword"
              size="md"
              label="Password"
              value={value}
              error={error?.message}
              onChange={onChange}
              disabled={loading}
            />
            )}
          />
          </div>
          <div>
          <Controller
            control={methods.control}
            name="reEnterpassword"
            render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <Input 
              type="password" 
              placeholder="Re-enter new passsword"
              size="md"
              label="Re-enter password"
              value={value}
              error={error?.message}
              onChange={onChange}
              disabled={loading}
            />
            )}
          />
          </div>
          <div>
          <Button variant="primary" disabled={loading} type="submit">Change Password</Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

ResetPasswordForm.defaultProps = {

};

ResetPasswordForm.propTypes = {

};

export default ResetPasswordForm;
