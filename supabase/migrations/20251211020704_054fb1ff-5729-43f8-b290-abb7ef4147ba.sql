
-- Drop existing restrictive policies and create new ones with full CRUD based on module access

-- =====================
-- ACCOUNTING MODULE
-- =====================

-- accounting_transactions
DROP POLICY IF EXISTS "Admins can manage transactions" ON public.accounting_transactions;
DROP POLICY IF EXISTS "Financial role access" ON public.accounting_transactions;

CREATE POLICY "Module access for accounting_transactions"
ON public.accounting_transactions
FOR ALL
USING (has_module_access(auth.uid(), 'accounting'))
WITH CHECK (has_module_access(auth.uid(), 'accounting'));

-- contracts
DROP POLICY IF EXISTS "Admins can manage contracts" ON public.contracts;
DROP POLICY IF EXISTS "Role-based contract access" ON public.contracts;

CREATE POLICY "Module access for contracts"
ON public.contracts
FOR ALL
USING (has_module_access(auth.uid(), 'accounting'))
WITH CHECK (has_module_access(auth.uid(), 'accounting'));

-- contract_guarantees
DROP POLICY IF EXISTS "Admins can manage contract guarantees" ON public.contract_guarantees;
DROP POLICY IF EXISTS "Financial role guarantee access" ON public.contract_guarantees;

CREATE POLICY "Module access for contract_guarantees"
ON public.contract_guarantees
FOR ALL
USING (has_module_access(auth.uid(), 'accounting'))
WITH CHECK (has_module_access(auth.uid(), 'accounting'));

-- =====================
-- HR MODULE
-- =====================

-- employees
DROP POLICY IF EXISTS "Admins can manage employees" ON public.employees;
DROP POLICY IF EXISTS "Role-based employee access" ON public.employees;

CREATE POLICY "Module access for employees"
ON public.employees
FOR ALL
USING (has_module_access(auth.uid(), 'hr'))
WITH CHECK (has_module_access(auth.uid(), 'hr'));

-- =====================
-- INVENTORY MODULE
-- =====================

-- asset_master_data
DROP POLICY IF EXISTS "Admins can manage asset master data" ON public.asset_master_data;
DROP POLICY IF EXISTS "Role-based asset master data access" ON public.asset_master_data;

CREATE POLICY "Module access for asset_master_data"
ON public.asset_master_data
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- inventory_items
DROP POLICY IF EXISTS "Admins can manage inventory items" ON public.inventory_items;
DROP POLICY IF EXISTS "Authenticated users can view inventory items" ON public.inventory_items;

CREATE POLICY "Module access for inventory_items"
ON public.inventory_items
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- brands
DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;
DROP POLICY IF EXISTS "Inventory users can view brands" ON public.brands;

CREATE POLICY "Module access for brands"
ON public.brands
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- product_categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.product_categories;
DROP POLICY IF EXISTS "Authenticated users can view categories" ON public.product_categories;

CREATE POLICY "Module access for product_categories"
ON public.product_categories
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- product_groups
DROP POLICY IF EXISTS "Admins can manage product groups" ON public.product_groups;
DROP POLICY IF EXISTS "Authenticated users can view product groups" ON public.product_groups;

CREATE POLICY "Module access for product_groups"
ON public.product_groups
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- asset_allocations
DROP POLICY IF EXISTS "Admins can manage allocations" ON public.asset_allocations;
DROP POLICY IF EXISTS "Users can view their allocations" ON public.asset_allocations;

CREATE POLICY "Module access for asset_allocations"
ON public.asset_allocations
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- asset_disposals
DROP POLICY IF EXISTS "Admins can manage disposals" ON public.asset_disposals;
DROP POLICY IF EXISTS "Authenticated users can view disposals" ON public.asset_disposals;

CREATE POLICY "Module access for asset_disposals"
ON public.asset_disposals
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- depreciation_schedules
DROP POLICY IF EXISTS "Admins can manage depreciation schedules" ON public.depreciation_schedules;
DROP POLICY IF EXISTS "Authenticated users can view depreciation schedules" ON public.depreciation_schedules;

CREATE POLICY "Module access for depreciation_schedules"
ON public.depreciation_schedules
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- maintenance_records
DROP POLICY IF EXISTS "Admins can manage maintenance records" ON public.maintenance_records;
DROP POLICY IF EXISTS "Authenticated users can create maintenance records" ON public.maintenance_records;
DROP POLICY IF EXISTS "Role-based maintenance records access" ON public.maintenance_records;

