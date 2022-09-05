import Link from 'next/link';
import {
  Anchor,
  Avatar,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Post as PostModel } from '../client';

dayjs.extend(relativeTime);

interface PostProps {
  post: PostModel
};

export function Post({ post }: PostProps) {
  return (
    <Group noWrap spacing="xs" align="start">
      <Avatar
        src={post.author ? (post.author.avatar_url + '&s=48') : null}
        alt={post.author?.username ?? 'User unknown'}
        size={48}
        radius={24}
      />
      <Stack
        spacing={0}
        sx={{ flex: '1 !important' }}
      >
        <Text>
          <Link href={post.author ? ('/user/' + post.author.username) : '/'} passHref>
            <Anchor component="a" span weight={500}>
              {post.author?.username ?? 'User unknown'}
            </Anchor>
          </Link> <Text span size="xs" color="dimmed">&mdash; {dayjs(post.timestamp).fromNow()}</Text>
        </Text>
        <Text>{post.text}</Text>
      </Stack>
    </Group>
  );
}