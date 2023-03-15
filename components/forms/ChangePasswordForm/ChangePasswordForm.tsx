import { Button, Input } from '@components/elements';
import Flex from '@components/Flex';
import useYupValidationResolver from '@hooks/useYupValidationResolver';
import React from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import * as yup from 'yup';

export type ChangePasswordFormValues = {
  password: string;
  newPassword: string;
};

interface ChangePasswordFormProps {
  onSubmit: (updatedValues: ChangePasswordFormValues) => void;
  loading?: boolean;
}

const validationSchema: yup.ObjectSchema<ChangePasswordFormValues> = yup.object({
  password: yup.string().required("Required"),
  newPassword: yup.string().required("Required")
});

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = (props: ChangePasswordFormProps) => {
  const resolver = useYupValidationResolver(validationSchema);

  const { onSubmit, loading } = props;

  const methods = useForm<ChangePasswordFormValues>({
    defaultValues: {},
    resolver
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Flex direction="col" classes="max-w-md" gap="4">
          <Controller
            control={methods.control}
            name="password"
            render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <Input 
              type="password" 
              placeholder="Enter current passsword"
              size="md"
              label="Current password"
              value={value}
              error={error?.message}
              onChange={onChange}
              disabled={loading}
            />
            )}
          />
          <Controller
            control={methods.control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
            <Input 
              type="password" 
              placeholder="Enter new passsword"
              size="md"
              label="New Password"
              value={value}
              error={error?.message}
              onChange={onChange}
              disabled={loading}
            />
            )}
          />
          <Button variant="primary" disabled={loading} type="submit">Save</Button>
        </Flex>
      </form>
    </FormProvider>
  );
};

ChangePasswordForm.defaultProps = {

};

ChangePasswordForm.propTypes = {

};

export default ChangePasswordForm;
