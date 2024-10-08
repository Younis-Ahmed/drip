import { auth } from '@/server/auth';
import { UserBtn } from '@/components/navigation/userBtn';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import Logo from '@/assets/images/logo.webp';
import Image from 'next/image';

export default async function Nav() {
  const session = await auth();
  console.log(session);

  return (
    <header className='py-8'>
      <nav>
        <ul className='flex justify-between'>
          <li>
            <Link href='/'>
              <Image src={Logo} alt='Logo' className='size-16' />
            </Link>
          </li>
          {!session ? (
            <li>
              <Button asChild>
                <Link href={'/auth/login'} aria-label='sign-in' className='flex gap-3'>
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserBtn expires={session?.expires ?? ''} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
