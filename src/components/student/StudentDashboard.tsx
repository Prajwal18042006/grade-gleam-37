import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Trophy, TrendingUp, Calendar, FileText, Star } from "lucide-react";

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
}

const mockResults = [
  { subject: "Data Structures", credits: 4, grade: "A", points: 9, semester: 6 },
  { subject: "Algorithms", credits: 4, grade: "A+", points: 10, semester: 6 },
  { subject: "Database Systems", credits: 3, grade: "B+", points: 8, semester: 6 },
  { subject: "Computer Networks", credits: 3, grade: "A", points: 9, semester: 6 },
  { subject: "Software Engineering", credits: 4, grade: "A", points: 9, semester: 5 },
  { subject: "Operating Systems", credits: 4, grade: "B+", points: 8, semester: 5 },
];

const calculateCGPA = (results: any[]) => {
  const totalPoints = results.reduce((sum, result) => sum + (result.points * result.credits), 0);
  const totalCredits = results.reduce((sum, result) => sum + result.credits, 0);
  return (totalPoints / totalCredits).toFixed(2);
};

const calculateSemesterGPA = (results: any[], semester: number) => {
  const semesterResults = results.filter(result => result.semester === semester);
  if (semesterResults.length === 0) return "0.00";
  
  const totalPoints = semesterResults.reduce((sum, result) => sum + (result.points * result.credits), 0);
  const totalCredits = semesterResults.reduce((sum, result) => sum + result.credits, 0);
  return (totalPoints / totalCredits).toFixed(2);
};

export const StudentDashboard = ({ user, onLogout }: StudentDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const cgpa = calculateCGPA(mockResults);
  const currentSemesterGPA = calculateSemesterGPA(mockResults, 6);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "bg-success text-success-foreground";
      case "A": return "bg-primary text-primary-foreground";
      case "B+": return "bg-warning text-warning-foreground";
      case "B": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-400/10"></div>
      
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-white drop-shadow-lg" />
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Student Portal</h1>
              <p className="text-gray-200 drop-shadow-md">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold">
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Student Info */}
        <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <Trophy className="h-5 w-5 text-cyan-400 drop-shadow-lg" />
              Academic Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 drop-shadow-lg">{user.rollNumber}</div>
                <div className="text-sm text-gray-300">Roll Number</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 drop-shadow-lg">Semester {user.semester}</div>
                <div className="text-sm text-gray-300">Current Semester</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 drop-shadow-lg">{cgpa}</div>
                <div className="text-sm text-gray-300">CGPA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 drop-shadow-lg">{currentSemesterGPA}</div>
                <div className="text-sm text-gray-300">Current GPA</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl border border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white font-medium">Overview</TabsTrigger>
            <TabsTrigger value="results" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white font-medium">Results</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white font-medium">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* CGPA Progress */}
            <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                  <TrendingUp className="h-5 w-5 text-cyan-400 drop-shadow-lg" />
                  Academic Progress
                </CardTitle>
                <CardDescription className="text-gray-300">Your overall performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-white">
                      <span>CGPA Progress</span>
                      <span className="font-bold">{cgpa}/10.0</span>
                    </div>
                    <Progress value={parseFloat(cgpa) * 10} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-green-500/20 backdrop-blur-xl rounded-lg border border-green-400/20">
                      <div className="text-lg font-bold text-green-400">
                        {mockResults.filter(r => r.grade.includes('A')).length}
                      </div>
                      <div className="text-sm text-gray-300">A Grades</div>
                    </div>
                    <div className="text-center p-4 bg-cyan-500/20 backdrop-blur-xl rounded-lg border border-cyan-400/20">
                      <div className="text-lg font-bold text-cyan-400">
                        {mockResults.reduce((sum, r) => sum + r.credits, 0)}
                      </div>
                      <div className="text-sm text-gray-300">Total Credits</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                  <FileText className="h-5 w-5 text-purple-400 drop-shadow-lg" />
                  Recent Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockResults.slice(0, 4).map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-xl rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/10">
                      <div>
                        <div className="font-medium text-white">{result.subject}</div>
                        <div className="text-sm text-gray-300">
                          {result.credits} Credits • Semester {result.semester}
                        </div>
                      </div>
                      <Badge className={getGradeColor(result.grade)}>
                        {result.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white drop-shadow-lg">Complete Academic Results</CardTitle>
                <CardDescription className="text-gray-300">All your semester results and grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[5, 6].map(semester => {
                    const semesterResults = mockResults.filter(r => r.semester === semester);
                    const gpa = calculateSemesterGPA(mockResults, semester);
                    
                    return (
                      <div key={semester} className="border border-white/20 rounded-lg p-4 bg-white/5 backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-white">Semester {semester}</h3>
                          <Badge variant="outline" className="text-sm bg-white/10 border-white/20 text-white">
                            GPA: {gpa}
                          </Badge>
                        </div>
                        <div className="grid gap-3">
                          {semesterResults.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-white">{result.subject}</div>
                                <div className="text-sm text-gray-300">
                                  {result.credits} Credits
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-sm text-gray-300">
                                  {result.points} Points
                                </div>
                                <Badge className={getGradeColor(result.grade)}>
                                  {result.grade}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <Star className="h-5 w-5 text-yellow-400 drop-shadow-lg" />
                    Grade Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['A+', 'A', 'B+', 'B'].map(grade => {
                      const count = mockResults.filter(r => r.grade === grade).length;
                      const percentage = (count / mockResults.length) * 100;
                      
                      return (
                        <div key={grade} className="space-y-2">
                          <div className="flex justify-between text-white">
                            <span>Grade {grade}</span>
                            <span>{count} subjects</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <Calendar className="h-5 w-5 text-cyan-400 drop-shadow-lg" />
                    Semester Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[5, 6].map(semester => {
                      const gpa = parseFloat(calculateSemesterGPA(mockResults, semester));
                      
                      return (
                        <div key={semester} className="space-y-2">
                          <div className="flex justify-between text-white">
                            <span>Semester {semester}</span>
                            <span className="font-bold">{gpa.toFixed(2)}</span>
                          </div>
                          <Progress value={gpa * 10} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};