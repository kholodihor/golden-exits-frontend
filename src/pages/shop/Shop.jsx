import { useState } from 'react';
import { PageLayout } from '@/components/common/PageLayout/PageLayout';
import Navbar from '@/components/shop/Navbar/Navbar';
import Products from '@/components/shop/Products/Products';

export const Shop = () => {
  const [query, setQuery] = useState('');
  return (
    <PageLayout title={'shop'} buttonTitle={'go to cart'} to={'/cart'}>
      <Navbar setQuery={setQuery} />
      <Products query={query} />
    </PageLayout>
  );
};
