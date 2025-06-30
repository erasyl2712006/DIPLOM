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
    { key: '1', label: 'Monday' },
    { key: '2', label: 'Tuesday' },
    { key: '3', label: 'Wednesday' },
    { key: '4', label: 'Thursday' },
    { key: '5', label: 'Friday' },
    { key: '6', label: 'Saturday' },
    { key: '0', label: 'Sunday' },
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
        <h1 className="text-2xl font-bold mb-2">My Schedule</h1>
        <p className="text-default-500">
          View your weekly class schedule
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
        <Tab key="daily" title="Daily View">
          <div className="flex justify-between items-center mb-6">
            <Select
              label="Select Day"
              className="max-w-xs"
              selectedKeys={[selectedDay]}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              {days.map((day) => (
                <SelectItem key={day.key} value={day.key}>
                  {day.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          
          <Card className="border border-divider">
            <CardHeader className="flex justify-between">
              <h2 className="text-lg font-semibold">
                Classes for {days.find(d => d.key === selectedDay)?.label}
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
                              <p className="text-default-500 text-sm">{teacher?.name} • Room {entry.roomNumber}</p>
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
                              {subject?.credits} credits
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
                  <p className="text-default-500">No classes scheduled for this day</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="weekly" title="Weekly View">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map((day) => (
              <Card key={day.key} className="border border-divider">
                <CardHeader className="flex justify-between">
                  <h2 className="text-lg font-semibold">{day.label}</h2>
                  <Chip color="primary" variant="flat" size="sm">
                    {weekSchedule[day.key].length} Classes
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
                                  {teacher?.name} • Room {entry.roomNumber}
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
                      <p className="text-default-500 text-sm">No classes</p>
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