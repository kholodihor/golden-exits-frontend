import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';
import { Blog } from './pages/blog/Blog';
import { SinglePost } from './pages/blog/SinglePost';
import { AddPost } from './pages/blog/AddPost/AddPost';
import { Shop } from './pages/shop/Shop';
import { Product } from './pages/shop/Product/Product';
import { Cart } from './pages/shop/Cart/Cart';
import { VideoPage } from './pages/video/VideoPage';
import { UploadVideo } from './pages/video/UploadVideo';
import Footer from './components/common/Footer/Footer';
import { fetchUser } from './redux/slices/auth';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/posts/:id" element={<SinglePost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/video/upload" element={<UploadVideo />} />
        </Routes>
      </main>
      <footer>
        <Footer/>
      </footer>
    </>
  );
}

export default App;
