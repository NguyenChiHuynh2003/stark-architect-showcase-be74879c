import { LayoutDashboard, FolderKanban, CheckSquare, FileText, Settings, LogOut, Building2, UserCog, Users, DollarSign, Package, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, roleLabels } from "@/hooks/useUserRole";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const allMenuItems = [
  { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { id: "projects", label: "Dự án", icon: FolderKanban },
  { id: "closed-projects", label: "Dự án đóng", icon: Archive },
  { id: "tasks", label: "Nhiệm vụ", icon: CheckSquare },
  { id: "hr", label: "Nhân sự", icon: Users },
  { id: "accounting", label: "Kế toán", icon: DollarSign },
  { id: "inventory", label: "Quản lí kho", icon: Package },
  { id: "reports", label: "Báo cáo", icon: FileText },
  { id: "settings", label: "Cài đặt", icon: Settings },
  { id: "admin-users", label: "Quản lý người dùng", icon: UserCog },
];

export const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { role, hasAccess, loading } = useUserRole();

  // Filter menu items based on role permissions
  const menuItems = allMenuItems.filter(item => hasAccess(item.id));

  const handleLogout = async () => {
    await signOut();
    toast.success("Đăng xuất thành công");
    navigate("/auth");
  };

  return (
    <aside className="w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold">KBA.2018</h2>
            <p className="text-xs text-sidebar-foreground/70">Hệ thống quản lý</p>
          </div>
        </div>
      </div>

      {/* Show current role */}
      {!loading && (
        <div className="px-6 py-2 border-b border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">Vai trò: <span className="font-medium text-sidebar-foreground/70">{roleLabels[role]}</span></p>
        </div>
      )}

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  if (item.id === "reports") {
                    navigate("/reports");
                  } else if (item.id === "settings") {
                    navigate("/settings");
                  } else if (item.id === "closed-projects") {
                    navigate("/closed-projects");
                  } else {
                    setActiveSection(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
