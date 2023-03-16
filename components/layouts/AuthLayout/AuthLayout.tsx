import React from 'react';

interface AuthLayoutProps {
  children: JSX.Element[] | JSX.Element;
}

const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;
  return (
    <div className="flex flex-col flex-no-wrap h-screen">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
};

AuthLayout.defaultProps = {

};

AuthLayout.propTypes = {

};

export default AuthLayout;
