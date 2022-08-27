import { Container, Title } from '@mantine/core';
import { Posts } from '../components/Posts';
import PrivateRoute from '../components/PrivateRoute';

function ExplorePage() {
  return (
    <Container>
      <Title mb="md">Explore</Title>
      <Posts content="explore" />
    </Container>
  );
}

export default PrivateRoute(ExplorePage);