-- Create storage buckets for employee photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('employee-photos', 'employee-photos', false);

-- Storage policies for employee photos
CREATE POLICY "Authenticated users can view employee photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'employee-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can upload employee photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'employee-photos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update employee photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'employee-photos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete employee photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'employee-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  date_joined DATE NOT NULL DEFAULT CURRENT_DATE,
  position TEXT,
  department TEXT,
  phone TEXT,
  employee_card_photo_url TEXT,
  id_card_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view employees"
ON public.employees FOR SELECT
USING (true);

CREATE POLICY "Admins can manage employees"
ON public.employees FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();