import Intro from '@/components/common/Intro/Intro';
import NewArrivals from '@/components/home/NewArrivals/NewArrivals';
import AboutGE from '@/components/home/AboutGE/AboutGE';
import Tabs from '@/components/home/Tabs/Tabs';
import Header from '@/components/common/Header/Header';
import { Container } from '@mui/material';

export const Home = () => {
  return (
    <>
      <Intro />
      <Container maxWidth="xl">
        <Header
          title={'Arrivals'}
          buttonTitle={'write a post'}
          to={'/add-post'}
        />
        <NewArrivals />
        <AboutGE />
        <Tabs />
      </Container>
    </>
  );
};
