import z from 'zod';

export const SignUpSchema = z.object({
  account: z.object({
    name: z.string().nonempty('Name is requered'),
    email: z
      .string()
      .nonempty('Email is requered')
      .pipe(z.email({ message: 'Invalid email' })),
    password: z.string().nonempty('Password is requered').min(8, 'Password required 8 character'),
  }),
});

export type SignUpBody = z.infer<typeof SignUpSchema>
