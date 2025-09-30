import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, BookOpen, BarChart3, Settings, FileText, Database, Plus, Edit, Trash2, UserPlus, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

interface Faculty {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  employee_id: string;
  department: string;
  assignedSubjects?: string[];
}

interface Student {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  roll_number: string;
  department: string;
  course: string;
  semester: number;
}

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  department: string;
  semester: number;
  credits: number;
}

const departments = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"];
const courseTypes = ["B.Tech", "M.Tech", "BCA", "MCA", "BSc", "MSc"];

export const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  
  // State management
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  const [facultyForm, setFacultyForm] = useState({
    full_name: "",
    email: "",
    password: "",
    employee_id: "",
    department: ""
  });
  
  const [studentForm, setStudentForm] = useState({
    full_name: "",
    email: "",
    password: "",
    roll_number: "",
    department: "",
    course: "",
    semester: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load faculty
      const { data: facultyData, error: facultyError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'faculty');
      
      if (facultyError) throw facultyError;
      
      // Load students
      const { data: studentData, error: studentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');
      
      if (studentError) throw studentError;
      
      // Load courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*');
      
      if (coursesError) throw coursesError;
      
      setFaculty(facultyData || []);
      setStudents(studentData || []);
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async () => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: facultyForm.email,
        password: facultyForm.password,
        email_confirm: true,
        user_metadata: {
          full_name: facultyForm.full_name,
          role: 'faculty'
        }
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          full_name: facultyForm.full_name,
          role: 'faculty',
          employee_id: facultyForm.employee_id,
          department: facultyForm.department
        });

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Faculty member added successfully!",
      });

      setIsAddFacultyOpen(false);
      setFacultyForm({ full_name: "", email: "", password: "", employee_id: "", department: "" });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add faculty member.",
        variant: "destructive",
      });
    }
  };

  const handleAddStudent = async () => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: studentForm.email,
        password: studentForm.password,
        email_confirm: true,
        user_metadata: {
          full_name: studentForm.full_name,
          role: 'student'
        }
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          full_name: studentForm.full_name,
          role: 'student',
          roll_number: studentForm.roll_number,
          department: studentForm.department,
          course: studentForm.course,
          semester: studentForm.semester
        });

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Student added successfully!",
      });

      setIsAddStudentOpen(false);
      setStudentForm({ full_name: "", email: "", password: "", roll_number: "", department: "", course: "", semester: 1 });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add student.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFaculty = async (facultyId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', facultyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Faculty member removed successfully!",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove faculty member.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', studentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student removed successfully!",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove student.",
        variant: "destructive",
      });
    }
  };

  const stats = {
    totalStudents: students.length,
    totalFaculty: faculty.length,
    totalDepartments: [...new Set([...faculty.map(f => f.department), ...students.map(s => s.department)])].filter(Boolean).length,
    totalSubjects: courses.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/50 via-slate-900/80 to-blue-950/50"></div>
      
      {/* Header */}
      <header className="bg-slate-800/40 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-cyan-400 drop-shadow-lg" />
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Admin Portal</h1>
              <p className="text-slate-300 drop-shadow-md">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold">
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Admin Info */}
        <Card className="animate-fade-in hover-scale bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Shield className="h-5 w-5 text-cyan-400 drop-shadow-lg" />
              Administrator Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400 drop-shadow-lg">{user.adminId}</div>
                <div className="text-sm text-slate-300">Admin ID</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400 drop-shadow-lg">{stats.totalStudents}</div>
                <div className="text-sm text-slate-300">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400 drop-shadow-lg">{stats.totalFaculty}</div>
                <div className="text-sm text-slate-300">Total Faculty</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400 drop-shadow-lg">{stats.totalSubjects}</div>
                <div className="text-sm text-slate-300">Total Subjects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50 border border-slate-600/50 h-12">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 font-medium">Overview</TabsTrigger>
            <TabsTrigger value="students" className="text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 font-medium">Manage Students</TabsTrigger>
            <TabsTrigger value="faculty" className="text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 font-medium">Manage Faculty</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Total Students</p>
                      <p className="text-3xl font-bold text-cyan-400">{stats.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Total Faculty</p>
                      <p className="text-3xl font-bold text-cyan-400">{stats.totalFaculty}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Total Subjects</p>
                      <p className="text-3xl font-bold text-cyan-400">{stats.totalSubjects}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Total Departments</p>
                      <p className="text-3xl font-bold text-purple-400">{stats.totalDepartments}</p>
                    </div>
                    <Database className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5 text-cyan-400" />
                    Student Management
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Add, edit, and manage student accounts
                  </CardDescription>
                </div>
                <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-600 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                      <DialogDescription>Create a new student account with access credentials.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="student-name">Full Name</Label>
                          <Input
                            id="student-name"
                            value={studentForm.full_name}
                            onChange={(e) => setStudentForm({...studentForm, full_name: e.target.value})}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="student-email">Email</Label>
                          <Input
                            id="student-email"
                            type="email"
                            value={studentForm.email}
                            onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="student-password">Password</Label>
                          <Input
                            id="student-password"
                            type="password"
                            value={studentForm.password}
                            onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="student-roll">Roll Number</Label>
                          <Input
                            id="student-roll"
                            value={studentForm.roll_number}
                            onChange={(e) => setStudentForm({...studentForm, roll_number: e.target.value})}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="student-department">Department</Label>
                          <Select value={studentForm.department} onValueChange={(value) => setStudentForm({...studentForm, department: value})}>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="student-course">Course</Label>
                          <Select value={studentForm.course} onValueChange={(value) => setStudentForm({...studentForm, course: value})}>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {courseTypes.map(courseName => (
                                <SelectItem key={courseName} value={courseName}>{courseName}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="student-semester">Semester</Label>
                          <Select value={studentForm.semester.toString()} onValueChange={(value) => setStudentForm({...studentForm, semester: parseInt(value)})}>
                            <SelectTrigger className="bg-slate-700 border-slate-600">
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {[1,2,3,4,5,6,7,8].map(sem => (
                                <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddStudent} className="bg-cyan-500 hover:bg-cyan-600">Add Student</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-600/50 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-600/50 hover:bg-slate-700/20">
                        <TableHead className="text-slate-200 font-medium">Roll Number</TableHead>
                        <TableHead className="text-slate-200 font-medium">Name</TableHead>
                        <TableHead className="text-slate-200 font-medium">Department</TableHead>
                        <TableHead className="text-slate-200 font-medium">Course</TableHead>
                        <TableHead className="text-slate-200 font-medium">Semester</TableHead>
                        <TableHead className="text-slate-200 font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map(student => (
                        <TableRow key={student.id} className="border-slate-600/50 hover:bg-slate-700/20">
                          <TableCell className="text-slate-200 font-medium">{student.roll_number}</TableCell>
                          <TableCell className="text-slate-200">{student.full_name}</TableCell>
                          <TableCell className="text-slate-200">{student.department}</TableCell>
                          <TableCell className="text-slate-200">{student.course}</TableCell>
                          <TableCell className="text-slate-200">{student.semester}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingStudent(student)}
                                className="h-8 w-8 p-0 border-cyan-500/50 hover:bg-cyan-500/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 border-red-500/50 hover:bg-red-500/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-800 border-slate-600">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Delete Student</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {student.full_name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteStudent(student.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty">
            <Card className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <GraduationCap className="h-5 w-5 text-cyan-400" />
                    Faculty Management
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Add, edit, and manage faculty accounts
                  </CardDescription>
                </div>
                <Dialog open={isAddFacultyOpen} onOpenChange={setIsAddFacultyOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Faculty
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-600 text-white">
                    <DialogHeader>
                      <DialogTitle>Add New Faculty</DialogTitle>
                      <DialogDescription>Create a new faculty account with access credentials.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="faculty-name">Full Name</Label>
                          <Input
                            id="faculty-name"
                            value={facultyForm.full_name}
                            onChange={(e) => setFacultyForm({...facultyForm, full_name: e.target.value})}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="faculty-email">Email</Label>
                          <Input
                            id="faculty-email"
                            type="email"
                            value={facultyForm.email}
                            onChange={(e) => setFacultyForm({...facultyForm, email: e.target.value})}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="faculty-password">Password</Label>
                          <Input
                            id="faculty-password"
                            type="password"
                            value={facultyForm.password}
                            onChange={(e) => setFacultyForm({...facultyForm, password: e.target.value})}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="faculty-employee-id">Employee ID</Label>
                          <Input
                            id="faculty-employee-id"
                            value={facultyForm.employee_id}
                            onChange={(e) => setFacultyForm({...facultyForm, employee_id: e.target.value})}
                            className="bg-slate-700 border-slate-600"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="faculty-department">Department</Label>
                        <Select value={facultyForm.department} onValueChange={(value) => setFacultyForm({...facultyForm, department: value})}>
                          <SelectTrigger className="bg-slate-700 border-slate-600">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddFacultyOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddFaculty} className="bg-cyan-500 hover:bg-cyan-600">Add Faculty</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-600/50 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-600/50 hover:bg-slate-700/20">
                        <TableHead className="text-slate-200 font-medium">Employee ID</TableHead>
                        <TableHead className="text-slate-200 font-medium">Name</TableHead>
                        <TableHead className="text-slate-200 font-medium">Department</TableHead>
                        <TableHead className="text-slate-200 font-medium">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faculty.map(facultyMember => (
                        <TableRow key={facultyMember.id} className="border-slate-600/50 hover:bg-slate-700/20">
                          <TableCell className="text-slate-200 font-medium">{facultyMember.employee_id}</TableCell>
                          <TableCell className="text-slate-200">{facultyMember.full_name}</TableCell>
                          <TableCell className="text-slate-200">{facultyMember.department}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingFaculty(facultyMember)}
                                className="h-8 w-8 p-0 border-cyan-500/50 hover:bg-cyan-500/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 w-8 p-0 border-red-500/50 hover:bg-red-500/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-800 border-slate-600">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Delete Faculty</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {facultyMember.full_name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteFaculty(facultyMember.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};