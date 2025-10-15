import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginId || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Simulate login
    toast.success("Đăng nhập thành công!");
    navigate("/dashboard");
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Nhớ tài khoản
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-destructive hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Tính năng đặt lại mật khẩu sắp ra mắt!");
                  }}
                >
                  Quên mật khẩu?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-base"
              >
                ĐĂNG NHẬP
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-sm text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Trang chính sách bảo mật sắp ra mắt!");
                }}
              >
                Chính sách bảo mật
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
