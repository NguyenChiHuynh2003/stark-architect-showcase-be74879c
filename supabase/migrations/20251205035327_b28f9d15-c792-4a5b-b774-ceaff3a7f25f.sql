-- Add new roles to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'accountant';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'project_manager';