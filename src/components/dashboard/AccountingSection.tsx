import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export const AccountingSection = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Quản lý kế toán</CardTitle>
              <CardDescription>Theo dõi thu chi, báo cáo tài chính</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tổng thu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">0 đ</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tổng chi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">0 đ</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lợi nhuận</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">0 đ</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 text-center text-muted-foreground">
            <p>Chức năng quản lý kế toán đầy đủ sẽ sớm được cập nhật</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
