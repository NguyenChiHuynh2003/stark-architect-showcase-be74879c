-- Create table for client requirements
CREATE TABLE public.client_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  requirement_title TEXT NOT NULL,
  requirement_description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_to UUID,
  due_date DATE,
  completion_percentage NUMERIC DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view requirements in their projects"
ON public.client_requirements
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = client_requirements.project_id
    AND (
      projects.created_by = auth.uid()
      OR has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.project_id = projects.id
        AND team_members.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Project owners can manage requirements"
ON public.client_requirements
FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = client_requirements.project_id
    AND projects.created_by = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_client_requirements_updated_at
BEFORE UPDATE ON public.client_requirements
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add index for better performance
CREATE INDEX idx_client_requirements_project_id ON public.client_requirements(project_id);
CREATE INDEX idx_client_requirements_assigned_to ON public.client_requirements(assigned_to);