import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Users } from "lucide-react";
import loginBackground from "@/assets/login-background.jpg";

interface LoginFormProps {
  onLogin: (role: 'student' | 'faculty' | 'admin', userData: any) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .cursor-trail {
        position: fixed;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, rgba(34, 211, 238, 0.8) 0%, rgba(6, 182, 212, 0.4) 50%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease-out;
        box-shadow: 0 0 10px rgba(34, 211, 238, 0.4);
      }
      
      .glow-text {
        text-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
      }
      
      .card-professional {
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 
                    0 0 0 1px rgba(34, 211, 238, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05);
      }
    `;
    document.head.appendChild(style);

    // Create cursor trail
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    const handleMouseMove = (e: MouseEvent) => {
      trail.style.left = e.clientX - 4 + 'px';
      trail.style.top = e.clientY - 4 + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(trail);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (role: 'student' | 'faculty' | 'admin') => {
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      if (email && password) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: role === 'student' ? 'John Doe' : 'Dr. Smith',
          role,
          ...(role === 'student' && { 
            rollNumber: 'ST001',
            semester: 6,
            course: 'Computer Science'
          }),
          ...(role === 'faculty' && { 
            employeeId: 'FAC001',
            department: 'Computer Science'
          }),
          ...(role === 'admin' && { 
            adminId: 'ADM001',
            department: 'Administration'
          })
        };
        
        onLogin(role, userData);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter valid credentials",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/50 via-slate-900/80 to-blue-950/50"></div>
      <Card className="w-full max-w-md animate-fade-in hover-scale relative z-10 backdrop-blur-sm bg-slate-800/90 border border-cyan-500/20 card-professional">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-3xl font-semibold flex items-center justify-center gap-3 text-white mb-2">
            <GraduationCap className="h-8 w-8 text-cyan-400" />
            Student Result Portal
          </CardTitle>
          <CardDescription className="text-slate-300 text-base">
            Access your academic results and grades
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Tabs defaultValue="student" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700/50 border border-slate-600/50 h-12">
              <TabsTrigger 
                value="student" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 data-[state=active]:border-cyan-400/30 font-medium h-10 transition-all duration-200"
              >
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger 
                value="faculty" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 data-[state=active]:border-cyan-400/30 font-medium h-10 transition-all duration-200"
              >
                <Users className="h-4 w-4" />
                Faculty
              </TabsTrigger>
              <TabsTrigger 
                value="admin" 
                className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 data-[state=active]:border-cyan-400/30 font-medium h-10 transition-all duration-200"
              >
                <Users className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="student" className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="student-email" className="text-slate-200 font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="student-email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/30 h-11 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password" className="text-slate-200 font-medium text-sm">
                  Password
                </Label>
                <Input
                  id="student-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/30 h-11 transition-all duration-200"
                />
              </div>
              <Button 
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white border-0 font-semibold h-11 mt-6 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20" 
                onClick={() => handleSubmit('student')}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in as Student"}
              </Button>
            </TabsContent>
            
            <TabsContent value="faculty" className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="faculty-email" className="text-slate-200 font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="faculty-email"
                  type="email"
                  placeholder="faculty@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/30 h-11 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty-password" className="text-slate-200 font-medium text-sm">
                  Password
                </Label>
                <Input
                  id="faculty-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/30 h-11 transition-all duration-200"
                />
              </div>
              <Button 
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white border-0 font-semibold h-11 mt-6 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20" 
                onClick={() => handleSubmit('faculty')}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in as Faculty"}
              </Button>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-slate-200 font-medium text-sm">
                  Email Address
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/30 h-11 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-slate-200 font-medium text-sm">
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/30 h-11 transition-all duration-200"
                />
              </div>
              <Button 
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white border-0 font-semibold h-11 mt-6 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20" 
                onClick={() => handleSubmit('admin')}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in as Admin"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};