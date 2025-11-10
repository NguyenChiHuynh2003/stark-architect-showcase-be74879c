import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEY = "remembered_login";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
    
    // Load saved credentials
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { loginId: savedLoginId, password: savedPassword } = JSON.parse(saved);
        setLoginId(savedLoginId || "");
        setPassword(savedPassword || "");
        setRememberMe(true);
      } catch (error) {
        console.error("Failed to load saved credentials");
      }
    }
  }, [user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save or clear credentials
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ loginId, password }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">KBA.2018</h1>
          </div>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <h2 className="text-xl font-semibold text-center">ĐĂNG NHẬP HỆ THỐNG</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="loginId" className="text-sm font-medium">
                  MÃ ĐĂNG NHẬP
                </Label>
                <Input
                  id="loginId"
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full"
                  placeholder="Nhập mã đăng nhập"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  MẬT KHẨU
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Ghi nhớ tài khoản
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-base"
              >
                ĐĂNG NHẬP
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
