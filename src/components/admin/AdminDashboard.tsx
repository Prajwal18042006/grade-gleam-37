import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, BookOpen, BarChart3, Settings, FileText, Database } from "lucide-react";

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const mockStudents = [
  { id: "1", rollNumber: "ST001", name: "John Doe", semester: 6, course: "Computer Science", gpa: "8.5" },
  { id: "2", rollNumber: "ST002", name: "Jane Smith", semester: 6, course: "Computer Science", gpa: "9.2" },
  { id: "3", rollNumber: "ST003", name: "Mike Johnson", semester: 6, course: "Computer Science", gpa: "7.8" },
  { id: "4", rollNumber: "ST004", name: "Sarah Wilson", semester: 6, course: "Computer Science", gpa: "8.9" },
];

const mockFaculty = [
  { id: "1", employeeId: "FAC001", name: "Dr. Smith", department: "Computer Science", subjects: 3 },
  { id: "2", employeeId: "FAC002", name: "Dr. Johnson", department: "Mathematics", subjects: 2 },
  { id: "3", employeeId: "FAC003", name: "Dr. Brown", department: "Physics", subjects: 4 },
];

const mockResults = [
  { id: "1", studentName: "John Doe", subject: "Data Structures", grade: "A", submittedBy: "Dr. Smith", date: "2024-01-15" },
  { id: "2", studentName: "Jane Smith", subject: "Algorithms", grade: "A+", submittedBy: "Dr. Smith", date: "2024-01-14" },
  { id: "3", studentName: "Mike Johnson", subject: "Database Systems", grade: "B+", submittedBy: "Dr. Johnson", date: "2024-01-13" },
];

export const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();

  const stats = {
    totalStudents: mockStudents.length,
    totalFaculty: mockFaculty.length,
    totalResults: mockResults.length,
    avgGPA: (mockStudents.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / mockStudents.length).toFixed(2)
  };

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
                <div className="text-xl font-bold text-green-400 drop-shadow-lg">{stats.avgGPA}</div>
                <div className="text-sm text-slate-300">Average GPA</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700/50 border border-slate-600/50 h-12">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 font-medium">Overview</TabsTrigger>
            <TabsTrigger value="students" className="text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 font-medium">Students</TabsTrigger>
            <TabsTrigger value="faculty" className="text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 font-medium">Faculty</TabsTrigger>
            <TabsTrigger value="results" className="text-slate-300 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-100 font-medium">Results</TabsTrigger>
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
                      <p className="text-sm text-slate-300">Total Results</p>
                      <p className="text-3xl font-bold text-cyan-400">{stats.totalResults}</p>
                    </div>
                    <FileText className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Average GPA</p>
                      <p className="text-3xl font-bold text-green-400">{stats.avgGPA}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-cyan-400" />
                  Student Management
                </CardTitle>
                <CardDescription className="text-slate-300">
                  View and manage all registered students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-600/50 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-600/50 hover:bg-slate-700/20">
                        <TableHead className="text-slate-200 font-medium">Roll Number</TableHead>
                        <TableHead className="text-slate-200 font-medium">Name</TableHead>
                        <TableHead className="text-slate-200 font-medium">Course</TableHead>
                        <TableHead className="text-slate-200 font-medium">Semester</TableHead>
                        <TableHead className="text-slate-200 font-medium">GPA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockStudents.map(student => (
                        <TableRow key={student.id} className="border-slate-600/50 hover:bg-slate-700/20">
                          <TableCell className="text-slate-200 font-medium">{student.rollNumber}</TableCell>
                          <TableCell className="text-slate-200">{student.name}</TableCell>
                          <TableCell className="text-slate-200">{student.course}</TableCell>
                          <TableCell className="text-slate-200">{student.semester}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              {student.gpa}
                            </Badge>
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="h-5 w-5 text-cyan-400" />
                  Faculty Management
                </CardTitle>
                <CardDescription className="text-slate-300">
                  View and manage all faculty members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-600/50 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-600/50 hover:bg-slate-700/20">
                        <TableHead className="text-slate-200 font-medium">Employee ID</TableHead>
                        <TableHead className="text-slate-200 font-medium">Name</TableHead>
                        <TableHead className="text-slate-200 font-medium">Department</TableHead>
                        <TableHead className="text-slate-200 font-medium">Subjects</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFaculty.map(faculty => (
                        <TableRow key={faculty.id} className="border-slate-600/50 hover:bg-slate-700/20">
                          <TableCell className="text-slate-200 font-medium">{faculty.employeeId}</TableCell>
                          <TableCell className="text-slate-200">{faculty.name}</TableCell>
                          <TableCell className="text-slate-200">{faculty.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                              {faculty.subjects} subjects
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card className="bg-slate-800/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5 text-cyan-400" />
                  Results Management
                </CardTitle>
                <CardDescription className="text-slate-300">
                  View all submitted results and grades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-600/50 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-600/50 hover:bg-slate-700/20">
                        <TableHead className="text-slate-200 font-medium">Student</TableHead>
                        <TableHead className="text-slate-200 font-medium">Subject</TableHead>
                        <TableHead className="text-slate-200 font-medium">Grade</TableHead>
                        <TableHead className="text-slate-200 font-medium">Submitted By</TableHead>
                        <TableHead className="text-slate-200 font-medium">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockResults.map(result => (
                        <TableRow key={result.id} className="border-slate-600/50 hover:bg-slate-700/20">
                          <TableCell className="text-slate-200 font-medium">{result.studentName}</TableCell>
                          <TableCell className="text-slate-200">{result.subject}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`${
                                result.grade.includes('A') ? 'text-green-400 border-green-400' :
                                result.grade.includes('B') ? 'text-blue-400 border-blue-400' :
                                'text-yellow-400 border-yellow-400'
                              }`}
                            >
                              {result.grade}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-200">{result.submittedBy}</TableCell>
                          <TableCell className="text-slate-200">{result.date}</TableCell>
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