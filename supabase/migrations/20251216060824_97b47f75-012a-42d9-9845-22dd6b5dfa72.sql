-- Create accounting_transactions table
CREATE TABLE public.accounting_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    position TEXT,
    department TEXT,
    hire_date DATE,
    status TEXT DEFAULT 'active',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority TEXT DEFAULT 'medium',
    due_date DATE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    assigned_to UUID,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    product_code TEXT,
    quantity INTEGER DEFAULT 0,
    unit TEXT,
    unit_price NUMERIC DEFAULT 0,
    category TEXT,
    location TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_items table
CREATE TABLE public.project_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.accounting_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for accounting_transactions
CREATE POLICY "Users can view all transactions" ON public.accounting_transactions FOR SELECT USING (true);
CREATE POLICY "Users can create transactions" ON public.accounting_transactions FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update transactions" ON public.accounting_transactions FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete transactions" ON public.accounting_transactions FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for employees
CREATE POLICY "Users can view all employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Users can create employees" ON public.employees FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update employees" ON public.employees FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete employees" ON public.employees FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for tasks
CREATE POLICY "Users can view all tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update tasks" ON public.tasks FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete tasks" ON public.tasks FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for inventory_items
CREATE POLICY "Users can view all inventory" ON public.inventory_items FOR SELECT USING (true);
CREATE POLICY "Users can create inventory" ON public.inventory_items FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update inventory" ON public.inventory_items FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete inventory" ON public.inventory_items FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for project_items
CREATE POLICY "Users can view all project items" ON public.project_items FOR SELECT USING (true);
CREATE POLICY "Users can manage project items" ON public.project_items FOR ALL USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_accounting_transactions_updated_at BEFORE UPDATE ON public.accounting_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_items_updated_at BEFORE UPDATE ON public.project_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();