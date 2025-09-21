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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-400/10"></div>
      
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-white drop-shadow-lg" />
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Faculty Portal</h1>
              <p className="text-gray-200 drop-shadow-md">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold">
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Faculty Info */}
        <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
              <BookOpen className="h-5 w-5 text-cyan-400 drop-shadow-lg" />
              Faculty Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400 drop-shadow-lg">{user.employeeId}</div>
                <div className="text-sm text-gray-300">Employee ID</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400 drop-shadow-lg">{user.department}</div>
                <div className="text-sm text-gray-300">Department</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400 drop-shadow-lg">{studentResults.length}</div>
                <div className="text-sm text-gray-300">Results Submitted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="add-results" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl border border-white/20">
            <TabsTrigger value="add-results" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white font-medium">Add Results</TabsTrigger>
            <TabsTrigger value="view-results" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white font-medium">View Results</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white font-medium">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="add-results" className="space-y-6">
            <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                  <PlusCircle className="h-5 w-5 text-cyan-400 drop-shadow-lg" />
                  Submit Student Results
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Add marks and grades for your students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white font-medium drop-shadow-md">Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                        {mockSubjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id} className="text-white hover:bg-white/10">
                            {subject.name} ({subject.credits} credits)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-medium drop-shadow-md">Student</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                        {mockStudents.map(student => (
                          <SelectItem key={student.id} value={student.id} className="text-white hover:bg-white/10">
                            {student.rollNumber} - {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-medium drop-shadow-md">Marks (out of 100)</Label>
                    <Input
                      type="number"
                      placeholder="Enter marks"
                      value={marks}
                      onChange={(e) => handleMarksChange(e.target.value)}
                      min="0"
                      max="100"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-medium drop-shadow-md">Grade</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Auto-calculated" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
                        {Object.keys(gradePoints).map(grade => (
                          <SelectItem key={grade} value={grade} className="text-white hover:bg-white/10">
                            {grade} ({gradePoints[grade as keyof typeof gradePoints]} points)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSubmitResult} className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold drop-shadow-lg">
                  <Save className="h-4 w-4 mr-2" />
                  Submit Result
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view-results" className="space-y-6">
            <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                  <FileSpreadsheet className="h-5 w-5 text-purple-400 drop-shadow-lg" />
                  Submitted Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-300">
                    No results submitted yet. Add some results to see them here.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-white/10 backdrop-blur-xl">
                        <div className="flex-1">
                          <div className="font-medium text-white">{result.studentName}</div>
                          <div className="text-sm text-gray-300">
                            {result.rollNumber} • {result.subjectName}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-bold text-white">{result.marks}</div>
                            <div className="text-xs text-gray-300">Marks</div>
                          </div>
                          <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
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
              <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                    <Calculator className="h-5 w-5 text-cyan-400 drop-shadow-lg" />
                    Class Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStudents.map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-xl rounded-lg">
                        <div>
                          <div className="font-medium text-white">{student.name}</div>
                          <div className="text-sm text-gray-300">{student.rollNumber}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-cyan-400">{calculateGPA(student.id)}</div>
                          <div className="text-xs text-gray-300">GPA</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in hover-scale bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white drop-shadow-lg">Grade Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.keys(gradePoints).map(grade => {
                      const count = studentResults.filter(r => r.grade === grade).length;
                      const percentage = studentResults.length > 0 ? (count / studentResults.length) * 100 : 0;
                      
                      return (
                        <div key={grade} className="flex justify-between items-center">
                          <span className="text-white">Grade {grade}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-300">{count}</span>
                            <div className="w-20 bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-cyan-400 h-2 rounded-full transition-all duration-500" 
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