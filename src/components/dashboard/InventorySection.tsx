import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, List, Tag, Award, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryList } from "@/components/inventory/InventoryList";
import { CategoriesManager } from "@/components/inventory/CategoriesManager";
import { BrandsManager } from "@/components/inventory/BrandsManager";
import { ProductGroupsManager } from "@/components/inventory/ProductGroupsManager";

export const InventorySection = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  const menuItems = [
    { id: "inventory", label: "Tồn kho", icon: Package },
    { id: "categories", label: "Phân loại", icon: List },
    { id: "brands", label: "Thương hiệu", icon: Award },
    { id: "groups", label: "Nhóm hàng", icon: Boxes },
  ];

  return (
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
  );
};
