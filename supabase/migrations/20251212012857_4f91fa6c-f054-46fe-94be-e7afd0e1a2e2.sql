-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;

-- Create a more restrictive policy that only allows:
-- 1. Admins can view all employees
-- 2. HR Admins can view all employees
-- 3. Users can view their own employee record (if linked via user_id)
CREATE POLICY "Admins and HR can view all employees, users can view own record"
  ON public.employees FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'hr_admin'::app_role)
    OR user_id = auth.uid()
  );