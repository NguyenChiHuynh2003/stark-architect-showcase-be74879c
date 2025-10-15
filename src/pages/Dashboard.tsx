import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BarChart3, FolderKanban, CheckSquare, FileText, TrendingUp, Clock, Users, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const stats = [
    {
      title: "Active Projects",
      value: "24",
      icon: FolderKanban,
      trend: "+12%",
      color: "text-primary",
    },
    {
      title: "Pending Tasks",
      value: "156",
      icon: CheckSquare,
      trend: "+8%",
      color: "text-accent",
    },
    {
      title: "Team Members",
      value: "48",
      icon: Users,
      trend: "+3%",
      color: "text-primary",
    },
    {
      title: "Overdue Items",
      value: "7",
      icon: AlertCircle,
      trend: "-15%",
      color: "text-destructive",
    },
  ];

  const recentProjects = [
    { name: "Office Building Construction", progress: 75, status: "On Track" },
    { name: "Highway Expansion Project", progress: 45, status: "In Progress" },
    { name: "Shopping Mall Renovation", progress: 90, status: "Nearly Complete" },
    { name: "Residential Complex Phase 2", progress: 30, status: "Starting" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening with your projects.</p>
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
                        <p className={`text-sm mt-2 ${stat.color}`}>{stat.trend} from last month</p>
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
                  Recent Projects
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
                      <p className="text-sm text-muted-foreground mt-1">{project.progress}% Complete</p>
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
                    <h3 className="font-semibold text-foreground">New Project</h3>
                    <p className="text-sm text-muted-foreground">Create a new project and start managing tasks</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-4 rounded-full bg-accent/10">
                      <FileText className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground">Generate Report</h3>
                    <p className="text-sm text-muted-foreground">Create detailed reports for your projects</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-4 rounded-full bg-primary/10">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Manage Team</h3>
                    <p className="text-sm text-muted-foreground">Add or manage team members and roles</p>
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
