import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useApi } from '../contexts/ApiProvider';
import { useUser } from '../contexts/UserProvider';
import { useFlash } from '../contexts/FlashProvider';
import PrivateRoute from '../components/PrivateRoute';

const schema = z.object({
  old_password: z
    .string({ required_error: "Old password is required" }),
  password: z
    .string({ required_error: "New password is required" }),
  password2: z
    .string({ required_error: "New password again is required" }),
}).refine((data) => data.password === data.password2, {
  message: "Passwords do not match",
  path: ["password2"],
});

function ChangePasswordPage() {
  const router = useRouter();
  const api = useApi();
  const { user } = useUser();
  const flash = useFlash();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      old_password: '',
      password: '',
      password2: '',
    },
  });
  const oldPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    oldPasswordRef?.current?.focus();
  }, [user]);

  return (
    <Container my={40}>
      <form onSubmit={form.onSubmit(async ({ old_password, password }) => {
          const response = await api.put('/me', { old_password, password });
          if (response.ok) {
            flash({
              message: 'Your password has been updated.',
              type: 'success',
            });
            if (user) {
              router.push('/user/' + user.username);
            }
          } else {
            form.setErrors(response.body.errors.json);
          }
        })}
      >
        <TextInput
          required
          label="Old Password"
          ref={oldPasswordRef}
          {...form.getInputProps('old_password')}
        />
        <TextInput
          required
          label="New Password"
          {...form.getInputProps('password')}
        />
        <TextInput
          required
          label="New Password Again"
          mt="md"
          {...form.getInputProps('password2')}
        />
        <Button type="submit" mt="xl">Change Password</Button>
      </form>
    </Container>
  );
}

export default PrivateRoute(ChangePasswordPage);