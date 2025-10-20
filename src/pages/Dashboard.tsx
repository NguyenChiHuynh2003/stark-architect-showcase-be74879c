import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BarChart3, FolderKanban, CheckSquare, FileText, TrendingUp, Clock, Users, AlertCircle } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProjectsSection } from "@/components/dashboard/ProjectsSection";
import { AdminUsers } from "@/components/dashboard/AdminUsers";
import { TasksSection } from "@/components/dashboard/TasksSection";
import { HRSection } from "@/components/dashboard/HRSection";
import { AccountingSection } from "@/components/dashboard/AccountingSection";
import { InventorySection } from "@/components/dashboard/InventorySection";

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

  const constructionProjects = [
    {
      name: "Thi công Khu A",
      subProjects: [
        {
          name: "Dự án nhỏ A1",
          details: {
            personnel: 25,
            materials: "Thép, Xi măng, Gạch",
            completionRate: 75,
          },
        },
        {
          name: "Dự án nhỏ A2",
          details: {
            personnel: 18,
            materials: "Xi măng, Cát, Sỏi",
            completionRate: 60,
          },
        },
      ],
    },
    {
      name: "Thi công Khu B",
      subProjects: [
        {
          name: "Dự án nhỏ B1",
          details: {
            personnel: 32,
            materials: "Thép, Gỗ, Kính",
            completionRate: 45,
          },
        },
        {
          name: "Dự án nhỏ B2",
          details: {
            personnel: 20,
            materials: "Gạch, Đá granite, Sơn",
            completionRate: 90,
          },
        },
      ],
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {activeSection === "projects" ? (
                <ProjectsSection />
              ) : activeSection === "tasks" ? (
                <TasksSection />
              ) : activeSection === "hr" ? (
                <HRSection />
              ) : activeSection === "accounting" ? (
                <AccountingSection />
              ) : activeSection === "inventory" ? (
                <InventorySection />
              ) : activeSection === "admin-users" ? (
                <AdminUsers />
              ) : activeSection === "overview" ? (
                <>
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

                  {/* Construction Projects */}
                  <Card className="border-border shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FolderKanban className="w-5 h-5 text-primary" />
                        Dự án thi công
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {constructionProjects.map((construction, cIndex) => (
                          <div key={cIndex} className="border border-border rounded-lg p-4">
                            <h3 className="font-bold text-foreground text-lg mb-4">{construction.name}</h3>
                            <div className="space-y-4">
                              {construction.subProjects.map((subProject, sIndex) => (
                                <div key={sIndex} className="bg-muted/50 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                  <h4 className="font-semibold text-foreground mb-3">{subProject.name}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4 text-primary" />
                                      <span className="text-sm text-muted-foreground">
                                        Nhân sự: <strong className="text-foreground">{subProject.details.personnel}</strong>
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-accent" />
                                      <span className="text-sm text-muted-foreground">
                                        Vật tư: <strong className="text-foreground">{subProject.details.materials}</strong>
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="w-4 h-4 text-primary" />
                                      <span className="text-sm text-muted-foreground">
                                        Hoàn thành: <strong className="text-foreground">{subProject.details.completionRate}%</strong>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-all"
                                      style={{ width: `${subProject.details.completionRate}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
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
                </>
              ) : (
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-bold text-foreground mb-2">Tính năng đang phát triển</h2>
                      <p className="text-muted-foreground">Mục này sẽ sớm được ra mắt!</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
