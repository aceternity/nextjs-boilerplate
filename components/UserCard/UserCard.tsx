import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { RxAvatar } from 'react-icons/rx';

interface UserCardProps {
    
}

const UserCard: React.FC<UserCardProps> = (props: UserCardProps) => {
  const { data: session } = useSession();
  return (
      <div className="container mx-auto">
        <Popover.Root>
          <Popover.Trigger asChild>
            <div className="bg-primary-800 p-1 rounded-md">
            <button className="flex justify-between w-full items-center">
              <span className="sr-only">Open user menu</span>
              <div className="px-2 flex flex-col text-left py-3">
                <span className="block text-gray-300 text-sm">{session?.user.name}</span>
                <span className="block font-medium truncate text-gray-300 text-[0.6rem]">{session?.user.email}</span>
              </div>
              {session?.user.image && <img className="w-8 h-8 rounded-full" src={session?.user.image} alt="user photo" />}
              {!session?.user.image && <RxAvatar className='w-8 h-8 text-white'/>}
            </button>
           {session?.user.role === 'superadmin' && (
              <div className='bg-white p-1 px-2 text-[0.6rem] text-center rounded-sm'>
                {session?.user.role}
              </div>
              )}
            </div>
          </Popover.Trigger>
          <Popover.Portal >
            <Popover.Content align="end" side="top" sideOffset={0}>
            <ul className="z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
              <li>
                <a 
                  onClick={() => signOut({ redirect: true, callbackUrl: '/' })} 
                  className="block cursor-pointer bg-red-600 px-4 py-2 text-sm text-gray-100 hover:bg-red-500"
                >
                  Sign out
                </a>
              </li>
            </ul>
            </Popover.Content>
          </Popover.Portal>
          </Popover.Root>
        
      </div>
  );
};

UserCard.defaultProps = {

};

UserCard.propTypes = {

};

export default UserCard;
