import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationsDropdown } from "./NotificationsDropdown";

export const DashboardHeader = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm dự án, nhiệm vụ hoặc báo cáo..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationsDropdown />
          
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Người quản trị</p>
              <p className="text-xs text-muted-foreground">Quản trị viên</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
