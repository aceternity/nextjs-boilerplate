import React from 'react';

interface LogoProps {
    
}

const Logo: React.FC<LogoProps> = (props: LogoProps) => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center space-x-1">
          <svg viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 font-bold" id="logo">
            <path d="M6.09521 5.98586C6.09521 5.98586 52.9961 16.1083 55.9639 27.9921C58.9317 39.876 7.14953 55.3998 7.14953 55.3998" stroke="url(#paint0_linear_101_8)" stroke-width="11" stroke-miterlimit="3.86874" stroke-linecap="round">
            </path>
            <defs>
            <linearGradient id="paint0_linear_101_8" x1="30.5444" y1="2.16844" x2="31.5724" y2="50.347" gradientUnits="userSpaceOnUse">
              <stop stop-color="#374151"></stop>
              <stop offset="0.5" stop-color="#111827"></stop>
              <stop offset="1" stop-color="#374151"></stop>
            </linearGradient>
            </defs>
          </svg>
          <a className="text-xl font-bold tracking-normal text-primary-800" href="/">
            Aceternity
          </a>
        </div>
    </div>
  );
};

Logo.defaultProps = {

};

Logo.propTypes = {

};

export default Logo;
