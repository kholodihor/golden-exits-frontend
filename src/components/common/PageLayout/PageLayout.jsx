import { Container } from '@mui/material';
import Intro from '@/components/common/Intro/Intro';
import Header from '@/components/common/Header/Header';

export const PageLayout = ({ title, buttonTitle, to, containerProps, children }) => (
  <>
    <Intro />
    <Container maxWidth="xl" {...containerProps}>
      <Header title={title} buttonTitle={buttonTitle} to={to} />
      {children}
    </Container>
  </>
);
