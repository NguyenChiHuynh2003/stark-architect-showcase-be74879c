-- Tạo enum cho loại tài sản
CREATE TYPE asset_type AS ENUM ('equipment', 'tools', 'materials');

-- Tạo enum cho phương pháp khấu hao
CREATE TYPE depreciation_method AS ENUM ('straight_line', 'declining_balance', 'units_of_production');

-- Tạo enum cho trạng thái tài sản
CREATE TYPE asset_status AS ENUM ('in_stock', 'active', 'allocated', 'under_maintenance', 'ready_for_reallocation', 'disposed');

-- Tạo enum cho trạng thái phiếu bàn giao
CREATE TYPE handover_status AS ENUM ('active', 'returned', 'overdue');

-- Bảng Master Data của Tài sản (Asset Master Data)
CREATE TABLE public.asset_master_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id TEXT UNIQUE NOT NULL, -- Mã định danh tài sản
  sku TEXT NOT NULL, -- Mã SKU
  asset_name TEXT NOT NULL,
  asset_type asset_type NOT NULL,
  cost_center TEXT NOT NULL, -- Trung tâm chi phí
  cost_basis NUMERIC NOT NULL DEFAULT 0, -- Giá trị gốc
  activation_date DATE, -- Ngày kích hoạt sử dụng
  useful_life_months INTEGER, -- Thời gian hữu dụng (tháng)
  amortization_period_months INTEGER, -- Kỳ phân bổ (tháng)
  depreciation_method depreciation_method, -- Phương pháp khấu hao
  current_status asset_status NOT NULL DEFAULT 'in_stock',
  nbv NUMERIC DEFAULT 0, -- Net Book Value (Giá trị sổ sách ròng)
  accumulated_depreciation NUMERIC DEFAULT 0, -- Khấu hao lũy kế
  total_maintenance_cost NUMERIC DEFAULT 0, -- Chi phí O&M lũy kế
  inventory_item_id UUID REFERENCES public.inventory_items(id), -- Liên kết với kho
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bảng Phiếu Nhập Kho (Goods Receipt Note - GRN)
CREATE TABLE public.goods_receipt_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_number TEXT UNIQUE NOT NULL,
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  supplier TEXT,
  total_value NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bảng Chi tiết Phiếu Nhập Kho
CREATE TABLE public.grn_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_id UUID REFERENCES public.goods_receipt_notes(id) ON DELETE CASCADE NOT NULL,
  asset_master_id UUID REFERENCES public.asset_master_data(id) ON DELETE CASCADE NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_cost NUMERIC NOT NULL DEFAULT 0,
  total_cost NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bảng Lịch Khấu hao (Depreciation Schedule)
CREATE TABLE public.depreciation_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_master_id UUID REFERENCES public.asset_master_data(id) ON DELETE CASCADE NOT NULL,
  period_date DATE NOT NULL,
  depreciation_amount NUMERIC NOT NULL DEFAULT 0,
  accumulated_depreciation NUMERIC NOT NULL DEFAULT 0,
  nbv NUMERIC NOT NULL DEFAULT 0,
  is_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bảng Phân Bổ Tài Sản (Asset Allocation)
CREATE TABLE public.asset_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_master_id UUID REFERENCES public.asset_master_data(id) ON DELETE CASCADE NOT NULL,
  allocated_to UUID REFERENCES auth.users(id) NOT NULL, -- Người chịu trách nhiệm
  allocated_by UUID REFERENCES auth.users(id) NOT NULL,
  purpose TEXT NOT NULL, -- Mục đích sử dụng
  project_id UUID REFERENCES public.projects(id), -- Dự án liên quan (nếu có)
  allocation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expected_return_date DATE, -- Thời hạn dự kiến hoàn trả
  actual_return_date TIMESTAMP WITH TIME ZONE, -- Ngày hoàn trả thực tế
  status handover_status NOT NULL DEFAULT 'active',
  return_condition TEXT, -- Tình trạng khi hoàn trả (%, mô tả)
  reusability_percentage NUMERIC, -- Phần trăm tái sử dụng (0-100)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bảng Phiếu Bàn Giao (Handover Slips)
