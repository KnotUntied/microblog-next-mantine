import { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Group,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';
import { useFlash } from '../contexts/FlashProvider';
import { Post } from '../client';

interface WriteProps {
  showPost: (arg0: Post) => void
};

export default function Write({ showPost }: WriteProps) {
  const api = useApi();
  const { user } = useUser();
  const flash = useFlash();
  const form = useForm({
    initialValues: {
      text: ''
    }
  });
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    textInputRef?.current?.focus();
  }, []);

  return (
    <Group noWrap spacing="xs" mt={10} pt={30} pb={40}>
      <Avatar
        src={user ? (user.avatar_url + '&s=64') : undefined}
        alt={user ? user.username : 'User unknown'}
        size={64}
        radius={32}
      />
      <form onSubmit={form.onSubmit(async ({ text }) => {
          const response = await api.post("/posts", { text });
          if (response.ok) {
            showPost(response.body);
            form.setValues({ text: '' })
            flash({
              message: 'Post successful',
              type: 'success',
            });
          }
          else {
            if (response.body.errors) {
              form.setErrors(response.body.errors.json);
            }
          }
        })}
      >
        <TextInput
          placeholder="What's on your mind?"
          ref={textInputRef}
          sx={{ flex: '1 !important' }}
          {...form.getInputProps('text')}
        />
      </form>
    </Group>
  );
}