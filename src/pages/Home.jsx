import NewArrivals from '@/components/home/NewArrivals/NewArrivals';
import AboutGE from '@/components/home/AboutGE/AboutGE';
import Tabs from '@/components/home/Tabs/Tabs';
import { PageLayout } from '@/components/common/PageLayout/PageLayout';

export const Home = () => {
  return (
    <PageLayout title={'Arrivals'} buttonTitle={'Write a post'} to={'/add-post'}>
      <NewArrivals />
      <AboutGE />
      <Tabs />
    </PageLayout>
  );
};
