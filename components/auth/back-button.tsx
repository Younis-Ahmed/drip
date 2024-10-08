'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

type BackButtonProps = {
  href: string;
  label: string;
};

export default function BackButton({ href, label }: BackButtonProps) {
  return (
    <Button asChild variant={"link"} className='w-full font-medium'>
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
}
