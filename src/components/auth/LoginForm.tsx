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
      .particles-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }
      
      .particle {
        position: absolute;
        background: radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: float 6s ease-in-out infinite;
      }
      
      .particle:nth-child(odd) {
        background: radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, rgba(99, 102, 241, 0.3) 50%, transparent 70%);
        animation-delay: -2s;
        animation-duration: 8s;
      }
      
      .particle:nth-child(3n) {
        background: radial-gradient(circle, rgba(79, 70, 229, 0.5) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%);
        animation-delay: -4s;
        animation-duration: 10s;
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        50% {
          transform: translateY(-100px) rotate(180deg);
          opacity: 0.8;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-200px) rotate(360deg);
          opacity: 0;
        }
      }
      
      .cursor-trail {
        position: fixed;
        width: 12px;
        height: 12px;
        background: radial-gradient(circle, rgba(168, 85, 247, 1) 0%, rgba(147, 51, 234, 0.8) 40%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
        transition: all 0.1s ease-out;
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.6), 0 0 40px rgba(147, 51, 234, 0.4);
      }
      
      .glow-text {
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(168, 85, 247, 0.6), 0 0 30px rgba(147, 51, 234, 0.4);
      }
      
      .card-glow {
        box-shadow: 0 0 50px rgba(168, 85, 247, 0.3), 0 0 100px rgba(147, 51, 234, 0.2), inset 0 0 50px rgba(255, 255, 255, 0.05);
      }
    `;
    document.head.appendChild(style);

    // Create particles
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = Math.random() * 6 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = Math.random() * 4 + 6 + 's';
      particlesContainer.appendChild(particle);
    }

    // Create cursor trail
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    const handleMouseMove = (e: MouseEvent) => {
      trail.style.left = e.clientX - 6 + 'px';
      trail.style.top = e.clientY - 6 + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(particlesContainer);
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
        filter: 'brightness(0.7) contrast(1.2) saturate(1.1)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-purple-900/40 to-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/20 to-indigo-900/30"></div>
      <Card className="w-full max-w-md animate-fade-in hover-scale relative z-10 backdrop-blur-xl bg-black/70 border border-purple-400/50 card-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2 text-white glow-text">
            <GraduationCap className="h-6 w-6 text-purple-400 drop-shadow-lg" />
            Student Result Portal
          </CardTitle>
          <CardDescription className="text-purple-200 glow-text">
            Access your academic results and grades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-purple-500/40">
              <TabsTrigger value="student" className="flex items-center gap-2 text-purple-200 data-[state=active]:bg-purple-600/30 data-[state=active]:text-white font-medium glow-text">
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="faculty" className="flex items-center gap-2 text-purple-200 data-[state=active]:bg-purple-600/30 data-[state=active]:text-white font-medium glow-text">
                <Users className="h-4 w-4" />
                Faculty
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="student" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-email" className="text-white font-medium glow-text">Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/30 border-purple-500/40 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password" className="text-white font-medium glow-text">Password</Label>
                <Input
                  id="student-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/30 border-purple-500/40 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
              <Button 
                className="w-full bg-purple-600/40 hover:bg-purple-600/60 text-white border border-purple-500/50 font-semibold glow-text hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300" 
                onClick={() => handleSubmit('student')}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in as Student"}
              </Button>
            </TabsContent>
            
            <TabsContent value="faculty" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faculty-email" className="text-white font-medium glow-text">Email</Label>
                <Input
                  id="faculty-email"
                  type="email"
                  placeholder="faculty@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/30 border-purple-500/40 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty-password" className="text-white font-medium glow-text">Password</Label>
                <Input
                  id="faculty-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/30 border-purple-500/40 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
              <Button 
                className="w-full bg-purple-600/40 hover:bg-purple-600/60 text-white border border-purple-500/50 font-semibold glow-text hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300" 
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