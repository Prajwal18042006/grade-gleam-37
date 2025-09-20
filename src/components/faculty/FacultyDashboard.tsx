import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen, PlusCircle, Save, Calculator, FileSpreadsheet } from "lucide-react";

interface FacultyDashboardProps {
  user: any;
  onLogout: () => void;
}

const mockStudents = [
  { id: "1", rollNumber: "ST001", name: "John Doe", semester: 6, course: "Computer Science" },
  { id: "2", rollNumber: "ST002", name: "Jane Smith", semester: 6, course: "Computer Science" },
  { id: "3", rollNumber: "ST003", name: "Mike Johnson", semester: 6, course: "Computer Science" },
  { id: "4", rollNumber: "ST004", name: "Sarah Wilson", semester: 6, course: "Computer Science" },
];

const mockSubjects = [
  { id: "1", name: "Data Structures", credits: 4, semester: 6 },
  { id: "2", name: "Algorithms", credits: 4, semester: 6 },
  { id: "3", name: "Database Systems", credits: 3, semester: 6 },
  { id: "4", name: "Computer Networks", credits: 3, semester: 6 },
];

const gradePoints = {
  "A+": 10, "A": 9, "B+": 8, "B": 7, "C+": 6, "C": 5, "D": 4, "F": 0
};

export const FacultyDashboard = ({ user, onLogout }: FacultyDashboardProps) => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [marks, setMarks] = useState("");
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSubmitResult = () => {
    if (!selectedSubject || !selectedStudent || !selectedGrade || !marks) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields to submit result",
        variant: "destructive",
      });
      return;
    }

    const student = mockStudents.find(s => s.id === selectedStudent);
    const subject = mockSubjects.find(s => s.id === selectedSubject);
    
    const newResult = {
      id: Date.now().toString(),
      studentId: selectedStudent,
      studentName: student?.name,
      rollNumber: student?.rollNumber,
      subjectId: selectedSubject,
      subjectName: subject?.name,
      credits: subject?.credits,
      marks: parseInt(marks),
      grade: selectedGrade,
      points: gradePoints[selectedGrade as keyof typeof gradePoints],
      submittedAt: new Date().toISOString(),
    };

    setStudentResults(prev => [...prev, newResult]);
    
    // Reset form
    setSelectedSubject("");
    setSelectedStudent("");
    setSelectedGrade("");
    setMarks("");

    toast({
      title: "Result Submitted",
      description: `Grade ${selectedGrade} assigned to ${student?.name} for ${subject?.name}`,
    });
  };

  const calculateGPA = (studentId: string) => {
    const results = studentResults.filter(r => r.studentId === studentId);
    if (results.length === 0) return "N/A";
    
    const totalPoints = results.reduce((sum, result) => sum + (result.points * result.credits), 0);
    const totalCredits = results.reduce((sum, result) => sum + result.credits, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const getGradeFromMarks = (marks: number) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C+";
    if (marks >= 40) return "C";
    if (marks >= 35) return "D";
    return "F";
  };

  const handleMarksChange = (value: string) => {
    setMarks(value);
    if (value) {
      const marksNum = parseInt(value);
      if (!isNaN(marksNum)) {
        setSelectedGrade(getGradeFromMarks(marksNum));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Faculty Portal</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Faculty Info */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" />
              Faculty Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{user.employeeId}</div>
                <div className="text-sm text-muted-foreground">Employee ID</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{user.department}</div>
                <div className="text-sm text-muted-foreground">Department</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-success">{studentResults.length}</div>
                <div className="text-sm text-muted-foreground">Results Submitted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="add-results" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add-results">Add Results</TabsTrigger>
            <TabsTrigger value="view-results">View Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="add-results" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  Submit Student Results
                </CardTitle>
                <CardDescription>
                  Add marks and grades for your students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSubjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.credits} credits)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Student</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStudents.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.rollNumber} - {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Marks (out of 100)</Label>
                    <Input
                      type="number"
                      placeholder="Enter marks"
                      value={marks}
                      onChange={(e) => handleMarksChange(e.target.value)}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Grade</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Auto-calculated" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(gradePoints).map(grade => (
                          <SelectItem key={grade} value={grade}>
                            {grade} ({gradePoints[grade as keyof typeof gradePoints]} points)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSubmitResult} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Submit Result
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view-results" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-accent" />
                  Submitted Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No results submitted yet. Add some results to see them here.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex-1">
                          <div className="font-medium">{result.studentName}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.rollNumber} • {result.subjectName}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold">{result.marks}</div>
                            <div className="text-xs text-muted-foreground">Marks</div>
                          </div>
                          <Badge variant="outline">
                            {result.grade}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Class Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStudents.map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.rollNumber}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-primary">{calculateGPA(student.id)}</div>
                          <div className="text-xs text-muted-foreground">GPA</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Grade Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.keys(gradePoints).map(grade => {
                      const count = studentResults.filter(r => r.grade === grade).length;
                      const percentage = studentResults.length > 0 ? (count / studentResults.length) * 100 : 0;
                      
                      return (
                        <div key={grade} className="flex justify-between items-center">
                          <span>Grade {grade}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{count}</span>
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
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