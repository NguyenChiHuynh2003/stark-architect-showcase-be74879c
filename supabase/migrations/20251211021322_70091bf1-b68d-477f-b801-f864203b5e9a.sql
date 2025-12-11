-- Add new columns for the updated asset master structure
ALTER TABLE public.asset_master_data 
ADD COLUMN IF NOT EXISTS quantity_supplied_previous numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS quantity_per_contract numeric DEFAULT 0;