import { useEffect, useRef } from 'react';
import {
  Button,
  Container,
  Paper,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useApi } from '../contexts/ApiProvider';
import { useFlash } from '../contexts/FlashProvider';
import PublicRoute from '../components/PublicRoute';

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: 'Invalid email' }),
});

function ResetRequestPage() {
  const api = useApi();
  const flash = useFlash();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      email: '',
    },
  });
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  return (
    <Container size={420} my={40}>
      <Title align="center">Reset Your Password</Title>
      <Paper withBorder p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(async ({ email }) => {
            const data = await api.post('/tokens/reset', { email });
            if (data.ok) {
              flash({
                message: 'You will receive an email with instructions to reset your password.',
                type: 'info',
              });
              if (emailRef && emailRef.current) {
                emailRef.current.value = '';
              }
            } else {
              form.setErrors(data.body.errors.json);
            }
          })}
        >
          <TextInput
            required
            label="Email Address"
            ref={emailRef}
            {...form.getInputProps('email')}
          />
          <Button type="submit" fullWidth mt="xl">Reset Password</Button>
        </form>
      </Paper>
    </Container>
  );
}

export default PublicRoute(ResetRequestPage);