CREATE TABLE public.handover_slips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slip_number TEXT UNIQUE NOT NULL,
  allocation_id UUID REFERENCES public.asset_allocations(id) ON DELETE CASCADE NOT NULL,
  handover_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location TEXT, -- Vị trí bàn giao
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bảng Bảo Trì & Sửa Chữa (Maintenance Records)
CREATE TABLE public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_master_id UUID REFERENCES public.asset_master_data(id) ON DELETE CASCADE NOT NULL,
  maintenance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  maintenance_type TEXT NOT NULL, -- Loại bảo trì: sửa chữa, bảo dưỡng định kỳ, etc.
  description TEXT,
  cost NUMERIC NOT NULL DEFAULT 0,
  vendor TEXT, -- Nhà cung cấp dịch vụ
  reported_by UUID REFERENCES auth.users(id),
  performed_by TEXT, -- Người/đơn vị thực hiện
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bảng Thanh Lý (Asset Disposal)
CREATE TABLE public.asset_disposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_master_id UUID REFERENCES public.asset_master_data(id) ON DELETE CASCADE NOT NULL,
  disposal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  disposal_reason TEXT NOT NULL,
  nbv_at_disposal NUMERIC NOT NULL DEFAULT 0, -- NBV tại thời điểm thanh lý
  sale_price NUMERIC DEFAULT 0, -- Giá bán thực tế
  gain_loss NUMERIC DEFAULT 0, -- Lãi/Lỗ = Sale Price - NBV
  approved_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bảng Lịch sử Vị trí (Location History - cho tracking)
CREATE TABLE public.asset_location_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_master_id UUID REFERENCES public.asset_master_data(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  moved_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Trigger cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_asset_master_data_updated_at
  BEFORE UPDATE ON public.asset_master_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goods_receipt_notes_updated_at
  BEFORE UPDATE ON public.goods_receipt_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_allocations_updated_at
  BEFORE UPDATE ON public.asset_allocations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_records_updated_at
  BEFORE UPDATE ON public.maintenance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_disposals_updated_at
  BEFORE UPDATE ON public.asset_disposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.asset_master_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_receipt_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grn_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depreciation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_disposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_location_history ENABLE ROW LEVEL SECURITY;

-- Policy cho asset_master_data
CREATE POLICY "Authenticated users can view asset master data"
  ON public.asset_master_data FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage asset master data"
  ON public.asset_master_data FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Policy cho goods_receipt_notes
CREATE POLICY "Authenticated users can view GRN"
  ON public.goods_receipt_notes FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage GRN"
  ON public.goods_receipt_notes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Policy cho grn_items
CREATE POLICY "Authenticated users can view GRN items"
  ON public.grn_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage GRN items"
  ON public.grn_items FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Policy cho depreciation_schedules
CREATE POLICY "Authenticated users can view depreciation schedules"
  ON public.depreciation_schedules FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage depreciation schedules"
  ON public.depreciation_schedules FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Policy cho asset_allocations
CREATE POLICY "Users can view their allocations"
  ON public.asset_allocations FOR SELECT
  USING (auth.uid() = allocated_to OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage allocations"
  ON public.asset_allocations FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Policy cho handover_slips
CREATE POLICY "Users can view handover slips"
  ON public.handover_slips FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage handover slips"
  ON public.handover_slips FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Policy cho maintenance_records
CREATE POLICY "Authenticated users can view maintenance records"
  ON public.maintenance_records FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create maintenance records"
  ON public.maintenance_records FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins can manage maintenance records"
  ON public.maintenance_records FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Policy cho asset_disposals
CREATE POLICY "Authenticated users can view disposals"
  ON public.asset_disposals FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage disposals"
  ON public.asset_disposals FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Policy cho asset_location_history
CREATE POLICY "Authenticated users can view location history"
  ON public.asset_location_history FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create location history"
  ON public.asset_location_history FOR INSERT
  WITH CHECK (auth.uid() = moved_by);

-- Indexes để tối ưu performance
CREATE INDEX idx_asset_master_asset_id ON public.asset_master_data(asset_id);
CREATE INDEX idx_asset_master_status ON public.asset_master_data(current_status);
CREATE INDEX idx_asset_allocations_user ON public.asset_allocations(allocated_to);
CREATE INDEX idx_asset_allocations_status ON public.asset_allocations(status);
CREATE INDEX idx_maintenance_asset ON public.maintenance_records(asset_master_id);
CREATE INDEX idx_depreciation_asset ON public.depreciation_schedules(asset_master_id);