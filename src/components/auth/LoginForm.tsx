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
  onLogin: (role: 'student' | 'faculty', userData: any) => void;
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
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(59, 130, 246, 0.6) 50%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
        animation: cursor-pulse 2s infinite;
        transition: all 0.1s ease-out;
      }
      
      @keyframes cursor-pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.5); opacity: 0.4; }
      }
      
      .cursor-trail::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        background: radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: cursor-glow 1.5s ease-in-out infinite alternate;
      }
      
      @keyframes cursor-glow {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
        100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.2; }
      }
    `;
    document.head.appendChild(style);

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    const handleMouseMove = (e: MouseEvent) => {
      trail.style.left = e.clientX - 10 + 'px';
      trail.style.top = e.clientY - 10 + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(trail);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (role: 'student' | 'faculty') => {
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
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden cursor-none"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(1.1) contrast(1.2) saturate(1.3)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/40 to-black/70 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-400/20"></div>
      <Card className="w-full max-w-md animate-fade-in hover-scale relative z-10 backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2 text-white drop-shadow-lg">
            <GraduationCap className="h-6 w-6 text-white drop-shadow-lg" />
            Student Result Portal
          </CardTitle>
          <CardDescription className="text-gray-200 drop-shadow-md">
            Access your academic results and grades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
              <TabsTrigger value="student" className="flex items-center gap-2 text-white data-[state=active]:bg-white/20 data-[state=active]:text-white font-medium">
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="faculty" className="flex items-center gap-2 text-white data-[state=active]:bg-white/20 data-[state=active]:text-white font-medium">
                <Users className="h-4 w-4" />
                Faculty
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="student" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-email" className="text-white font-medium drop-shadow-md">Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password" className="text-white font-medium drop-shadow-md">Password</Label>
                <Input
                  id="student-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
              </div>
              <Button 
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold drop-shadow-lg" 
                onClick={() => handleSubmit('student')}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in as Student"}
              </Button>
            </TabsContent>
            
            <TabsContent value="faculty" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faculty-email" className="text-white font-medium drop-shadow-md">Email</Label>
                <Input
                  id="faculty-email"
                  type="email"
                  placeholder="faculty@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty-password" className="text-white font-medium drop-shadow-md">Password</Label>
                <Input
                  id="faculty-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
              </div>
              <Button 
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold drop-shadow-lg" 
                onClick={() => handleSubmit('faculty')}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in as Faculty"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};