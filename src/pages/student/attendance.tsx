import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tabs,
  Tab,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  attendanceRecords, 
  getScheduleEntryById,
  getSubjectById,
  getTeacherById
} from '../../data/mock-data';

const StudentAttendance: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = React.useState<string>("current");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  
  // Get current student attendance records (hardcoded to st1 for now)
  const studentAttendance = React.useMemo(() => {
    return attendanceRecords.filter(record => record.studentId === 'st1');
  }, []);
  
  // Get attendance by status
  const attendanceCounts = React.useMemo(() => {
    return {
      present: studentAttendance.filter(r => r.status === 'present').length,
      absent: studentAttendance.filter(r => r.status === 'absent').length,
      late: studentAttendance.filter(r => r.status === 'late').length,
      excused: studentAttendance.filter(r => r.status === 'excused').length,
      total: studentAttendance.length
    };
  }, [studentAttendance]);
  
  // Get attendance rate
  const attendanceRate = React.useMemo(() => {
    if (attendanceCounts.total === 0) return 0;
    return Math.round((attendanceCounts.present / attendanceCounts.total) * 100);
  }, [attendanceCounts]);
  
  // Get attendance by subject
  const attendanceBySubject = React.useMemo(() => {
    const subjects: Record<string, { present: number, total: number }> = {};
    
    studentAttendance.forEach(record => {
      const scheduleEntry = getScheduleEntryById(record.scheduleEntryId);
      if (!scheduleEntry) return;
      
      const subjectId = scheduleEntry.subjectId;
      
      if (!subjects[subjectId]) {
        subjects[subjectId] = { present: 0, total: 0 };
      }
      
      subjects[subjectId].total++;
      if (record.status === 'present') {
        subjects[subjectId].present++;
      }
    });
    
    return subjects;
  }, [studentAttendance]);
  
  // Get status color
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
        <h1 className="text-2xl font-bold">Моя посещаемость</h1>
        <p className="text-default-500">
          Отчет о вашей посещаемости занятий
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border border-divider">
          <CardBody className="flex flex-col items-center justify-center p-6">
            <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{attendanceRate}%</p>
                <p className="text-xs text-default-500">Посещаемость</p>
              </div>
            </div>
            <p className="font-medium text-lg">
              {attendanceRate >= 90 ? "Отлично" : 
               attendanceRate >= 75 ? "Хорошо" : 
               attendanceRate >= 60 ? "Удовлетворительно" : 
               "Требуется улучшение"}
            </p>
          </CardBody>
        </Card>

        <Card className="border border-divider">
          <CardHeader>
            <h3 className="text-lg font-semibold">Статистика посещений</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success-100 text-success">
                  <Icon icon="lucide:check" width={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span>Присутствовал</span>
                    <span>{attendanceCounts.present}</span>
                  </div>
                  <Progress value={(attendanceCounts.present / attendanceCounts.total) * 100} color="success" size="sm" className="mt-1" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-danger-100 text-danger">
                  <Icon icon="lucide:x" width={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span>Отсутствовал</span>
                    <span>{attendanceCounts.absent}</span>
                  </div>
                  <Progress value={(attendanceCounts.absent / attendanceCounts.total) * 100} color="danger" size="sm" className="mt-1" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-warning-100 text-warning">
                  <Icon icon="lucide:clock" width={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span>Опоздал</span>
                    <span>{attendanceCounts.late}</span>
                  </div>
                  <Progress value={(attendanceCounts.late / attendanceCounts.total) * 100} color="warning" size="sm" className="mt-1" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary-100 text-primary">
                  <Icon icon="lucide:file-minus" width={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span>Уважительная причина</span>
                    <span>{attendanceCounts.excused}</span>
                  </div>
                  <Progress value={(attendanceCounts.excused / attendanceCounts.total) * 100} color="primary" size="sm" className="mt-1" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-divider">
          <CardHeader>
            <h3 className="text-lg font-semibold">Посещаемость по предметам</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-3">
              {Object.entries(attendanceBySubject).map(([subjectId, data]) => {
                const subject = getSubjectById(subjectId);
                const rate = Math.round((data.present / data.total) * 100);
                
                return subject && (
                  <div key={subjectId}>
                    <div className="flex justify-between text-sm">
                      <span className="truncate max-w-[180px]">{subject.name}</span>
                      <span>{rate}%</span>
                    </div>
                    <Progress 
                      value={rate} 
                      color={
                        rate >= 90 ? "success" : 
                        rate >= 75 ? "primary" : 
                        rate >= 60 ? "warning" : 
                        "danger"
                      }
                      size="sm"
                      className="mt-1"
                    />
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="shadow-sm border-divider">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">История посещаемости</h2>
          <div className="flex gap-2">
            <Select
              selectedKeys={[selectedMonth]}
              onChange={(e) => setSelectedMonth(e.target.value)}
              size="sm"
              aria-label="Выберите месяц"
            >
              <SelectItem key="current" value="current" textValue="Текущий месяц">Текущий месяц</SelectItem>
              <SelectItem key="previous" value="previous" textValue="Предыдущий месяц">Предыдущий месяц</SelectItem>
              <SelectItem key="all" value="all" textValue="Все время">Все время</SelectItem>
            </Select>
            <Select
              selectedKeys={[selectedSubject]}
              onChange={(e) => setSelectedSubject(e.target.value)}
              size="sm"
              aria-label="Выберите предмет"
            >
              <SelectItem key="all" value="all" textValue="Все предметы">Все предметы</SelectItem>
              {Object.keys(attendanceBySubject).map(subjectId => {
                const subject = getSubjectById(subjectId);
                return subject && (
                  <SelectItem key={subjectId} value={subjectId} textValue={subject.name}>
                    {subject.name}
                  </SelectItem>
                );
              })}
            </Select>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          <Table removeWrapper aria-label="История посещаемости">
            <TableHeader>
              <TableColumn>ДАТА</TableColumn>
              <TableColumn>ПРЕДМЕТ</TableColumn>
              <TableColumn>ПРЕПОДАВАТЕЛЬ</TableColumn>
              <TableColumn>СТАТУС</TableColumn>
              <TableColumn>ПРИМЕЧАНИЕ</TableColumn>
            </TableHeader>
            <TableBody>
              {studentAttendance.map((record) => {
                const scheduleEntry = getScheduleEntryById(record.scheduleEntryId);
                if (!scheduleEntry) return null;
                
                const subject = getSubjectById(scheduleEntry.subjectId);
                const teacher = getTeacherById(scheduleEntry.teacherId);
                
                return (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{subject?.name}</TableCell>
                    <TableCell>{teacher?.name}</TableCell>
                    <TableCell>
                      <Chip color={getStatusColor(record.status) as any} variant="flat">
                        {getStatusLabel(record.status)}
                      </Chip>
                    </TableCell>
                    <TableCell>{record.notes || "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentAttendance;