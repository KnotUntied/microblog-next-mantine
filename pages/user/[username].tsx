import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Avatar,
  Button,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Posts } from '../../components/Posts';
import { useApi } from '../../contexts/ApiProvider';
import { useUser } from '../../contexts/UserProvider';
import { useFlash } from '../../contexts/FlashProvider';
import PrivateRoute from '../../components/PrivateRoute';
import { User } from '../../client';

dayjs.extend(relativeTime);

function UserPage() {
  const router = useRouter();
  const api = useApi();
  const [user, setUser] = useState<User | null>();
  const flash = useFlash();
  const { username } = router.query;
  const [isFollower, setIsFollower] = useState<boolean | null>();
  const { user: loggedInUser } = useUser();

  useEffect(() => {
    (async () => {
      const response = await api.get('/users/' + username);
      if (response.ok) {
        setUser(response.body);
        if (loggedInUser && response.body.username !== loggedInUser.username) {
          const follower = await api.get('/me/following/' + response.body.id);
          if (follower.status === 204) {
            setIsFollower(true);
          } else if (follower.status === 404) {
            setIsFollower(false);
          }
        } else {
          setIsFollower(null);
        }
      } else {
        setUser(null);
      }
    })();
  }, [username, api, loggedInUser]);

  const edit = () => {
    router.push('/edit');
  };

  const follow = async () => {
    if (user) {
      const response = await api.post('/me/following/' + user.id);
      if (response.ok) {
        flash({
          message: ( <>You are now following <strong>{user.username}</strong>.</> ),
          type: 'success'
        });
        setIsFollower(true);
      }
    }
  };

  const unfollow = async () => {
    if (user) {
      const response = await api.delete('/me/following/' + user.id);
      if (response.ok) {
        flash({
          message: ( <>You have unfollowed <strong>{user.username}</strong>.</> ),
          type: 'success'
        });
        setIsFollower(false);
      }
    }
  };

  return (
    <Container>
      {user === undefined
        ? <Loader />
        : <>
            <Group noWrap spacing="xl" my="xl" align="start">
              <Avatar
                src={user ? user.avatar_url + '&s=128' : undefined}
                alt={user?.username ?? 'User unknown'}
                size={128}
                radius={64}
              />
              <div>
                <Title>{user?.username ?? 'User unknown'}</Title>
                {user?.about_me && <Text>{user.about_me}</Text>}
                {user &&
                  <>
                    <Text size="xs" color="dimmed">Member since: {dayjs(user.first_seen).fromNow()}</Text>
                    <Text size="xs" mb="xs" color="dimmed">Last seen: {dayjs(user.last_seen).fromNow()}</Text>
                  </>
                }
                {isFollower === null &&
                  <Button onClick={edit}>
                    Edit
                  </Button>
                }
                {isFollower === false &&
                  <Button onClick={follow}>
                    Follow
                  </Button>
                }
                {isFollower === true &&
                  <Button onClick={unfollow}>
                    Unfollow
                  </Button>
                }
              </div>
            </Group>
            {user && <Posts content={user.id} />}
          </>
      }
    </Container>
  );
}

export default PrivateRoute(UserPage);