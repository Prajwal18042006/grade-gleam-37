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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Student Portal</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Student Info */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Academic Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.rollNumber}</div>
                <div className="text-sm text-muted-foreground">Roll Number</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Semester {user.semester}</div>
                <div className="text-sm text-muted-foreground">Current Semester</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{cgpa}</div>
                <div className="text-sm text-muted-foreground">CGPA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{currentSemesterGPA}</div>
                <div className="text-sm text-muted-foreground">Current GPA</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* CGPA Progress */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Academic Progress
                </CardTitle>
                <CardDescription>Your overall performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>CGPA Progress</span>
                      <span className="font-bold">{cgpa}/10.0</span>
                    </div>
                    <Progress value={parseFloat(cgpa) * 10} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <div className="text-lg font-bold text-success">
                        {mockResults.filter(r => r.grade.includes('A')).length}
                      </div>
                      <div className="text-sm text-muted-foreground">A Grades</div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-lg font-bold text-primary">
                        {mockResults.reduce((sum, r) => sum + r.credits, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Credits</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-accent" />
                  Recent Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockResults.slice(0, 4).map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">{result.subject}</div>
                        <div className="text-sm text-muted-foreground">
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
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Complete Academic Results</CardTitle>
                <CardDescription>All your semester results and grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[5, 6].map(semester => {
                    const semesterResults = mockResults.filter(r => r.semester === semester);
                    const gpa = calculateSemesterGPA(mockResults, semester);
                    
                    return (
                      <div key={semester} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Semester {semester}</h3>
                          <Badge variant="outline" className="text-sm">
                            GPA: {gpa}
                          </Badge>
                        </div>
                        <div className="grid gap-3">
                          {semesterResults.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-card border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{result.subject}</div>
                                <div className="text-sm text-muted-foreground">
                                  {result.credits} Credits
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-sm text-muted-foreground">
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
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-warning" />
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
                          <div className="flex justify-between">
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

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Semester Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[5, 6].map(semester => {
                      const gpa = parseFloat(calculateSemesterGPA(mockResults, semester));
                      
                      return (
                        <div key={semester} className="space-y-2">
                          <div className="flex justify-between">
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