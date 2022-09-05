import { useRouter } from 'next/router';
import { useUser } from '../contexts/UserProvider';

export default function PrivateRoute(Component: () => JSX.Element) {
  const PrivateRouteComponent = () => {
    const { user } = useUser();
    const router = useRouter();

    if (user === undefined) {
      return null;
    }
    else if (user) {
      return <Component />;
    }
    else {
      const url = router.pathname;
      router.push({
        pathname: '/login',
        query: { next: url },
      });
      return null;
    }
  };

  return PrivateRouteComponent;
}