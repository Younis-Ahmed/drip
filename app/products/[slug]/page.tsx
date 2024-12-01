import ProductPicks from '@/components/products/product-picks';
import ProductType from '@/components/products/product-type';
import ProductCarousal from '@/components/products/products-carousal';
import Reviews from '@/components/reviews/reviews';
import Stars from '@/components/reviews/stars';
import { Separator } from '@/components/ui/separator';
import formatPrice from '@/lib/format-price';
import { getReviewAverage } from '@/lib/review-average';
import { db } from '@/server';
import { productVariants } from '@/server/schema';
import { eq } from 'drizzle-orm';

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantsImages: true,
      variantsTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (!data) {
    return [];
  }

  const slugID = data.map(variant => ({ slug: variant.id.toString() }));
  return slugID;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          reviews: true,
          productVariants: {
            with: { variantsImages: true, variantsTags: true },
          },
        },
      },
    },
  });
  if (variant) {
    const reviewAvg = getReviewAverage(variant?.product?.reviews.map(review => review.rating));
    return (
      <main>
        <section className='flex flex-col gap-4 lg:flex-row lg:gap-12'>
          <div className='flex-1'>
            <ProductCarousal variants={variant.product.productVariants} />
          </div>
          <div className='flex flex-1 flex-col'>
            <h2 className='text-2xl font-bold'>{variant?.product?.title}</h2>
            <div>
              <ProductType variants={variant.product.productVariants} />
              <Stars rating={reviewAvg} totalReviews={variant.product.reviews.length} />
            </div>
          </div>
          <Separator className='my-2' />
          <p className='py-2 text-2xl font-medium'>{formatPrice(variant.product.price)}</p>
          <div dangerouslySetInnerHTML={{ __html: variant.product.description }}></div>
          <p className='my-2 font-medium text-secondary-foreground'>Available Variants</p>
          <div className='flex gap-4'>
            {variant.product.productVariants.map(prodVariant => (
              <ProductPicks
                key={prodVariant.id}
                id={prodVariant.id}
                color={prodVariant.color}
                productType={prodVariant.productType}
                title={variant.product.title}
                price={variant.product.price}
                productID={variant.productID}
                image={prodVariant.variantsImages[0].url}
              />
            ))}
          </div>
        </section>
        <Reviews productID={variant.productID} />
      </main>
    );
  }
}
