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
import { motion } from 'framer-motion';

const StudentGrades: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  const [lastViewedGrade, setLastViewedGrade] = React.useState<string | null>(null);
  
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

  // Add highlight effect for viewed grades
  const handleGradeRowClick = (gradeId: string) => {
    setLastViewedGrade(gradeId);
    
    // Remove highlight after animation duration
    setTimeout(() => {
      setLastViewedGrade(null);
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Мои оценки</h1>
        <p className="text-default-500">
          Просмотр вашей успеваемости и оценок
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Card */}
        <Card className="border border-divider">
          <CardHeader>
            <h2 className="text-lg font-semibold">Сводка оценок</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold">{averageGrade.toFixed(1)}</h3>
                <p className="text-default-500">Средний балл</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Успеваемость</span>
                  <span>
                    {averageGrade >= 4.5 ? "Отлично" : 
                     averageGrade >= 3.5 ? "Хорошо" : 
                     averageGrade >= 2.5 ? "Удовлетворительно" : 
                     "Требует улучшения"}
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
                <p className="font-medium">Оценки по предметам</p>
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
              label="Фильтр по предмету"
              className="max-w-xs"
              selectedKeys={[selectedSubject]}
              onChange={(e) => setSelectedSubject(e.target.value)}
              aria-label="Фильтровать оценки по предмету"
            >
              <SelectItem key="all" value="all" textValue="Все предметы">Все предметы</SelectItem>
              {Object.values(subjectGrades).map((subject, index) => (
                <SelectItem 
                  key={Object.keys(subjectGrades)[index]} 
                  value={Object.keys(subjectGrades)[index]} 
                  textValue={subject.name}
                >
                  {subject.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          
          <Card className="border border-divider">
            <Table removeWrapper aria-label="Таблица оценок">
              <TableHeader>
                <TableColumn>ПРЕДМЕТ</TableColumn>
                <TableColumn>ОЦЕНКА</TableColumn>
                <TableColumn>ДАТА</TableColumn>
                <TableColumn>ПРЕПОДАВАТЕЛЬ</TableColumn>
                <TableColumn>КОММЕНТАРИЙ</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => {
                  const subject = getSubjectById(grade.subjectId);
                  const teacher = getTeacherById(grade.teacherId);
                  const isHighlighted = grade.id === lastViewedGrade;
                  
                  return (
                    <TableRow 
                      key={grade.id} 
                      onClick={() => handleGradeRowClick(grade.id)}
                      className={`cursor-pointer ${isHighlighted ? 'bg-primary-50' : ''}`}
                    >
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
                          {grade.comment || "Нет комментария"}
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