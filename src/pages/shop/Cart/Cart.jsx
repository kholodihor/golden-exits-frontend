import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeProduct, clearCart, selectCartItems, selectCartTotal } from '@/redux/slices/cart';
import { logger } from '@/utils/logger';
import { BiShoppingBag } from 'react-icons/bi';
import { FaRegTimesCircle } from 'react-icons/fa';
import styles from './Cart.module.scss';
import StripeCheckout from 'react-stripe-checkout';
import axios from '@/utils/axios';

const KEY = import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY;

const formatPrice = value => Number(value || 0).toFixed(2);

export const Cart = () => {
  const dispatch = useDispatch();
  const total = useSelector(selectCartTotal);
  const cart = useSelector(selectCartItems);
  const amountInCents = Math.round(total * 100);

  const onToken = async token => {
    try {
      await axios.post('/payment', {
        tokenId: token.id,
        amount: amountInCents,
      });
      dispatch(clearCart());
    } catch (error) {
      logger.error('Payment failed:', error);
    }
  };

  const handleRemoveProduct = id => {
    dispatch(removeProduct(id));
  };

  return (
    <div className={styles.Cart}>
      <h1>
        Your <span>golden</span> treasury
        {!cart.length && (
          <div>
            <p>is empty</p> <BiShoppingBag className={styles.bag} />
          </div>
        )}
      </h1>
      {cart.length ? (
        <div className={styles.inner}>
          <div className={styles.cartcontainer}>
            {cart.map(item => (
              <div className={styles.cartitem} key={item.product._id}>
                <div className={styles.image}>
                  <img src={item.product.img} alt={item.product.title} />
                </div>
                <div className={styles.info}>
                  <p>{item.product.title}</p>
                  <span>&nbsp;x{item.quantity}</span>
                  <br />
                </div>
                <div className={styles.pricecontainer}>
                  <div className={styles.price}>
                    <p>${formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className={styles.remove}>
                    <FaRegTimesCircle onClick={() => handleRemoveProduct(item.product._id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.summary}>
            <h2>order summary</h2>
            <div className={styles.total}>
              <h3>total</h3>
              <span>${formatPrice(total)}</span>
            </div>
            <StripeCheckout
              name="Golden Exits"
              billingAddress
              shippingAddress
              description={`Your total is $${formatPrice(total)}`}
              amount={amountInCents}
              token={onToken}
              stripeKey={KEY}
            >
              <button disabled={!total} className={styles.paybutton}>
                Pay with Stripe
              </button>
            </StripeCheckout>
          </div>
        </div>
      ) : null}
      <Link to="/shop">
        <button className={styles.continue}>continue shopping</button>
      </Link>
    </div>
  );
};
