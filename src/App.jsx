import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/common/Footer/Footer';
import { fetchUser } from './redux/slices/auth';
import { useDispatch } from 'react-redux';

// Pages are named exports; map each to a default export for React.lazy.
const page = (load, name) => lazy(() => load().then(m => ({ default: m[name] })));

const Home = page(() => import('./pages/Home'), 'Home');
const Login = page(() => import('./pages/login/Login'), 'Login');
const Register = page(() => import('./pages/register/Register'), 'Register');
const Blog = page(() => import('./pages/blog/Blog'), 'Blog');
const SinglePost = page(() => import('./pages/blog/SinglePost'), 'SinglePost');
const AddPost = page(() => import('./pages/blog/AddPost/AddPost'), 'AddPost');
const Shop = page(() => import('./pages/shop/Shop'), 'Shop');
const Product = page(() => import('./pages/shop/Product/Product'), 'Product');
const Cart = page(() => import('./pages/shop/Cart/Cart'), 'Cart');
const VideoPage = page(() => import('./pages/video/VideoPage'), 'VideoPage');
const UploadVideo = page(() => import('./pages/video/UploadVideo'), 'UploadVideo');

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <>
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/add-post" element={<AddPost key="add" />} />
            <Route path="/edit-post/:id" element={<AddPost key="edit" />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/video" element={<VideoPage />} />
            <Route path="/video/upload" element={<UploadVideo />} />
          </Routes>
        </Suspense>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;
