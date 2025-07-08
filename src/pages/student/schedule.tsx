import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Chip,
  Tabs,
  Tab,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  getStudentSchedule, 
  getDayName, 
  getSubjectById,
  getTeacherById
} from '../../data/mock-data';

const StudentSchedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = React.useState<string>(String(new Date().getDay()));
  
  // Days of the week
  const days = [
    { key: '1', label: 'Понедельник' },
    { key: '2', label: 'Вторник' },
    { key: '3', label: 'Среда' },
    { key: '4', label: 'Четверг' },
    { key: '5', label: 'Пятница' },
    { key: '6', label: 'Суббота' },
    { key: '0', label: 'Воскресенье' },
  ];

  // Get schedule for the selected day
  const daySchedule = React.useMemo(() => {
    return getStudentSchedule('st1')
      .filter(entry => entry.dayOfWeek === Number(selectedDay))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [selectedDay]);

  // Get all schedule grouped by day
  const weekSchedule = React.useMemo(() => {
    const schedule: Record<string, any[]> = {};
    
    days.forEach(day => {
      schedule[day.key] = getStudentSchedule('st1')
        .filter(entry => entry.dayOfWeek === Number(day.key))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    
    return schedule;
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Моё расписание</h1>
        <p className="text-default-500">
          Просмотр вашего еженедельного расписания занятий
        </p>
      </div>

      <Tabs 
        aria-label="Schedule views" 
        classNames={{
          tabList: "gap-6 relative rounded-none p-0 border-b border-divider mb-6",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary"
        }}
      >
        <Tab key="daily" title="Ежедневное представление">
          <div className="flex justify-between items-center mb-6">
            <Select
              label="Выберите день"
              className="max-w-xs"
              selectedKeys={[selectedDay]}
              onChange={(e) => setSelectedDay(e.target.value)}
              aria-label="Выберите день недели"
            >
              {days.map((day) => (
                <SelectItem key={day.key} value={day.key} textValue={day.label}>
                  {day.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          
          <Card className="border border-divider">
            <CardHeader className="flex justify-between">
              <h2 className="text-lg font-semibold">
                Занятия на {days.find(d => d.key === selectedDay)?.label}
              </h2>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              {daySchedule.length > 0 ? (
                <ul className="divide-y divide-divider">
                  {daySchedule.map((entry) => {
                    const subject = getSubjectById(entry.subjectId);
                    const teacher = getTeacherById(entry.teacherId);
                    
                    return (
                      <li key={entry.id} className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-full bg-primary-100 text-primary">
                              <Icon icon="lucide:book-open" width={20} height={20} />
                            </div>
                            <div>
                              <p className="font-medium">{subject?.name}</p>
                              <p className="text-default-500 text-sm">{teacher?.name} • Аудитория {entry.roomNumber}</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="flex items-center sm:justify-end gap-2">
                              <Icon icon="lucide:clock" className="text-default-500" width={16} />
                              <p className="font-medium">
                                {entry.startTime} - {entry.endTime}
                              </p>
                            </div>
                            <p className="text-default-500 text-sm">
                              {subject?.credits} кредитов
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <Icon icon="lucide:calendar-off" className="mx-auto mb-2 text-default-400" width={32} height={32} />
                  <p className="text-default-500">Нет занятий на этот день</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="weekly" title="Еженедельное представление">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map((day) => (
              <Card key={day.key} className="border border-divider">
                <CardHeader className="flex justify-between">
                  <h2 className="text-lg font-semibold">{day.label}</h2>
                  <Chip color="primary" variant="flat" size="sm">
                    {weekSchedule[day.key].length} занятий
                  </Chip>
                </CardHeader>
                <Divider />
                <CardBody className="p-0">
                  {weekSchedule[day.key].length > 0 ? (
                    <ul className="divide-y divide-divider">
                      {weekSchedule[day.key].map((entry) => {
                        const subject = getSubjectById(entry.subjectId);
                        const teacher = getTeacherById(entry.teacherId);
                        
                        return (
                          <li key={entry.id} className="p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{subject?.name}</p>
                                <p className="text-default-500 text-xs">
                                  {teacher?.name} • Аудитория {entry.roomNumber}
                                </p>
                              </div>
                              <p className="text-sm">
                                {entry.startTime} - {entry.endTime}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-default-500 text-sm">Нет занятий</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default StudentSchedule;