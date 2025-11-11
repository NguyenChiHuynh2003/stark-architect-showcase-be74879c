import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetMasterDialogProps {
  open: boolean;
  onClose: () => void;
  editingAsset?: any;
}

export function AssetMasterDialog({
  open,
  onClose,
  editingAsset,
}: AssetMasterDialogProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    asset_id: "",
    sku: "",
    asset_name: "",
    asset_type: "equipment",
    cost_center: "",
    cost_basis: "",
    activation_date: "",
    useful_life_months: "",
    amortization_period_months: "",
    depreciation_method: "straight_line",
  });

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        asset_id: editingAsset.asset_id || "",
        sku: editingAsset.sku || "",
        asset_name: editingAsset.asset_name || "",
        asset_type: editingAsset.asset_type || "equipment",
        cost_center: editingAsset.cost_center || "",
        cost_basis: editingAsset.cost_basis?.toString() || "",
        activation_date: editingAsset.activation_date || "",
        useful_life_months: editingAsset.useful_life_months?.toString() || "",
        amortization_period_months:
          editingAsset.amortization_period_months?.toString() || "",
        depreciation_method: editingAsset.depreciation_method || "straight_line",
      });
    } else {
      resetForm();
    }
  }, [editingAsset, open]);

  const resetForm = () => {
    setFormData({
      asset_id: "",
      sku: "",
      asset_name: "",
      asset_type: "equipment",
      cost_center: "",
      cost_basis: "",
      activation_date: "",
      useful_life_months: "",
      amortization_period_months: "",
      depreciation_method: "straight_line",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.asset_id || !formData.sku || !formData.asset_name) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const dataToSave = {
        asset_id: formData.asset_id,
        sku: formData.sku,
        asset_name: formData.asset_name,
        asset_type: formData.asset_type as "equipment" | "tools" | "materials",
        cost_center: formData.cost_center,
        cost_basis: parseFloat(formData.cost_basis) || 0,
        activation_date: formData.activation_date || null,
        useful_life_months: formData.useful_life_months
          ? parseInt(formData.useful_life_months)
          : null,
        amortization_period_months: formData.amortization_period_months
          ? parseInt(formData.amortization_period_months)
          : null,
        depreciation_method: formData.depreciation_method as
          | "straight_line"
          | "declining_balance"
          | "units_of_production",
        created_by: user?.id,
      };

      let error;
      if (editingAsset) {
        const { error: updateError } = await supabase
          .from("asset_master_data")
          .update(dataToSave)
          .eq("id", editingAsset.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("asset_master_data")
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(
        editingAsset ? "Cập nhật tài sản thành công" : "Thêm tài sản thành công"
      );
      onClose();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingAsset ? "Chỉnh sửa Tài sản" : "Thêm Tài sản mới"}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin Master Data của tài sản
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset_id">
                Mã Tài sản <span className="text-red-500">*</span>
              </Label>
              <Input
                id="asset_id"
                value={formData.asset_id}
                onChange={(e) =>
                  setFormData({ ...formData, asset_id: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">
                SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset_name">
              Tên Tài sản <span className="text-red-500">*</span>
            </Label>
            <Input
              id="asset_name"
              value={formData.asset_name}
              onChange={(e) =>
                setFormData({ ...formData, asset_name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asset_type">Loại Tài sản</Label>
              <Select
                value={formData.asset_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, asset_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">Thiết bị</SelectItem>
                  <SelectItem value="tools">Công cụ dụng cụ (C&C)</SelectItem>
                  <SelectItem value="materials">Vật tư</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_center">Trung tâm Chi phí</Label>
              <Input
                id="cost_center"
                value={formData.cost_center}
                onChange={(e) =>
                  setFormData({ ...formData, cost_center: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost_basis">Giá trị Gốc (₫)</Label>
              <Input
                id="cost_basis"
                type="number"
                value={formData.cost_basis}
                onChange={(e) =>
                  setFormData({ ...formData, cost_basis: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activation_date">Ngày Kích hoạt</Label>
              <Input
                id="activation_date"
                type="date"
                value={formData.activation_date}
                onChange={(e) =>
                  setFormData({ ...formData, activation_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="useful_life_months">Thời gian hữu dụng (tháng)</Label>
              <Input
                id="useful_life_months"
                type="number"
                value={formData.useful_life_months}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    useful_life_months: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amortization_period_months">
                Kỳ Phân bổ (tháng)
              </Label>
              <Input
                id="amortization_period_months"
                type="number"
                value={formData.amortization_period_months}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amortization_period_months: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="depreciation_method">Phương pháp Khấu hao</Label>
            <Select
              value={formData.depreciation_method}
              onValueChange={(value) =>
                setFormData({ ...formData, depreciation_method: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="straight_line">Đường thẳng</SelectItem>
                <SelectItem value="declining_balance">Số dư giảm dần</SelectItem>
                <SelectItem value="units_of_production">
                  Theo đơn vị sản xuất
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {editingAsset ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
