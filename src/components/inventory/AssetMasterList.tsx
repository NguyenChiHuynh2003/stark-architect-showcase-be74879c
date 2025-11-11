import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Plus, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AssetMasterDialog } from "./AssetMasterDialog";

interface AssetMaster {
  id: string;
  asset_id: string;
  sku: string;
  asset_name: string;
  asset_type: string;
  cost_center: string;
  cost_basis: number;
  activation_date: string | null;
  current_status: string;
  nbv: number;
  accumulated_depreciation: number;
  total_maintenance_cost: number;
}

export function AssetMasterList() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<AssetMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetMaster | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("asset_master_data")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error: any) {
      toast.error("Lỗi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter((asset) =>
    Object.values(asset).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      in_stock: "bg-blue-500",
      active: "bg-green-500",
      allocated: "bg-yellow-500",
      under_maintenance: "bg-orange-500",
      ready_for_reallocation: "bg-purple-500",
      disposed: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      in_stock: "Trong kho",
      active: "Đang hoạt động",
      allocated: "Đã phân bổ",
      under_maintenance: "Bảo trì",
      ready_for_reallocation: "Sẵn sàng tái phân bổ",
      disposed: "Đã thanh lý",
    };
    return labels[status] || status;
  };

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      equipment: "Thiết bị",
      tools: "Công cụ dụng cụ",
      materials: "Vật tư",
    };
    return labels[type] || type;
  };

  const handleEdit = (asset: AssetMaster) => {
    setEditingAsset(asset);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAsset(null);
    fetchAssets();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <Input
            placeholder="Tìm kiếm tài sản..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchAssets}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm Tài sản
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã Tài sản</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Tên Tài sản</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Trung tâm CP</TableHead>
              <TableHead className="text-right">Giá trị Gốc</TableHead>
              <TableHead className="text-right">NBV</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.asset_id}</TableCell>
                  <TableCell>{asset.sku}</TableCell>
                  <TableCell>{asset.asset_name}</TableCell>
                  <TableCell>{getAssetTypeLabel(asset.asset_type)}</TableCell>
                  <TableCell>{asset.cost_center}</TableCell>
                  <TableCell className="text-right">
                    {Number(asset.cost_basis).toLocaleString("vi-VN")} ₫
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(asset.nbv).toLocaleString("vi-VN")} ₫
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(asset.current_status)}>
                      {getStatusLabel(asset.current_status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(asset)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AssetMasterDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        editingAsset={editingAsset}
      />
    </div>
  );
}
