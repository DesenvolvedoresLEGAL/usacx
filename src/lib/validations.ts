import { z } from 'zod';

/**
 * Zod validation schemas for critical forms
 * Centralized validation logic for security and consistency
 */

// Login form validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido')
    .max(255, 'E-mail muito longo'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha muito longa'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup form validation
export const signupSchema = z.object({
  displayName: z
    .string()
    .max(100, 'Nome muito longo')
    .optional()
    .transform(val => val?.trim() || undefined),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido')
    .max(255, 'E-mail muito longo'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha muito longa'),
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Profile settings validation
export const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .transform(val => val.trim()),
  phone: z
    .string()
    .max(20, 'Telefone muito longo')
    .optional()
    .transform(val => val?.trim() || undefined),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Password change validation
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter letras maiúsculas, minúsculas e números'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// User creation validation (admin panel)
export const userCreateSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .transform(val => val.trim()),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido')
    .max(255, 'E-mail muito longo'),
  role: z
    .enum(['agent', 'manager', 'admin'], {
      errorMap: () => ({ message: 'Papel inválido' }),
    }),
  teamId: z
    .string()
    .uuid('ID de equipe inválido')
    .optional(),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;

// Team creation validation
export const teamCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome da equipe é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .transform(val => val.trim()),
  managerId: z
    .string()
    .uuid('ID de gestor inválido')
    .optional(),
});

export type TeamCreateFormData = z.infer<typeof teamCreateSchema>;

// Generic message/content validation
export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Mensagem não pode estar vazia')
    .max(4000, 'Mensagem muito longa'),
});

export type MessageFormData = z.infer<typeof messageSchema>;

// Helper function to format Zod errors for toast display
export const formatZodError = (error: z.ZodError): string => {
  return error.errors.map(e => e.message).join('. ');
};
