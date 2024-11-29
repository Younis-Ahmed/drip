'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import { VariantsWithImagesTags } from '@/lib/infer-types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductCarousal({ variants }: { variants: VariantsWithImagesTags[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState([0]);
  const searchParams = useSearchParams();
  const seletedColor = searchParams.get('type') || variants[0].productType;

  const updatePreview = (idx: number) => {
    api?.scrollTo(idx);
  };

  useEffect(() => {
    if (!api) return;

    api.on('slidesInView', e => {
      setCurrentSlide(e.slidesInView());
    });
  }, [api]);
  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          variant =>
            variant.productType === seletedColor &&
            variant.variantsImages.map(img => {
              return (
                <CarouselItem key={img.url}>
                  {img.url ? (
                    <Image
                      priority
                      className='rounded-md'
                      width={1280}
                      height={720}
                      src={img.url}
                      alt={img.name}
                    />
                  ) : null}
                </CarouselItem>
              );
            }),
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <div className='flex gap-4 overflow-clip py-2'>
        {variants.map(
          variant =>
            variant.productType === seletedColor &&
            variant.variantsImages.map((img, idx) => {
              return (
                <div key={img.url}>
                  {img.url ? (
                    <Image
                      onClick={() => updatePreview(idx)}
                      priority
                      className={cn(
                        idx === currentSlide[0] ? 'opacity-100' : 'opacity-75',
                        'cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:opacity-75',
                      )}
                      width={72}
                      height={48}
                      src={img.url}
                      alt={img.name}
                    />
                  ) : null}
                </div>
              );
            }),
        )}
      </div>
    </Carousel>
  );
}
