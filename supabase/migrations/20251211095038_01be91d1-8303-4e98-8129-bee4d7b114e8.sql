
-- Create security definer function to check team membership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id uuid, _project_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members tm
    WHERE tm.project_id = _project_id
      AND tm.user_id = _user_id
  )
$$;

-- Create security definer function to check project ownership
CREATE OR REPLACE FUNCTION public.is_project_owner(_user_id uuid, _project_id uuid)
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
      AND p.created_by = _user_id
  )
$$;

-- Drop and recreate projects SELECT policy using the new functions
DROP POLICY IF EXISTS "Users can view projects they're involved in" ON public.projects;
CREATE POLICY "Users can view projects they're involved in"
ON public.projects
FOR SELECT
USING (
  auth.uid() = created_by
  OR public.has_role(auth.uid(), 'admin')
  OR public.is_team_member(auth.uid(), id)
);

-- Update team_members policies to use security definer function
DROP POLICY IF EXISTS "Project owners can manage team members" ON public.team_members;
CREATE POLICY "Project owners can manage team members"
ON public.team_members
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.is_project_owner(auth.uid(), project_id)
);

DROP POLICY IF EXISTS "Users can view team members in their projects" ON public.team_members;
CREATE POLICY "Users can view team members in their projects"
ON public.team_members
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.is_project_owner(auth.uid(), project_id)
  OR user_id = auth.uid()
);
