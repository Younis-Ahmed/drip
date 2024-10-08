'use client';

import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { BsTwitterX } from "react-icons/bs";

export default function Socials() {
  return (
    <div className='flex flex-col items-center w-full gap-4'>
      <Button
      variant={'outline'}
      className='flex gap-4 w-full'
        onClick={() =>
          signIn('google', {
            redirect: false,
            redirectTo: '/',
          })
        }
      >
        <span>Sign in with Google</span>
        <FcGoogle className='w-5 h-5'/>
      </Button>
      <Button className='flex gap-4 w-full' 
      variant={'outline'}
      onClick={() =>
        signIn('twitter', {
          redirect: false,
          redirectTo: '/',
        })
      }>
        <span>Sign in with </span>
        <BsTwitterX className='w-5 h-5'/>
      </Button>
    </div>
  );
}
