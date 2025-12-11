
-- Create security definer function to check project access without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.user_can_access_project(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = _project_id
      AND (
        p.created_by = _user_id
        OR public.has_role(_user_id, 'admin')
        OR EXISTS (
          SELECT 1
          FROM public.team_members tm
          WHERE tm.project_id = p.id
            AND tm.user_id = _user_id
        )
      )
  )
$$;

-- Drop and recreate tasks policies using the new function
DROP POLICY IF EXISTS "Users can view tasks in their projects" ON public.tasks;
CREATE POLICY "Users can view tasks in their projects"
ON public.tasks
FOR SELECT
USING (public.user_can_access_project(auth.uid(), project_id));

DROP POLICY IF EXISTS "Users can create tasks in their projects" ON public.tasks;
CREATE POLICY "Users can create tasks in their projects"
ON public.tasks
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND public.user_can_access_project(auth.uid(), project_id)
);

DROP POLICY IF EXISTS "Task creators and project owners can update tasks" ON public.tasks;
CREATE POLICY "Task creators and project owners can update tasks"
ON public.tasks
FOR UPDATE
USING (
  auth.uid() = created_by
  OR public.has_role(auth.uid(), 'admin')
  OR public.user_can_access_project(auth.uid(), project_id)
);

DROP POLICY IF EXISTS "Task creators and project owners can delete tasks" ON public.tasks;
CREATE POLICY "Task creators and project owners can delete tasks"
ON public.tasks
FOR DELETE
USING (
  auth.uid() = created_by
  OR public.has_role(auth.uid(), 'admin')
  OR public.user_can_access_project(auth.uid(), project_id)
);
