import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addProduct } from '@/redux/slices/cart';
import Navbar from '@/components/shop/Navbar/Navbar';
import styles from './Product.module.scss';
import axios from '@/utils/axios';

export const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`/product/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [id]);

  const decrease = () => {
    if(quantity !== 0){
      setQuantity((prev) => prev - 1);
    } else{
      setQuantity(0)
    }
  }
    
  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  const addToCart = () => {
    dispatch(addProduct({ product, quantity, price: product.price }));
  };

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
          <p className={styles.price}>${product.price}</p>
          <div className={styles.quantity}>
            <span onClick={decrease}>-</span>
            <span>{quantity}</span>
            <span onClick={increase}>+</span>
          </div>
          <button
            className={styles.button}
            disabled={!quantity}
            onClick={addToCart}
          >
            add to cart
          </button>
        </div>
      </div>
    </div>
  );
};