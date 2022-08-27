import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useUser } from '../contexts/UserProvider';
import { useFlash } from '../contexts/FlashProvider';
import PublicRoute from '../components/PublicRoute';

function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const flash = useFlash();
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (value) => (!value ? 'Username is required' : null),
      password: (value) => (!value ? 'Password is required' : null),
    },
  });
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef?.current?.focus();
  }, []);

  return (
    <Container size={420} my={40}>
      <Title align="center">Sign in to Microblog</Title>
      <Paper withBorder p={30} mt={30} radius="md">
      <form onSubmit={form.onSubmit(async ({ username, password }) => {
          const result = await login(username, password);
          if (result === 'ok') {
            flash({
              title: 'Login successful',
              message: 'Welcome back to Microblog!',
              type: 'success',
            });
            const { next } = router.query;
            const nextUrl = next ? next.toString() : '/';
            router.push(nextUrl);
          } else if (result === 'fail') {
            form.setErrors({ password: 'Invalid username or password' });
          } else if (result === 'error') {
            form.setErrors({ password: 'Something wrong happened. Please try again.' });
          }
        })}
      >
          <TextInput
            required
            label="Username"
            ref={usernameRef}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            required
            label="Password"
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth mt="xl">Submit</Button>
        </form>
      </Paper>
      <Paper withBorder p={30} mt={30} radius="md">
        <Text align="center">Forgot your password? You can <Link href="/reset-request" passHref><Anchor>reset it</Anchor></Link>.</Text>
        <Text align="center">Don't have an account? <Link href="/register" passHref><Anchor>Register here</Anchor></Link>!</Text>
      </Paper>
    </Container>
  );
}

export default PublicRoute(LoginPage);