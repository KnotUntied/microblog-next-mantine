import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useApi } from '../contexts/ApiProvider';
import { useFlash } from '../contexts/FlashProvider';
import PublicRoute from '../components/PublicRoute';

const schema = z.object({
  username: z
    .string({ required_error: "Username is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: 'Invalid email' }),
  password: z
    .string({ required_error: "Password is required" }),
  password2: z
    .string({ required_error: "Repeated password is required" }),
}).refine((data) => data.password === data.password2, {
  message: "Passwords do not match",
  path: ["password2"],
});

function RegistrationPage() {
  const router = useRouter();
  const api = useApi();
  const flash = useFlash();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      username: '',
      email: '',
      password: '',
      password2: '',
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
        <form onSubmit={form.onSubmit(async ({ username, email, password }) => {
            const data = await api.post('/users', { username, email, password });
            if (data.ok) {
              flash({
                message: 'You have successfully registered!',
                type: 'success',
              });
              router.push('/login');
            } else {
              form.setErrors(data.body.errors.json);
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
            label="Email address"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            required
            label="Password"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            required
            label="Repeat password"
            {...form.getInputProps('password2')}
          />
          <Button type="submit" fullWidth mt="xl">Submit</Button>
        </form>
      </Paper>
    </Container>
  );
}

export default PublicRoute(RegistrationPage);