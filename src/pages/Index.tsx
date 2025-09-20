import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { StudentDashboard } from "@/components/student/StudentDashboard";
import { FacultyDashboard } from "@/components/faculty/FacultyDashboard";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'student' | 'faculty' | null>(null);

  const handleLogin = (role: 'student' | 'faculty', userData: any) => {
    setUser(userData);
    setUserRole(role);
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (userRole === 'student') {
    return <StudentDashboard user={user} onLogout={handleLogout} />;
  }

  if (userRole === 'faculty') {
    return <FacultyDashboard user={user} onLogout={handleLogout} />;
  }

  return null;
};

export default Index;
