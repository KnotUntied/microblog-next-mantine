import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';
import { useFlash } from '../contexts/FlashProvider';
import PrivateRoute from '../components/PrivateRoute';

const schema = z.object({
  username: z
    .string({ required_error: "Username is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: 'Invalid email' }),
  about_me: z
    .string()
    .optional(),
});

function EditUserPage() {
  const router = useRouter();
  const api = useApi();
  const { user, setUser } = useUser();
  const flash = useFlash();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      username: user?.username,
      email: user?.email,
      about_me: user?.about_me,
    },
  });
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef?.current?.focus();
  }, [user]);

  return (
    <Container my={40}>
      <form onSubmit={form.onSubmit(async ({ username, email, about_me }) => {
          const response = await api.put('/me', { username, email, about_me });
          if (response.ok) {
            setUser(response.body);
            flash({
              message: 'Your profile has been updated.',
              type: 'success',
            });
            router.push('/user/' + response.body.username);
          } else {
            form.setErrors(response.body.errors.json);
          }
        })}
      >
        <TextInput
          required
          label="Username"
          ref={usernameRef}
          {...form.getInputProps('username')}
        />
        <TextInput
          required
          label="Email"
          {...form.getInputProps('email')}
        />
        <TextInput
          label="About Me"
          mt="md"
          {...form.getInputProps('about_me')}
        />
        <Button type="submit" mt="xl">Save</Button>
      </form>
    </Container>
  );
}

export default PrivateRoute(EditUserPage);