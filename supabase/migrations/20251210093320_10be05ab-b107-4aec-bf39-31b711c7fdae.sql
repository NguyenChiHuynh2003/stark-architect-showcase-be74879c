-- Create user_permissions table to store module access
CREATE TABLE public.user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  allowed_modules text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Only admins can manage permissions
CREATE POLICY "Admins can manage permissions"
ON public.user_permissions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own permissions
CREATE POLICY "Users can view own permissions"
ON public.user_permissions
FOR SELECT
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_permissions_updated_at
BEFORE UPDATE ON public.user_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check module access
CREATE OR REPLACE FUNCTION public.has_module_access(_user_id uuid, _module text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    -- Admins have access to everything
    has_role(_user_id, 'admin'::app_role)
    OR
    -- Check if module is in allowed_modules array
    EXISTS (
      SELECT 1
      FROM public.user_permissions
      WHERE user_id = _user_id
        AND _module = ANY(allowed_modules)
    )
$$;

-- Migrate existing role permissions to new table
INSERT INTO public.user_permissions (user_id, allowed_modules)
SELECT 
  ur.user_id,
  CASE ur.role
    WHEN 'admin' THEN ARRAY['overview', 'projects', 'closed-projects', 'tasks', 'hr', 'accounting', 'inventory', 'reports', 'settings', 'admin-users']
    WHEN 'accountant' THEN ARRAY['overview', 'accounting', 'inventory', 'projects', 'closed-projects']
    WHEN 'hr_admin' THEN ARRAY['overview', 'tasks', 'hr']
    WHEN 'project_manager' THEN ARRAY['overview', 'projects', 'closed-projects', 'tasks', 'inventory']
    ELSE ARRAY['overview']
  END
FROM public.user_roles ur
ON CONFLICT (user_id) DO NOTHING;