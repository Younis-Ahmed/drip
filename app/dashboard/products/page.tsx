import { db } from '@/server';
import React from 'react';
import Placeholder from '@/assets/images/placeholder.png';
import { DataTable } from './data-table';
import { columns } from './columns';
async function Products() {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) throw new Error('No products found');

  const dataTable = products.map(product => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
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
