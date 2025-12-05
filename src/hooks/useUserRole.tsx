import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "user" | "accountant" | "hr_admin" | "project_manager";

// Define which sections each role can access
const rolePermissions: Record<AppRole, string[]> = {
  admin: ["overview", "projects", "closed-projects", "tasks", "hr", "accounting", "inventory", "reports", "settings", "admin-users"],
  accountant: ["overview", "accounting", "inventory", "projects", "closed-projects"],
  hr_admin: ["overview", "tasks", "hr"],
  project_manager: ["overview", "projects", "closed-projects", "tasks", "inventory"],
  user: ["overview"], // Basic user has limited access
};

export const roleLabels: Record<AppRole, string> = {
  admin: "Quản trị viên",
  accountant: "Kế toán",
  hr_admin: "Hành chính nhân sự",
  project_manager: "Quản lí dự án",
  user: "Người dùng",
};

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (data?.role) {
          setRole(data.role as AppRole);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  const hasAccess = (section: string): boolean => {
    return rolePermissions[role]?.includes(section) || false;
  };

  const getAllowedSections = (): string[] => {
    return rolePermissions[role] || [];
  };

  const isAdmin = role === "admin";

  return { role, loading, hasAccess, getAllowedSections, isAdmin };
};
