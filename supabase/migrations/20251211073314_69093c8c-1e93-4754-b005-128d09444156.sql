-- Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Add storage policies for employee-photos bucket
-- Allow admins to upload employee photos
CREATE POLICY "Admins can upload employee photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'employee-photos' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to view employee photos
CREATE POLICY "Admins can view employee photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'employee-photos' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to update employee photos
CREATE POLICY "Admins can update employee photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'employee-photos' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to delete employee photos
CREATE POLICY "Admins can delete employee photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'employee-photos' AND
  public.has_role(auth.uid(), 'admin'::public.app_role)
);