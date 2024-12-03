import { db } from '@/server';
import React from 'react';
import Placeholder from '@/assets/images/placeholder.png';
import { DataTable } from './data-table';
import { columns } from './columns';

async function Products() {
  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantsImages: true, variantsTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error('No products found');

  const dataTable = products.map(product => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image: Placeholder.src,
    };
  });
  if (!dataTable) throw new Error('No data found');
  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}

export default Products;
