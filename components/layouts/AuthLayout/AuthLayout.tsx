import React from 'react';

interface AuthLayoutProps {
  children: JSX.Element[] | JSX.Element;
}

const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;
  return (
    <div className="flex flex-col flex-no-wrap h-screen">
      {children}
    </div>
  );
};

AuthLayout.defaultProps = {

};

AuthLayout.propTypes = {

};

export default AuthLayout;
