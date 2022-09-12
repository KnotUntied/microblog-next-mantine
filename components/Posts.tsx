import { useState, useEffect } from 'react';
import { Loader, Stack, Text } from '@mantine/core';
import More from './More';
import Post from './Post';
import { useApi } from '../contexts/ApiProvider';
import Write from './Write';
import { DateTimePagination, Post as PostModel } from '../client';

interface PostsProps {
  content?: string | number,
  write?: boolean
};

export default function Posts({ content, write }: PostsProps) {
  const [posts, setPosts] = useState<PostModel[] | null | undefined>();
  const [pagination, setPagination] = useState<DateTimePagination>();
  const api = useApi();

  let url: string;
  switch (content) {
    case 'feed':
    case undefined:
      url = '/feed';
      break;
    case 'explore':
      url = '/posts';
      break
    default:
      url = `/users/${content}/posts`;
      break;
  }

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      if (response.ok) {
        setPosts(response.body.data);
        setPagination(response.body.pagination);
      }
      else {
        setPosts(null);
      }
    })();
  }, [api, url]);

  const loadNextPage = async () => {
    if (posts) {
      try {
        const response = await api.get(url, {
          after: posts[posts.length - 1].timestamp
        });
        setPosts([...posts, ...response.body.data]);
        setPagination(response.body.pagination);
      } catch (error) {
        null;
      }
    }
  };

  const showPost = (newPost: PostModel) => {
    if (posts) {
      setPosts([newPost, ...posts]);
    }
  };

  return (
    <>
      {write && <Write showPost={showPost} />}
      {posts === undefined
        ? <Loader />
        : <Stack>
            {posts === null
              ? <Text>Could not retrieve blog posts.</Text>
              : posts.map(post => <Post key={post.id} post={post} />)
            }
            <More pagination={pagination} loadNextPage={loadNextPage} />
          </Stack>
      }
    </>
  );
}