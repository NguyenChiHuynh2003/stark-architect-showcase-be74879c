-- Drop the existing foreign key constraint that references auth.users
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;

-- Add new foreign key constraint to reference employees table
ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_assigned_to_fkey 
FOREIGN KEY (assigned_to) REFERENCES public.employees(id) ON DELETE SET NULL;