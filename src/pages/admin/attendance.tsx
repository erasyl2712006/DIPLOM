import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Select,
  SelectItem,
  Tabs,
  Tab
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  attendanceRecords, 
  scheduleEntries,
  students, 
  getStudentById, 
  getSubjectById, 
  getScheduleEntryById,
  getTeacherById
} from '../../data/mock-data';

const AdminAttendance: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedStudent, setSelectedStudent] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  
  // Filter attendance records
  const filteredAttendance = React.useMemo(() => {
    let filtered = [...attendanceRecords];
    
    // Filter by student
    if (selectedStudent !== 'all') {
      filtered = filtered.filter(record => record.studentId === selectedStudent);
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }
    
    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(record => record.date === selectedDate);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(record => {
        const student = getStudentById(record.studentId);
        const scheduleEntry = scheduleEntries.find(entry => entry.id === record.scheduleEntryId);
        const subject = scheduleEntry ? getSubjectById(scheduleEntry.subjectId) : null;
        
        return (
          student?.name.toLowerCase().includes(lowerCaseQuery) ||
          subject?.name.toLowerCase().includes(lowerCaseQuery) ||
          record.notes?.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedStudent, selectedStatus, selectedDate, searchQuery]);

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return "success";
      case 'absent': return "danger";
      case 'late': return "warning";
      case 'excused': return "primary";
      default: return "default";
    }
  };

  // Get status label in Russian
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return "Присутствует";
      case 'absent': return "Отсутствует";
      case 'late': return "Опоздал";
      case 'excused': return "Уважительная причина";
      default: return status;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Учет посещаемости</h1>
        <p className="text-default-500">
          Просмотр и управление посещаемостью студентов
        </p>
      </div>

      <Tabs aria-label="Attendance options">
        <Tab key="records" title="Записи посещаемости">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <Select
              label="Студент"
              selectedKeys={[selectedStudent]}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <SelectItem key="all" value="all">Все студенты</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </Select>
            
            <Select
              label="Статус"
              selectedKeys={[selectedStatus]}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <SelectItem key="all" value="all">Все статусы</SelectItem>
              <SelectItem key="present" value="present">Присутствует</SelectItem>
              <SelectItem key="absent" value="absent">Отсутствует</SelectItem>
              <SelectItem key="late" value="late">Опоздал</SelectItem>
              <SelectItem key="excused" value="excused">Уважительная причина</SelectItem>
            </Select>
            
            <Input
              type="date"
              label="Дата"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              isClearable
            />
          </div>

          <Card className="shadow-sm border-divider">
            <Table removeWrapper aria-label="Таблица посещаемости">
              <TableHeader>
                <TableColumn>ДАТА</TableColumn>
                <TableColumn>СТУДЕНТ</TableColumn>
                <TableColumn>ПРЕДМЕТ</TableColumn>
                <TableColumn>ПРЕПОДАВАТЕЛЬ</TableColumn>
                <TableColumn>СТАТУС</TableColumn>
                <TableColumn>ПРИМЕЧАНИЯ</TableColumn>
                <TableColumn width={100}>ДЕЙСТВИЯ</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => {
                  const student = getStudentById(record.studentId);
                  const scheduleEntry = scheduleEntries.find(entry => entry.id === record.scheduleEntryId);
                  const subject = scheduleEntry ? getSubjectById(scheduleEntry.subjectId) : null;
                  const teacher = scheduleEntry ? getTeacherById(scheduleEntry.teacherId) : null;
                  
                  return (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{student?.name}</TableCell>
                      <TableCell>{subject?.name}</TableCell>
                      <TableCell>{teacher?.name}</TableCell>
                      <TableCell>
                        <Chip color={getStatusColor(record.status) as any} variant="flat">
                          {getStatusLabel(record.status)}
                        </Chip>
                      </TableCell>
                      <TableCell>{record.notes || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button isIconOnly size="sm" variant="light">
                            <Icon icon="lucide:edit" className="text-default-500" />
                          </Button>
                          <Button isIconOnly size="sm" variant="light" color="danger">
                            <Icon icon="lucide:trash-2" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          <div className="flex justify-end mt-6">
            <Button color="primary" endContent={<Icon icon="lucide:download" />}>
              Экспорт данных
            </Button>
          </div>
        </Tab>
        
        <Tab key="stats" title="Статистика посещаемости">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-divider">
              <CardHeader>
                <h3 className="text-lg font-semibold">Общая посещаемость</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-8 border-primary flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold">85%</p>
                      <p className="text-xs text-default-500">Посещаемость</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Присутствует</span>
                    <span>170</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Отсутствует</span>
                    <span>15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Опоздал</span>
                    <span>8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Уважительная причина</span>
                    <span>7</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border border-divider">
              <CardHeader>
                <h3 className="text-lg font-semibold">По группам</h3>
              </CardHeader>
              <Divider />
              <CardBody className="p-0">
                <Table removeWrapper aria-label="Таблица посещаемости по группам">
                  <TableHeader>
                    <TableColumn>ГРУППА</TableColumn>
                    <TableColumn>ПОСЕЩАЕМОСТЬ</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow key="g1">
                      <TableCell>CS-101</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-default-200 rounded-lg overflow-hidden">
                            <div className="h-full bg-primary rounded-lg" style={{width: '90%'}}></div>
                          </div>
                          <span className="text-sm">90%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow key="g2">
                      <TableCell>CS-201</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-default-200 rounded-lg overflow-hidden">
                            <div className="h-full bg-primary rounded-lg" style={{width: '87%'}}></div>
                          </div>
                          <span className="text-sm">87%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow key="g3">
                      <TableCell>ME-101</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-default-200 rounded-lg overflow-hidden">
                            <div className="h-full bg-primary rounded-lg" style={{width: '82%'}}></div>
                          </div>
                          <span className="text-sm">82%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow key="g4">
                      <TableCell>EE-101</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-default-200 rounded-lg overflow-hidden">
                            <div className="h-full bg-primary rounded-lg" style={{width: '78%'}}></div>
                          </div>
                          <span className="text-sm">78%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardBody>
            </Card>

            <Card className="border border-divider">
              <CardHeader>
                <h3 className="text-lg font-semibold">Тенденция посещаемости</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="text-center text-default-500 py-4">
                  <p>График тенденции посещаемости по месяцам</p>
                  <p className="text-xs mt-2">Данные будут доступны в следующем обновлении</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminAttendance;