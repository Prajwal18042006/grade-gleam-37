import { useState } from "react";
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
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80"></div>
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