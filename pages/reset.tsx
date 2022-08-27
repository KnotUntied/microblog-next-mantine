import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useApi } from '../contexts/ApiProvider';
import { useFlash } from '../contexts/FlashProvider';
import PublicRoute from '../components/PublicRoute';

const schema = z.object({
  password: z
    .string({ required_error: "Password is required" }),
  password2: z
    .string({ required_error: "Repeated password is required" }),
}).refine((data) => data.password === data.password2, {
  message: "New passwords do not match",
  path: ["password2"],
});

function ResetPage() {
  const router = useRouter();
  const api = useApi();
  const flash = useFlash();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      password: '',
      password2: '',
    },
  });
  const passwordRef = useRef<HTMLInputElement>(null);
  const token = router.query.token;

  useEffect(() => {
    if (!token) {
      router.push('/');
    } else {
      passwordRef?.current?.focus();
    }
  }, [token]);

  return (
    <Container size={420} my={40}>
      <Title align="center">Reset Your Password</Title>
      <Paper withBorder p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(async ({ password }) => {
            const response = await api.put('/tokens/reset', { token, new_password: password });
            if (response.ok) {
              flash({ message: 'Your password has been reset.', type: 'success'});
              router.push('/login');
            } else {
              if (response.body.errors.json.new_password) {
                form.setErrors(response.body.errors.json);
              } else {
                flash({ message: 'Password could not be reset. Please try again.', type: 'danger' });
                router.push('/reset-request');
              }
            }
          })}
        >
          <PasswordInput
            required
            label="New Password"
            ref={passwordRef}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            required
            label="New Password Again"
            {...form.getInputProps('password2')}
          />
          <Button type="submit" fullWidth mt="xl">Submit</Button>
        </form>
      </Paper>
    </Container>
  );
}

export default PublicRoute(ResetPage);