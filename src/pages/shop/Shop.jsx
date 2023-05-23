import { useState } from 'react';
import { Container } from '@mui/material';
import Intro from '@/components/common/Intro/Intro';
import Header from '@/components/common/Header/Header';
import Navbar from '@/components/shop/Navbar/Navbar';
import Products from '@/components/shop/Products/Products';

export const Shop = () => {
  const [query, setQuery] = useState('');
  return (
    <>
      <Intro />
      <Container maxWidth="xl">
        <Header title={'shop'} buttonTitle={'go to shop'} to={'/'} />
        <Navbar setQuery={setQuery} />
        <Products query={query} />
      </Container>
    </>
  );
};
