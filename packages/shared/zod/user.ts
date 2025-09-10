import * as z from 'zod';

export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SigninForm = z.infer<typeof signinSchema>;
export type SignupForm = z.infer<typeof signupSchema>;