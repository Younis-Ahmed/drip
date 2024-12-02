'use client';
import Image from 'next/image';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback /*, AvatarImage*/ } from '@/components/ui/avatar';
import { LogOut, Moon, Settings, Sun, TruckIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const UserBtn = ({ user }: Session) => {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const handleNavigation = (path: string) => {
    const fullPath = `${window.location.origin}/${path}`;
    router.push(fullPath);
  };
  // Maybe we can use this function to set the switch theme. Haven't decided yet.
  // const setSwitchTheme = () => {
  //   switch (theme) {
  //     case 'dark':
  //       return setChecked(true);
  //     case 'light':
  //       return setChecked(false);
  //     case 'system':
  //       return setChecked(false);
  //     default:
  //       break;
  //   }
  // };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar>
          {user?.image && <Image src={user.image} alt={user.name || "User's avatar"} fill={true} sizes='' />}
          {!user?.image && (
            <AvatarFallback className='bg-primary/25'>
              <div className='font-blod'>{user?.name?.charAt(0)}</div>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-64 p-6' align='end'>
        <div className='mb-4 flex flex-col items-center gap-1 rounded-lg bg-primary/10 p-4'>
          {user?.image && (
            <Image
              src={user.image}
              className='rounded-full'
              alt={user.name || "User's avatar"}
              width={36}
              height={36}
            />
          )}
          <p className='text-xs font-bold'>{user?.name}</p>
          <span className='text-xs font-medium text-secondary-foreground'>{user?.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
        onClick={() => handleNavigation('dashboard/orders')}
        className='group cursor-pointer py-2 font-medium ease-in-out'>
          <TruckIcon
            size={14}
            className='mr-3 transition-all duration-500 ease-in-out group-hover:translate-x-1'
          />{' '}
          My Order
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigation('dashboard/settings')}
          className='group cursor-pointer py-2 font-medium ease-in-out'
        >
          <Settings
            size={14}
            className='mr-3 transition-all duration-500 ease-in-out group-hover:rotate-180'
          />{' '}
          Settings
        </DropdownMenuItem>
        {theme && (
          <DropdownMenuItem className='cursor-pointer py-2 font-medium'>
            <div className='group flex items-center' onClick={event => event.stopPropagation()}>
              <div className='relative mr-3 flex'>
                <Sun
                  size={14}
                  className='absolute mr-3 transition-all duration-500 ease-in-out group-hover:rotate-90 group-hover:text-yellow-500 dark:-rotate-90 dark:scale-0'
                />
                <Moon
                  size={14}
                  className='ml-auto scale-0 transition-all duration-500 ease-in-out group-hover:rotate-45 group-hover:text-blue-400 dark:scale-100'
                />
              </div>
              <p className='text-xs text-secondary-foreground/75 text-yellow-600 dark:text-blue-400'>
                {theme[0].toUpperCase() + theme.slice(1)} Mode
              </p>
              <Switch
                className='ml-2 scale-75'
                checked={checked}
                onCheckedChange={e => {
                  setChecked(prev => !prev);
                  if (e) {
                    setTheme('dark');
                  }
                  if (!e) {
                    setTheme('light');
                  }
                }}
              />
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className='group cursor-pointer py-2 font-medium transition-all duration-500 ease-in-out focus:bg-destructive/30'
          onClick={() => signOut()}
        >
          <LogOut
            size={14}
            className='mr-3 transition-all duration-500 ease-in-out group-hover:scale-75'
          />{' '}
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
