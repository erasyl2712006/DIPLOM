import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Button,
  Input,
  Avatar,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  students, 
  attendanceRecords,
  getStudentById,
  getGroupById,
  getSubjectById,
  getScheduleEntryById,
  scheduleEntries
} from '../../data/mock-data';
import { motion } from 'framer-motion';
import { 
  getFromLocalStorage, 
  saveToLocalStorage, 
  updateCollectionItem, 
  addCollectionItem 
} from '../../data/local-storage';

const TeacherAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = React.useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Get classes taught by the teacher (hardcoded to t1 for now)
  const teacherClasses = React.useMemo(() => {
    return scheduleEntries.filter(entry => entry.teacherId === 't1');
  }, []);
  
  // Get students for the selected class
  const classStudents = React.useMemo(() => {
    if (!selectedClass) return [];
    
    const selectedEntry = scheduleEntries.find(entry => entry.id === selectedClass);
    if (!selectedEntry) return [];
    
    return students.filter(student => student.groupId === selectedEntry.groupId);
  }, [selectedClass]);
  
  // Add state for attendance records
  const [attendanceData, setAttendanceData] = React.useState(attendanceRecords);
  const [markAllStatus, setMarkAllStatus] = React.useState('present');
  const [markAllNote, setMarkAllNote] = React.useState('');
  
  // Load attendance data from localStorage
  React.useEffect(() => {
    const savedAttendance = getFromLocalStorage<typeof attendanceRecords>('attendance', attendanceRecords);
    setAttendanceData(savedAttendance);
  }, []);
  
  // Get attendance records for the selected class and date with localStorage data
  const classAttendance = React.useMemo(() => {
    if (!selectedClass || !selectedDate) return {};
    
    const records = attendanceData.filter(
      record => record.scheduleEntryId === selectedClass && record.date === selectedDate
    );
    
    const attendanceMap: Record<string, string> = {};
    records.forEach(record => {
      attendanceMap[record.studentId] = record.status;
    });
    
    return attendanceMap;
  }, [selectedClass, selectedDate, attendanceData]);
  
  // Get status options
  const statusOptions = [
    { key: 'present', label: 'Присутствует', color: 'success' },
    { key: 'absent', label: 'Отсутствует', color: 'danger' },
    { key: 'late', label: 'Опоздал', color: 'warning' },
    { key: 'excused', label: 'Уваж. причина', color: 'primary' }
  ];
  
  // Handle status change with localStorage persistence
  const handleStatusChange = (studentId: string, status: string) => {
    // Save the previous status for the student
    const previousStatus = classAttendance[studentId] || 'present';
    
    // Create a record ID for consistent updates
    const recordId = `att-${selectedClass}-${studentId}-${selectedDate}`;
    
    // Check if record exists
    const existingRecord = attendanceData.find(
      r => r.scheduleEntryId === selectedClass && 
           r.studentId === studentId && 
           r.date === selectedDate
    );
    
    if (existingRecord) {
      // Update existing record
      const updatedAttendance = updateCollectionItem(
        'attendance',
        existingRecord.id,
        { status },
        attendanceRecords
      );
      setAttendanceData(updatedAttendance);
    } else {
      // Create new record
      const newRecord = {
        id: recordId,
        scheduleEntryId: selectedClass,
        studentId: studentId,
        date: selectedDate,
        status: status,
        notes: ''
      };
      
      const updatedAttendance = addCollectionItem(
        'attendance',
        newRecord,
        attendanceRecords
      );
      setAttendanceData(updatedAttendance);
    }
    
    // Animate status change
    const statusCell = document.querySelector(`[data-student-id="${studentId}"]`);
    if (statusCell) {
      statusCell.classList.add('bg-primary-50');
      setTimeout(() => {
        statusCell.classList.remove('bg-primary-50');
      }, 1000);
    }
    
    addToast({
      title: "Статус обновлен",
      description: "Посещаемость студента успешно обновлена",
      color: "success",
    });
  };

  // Mark attendance for all students with localStorage persistence
  const handleMarkAllAttendance = () => {
    if (!selectedClass || !selectedDate || !classStudents.length) {
      onClose();
      return;
    }
    
    // Create or update attendance records for all students
    const updatedRecords = [...attendanceData];
    
    classStudents.forEach(student => {
      const existingRecordIndex = updatedRecords.findIndex(
        r => r.scheduleEntryId === selectedClass && 
             r.studentId === student.id && 
             r.date === selectedDate
      );
      
      if (existingRecordIndex >= 0) {
        // Update existing record
        updatedRecords[existingRecordIndex] = {
          ...updatedRecords[existingRecordIndex],
          status: markAllStatus,
          notes: markAllNote || updatedRecords[existingRecordIndex].notes
        };
      } else {
        // Create new record
        updatedRecords.push({
          id: `att-${selectedClass}-${student.id}-${selectedDate}`,
          scheduleEntryId: selectedClass,
          studentId: student.id,
          date: selectedDate,
          status: markAllStatus,
          notes: markAllNote
        });
      }
    });
    
    // Save to localStorage and update state
    saveToLocalStorage('attendance', updatedRecords);
    setAttendanceData(updatedRecords);
    
    onClose();
    
    addToast({
      title: "Посещаемость обновлена",
      description: `Статус посещаемости для всех студентов установлен: ${
        markAllStatus === 'present' ? 'Присутствует' :
        markAllStatus === 'absent' ? 'Отсутствует' :
        markAllStatus === 'late' ? 'Опоздал' : 'Уваж. причина'
      }`,
      color: "success",
    });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Учёт посещаемости</h1>
        <p className="text-default-500">
          Отмечайте посещаемость студентов на ваших занятиях
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Input
          type="date"
          label="Дата"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          labelPlacement="outside"
        />
        
        <Select
          label="Занятие"
          placeholder="Выберите занятие"
          selectedKeys={selectedClass ? [selectedClass] : []}
          onChange={(e) => setSelectedClass(e.target.value)}
          labelPlacement="outside"
        >
          {teacherClasses.map((entry) => {
            const subject = getSubjectById(entry.subjectId);
            const group = getGroupById(entry.groupId);
            
            return (
              <SelectItem key={entry.id} value={entry.id}>
                {`${subject?.name} | ${group?.name} | ${entry.startTime}-${entry.endTime}`}
              </SelectItem>
            );
          })}
        </Select>
      </div>

      {selectedClass && classStudents.length > 0 ? (
        <Card className="shadow-sm border-divider">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Список студентов ({getSubjectById(teacherClasses.find(c => c.id === selectedClass)?.subjectId || "")?.name})
            </h2>
            <Button color="primary" size="sm" onPress={onOpen}>
              Отметить всех
            </Button>
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            <Table removeWrapper aria-label="Таблица посещаемости">
              <TableHeader>
                <TableColumn>СТУДЕНТ</TableColumn>
                <TableColumn>ГРУППА</TableColumn>
                <TableColumn width={200}>СТАТУС</TableColumn>
                <TableColumn width={100}>ДЕЙСТВИЯ</TableColumn>
              </TableHeader>
              <TableBody>
                {classStudents.map((student) => {
                  const group = getGroupById(student.groupId);
                  const status = classAttendance[student.id] || 'present';
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar src={student.avatar} name={student.name} size="sm" />
                          <p className="font-medium">{student.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{group?.name}</TableCell>
                      <TableCell data-student-id={student.id} className="transition-colors duration-500">
                        <Select
                          size="sm"
                          selectedKeys={[status]}
                          onChange={(e) => handleStatusChange(student.id, e.target.value)}
                          classNames={{
                            trigger: "border-none bg-content2 rounded-md"
                          }}
                        >
                          {statusOptions.map((option) => (
                            <SelectItem key={option.key} textValue={option.label}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="flat">
                          Заметка
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      ) : (
        <Card className="shadow-sm border-divider">
          <CardBody className="py-10">
            <div className="text-center">
              <Icon icon="lucide:calendar-search" className="mx-auto mb-4 text-default-400" width={48} />
              <p className="text-xl font-semibold mb-2">Нет данных для отображения</p>
              <p className="text-default-500 mb-6">Выберите дату и занятие, чтобы отметить посещаемость</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Mark All Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Отметить всех студентов</ModalHeader>
              <ModalBody>
                <Select
                  label="Статус для всех студентов"
                  placeholder="Выберите статус"
                  labelPlacement="outside"
                  selectedKeys={[markAllStatus]}
                  onChange={(e) => setMarkAllStatus(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                
                <Textarea
                  label="Примечание (необязательно)"
                  placeholder="Введите примечание, если необходимо"
                  labelPlacement="outside"
                  value={markAllNote}
                  onValueChange={setMarkAllNote}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onPress={handleMarkAllAttendance}>
                  Применить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TeacherAttendance;