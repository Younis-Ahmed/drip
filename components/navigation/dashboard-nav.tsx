'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardNav({
  allLinks,
}: {
  allLinks: {
    label: string;
    path: string;
    icon: React.ReactNode;
  }[];
}) {
  const pathname = usePathname();
  return (
    <nav className='overflow-auto py-2 mb-4'>
      <ul className='flex gap-6 text-xs font-semibold'>
        <AnimatePresence>
          {allLinks.map(link => (
            <motion.li key={link.path} whileTap={{ scale: 0.95 }}>
              <Link
                className={cn(
                  'relative flex flex-col items-center gap-1',
                  pathname === link.path && 'text-primary',
                )}
                href={link.path}
              >
                {link.icon}
                {link.label}
                {pathname === link.path ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId='nav-underline'
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className='-bottom-1 absolute left-0 z-0 h-[2px] w-full rounded-full bg-primary'
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
