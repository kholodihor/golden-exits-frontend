import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/redux/slices/products';
import { Link } from 'react-router-dom';
import { ProductSkeleton } from '../Skeleton/ProductSkeleton';
import { Paper } from '@mui/material';
import styles from './Products.module.scss';
import Error from '../../common/Error/Error';

const Products = ({ query }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.items.filter((product) =>
    product.category.includes(query)
  );

  if (products.status === 'error') return <Error />;

  const isProductsLoading = products.status === 'loading';

  return (
    <div className={styles.Products}>
      <div className={styles.gridbox}>
        {(isProductsLoading ? [...Array(6)] : filteredProducts).map(
          (product, index) =>
            isProductsLoading ? (
              <ProductSkeleton key={index} />
            ) : (
              <Link to={`/product/${product._id}`} key={product._id}>
                <Paper className={styles.griditem}>
                  <div className={styles.image}>
                    <img src={product.img} alt="" />
                  </div>
                  <h3>{product.title}</h3>
                  <p>${product.price}</p>
                </Paper>
              </Link>
            )
        )}
      </div>
    </div>
  );
};

export default Products;
