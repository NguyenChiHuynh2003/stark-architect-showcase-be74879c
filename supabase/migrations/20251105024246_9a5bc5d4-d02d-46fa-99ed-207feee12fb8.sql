-- Create contracts table for managing construction contracts
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  is_appendix BOOLEAN NOT NULL DEFAULT false,
  parent_contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  contract_type TEXT NOT NULL DEFAULT 'Thi công',
  contract_value NUMERIC NOT NULL DEFAULT 0,
  payment_value NUMERIC NOT NULL DEFAULT 0,
  effective_date DATE,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contract guarantees table
CREATE TABLE public.contract_guarantees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  guarantee_type TEXT NOT NULL,
  guarantee_number TEXT,
  guarantee_value NUMERIC NOT NULL DEFAULT 0,
  issue_date DATE,
  expiry_date DATE,
  issuing_bank TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_guarantees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contracts
CREATE POLICY "Admins can manage contracts"
  ON public.contracts
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view contracts"
  ON public.contracts
  FOR SELECT
  USING (true);

-- RLS Policies for contract_guarantees
CREATE POLICY "Admins can manage contract guarantees"
  ON public.contract_guarantees
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view contract guarantees"
  ON public.contract_guarantees
  FOR SELECT
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_contract_guarantees_updated_at
  BEFORE UPDATE ON public.contract_guarantees
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();