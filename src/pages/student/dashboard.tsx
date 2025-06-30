import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Chip,
  Button,
  Progress
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { 
  getStudentSchedule, 
  getDayName, 
  getStudentGrades,
  getSubjectById,
  getGroupById,
  getTeacherById
} from '../../data/mock-data';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Get current date and time
  const now = new Date();
  const currentDayNumber = now.getDay();
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  // Get today's schedule
  const todaySchedule = getStudentSchedule('st1').filter(
    entry => entry.dayOfWeek === currentDayNumber
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  // Get recent grades
  const recentGrades = getStudentGrades('st1').sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  // Calculate GPA
  const allGrades = getStudentGrades('st1');
  const averageGrade = allGrades.length > 0 
    ? allGrades.reduce((sum, grade) => sum + grade.grade, 0) / allGrades.length
    : 0;
  const gradeProgress = (averageGrade / 5) * 100; // 5 is max grade

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-default-500">
          Here's your student dashboard for today, {getDayName(currentDayNumber)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-divider">
          <CardBody className="flex flex-col gap-2">
            <p className="text-default-500">Average Grade</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">{averageGrade.toFixed(1)}</h3>
              <Chip 
                color={
                  averageGrade >= 4.5 ? "success" : 
                  averageGrade >= 3.5 ? "primary" : 
                  averageGrade >= 2.5 ? "warning" : 
                  "danger"
                }
                variant="flat"
              >
                {averageGrade >= 4.5 ? "Excellent" : 
                 averageGrade >= 3.5 ? "Good" : 
                 averageGrade >= 2.5 ? "Satisfactory" : 
                 "Needs Improvement"}
              </Chip>
            </div>
            <Progress 
              value={gradeProgress} 
              color={
                averageGrade >= 4.5 ? "success" : 
                averageGrade >= 3.5 ? "primary" : 
                averageGrade >= 2.5 ? "warning" : 
                "danger"
              }
              size="sm"
              className="mt-2"
            />
          </CardBody>
        </Card>
        
        <Card className="border border-divider">
          <CardBody className="flex flex-col gap-2">
            <p className="text-default-500">Today's Classes</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">{todaySchedule.length}</h3>
              <Button 
                as={Link}
                to="/student/schedule"
                size="sm" 
                variant="light" 
                color="primary"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                View Schedule
              </Button>
            </div>
          </CardBody>
        </Card>
        
        <Card className="border border-divider">
          <CardBody className="flex flex-col gap-2">
            <p className="text-default-500">Assignments Due</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">2</h3>
              <Chip color="warning" variant="flat">This Week</Chip>
            </div>
          </CardBody>
        </Card>
        
        <Card className="border border-divider">
          <CardBody className="flex flex-col gap-2">
            <p className="text-default-500">Attendance Rate</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">95%</h3>
              <Chip color="success" variant="flat">Good</Chip>
            </div>
            <Progress 
              value={95} 
              color="success"
              size="sm"
              className="mt-2"
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2">
          <Card className="border border-divider">
            <CardHeader className="flex justify-between">
              <h2 className="text-lg font-semibold">Today's Classes</h2>
              <Chip color="primary" variant="flat">{getDayName(currentDayNumber)}</Chip>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              {todaySchedule.length > 0 ? (
                <ul className="divide-y divide-divider">
                  {todaySchedule.map((entry) => {
                    const subject = getSubjectById(entry.subjectId);
                    const teacher = getTeacherById(entry.teacherId);
                    const isCurrentClass = entry.startTime <= currentTimeStr && entry.endTime >= currentTimeStr;
                    
                    return (
                      <li 
                        key={entry.id} 
                        className={`p-4 ${isCurrentClass ? 'bg-primary-50' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full ${isCurrentClass ? 'bg-primary-100 text-primary' : 'bg-default-100 text-default-600'}`}>
                              <Icon icon="lucide:book-open" width={20} height={20} />
                            </div>
                            <div>
                              <p className="font-medium">{subject?.name}</p>
                              <p className="text-default-500 text-sm">{teacher?.name} • Room {entry.roomNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {entry.startTime} - {entry.endTime}
                            </p>
                            {isCurrentClass && (
                              <Chip color="primary" size="sm">Ongoing</Chip>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <Icon icon="lucide:calendar" className="mx-auto mb-2 text-default-400" width={32} height={32} />
                  <p className="text-default-500">No classes scheduled for today</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Recent Grades */}
        <div>
          <Card className="border border-divider">
            <CardHeader className="flex justify-between">
              <h2 className="text-lg font-semibold">Recent Grades</h2>
              <Button 
                as={Link}
                to="/student/grades"
                size="sm" 
                variant="light" 
                color="primary"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                All Grades
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <ul className="divide-y divide-divider">
                {recentGrades.map((grade) => {
                  const subject = getSubjectById(grade.subjectId);
                  
                  return (
                    <li key={grade.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{subject?.name}</p>
                          <p className="text-default-500 text-xs">{grade.date}</p>
                        </div>
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
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
          
          {/* Quick Access */}
          <Card className="border border-divider mt-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">Quick Access</h2>
            </CardHeader>
            <Divider />
            <CardBody className="py-4 px-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  as={Link}
                  to="/student/profile"
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-primary-100 text-primary">
                      <Icon icon="lucide:user" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Profile</div>
                </Button>
                
                <Button 
                  as={Link}
                  to="/student/schedule"
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-warning-100 text-warning">
                      <Icon icon="lucide:calendar" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Schedule</div>
                </Button>
                
                <Button 
                  as={Link}
                  to="/student/grades"
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-success-100 text-success">
                      <Icon icon="lucide:file-text" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Grades</div>
                </Button>
                
                <Button 
                  as={Link}
                  to="/student/teachers"
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-secondary-100 text-secondary">
                      <Icon icon="lucide:users" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Teachers</div>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;