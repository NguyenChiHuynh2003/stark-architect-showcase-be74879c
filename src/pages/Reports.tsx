import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FileText, TrendingUp, Users, Package, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Reports() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("reports");
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [projectStats, setProjectStats] = useState<any[]>([]);
  const [accountingData, setAccountingData] = useState<any[]>([]);
  const [employeeStats, setEmployeeStats] = useState<any[]>([]);
  const [inventoryStats, setInventoryStats] = useState<any[]>([]);
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    profit: 0,
  });

  const handleSectionChange = (section: string) => {
    if (section !== "reports") {
      navigate("/dashboard");
    }
    setActiveSection(section);
  };

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProjectStats(),
      fetchAccountingData(),
      fetchEmployeeStats(),
      fetchInventoryStats(),
    ]);
    setLoading(false);
  };

  const fetchProjectStats = async () => {
    try {
      const { data: projects } = await supabase
        .from("projects")
        .select("id, name, status, budget");

      if (!projects) return;

      const statusCounts = projects.reduce((acc: any, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status === "planning" ? "Lên kế hoạch" :
              status === "in_progress" ? "Đang thực hiện" :
              status === "on_hold" ? "Tạm dừng" :
              status === "completed" ? "Hoàn thành" : "Đã hủy",
        value: count,
      }));

      setProjectStats(chartData);
    } catch (error) {
      console.error("Error fetching project stats:", error);
    }
  };

  const fetchAccountingData = async () => {
    try {
      const now = new Date();
      let startDate: Date;

      if (timeRange === "week") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timeRange === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        startDate = new Date(now.getFullYear(), 0, 1);
      }

      const { data: transactions } = await supabase
        .from("accounting_transactions")
        .select("*")
        .gte("transaction_date", startDate.toISOString().split("T")[0]);

      if (!transactions) return;

      const income = transactions
        .filter((t) => t.transaction_type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = transactions
        .filter((t) => t.transaction_type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setFinancialSummary({
        totalIncome: income,
        totalExpense: expense,
        profit: income - expense,
      });

      // Group by category
      const categoryData = transactions.reduce((acc: any, t) => {
        const key = t.category;
        if (!acc[key]) {
          acc[key] = { name: key, income: 0, expense: 0 };
        }
        if (t.transaction_type === "income") {
          acc[key].income += Number(t.amount);
        } else {
          acc[key].expense += Number(t.amount);
        }
        return acc;
      }, {});

      setAccountingData(Object.values(categoryData));
    } catch (error) {
      console.error("Error fetching accounting data:", error);
    }
  };

  const fetchEmployeeStats = async () => {
    try {
      const { data: employees } = await supabase
        .from("employees")
        .select("department");

      if (!employees) return;

      const deptCounts = employees.reduce((acc: any, emp) => {
        const dept = emp.department || "Chưa phân loại";
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(deptCounts).map(([name, value]) => ({
        name,
        value,
      }));

      setEmployeeStats(chartData);
    } catch (error) {
      console.error("Error fetching employee stats:", error);
    }
  };

  const fetchInventoryStats = async () => {
    try {
      const { data: items } = await supabase
        .from("inventory_items")
        .select("product_name, stock_quantity, retail_price");

      if (!items) return;

      const topItems = items
        .sort((a, b) => Number(b.stock_quantity) - Number(a.stock_quantity))
        .slice(0, 10)
        .map((item) => ({
          name: item.product_name.length > 20 
            ? item.product_name.substring(0, 20) + "..." 
            : item.product_name,
          quantity: Number(item.stock_quantity),
          value: Number(item.stock_quantity) * Number(item.retail_price),
        }));

      setInventoryStats(topItems);
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar activeSection={activeSection} setActiveSection={handleSectionChange} />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Báo cáo</h1>
            <p className="text-muted-foreground">Thống kê và phân tích dữ liệu</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Tổng thu</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(financialSummary.totalIncome)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Tổng chi</CardTitle>
                <DollarSign className="w-4 h-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(financialSummary.totalExpense)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Lợi nhuận</CardTitle>
                <FileText className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${financialSummary.profit >= 0 ? "text-primary" : "text-red-600"}`}>
                {formatCurrency(financialSummary.profit)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Dự án</TabsTrigger>
            <TabsTrigger value="accounting">Kế toán</TabsTrigger>
            <TabsTrigger value="employees">Nhân sự</TabsTrigger>
            <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái dự án</CardTitle>
                <CardDescription>Phân bố dự án theo trạng thái</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Đang tải...</p>
                  </div>
                ) : projectStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={projectStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {projectStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Chưa có dữ liệu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thu chi theo danh mục</CardTitle>
                <CardDescription>So sánh thu và chi theo từng danh mục</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Đang tải...</p>
                  </div>
                ) : accountingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={accountingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="income" name="Thu" fill="#00C49F" />
                      <Bar dataKey="expense" name="Chi" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Chưa có dữ liệu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nhân sự theo phòng ban</CardTitle>
                <CardDescription>Phân bố nhân viên theo từng phòng ban</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Đang tải...</p>
                  </div>
                ) : employeeStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={employeeStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {employeeStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Chưa có dữ liệu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 sản phẩm tồn kho</CardTitle>
                <CardDescription>Sản phẩm có số lượng tồn nhiều nhất</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Đang tải...</p>
                  </div>
                ) : inventoryStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={inventoryStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" name="Số lượng" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Chưa có dữ liệu</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}