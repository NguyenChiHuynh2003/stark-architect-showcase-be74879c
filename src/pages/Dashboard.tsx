import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BarChart3, FolderKanban, CheckSquare, FileText, TrendingUp, Clock, Users, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const stats = [
    {
      title: "Dự án đang hoạt động",
      value: "24",
      icon: FolderKanban,
      trend: "+12%",
      color: "text-primary",
    },
    {
      title: "Nhiệm vụ chờ xử lý",
      value: "156",
      icon: CheckSquare,
      trend: "+8%",
      color: "text-accent",
    },
    {
      title: "Thành viên nhóm",
      value: "48",
      icon: Users,
      trend: "+3%",
      color: "text-primary",
    },
    {
      title: "Mục quá hạn",
      value: "7",
      icon: AlertCircle,
      trend: "-15%",
      color: "text-destructive",
    },
  ];

  const recentProjects = [
    { name: "Xây dựng tòa nhà văn phòng", progress: 75, status: "Đúng tiến độ" },
    { name: "Dự án mở rộng đường cao tốc", progress: 45, status: "Đang thực hiện" },
    { name: "Cải tạo trung tâm thương mại", progress: 90, status: "Sắp hoàn thành" },
    { name: "Khu dân cư giai đoạn 2", progress: 30, status: "Bắt đầu" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Tổng quan bảng điều khiển</h1>
              <p className="text-muted-foreground">Chào mừng trở lại! Đây là những gì đang diễn ra với các dự án của bạn.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                        <p className={`text-sm mt-2 ${stat.color}`}>{stat.trend} so với tháng trước</p>
                      </div>
                      <div className={`p-3 rounded-lg bg-primary/10`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Projects */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-primary" />
                  Dự án gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{project.name}</h4>
                        <span className="text-sm text-muted-foreground">{project.status}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Hoàn thành {project.progress}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-4 rounded-full bg-primary/10">
                      <FolderKanban className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Dự án mới</h3>
                    <p className="text-sm text-muted-foreground">Tạo dự án mới và bắt đầu quản lý nhiệm vụ</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-4 rounded-full bg-accent/10">
                      <FileText className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground">Tạo báo cáo</h3>
                    <p className="text-sm text-muted-foreground">Tạo báo cáo chi tiết cho các dự án của bạn</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-4 rounded-full bg-primary/10">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Quản lý nhóm</h3>
                    <p className="text-sm text-muted-foreground">Thêm hoặc quản lý thành viên và vai trò trong nhóm</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
