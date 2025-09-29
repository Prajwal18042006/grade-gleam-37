import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { StudentDashboard } from "@/components/student/StudentDashboard";
import { FacultyDashboard } from "@/components/faculty/FacultyDashboard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'student' | 'faculty' | 'admin' | null>(null);

  const handleLogin = (role: 'student' | 'faculty' | 'admin', userData: any) => {
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

  if (userRole === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return null;
};

export default Index;
