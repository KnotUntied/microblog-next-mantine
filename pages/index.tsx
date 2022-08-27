import { Container } from '@mantine/core';
import { Posts } from '../components/Posts';
import PrivateRoute from '../components/PrivateRoute';

function FeedPage() {
  return (
    <Container>
      <Posts write={true} />
    </Container>
  );
}

export default PrivateRoute(FeedPage);