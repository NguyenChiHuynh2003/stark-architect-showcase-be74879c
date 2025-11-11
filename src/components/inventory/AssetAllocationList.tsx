import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Plus, ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AssetAllocationDialog } from "./AssetAllocationDialog";

interface AssetAllocation {
  id: string;
  asset_master_id: string;
  allocated_to: string;
  purpose: string;
  allocation_date: string;
  expected_return_date: string | null;
  actual_return_date: string | null;
  status: string;
  return_condition: string | null;
  reusability_percentage: number | null;
  asset_master_data: {
    asset_id: string;
    asset_name: string;
  } | null;
  allocated_to_profile?: {
    full_name: string;
  } | null;
}

export function AssetAllocationList() {
  const [allocations, setAllocations] = useState<AssetAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<AssetAllocation | null>(null);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("asset_allocations")
        .select(`
          *,
          asset_master_data(asset_id, asset_name),
          allocated_to_profile:profiles!allocated_to(full_name)
        `)
        .order("allocation_date", { ascending: false });

      if (error) throw error;
      setAllocations((data as any) || []);
    } catch (error: any) {
      toast.error("Lỗi tải dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const filteredAllocations = allocations.filter((allocation) =>
    Object.values(allocation).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-500",
      returned: "bg-blue-500",
      overdue: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "Đang sử dụng",
      returned: "Đã hoàn trả",
      overdue: "Quá hạn",
    };
    return labels[status] || status;
  };

  const handleReturn = (allocation: AssetAllocation) => {
    setSelectedAllocation(allocation);
    setReturnDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setReturnDialogOpen(false);
    setSelectedAllocation(null);
    fetchAllocations();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <Input
            placeholder="Tìm kiếm phân bổ tài sản..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchAllocations}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Phân Bổ Tài sản
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã Tài sản</TableHead>
              <TableHead>Tên Tài sản</TableHead>
              <TableHead>Người sử dụng</TableHead>
              <TableHead>Mục đích</TableHead>
              <TableHead>Ngày phân bổ</TableHead>
              <TableHead>Hạn hoàn trả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filteredAllocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filteredAllocations.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell className="font-medium">
                    {allocation.asset_master_data?.asset_id}
                  </TableCell>
                  <TableCell>{allocation.asset_master_data?.asset_name}</TableCell>
                  <TableCell>{allocation.allocated_to_profile?.full_name || "-"}</TableCell>
                  <TableCell>{allocation.purpose}</TableCell>
                  <TableCell>
                    {format(new Date(allocation.allocation_date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    {allocation.expected_return_date
                      ? format(
                          new Date(allocation.expected_return_date),
                          "dd/MM/yyyy"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(allocation.status)}>
                      {getStatusLabel(allocation.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {allocation.status === "active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReturn(allocation)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Hoàn trả
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AssetAllocationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        isReturn={false}
      />

      <AssetAllocationDialog
        open={returnDialogOpen}
        onClose={handleCloseDialog}
        isReturn={true}
        allocation={selectedAllocation}
      />
    </div>
  );
}
