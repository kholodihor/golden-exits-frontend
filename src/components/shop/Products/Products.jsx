import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/redux/slices/products';
import { Link } from 'react-router-dom';
import { ProductSkeleton } from '../Skeleton/ProductSkeleton';
import { Paper } from '@mui/material';
import styles from './Products.module.scss';
import Error from '../../common/Error/Error';

const Products = ({ query }) => {
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    if (!q) return products.items;
    return products.items.filter(product => {
      const { category } = product;
      if (Array.isArray(category)) {
        return category.some(c => String(c).toLowerCase().includes(q));
      }
      return typeof category === 'string' && category.toLowerCase().includes(q);
    });
  }, [products.items, query]);

  if (products.status === 'error') return <Error />;

  const isProductsLoading = products.status === 'loading';

  return (
    <div className={styles.Products}>
      <div className={styles.gridbox}>
        {(isProductsLoading ? [...Array(6)] : filteredProducts).map((product, index) =>
          isProductsLoading ? (
            <ProductSkeleton key={index} />
          ) : (
            <Link to={`/product/${product._id}`} key={product._id}>
              <Paper className={styles.griditem}>
                <div className={styles.image}>
                  <img src={product.img} alt="" />
                </div>
                <h3>{product.title}</h3>
                <p>${Number(product.price || 0).toFixed(2)}</p>
              </Paper>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Products;
