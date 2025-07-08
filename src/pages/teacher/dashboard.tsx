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
import { Link } from 'react-router-dom';
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
        <h1 className="text-2xl font-bold mb-2">Добро пожаловать, {user?.name}</h1>
        <p className="text-default-500">
          Обзор вашего расписания занятий на сегодня, {getDayName(currentDayNumber)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2">
          <Card className="border border-divider">
            <CardHeader className="flex justify-between">
              <h2 className="text-lg font-semibold">Занятия сегодня</h2>
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
                              <p className="text-default-500 text-sm">{group?.name} • Кабинет {entry.roomNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {entry.startTime} - {entry.endTime}
                            </p>
                            {isCurrentClass && (
                              <Chip color="primary" size="sm">Сейчас</Chip>
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
                  <p className="text-default-500">Нет запланированных занятий на сегодня</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Quick Access */}
        <div>
          <Card className="border border-divider">
            <CardHeader>
              <h2 className="text-lg font-semibold">Быстрый доступ</h2>
            </CardHeader>
            <Divider />
            <CardBody className="py-4 px-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  as={Link}
                  to="/teacher/grades"
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-primary-100 text-primary">
                      <Icon icon="lucide:book" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Журнал оценок</div>
                </Button>
                
                <Button 
                  as={Link}
                  to="/teacher/schedule"
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-warning-100 text-warning">
                      <Icon icon="lucide:calendar" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Расписание</div>
                </Button>
                
                <Button 
                  as={Link}
                  to="/teacher/students"
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-success-100 text-success">
                      <Icon icon="lucide:users" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Студенты</div>
                </Button>
                
                <Button 
                  as={Link}
                  to="/teacher/materials"
                  variant="flat" 
                  className="h-auto py-4 flex-col text-default-700"
                  startContent={
                    <div className="p-2 rounded-full bg-secondary-100 text-secondary">
                      <Icon icon="lucide:file-text" width={24} height={24} />
                    </div>
                  }
                >
                  <div className="mt-2 text-sm">Материалы</div>
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border border-divider mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Недавние оценки</h2>
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
    </div>
  );
};

export default TeacherDashboard;