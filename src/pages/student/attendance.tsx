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
  Progress,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  attendanceRecords, 
  scheduleEntries,
  getSubjectById,
  getTeacherById,
  getStudentAttendanceSummary
} from '../../data/mock-data';

const StudentAttendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  
  // Hard-coded student ID for now
  const studentId = 'st1';
  
  // Get attendance summary
  const attendanceSummary = getStudentAttendanceSummary(studentId);
  const attendanceRate = attendanceSummary.total > 0 
    ? Math.round((attendanceSummary.present / attendanceSummary.total) * 100) 
    : 0;
  
  // Get student attendance records
  const studentAttendance = React.useMemo(() => {
    let filtered = attendanceRecords.filter(record => record.studentId === studentId);
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }
    
    // Filter by month (simplified - just checking if month is in date string)
    if (selectedMonth !== 'all') {
      const monthMap: Record<string, string> = {
        '01': '-01-',
        '02': '-02-',
        '03': '-03-',
        '04': '-04-',
        '05': '-05-',
        '06': '-06-',
        '07': '-07-',
        '08': '-08-',
        '09': '-09-',
        '10': '-10-',
        '11': '-11-',
        '12': '-12-',
      };
      filtered = filtered.filter(record => record.date.includes(monthMap[selectedMonth]));
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [studentId, selectedMonth, selectedStatus]);
  
  // Get status color and label
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'present':
        return { color: 'success', label: 'Присутствует', icon: 'lucide:check' };
      case 'absent':
        return { color: 'danger', label: 'Отсутствует', icon: 'lucide:x' };
      case 'late':
        return { color: 'warning', label: 'Опоздал', icon: 'lucide:clock' };
      case 'excused':
        return { color: 'primary', label: 'Уважительная причина', icon: 'lucide:clipboard' };
      default:
        return { color: 'default', label: status, icon: 'lucide:help-circle' };
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Посещаемость</h1>
        <p className="text-default-500">
          Просмотр вашей посещаемости занятий
        </p>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-divider">
          <CardBody>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-default-500 text-sm">Общая посещаемость</p>
                <p className="text-2xl font-bold">{attendanceRate}%</p>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-primary">
                <p className="text-primary font-bold">{attendanceRate}%</p>
              </div>
            </div>
            <Progress 
              value={attendanceRate} 
              color={
                attendanceRate >= 90 ? "success" : 
                attendanceRate >= 75 ? "primary" : 
                attendanceRate >= 60 ? "warning" : 
                "danger"
              }
              className="mt-2"
            />
          </CardBody>
        </Card>
        
        <Card className="border border-divider">
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-default-500 text-sm">Присутствие</p>
              <p className="text-2xl font-bold text-success">{attendanceSummary.present}</p>
              <p className="text-xs text-default-500">дней</p>
            </div>
            <div className="p-3 rounded-full bg-success-100 text-success">
              <Icon icon="lucide:check" width={24} height={24} />
            </div>
          </CardBody>
        </Card>
        
        <Card className="border border-divider">
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-default-500 text-sm">Отсутствие</p>
              <p className="text-2xl font-bold text-danger">{attendanceSummary.absent}</p>
              <p className="text-xs text-default-500">дней</p>
            </div>
            <div className="p-3 rounded-full bg-danger-100 text-danger">
              <Icon icon="lucide:x" width={24} height={24} />
            </div>
          </CardBody>
        </Card>
        
        <Card className="border border-divider">
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-default-500 text-sm">Опоздания</p>
              <p className="text-2xl font-bold text-warning">{attendanceSummary.late}</p>
              <p className="text-xs text-default-500">дней</p>
            </div>
            <div className="p-3 rounded-full bg-warning-100 text-warning">
              <Icon icon="lucide:clock" width={24} height={24} />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">История посещаемости</h2>
        
        <div className="flex gap-4">
          <Select
            label="Месяц"
            selectedKeys={[selectedMonth]}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-40"
          >
            <SelectItem key="all" value="all">Все месяцы</SelectItem>
            <SelectItem key="01" value="01">Январь</SelectItem>
            <SelectItem key="02" value="02">Февраль</SelectItem>
            <SelectItem key="03" value="03">Март</SelectItem>
            <SelectItem key="04" value="04">Апрель</SelectItem>
            <SelectItem key="05" value="05">Май</SelectItem>
            <SelectItem key="06" value="06">Июнь</SelectItem>
            <SelectItem key="07" value="07">Июль</SelectItem>
            <SelectItem key="08" value="08">Август</SelectItem>
            <SelectItem key="09" value="09">Сентябрь</SelectItem>
            <SelectItem key="10" value="10">Октябрь</SelectItem>
            <SelectItem key="11" value="11">Ноябрь</SelectItem>
            <SelectItem key="12" value="12">Декабрь</SelectItem>
          </Select>
          
          <Select
            label="Статус"
            selectedKeys={[selectedStatus]}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-40"
          >
            <SelectItem key="all" value="all">Все статусы</SelectItem>
            <SelectItem key="present" value="present">Присутствует</SelectItem>
            <SelectItem key="absent" value="absent">Отсутствует</SelectItem>
            <SelectItem key="late" value="late">Опоздал</SelectItem>
            <SelectItem key="excused" value="excused">Уважительная причина</SelectItem>
          </Select>
        </div>
      </div>

      <Card className="shadow-sm border-divider">
        <Table removeWrapper aria-label="Таблица посещаемости студента">
          <TableHeader>
            <TableColumn>ДАТА</TableColumn>
            <TableColumn>ПРЕДМЕТ</TableColumn>
            <TableColumn>ПРЕПОДАВАТЕЛЬ</TableColumn>
            <TableColumn>СТАТУС</TableColumn>
            <TableColumn>ПРИМЕЧАНИЯ</TableColumn>
          </TableHeader>
          <TableBody>
            {studentAttendance.map((record) => {
              const scheduleEntry = scheduleEntries.find(entry => entry.id === record.scheduleEntryId);
              const subject = scheduleEntry ? getSubjectById(scheduleEntry.subjectId) : null;
              const teacher = scheduleEntry ? getTeacherById(scheduleEntry.teacherId) : null;
              const statusInfo = getStatusInfo(record.status);
              
              return (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{subject?.name || "Неизвестно"}</TableCell>
                  <TableCell>{teacher?.name || "Неизвестно"}</TableCell>
                  <TableCell>
                    <Chip color={statusInfo.color as any} variant="dot">
                      {statusInfo.label}
                    </Chip>
                  </TableCell>
                  <TableCell>{record.notes || "—"}</TableCell>
                </TableRow>
              );
            })}

            {studentAttendance.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="text-center py-6">
                    <Icon icon="lucide:calendar-x" className="mx-auto mb-2 text-default-400" width={32} />
                    <p className="text-default-500">Записи не найдены</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default StudentAttendance;