CREATE POLICY "Module access for maintenance_records"
ON public.maintenance_records
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- goods_receipt_notes
DROP POLICY IF EXISTS "Admins can manage GRN" ON public.goods_receipt_notes;
DROP POLICY IF EXISTS "Role-based GRN access" ON public.goods_receipt_notes;

CREATE POLICY "Module access for goods_receipt_notes"
ON public.goods_receipt_notes
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- grn_items
DROP POLICY IF EXISTS "Admins can manage GRN items" ON public.grn_items;
DROP POLICY IF EXISTS "Authenticated users can view GRN items" ON public.grn_items;

CREATE POLICY "Module access for grn_items"
ON public.grn_items
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- handover_slips
DROP POLICY IF EXISTS "Admins can manage handover slips" ON public.handover_slips;
DROP POLICY IF EXISTS "Users can view handover slips" ON public.handover_slips;

CREATE POLICY "Module access for handover_slips"
ON public.handover_slips
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- asset_location_history
DROP POLICY IF EXISTS "Authenticated users can create location history" ON public.asset_location_history;
DROP POLICY IF EXISTS "Authenticated users can view location history" ON public.asset_location_history;

CREATE POLICY "Module access for asset_location_history"
ON public.asset_location_history
FOR ALL
USING (has_module_access(auth.uid(), 'inventory'))
WITH CHECK (has_module_access(auth.uid(), 'inventory'));

-- =====================
-- PROJECTS MODULE
-- =====================

-- projects
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Project creators and admins can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Project creators and admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view projects they're involved in" ON public.projects;

CREATE POLICY "Module access for projects"
ON public.projects
FOR ALL
USING (has_module_access(auth.uid(), 'projects'))
WITH CHECK (has_module_access(auth.uid(), 'projects'));

-- team_members
DROP POLICY IF EXISTS "Project owners can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view team members in their projects" ON public.team_members;

CREATE POLICY "Module access for team_members"
ON public.team_members
FOR ALL
USING (has_module_access(auth.uid(), 'projects'))
WITH CHECK (has_module_access(auth.uid(), 'projects'));

-- project_items
DROP POLICY IF EXISTS "Project owners can manage items" ON public.project_items;
DROP POLICY IF EXISTS "Team members can view project items" ON public.project_items;

CREATE POLICY "Module access for project_items"
ON public.project_items
FOR ALL
USING (has_module_access(auth.uid(), 'projects'))
WITH CHECK (has_module_access(auth.uid(), 'projects'));

-- project_kpis
DROP POLICY IF EXISTS "Project owners can manage KPIs" ON public.project_kpis;
DROP POLICY IF EXISTS "Team members can view project KPIs" ON public.project_kpis;

CREATE POLICY "Module access for project_kpis"
ON public.project_kpis
FOR ALL
USING (has_module_access(auth.uid(), 'projects'))
WITH CHECK (has_module_access(auth.uid(), 'projects'));

-- client_requirements
DROP POLICY IF EXISTS "Project owners can manage requirements" ON public.client_requirements;
DROP POLICY IF EXISTS "Users can view requirements in their projects" ON public.client_requirements;

CREATE POLICY "Module access for client_requirements"
ON public.client_requirements
FOR ALL
USING (has_module_access(auth.uid(), 'projects'))
WITH CHECK (has_module_access(auth.uid(), 'projects'));

-- materials
DROP POLICY IF EXISTS "Project owners can manage materials" ON public.materials;
DROP POLICY IF EXISTS "Users can view materials in their projects" ON public.materials;

CREATE POLICY "Module access for materials"
ON public.materials
FOR ALL
USING (has_module_access(auth.uid(), 'projects'))
WITH CHECK (has_module_access(auth.uid(), 'projects'));

-- =====================
-- TASKS MODULE
-- =====================

-- tasks
DROP POLICY IF EXISTS "Task creators and project owners can delete tasks" ON public.tasks;
DROP POLICY IF EXISTS "Task creators and project owners can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks in their projects" ON public.tasks;
DROP POLICY IF EXISTS "Users can view tasks in their projects" ON public.tasks;

CREATE POLICY "Module access for tasks"
ON public.tasks
FOR ALL
USING (has_module_access(auth.uid(), 'tasks'))
WITH CHECK (has_module_access(auth.uid(), 'tasks'));
