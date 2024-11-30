'use client';

import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export default function Stars({
  rating,
  totalReviews,
  size = 14,
}: {
  rating: number;
  totalReviews?: number;
  size?: number;
}) {
  return (
    <div className='flex items-center'>
      {[1, 2, 3, 4, 5].map((star, index) => (
        <Star
          key={index}
          size={size}
          className={cn(
            'bg-transparent text-primary transition-all duration-300 ease-in-out',
            rating >= star ? 'fill-primary' : 'fill-transparent',
          )}
        />
      ))}
      <span className='ml-2 text-sm font-bold text-secondary-foreground'>
        {totalReviews} reviews
      </span>
    </div>
  );
}
