import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Chip,
  Button
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/auth-context';
import { 
  getTeacherById, 
  getTeacherSchedule, 
  getDayName, 
  getTeacherGrades,
  getSubjectById,
  getGroupById,
  getStudentById
} from '../../data/mock-data';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Get current date and time
  const now = new Date();
  const currentDayNumber = now.getDay();
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  // Get today's schedule
  const todaySchedule = getTeacherSchedule('t1').filter(
    entry => entry.dayOfWeek === currentDayNumber
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  // Get recent grades
  const recentGrades = getTeacherGrades('t1').sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-default-500">
          Here's your teaching overview for today, {getDayName(currentDayNumber)}
        </p>
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
                    const group = getGroupById(entry.groupId);
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
                              <p className="text-default-500 text-sm">{group?.name} • Room {entry.roomNumber}</p>
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

        {/* Quick Access */}
        <div>
          <Card className="border border-divider">
            <CardHeader>
              <h2 className="text-lg font-semibold">Quick Access</h2>
            </CardHeader>
            <Divider />
            <CardBody className="py-4 px-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-primary-100 text-primary">
                      <Icon icon="lucide:book" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Grade Books</div>
                </Button>
                
                <Button 
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
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-success-100 text-success">
                      <Icon icon="lucide:users" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Students</div>
                </Button>
                
                <Button 
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-secondary-100 text-secondary">
                      <Icon icon="lucide:file-text" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Materials</div>
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card className="border border-divider mt-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">Recent Grades</h2>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <ul className="divide-y divide-divider">
                {recentGrades.map((grade) => {
                  const student = getStudentById(grade.studentId);
                  const subject = getSubjectById(grade.subjectId);
                  
                  return (
                    <li key={grade.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{student?.name}</p>
                          <p className="text-default-500 text-xs">{subject?.name}</p>
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
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-3">
          <Card className="border border-divider">
            <CardHeader className="flex justify-between">
              <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
              <Button color="primary" size="sm" variant="flat">
                View All
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              {/* Sample deadlines */}
              <ul className="divide-y divide-divider">
                {[
                  {
                    title: "Submit Final Grades",
                    subject: "Introduction to Programming",
                    dueDate: "Oct 15, 2023",
                    daysLeft: 5
                  },
                  {
                    title: "Course Material Update",
                    subject: "Data Structures",
                    dueDate: "Oct 18, 2023",
                    daysLeft: 8
                  },
                  {
                    title: "Exam Papers Preparation",
                    subject: "All Courses",
                    dueDate: "Oct 25, 2023",
                    daysLeft: 15
                  }
                ].map((deadline, index) => (
                  <li key={index} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{deadline.title}</p>
                        <p className="text-default-500 text-sm">{deadline.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{deadline.dueDate}</p>
                        <Chip 
                          size="sm"
                          color={
                            deadline.daysLeft <= 5 ? "danger" :
                            deadline.daysLeft <= 10 ? "warning" : 
                            "primary"
                          }
                          variant="flat"
                        >
                          {deadline.daysLeft} days left
                        </Chip>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;