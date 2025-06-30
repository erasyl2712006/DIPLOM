import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Progress
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  getStudentGrades, 
  getSubjectById,
  getTeacherById
} from '../../data/mock-data';

const StudentGrades: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  
  // Get all grades for the student
  const allGrades = getStudentGrades('st1');
  
  // Calculate average grade
  const averageGrade = allGrades.length > 0 
    ? allGrades.reduce((sum, grade) => sum + grade.grade, 0) / allGrades.length
    : 0;
    
  // Filter grades by selected subject
  const filteredGrades = React.useMemo(() => {
    if (selectedSubject === "all") {
      return allGrades;
    }
    return allGrades.filter(grade => grade.subjectId === selectedSubject);
  }, [selectedSubject]);
  
  // Group grades by subject for the chart
  const subjectGrades = React.useMemo(() => {
    const subjects: Record<string, { name: string, grades: number[], average: number }> = {};
    
    allGrades.forEach(grade => {
      const subject = getSubjectById(grade.subjectId);
      if (!subject) return;
      
      if (!subjects[grade.subjectId]) {
        subjects[grade.subjectId] = {
          name: subject.name,
          grades: [],
          average: 0
        };
      }
      
      subjects[grade.subjectId].grades.push(grade.grade);
    });
    
    // Calculate average for each subject
    Object.keys(subjects).forEach(id => {
      const subj = subjects[id];
      subj.average = subj.grades.reduce((sum, g) => sum + g, 0) / subj.grades.length;
    });
    
    return subjects;
  }, [allGrades]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Grades</h1>
        <p className="text-default-500">
          View your academic performance and grades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Card */}
        <Card className="border border-divider">
          <CardHeader>
            <h2 className="text-lg font-semibold">Grade Summary</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold">{averageGrade.toFixed(1)}</h3>
                <p className="text-default-500">Average Grade</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Performance</span>
                  <span>
                    {averageGrade >= 4.5 ? "Excellent" : 
                     averageGrade >= 3.5 ? "Good" : 
                     averageGrade >= 2.5 ? "Satisfactory" : 
                     "Needs Improvement"}
                  </span>
                </div>
                <Progress 
                  value={(averageGrade / 5) * 100} 
                  color={
                    averageGrade >= 4.5 ? "success" : 
                    averageGrade >= 3.5 ? "primary" : 
                    averageGrade >= 2.5 ? "warning" : 
                    "danger"
                  }
                />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Subject Breakdown</p>
                {Object.values(subjectGrades).map((subject, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="truncate max-w-[180px]">{subject.name}</span>
                      <span>{subject.average.toFixed(1)}</span>
                    </div>
                    <Progress 
                      value={(subject.average / 5) * 100} 
                      color={
                        subject.average >= 4.5 ? "success" : 
                        subject.average >= 3.5 ? "primary" : 
                        subject.average >= 2.5 ? "warning" : 
                        "danger"
                      }
                      size="sm"
                      className="mb-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Grades Table */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <Select
              label="Filter by Subject"
              className="max-w-xs"
              selectedKeys={[selectedSubject]}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <SelectItem key="all" value="all">All Subjects</SelectItem>
              {Object.values(subjectGrades).map((subject, index) => (
                <SelectItem key={Object.keys(subjectGrades)[index]} value={Object.keys(subjectGrades)[index]}>
                  {subject.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          
          <Card className="border border-divider">
            <Table removeWrapper aria-label="Student grades table">
              <TableHeader>
                <TableColumn>SUBJECT</TableColumn>
                <TableColumn>GRADE</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>TEACHER</TableColumn>
                <TableColumn>COMMENT</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => {
                  const subject = getSubjectById(grade.subjectId);
                  const teacher = getTeacherById(grade.teacherId);
                  
                  return (
                    <TableRow key={grade.id}>
                      <TableCell>{subject?.name}</TableCell>
                      <TableCell>
                        <Chip 
                          color={
                            grade.grade >= 5 ? "success" : 
                            grade.grade >= 4 ? "primary" : 
                            grade.grade >= 3 ? "warning" : 
                            "danger"
                          }
                          variant="flat"
                        >
                          {grade.grade}
                        </Chip>
                      </TableCell>
                      <TableCell>{grade.date}</TableCell>
                      <TableCell>{teacher?.name}</TableCell>
                      <TableCell>
                        <p className="text-default-600 truncate max-w-[180px]">
                          {grade.comment || "No comment"}
                        </p>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;