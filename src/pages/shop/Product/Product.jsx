import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addProduct } from '@/redux/slices/cart';
import Navbar from '@/components/shop/Navbar/Navbar';
import Notification from '@/components/common/Notification/Notification';
import styles from './Product.module.scss';
import axios from '@/utils/axios';
import { logger } from '@/utils/logger';
import Error from '@/components/common/Error/Error';

export const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [quantity, setQuantity] = useState(0);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });

  useEffect(() => {
    const controller = new AbortController();
    setProduct(null);
    setStatus('loading');
    setQuantity(0);
    const getProduct = async () => {
      try {
        const res = await axios.get(`/product/${id}`, { signal: controller.signal });
        setProduct(res.data);
        setStatus('loaded');
      } catch (error) {
        if (controller.signal.aborted) return;
        logger.error('Failed to fetch product:', error);
        setStatus('error');
      }
    };
    getProduct();
    return () => controller.abort();
  }, [id]);

  const decrease = () => {
    setQuantity(prev => Math.max(0, prev - 1));
  };

  const increase = () => {
    setQuantity(prev => prev + 1);
  };

  const addToCart = () => {
    if (!product || !quantity) return;
    dispatch(addProduct({ product, quantity, price: product.price }));
    setNotify({
      isOpen: true,
      message: `"${product.title}" added to cart`,
      type: 'success',
    });
  };

  if (status === 'error') return <Error />;

  if (!product) {
    return (
      <div className={styles.Product}>
        <Navbar />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.Product}>
      <Navbar />
      <div className={styles.inner}>
        <div className={styles.image}>
          <img src={product.img} alt={product.title} />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.desc}>{product.desc}</p>
          <p className={styles.price}>${Number(product.price || 0).toFixed(2)}</p>
          <div className={styles.quantity}>
            <span onClick={decrease}>-</span>
            <span>{quantity}</span>
            <span onClick={increase}>+</span>
          </div>
          <button className={styles.button} disabled={!quantity} onClick={addToCart}>
            add to cart
          </button>
        </div>
      </div>
      <Notification notify={notify} setNotify={setNotify} />
    </div>
  );
};
