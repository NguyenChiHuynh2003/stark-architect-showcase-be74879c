-- Add new columns to asset_master_data based on Excel structure
ALTER TABLE public.asset_master_data
ADD COLUMN IF NOT EXISTS brand text,
ADD COLUMN IF NOT EXISTS unit text DEFAULT 'Cái',
ADD COLUMN IF NOT EXISTS quantity_requested numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS installation_scope text,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS project_name text,
ADD COLUMN IF NOT EXISTS project_location text,
ADD COLUMN IF NOT EXISTS category text;