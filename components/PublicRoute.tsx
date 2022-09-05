import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserProvider';

export default function PublicRoute(Component: () => JSX.Element) {
  const PublicRouteComponent = () => {
    const { user } = useUser();
    const router = useRouter();

    if (user === undefined) {
      return null;
    }
    else if (user) {
      router.push('/');
      return null;
    }
    else {
      return <Component />;
    }
  };

  return PublicRouteComponent;
}