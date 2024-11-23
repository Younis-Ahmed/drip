import ProductPicks from '@/components/products/product-picks';
import ProductType from '@/components/products/product-type';
import { Separator } from '@/components/ui/separator';
import formatPrice from '@/lib/format-price';
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
          productVariants: {
            with: { variantsImages: true, variantsTags: true },
          },
        },
      },
    },
  });
  if (variant) {
    return (
      <main>
         <section>
          <div className='flex-1'>
            <h1>images</h1>
          </div>
          <div className='flex flex-1 flex-col gap-2'>
            <h2 className=''>{variant?.product?.title}</h2>
            <div>
              <ProductType variants={variant.product.productVariants} />
            </div>
          </div>
          <Separator />
          <p className='text-2xl font-medium'>
            {formatPrice(variant.product.price)}
          </p>
          <div dangerouslySetInnerHTML={{__html: variant.product.description}}></div>
          <p className='text-secondary-foreground'>Available Variants</p>
          <div className='flex gap-4 '>
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
      </main>
    );
  }
}
