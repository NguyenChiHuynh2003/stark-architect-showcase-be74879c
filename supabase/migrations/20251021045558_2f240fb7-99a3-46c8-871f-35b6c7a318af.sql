-- Add priority field to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium';

COMMENT ON COLUMN public.projects.priority IS 'Project priority: low, medium, high, urgent';