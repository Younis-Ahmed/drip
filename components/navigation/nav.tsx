// import { LogIn } from 'lucide-react';
import Logo from '@/assets/images/logo.webp'
import { UserBtn } from '@/components/navigation/userBtn'
import { auth } from '@/server/auth'
import Image from 'next/image'
import Link from 'next/link'
import CartDrawer from '../cart/cart-drawer'
import { Button } from '../ui/button'

export default async function Nav() {
  const session = await auth()
  console.log(session)

  return (
    <header className="py-8">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href="/" aria-label="drip">
              <div className="h-15 w-15 pb-3">
                <Image src={Logo} alt="Logo" className="size-12" />

              </div>
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {
            !session
              ? (
                  <li className="flex items-center justify-center">
                    <Button asChild>
                      <Link href="/auth/login" aria-label="sign-in" className="flex gap-3">
                        {/* <LogIn size={13} /> */}
                        <span>Login</span>
                      </Link>
                    </Button>
                  </li>
                ) : (
                  <li className="flex items-center justify-center">
                    <UserBtn expires={session?.expires ?? ''} user={session?.user} />
                  </li>
                )
          }
        </ul>
      </nav>
    </header>
  )
}
