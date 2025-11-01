-- Create accounting transactions table
CREATE TABLE public.accounting_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  description TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.accounting_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage transactions"
ON public.accounting_transactions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view transactions"
ON public.accounting_transactions
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_accounting_transactions_updated_at
BEFORE UPDATE ON public.accounting_transactions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for better performance
CREATE INDEX idx_accounting_transactions_date ON public.accounting_transactions(transaction_date DESC);
CREATE INDEX idx_accounting_transactions_type ON public.accounting_transactions(transaction_type);
CREATE INDEX idx_accounting_transactions_project ON public.accounting_transactions(project_id);