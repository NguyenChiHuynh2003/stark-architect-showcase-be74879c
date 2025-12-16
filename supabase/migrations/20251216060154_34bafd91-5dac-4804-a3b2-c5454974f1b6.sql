-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  project_code TEXT,
  client_name TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create contracts table
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT NOT NULL,
  client_name TEXT,
  is_appendix BOOLEAN DEFAULT false,
  project_id UUID REFERENCES public.projects(id),
  contract_type TEXT,
  contract_value NUMERIC,
  payment_value NUMERIC,
  effective_date DATE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create contract_guarantees table
CREATE TABLE public.contract_guarantees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts(id),
  guarantee_type TEXT NOT NULL,
  guarantee_number TEXT,
  guarantee_value NUMERIC,
  issuing_bank TEXT,
  issue_date DATE,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_guarantees ENABLE ROW LEVEL SECURITY;

-- RLS policies for projects
CREATE POLICY "Users can view all projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update projects" ON public.projects FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete projects" ON public.projects FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for contracts
CREATE POLICY "Users can view all contracts" ON public.contracts FOR SELECT USING (true);
CREATE POLICY "Users can create contracts" ON public.contracts FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update contracts" ON public.contracts FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete contracts" ON public.contracts FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for contract_guarantees
CREATE POLICY "Users can view all guarantees" ON public.contract_guarantees FOR SELECT USING (true);
CREATE POLICY "Users can create guarantees" ON public.contract_guarantees FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update guarantees" ON public.contract_guarantees FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete guarantees" ON public.contract_guarantees FOR DELETE USING (auth.uid() = created_by);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contract_guarantees_updated_at BEFORE UPDATE ON public.contract_guarantees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();