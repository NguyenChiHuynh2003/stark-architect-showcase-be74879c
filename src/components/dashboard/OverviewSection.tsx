import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckSquare, Users, AlertCircle, FileText, TrendingUp, Loader2, Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardStats {
  activeProjects: number;
  pendingTasks: number;
  totalEmployees: number;
  overdueItems: number;
  totalInventoryItems: number;
}

interface ProjectWithItems {
  id: string;
  name: string;
  status: string;
  items: {
    id: string;
    item_name: string;
    completion_percentage: number | null;
  }[];
  teamCount: number;
}

export const OverviewSection = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    pendingTasks: 0,
    totalEmployees: 0,
    overdueItems: 0,
    totalInventoryItems: 0,
  });
  const [projects, setProjects] = useState<ProjectWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch active projects count
      const { data: activeProjectsData, error: projectsError } = await supabase
        .from("projects")
        .select("id")
        .in("status", ["planning", "in_progress"]);
      if (projectsError) throw projectsError;

      // Fetch pending tasks count
      const { data: pendingTasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("id")
        .eq("status", "pending");
      if (tasksError) throw tasksError;

      // Fetch total employees
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select("id");
      if (employeesError) throw employeesError;

      // Fetch overdue tasks
      const today = new Date().toISOString().split("T")[0];
      const { data: overdueData, error: overdueError } = await supabase
        .from("tasks")
        .select("id")
        .lt("due_date", today)
        .neq("status", "completed");
      if (overdueError) throw overdueError;

      // Fetch total inventory items
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory_items")
        .select("id");
      if (inventoryError) throw inventoryError;

      setStats({
        activeProjects: activeProjectsData?.length || 0,
        pendingTasks: pendingTasksData?.length || 0,
        totalEmployees: employeesData?.length || 0,
        overdueItems: overdueData?.length || 0,
        totalInventoryItems: inventoryData?.length || 0,
      });

      // Fetch projects with items for detailed view
      const { data: projectsWithItems, error: projectsItemsError } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          status,
          project_items (
            id,
            item_name,
            completion_percentage
          )
        `)
        .in("status", ["planning", "in_progress"])
        .order("created_at", { ascending: false })
        .limit(5);
      if (projectsItemsError) throw projectsItemsError;

      // Fetch team member counts for each project
      const projectsData: ProjectWithItems[] = [];
      for (const project of projectsWithItems || []) {
        const { data: teamData } = await supabase
          .from("team_members")
          .select("id")
          .eq("project_id", project.id);

        projectsData.push({
          id: project.id,
          name: project.name,
          status: project.status,
          items: project.project_items || [],
          teamCount: teamData?.length || 0,
        });
      }

      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectCompletion = (items: { completion_percentage: number | null }[]) => {
    if (!items || items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + (item.completion_percentage || 0), 0);
    return Math.round(total / items.length);
  };

  const statsConfig = [
    {
      title: "Dự án đang hoạt động",
      value: stats.activeProjects,
      icon: FolderKanban,
      color: "text-primary",
    },
    {
      title: "Nhiệm vụ chờ xử lý",
      value: stats.pendingTasks,
      icon: CheckSquare,
      color: "text-accent",
    },
    {
      title: "Tổng nhân sự",
      value: stats.totalEmployees,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Tổng sản phẩm kho",
      value: stats.totalInventoryItems,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Mục quá hạn",
      value: stats.overdueItems,
      icon: AlertCircle,
      color: "text-destructive",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Tổng quan bảng điều khiển</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Chào mừng trở lại! Đây là những gì đang diễn ra với các dự án của bạn.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {statsConfig.map((stat, index) => (
          <Card key={index} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 lg:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="order-2 sm:order-1">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1 line-clamp-2">{stat.title}</p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</h3>
                </div>
                <div className={`order-1 sm:order-2 p-2 sm:p-3 rounded-lg bg-primary/10 w-fit`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Overview */}
      <Card className="border-border shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Dự án đang thực hiện
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          {projects.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
              Chưa có dự án nào đang hoạt động
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {projects.map((project) => {
                const completion = calculateProjectCompletion(project.items);
                return (
                  <div key={project.id} className="border border-border rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">{project.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                        project.status === "in_progress" 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {project.status === "in_progress" ? "Đang thực hiện" : 
                         project.status === "planning" ? "Lập kế hoạch" : project.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground truncate">
                          <span className="hidden sm:inline">Thành viên: </span>
                          <strong className="text-foreground">{project.teamCount}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground truncate">
                          <span className="hidden sm:inline">Hạng mục: </span>
                          <strong className="text-foreground">{project.items.length}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-muted-foreground truncate">
                          <strong className="text-foreground">{completion}%</strong>
                        </span>
                      </div>
                    </div>
                    <Progress value={completion} className="h-1.5 sm:h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:space-y-3">
              <div className="p-3 sm:p-4 rounded-full bg-primary/10 flex-shrink-0">
                <FolderKanban className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div className="flex-1 sm:flex-none">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Dự án mới</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Tạo dự án mới và bắt đầu quản lý nhiệm vụ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:space-y-3">
              <div className="p-3 sm:p-4 rounded-full bg-accent/10 flex-shrink-0">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
              </div>
              <div className="flex-1 sm:flex-none">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Tạo báo cáo</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Tạo báo cáo chi tiết cho các dự án của bạn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:space-y-3">
              <div className="p-3 sm:p-4 rounded-full bg-primary/10 flex-shrink-0">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <div className="flex-1 sm:flex-none">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">Quản lý nhóm</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Thêm hoặc quản lý thành viên và vai trò trong nhóm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};