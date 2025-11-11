import { useState } from "react";
import { Database, FileText, UserCog, Package, List, Award, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryList } from "@/components/inventory/InventoryList";
import { CategoriesManager } from "@/components/inventory/CategoriesManager";
import { BrandsManager } from "@/components/inventory/BrandsManager";
import { ProductGroupsManager } from "@/components/inventory/ProductGroupsManager";
import { AssetMasterList } from "@/components/inventory/AssetMasterList";
import { GRNList } from "@/components/inventory/GRNList";
import { AssetAllocationList } from "@/components/inventory/AssetAllocationList";

export const InventorySection = () => {
  const [activeTab, setActiveTab] = useState("assets");

  const menuItems = [
    { id: "assets", label: "Tài sản Master", icon: Database },
    { id: "grn", label: "Phiếu Nhập Kho", icon: FileText },
    { id: "allocation", label: "Phân Bổ & Hoàn Trả", icon: UserCog },
    { id: "inventory", label: "Tồn kho", icon: Package },
    { id: "categories", label: "Phân loại", icon: List },
    { id: "brands", label: "Thương hiệu", icon: Award },
    { id: "groups", label: "Nhóm hàng", icon: Boxes },
  ];

  return (
    <div>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle>Hệ thống RAT - Rosetta Assets Tracker</CardTitle>
          <CardDescription>
            Quản lý tài sản theo 3 luồng: Nhập Kho & Kích hoạt → Phân Bổ & Theo Dõi → Hoàn Trả & Thanh Lý
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex gap-4">
        <aside className="w-56 space-y-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Danh mục</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start mb-1"
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1">
          {activeTab === "assets" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Dữ Liệu Tài Sản Master (Asset Master Data)</CardTitle>
                    <CardDescription>
                      Luồng 1: Tạo và quản lý thông tin gốc của tài sản
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AssetMasterList />
              </CardContent>
            </Card>
          )}

          {activeTab === "grn" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Phiếu Nhập Kho (GRN)</CardTitle>
                    <CardDescription>
                      Luồng 1: Ghi nhận việc nhập tài sản vào kho
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <GRNList />
              </CardContent>
            </Card>
          )}

          {activeTab === "allocation" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <UserCog className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Phân Bổ & Hoàn Trả Tài Sản</CardTitle>
                    <CardDescription>
                      Luồng 2 & 3: Theo dõi việc bàn giao, sử dụng và hoàn trả
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AssetAllocationList />
              </CardContent>
            </Card>
          )}

          {activeTab === "inventory" && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Quản lý tồn kho</CardTitle>
                    <CardDescription>Theo dõi và quản lý hàng hóa trong kho</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <InventoryList />
              </CardContent>
            </Card>
          )}

          {activeTab === "categories" && <CategoriesManager />}
          {activeTab === "brands" && <BrandsManager />}
          {activeTab === "groups" && <ProductGroupsManager />}
        </div>
      </div>
    </div>
  );
};
