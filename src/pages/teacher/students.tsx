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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
  Progress,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  students, 
  getGroupById, 
  getStudentGrades,
  getSubjectById,
  getStudentAttendanceSummary
} from '../../data/mock-data';
import { Student } from '../../data/mock-data';
import { 
  getFromLocalStorage,
  saveToLocalStorage
} from '../../data/local-storage';

const TeacherStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTab, setSelectedTab] = React.useState<string>("profile");
  
  // Get unique group IDs from students
  const groupIds = React.useMemo(() => {
    return Array.from(new Set(students.map(student => student.groupId)));
  }, []);
  
  // Load students from localStorage on component mount
  React.useEffect(() => {
    const savedStudents = getFromLocalStorage<typeof students>('students', students);
    setStudentsData(savedStudents);
  }, []);
  
  // Add state to track loaded student data
  const [studentsData, setStudentsData] = React.useState(students);
  
  // Filter students
  const filteredStudents = React.useMemo(() => {
    let filtered = [...studentsData];
    
    // Filter by group
    if (selectedGroup !== 'all') {
      filtered = filtered.filter(student => student.groupId === selectedGroup);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(lowerCaseQuery) ||
        student.email.toLowerCase().includes(lowerCaseQuery) ||
        getGroupById(student.groupId)?.name.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    return filtered;
  }, [selectedGroup, searchQuery, studentsData]);
  
  // Handle student selection
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    onOpen();
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Студенты</h1>
        <p className="text-default-500">
          Управление информацией о студентах
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="w-full max-w-xs">
          <Select
            label="Группа"
            selectedKeys={[selectedGroup]}
            onChange={(e) => setSelectedGroup(e.target.value)}
            aria-label="Фильтр по группе"
          >
            <SelectItem key="all" value="all" textValue="Все группы">Все группы</SelectItem>
            {groupIds.map((groupId) => {
              const group = getGroupById(groupId);
              return group && (
                <SelectItem key={group.id} value={group.id} textValue={group.name}>
                  {group.name}
                </SelectItem>
              );
            })}
          </Select>
        </div>
        
        <div className="w-full max-w-xs">
          <Input
            placeholder="Поиск студентов..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            isClearable
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="flat" endContent={<Icon icon="lucide:download" />}>
            Экспорт
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-divider">
        <Table removeWrapper aria-label="Таблица студентов">
          <TableHeader>
            <TableColumn>ИМЯ</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ГРУППА</TableColumn>
            <TableColumn>СРЕДНИЙ БАЛЛ</TableColumn>
            <TableColumn>ПОСЕЩАЕМОСТЬ</TableColumn>
            <TableColumn width={100}>ДЕЙСТВИЯ</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => {
              const group = getGroupById(student.groupId);
              const grades = getStudentGrades(student.id);
              const averageGrade = grades.length > 0 
                ? grades.reduce((sum, grade) => sum + grade.grade, 0) / grades.length 
                : 0;
              const attendance = getStudentAttendanceSummary(student.id);
              const attendanceRate = attendance.total > 0 
                ? Math.round(attendance.present / attendance.total * 100) 
                : 0;
              
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={student.avatar} name={student.name} size="sm" />
                      <p className="font-medium">{student.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{group?.name}</TableCell>
                  <TableCell>
                    <Chip 
                      color={
                        averageGrade >= 4.5 ? "success" : 
                        averageGrade >= 3.5 ? "primary" : 
                        averageGrade >= 2.5 ? "warning" : 
                        "danger"
                      }
                      variant="flat"
                    >
                      {averageGrade.toFixed(1)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={attendanceRate} 
                        size="sm" 
                        color={
                          attendanceRate >= 90 ? "success" : 
                          attendanceRate >= 75 ? "primary" : 
                          attendanceRate >= 60 ? "warning" : 
                          "danger"
                        }
                        className="w-24"
                      />
                      <span className="text-xs">{attendanceRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="light"
                      onPress={() => handleStudentSelect(student)}
                    >
                      Подробнее
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Student Details Modal with Tabs */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Информация о студенте</ModalHeader>
              <ModalBody>
                {selectedStudent && (
                  <div>
                    <Tabs 
                      selectedKey={selectedTab}
                      onSelectionChange={(key) => setSelectedTab(key as string)}
                      aria-label="Student details tabs"
                    >
                      <Tab key="profile" title="Профиль">
                        <div className="space-y-6 py-4">
                          <div className="flex items-center gap-4">
                            <Avatar src={selectedStudent.avatar} name={selectedStudent.name} size="lg" />
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                              <p className="text-default-500">{selectedStudent.email}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-default-500 text-sm mb-1">Группа</p>
                              <p className="font-medium">{getGroupById(selectedStudent.groupId)?.name}</p>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm mb-1">Телефон</p>
                              <p className="font-medium">{selectedStudent.phone || "Не указан"}</p>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm mb-1">Дата рождения</p>
                              <p className="font-medium">{selectedStudent.dateOfBirth || "Не указана"}</p>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm mb-1">Адрес</p>
                              <p className="font-medium">{selectedStudent.address || "Не указан"}</p>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab key="grades" title="Оценки">
                        <div className="space-y-4 py-4">
                          <h3 className="text-lg font-semibold">Успеваемость</h3>
                          
                          <Table removeWrapper aria-label="Student grades">
                            <TableHeader>
                              <TableColumn>ПРЕДМЕТ</TableColumn>
                              <TableColumn>ОЦЕНКА</TableColumn>
                              <TableColumn>ДАТА</TableColumn>
                              <TableColumn>КОММЕНТАРИЙ</TableColumn>
                            </TableHeader>
                            <TableBody>
                              {getStudentGrades(selectedStudent.id).map((grade) => {
                                const subject = getSubjectById(grade.subjectId);
                                
                                return (
                                  <TableRow key={grade.id}>
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
                                    <TableCell>{grade.comment}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </Tab>
                      <Tab key="attendance" title="Посещаемость">
                        <div className="space-y-4 py-4">
                          <h3 className="text-lg font-semibold">Статистика посещаемости</h3>
                          
                          <div className="p-4">
                            {/* Implement attendance data display here */}
                            <p>Информация о посещаемости студента будет доступна в следующем обновлении.</p>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Закрыть
                </Button>
                <Button color="primary">
                  Отправить сообщение
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TeacherStudents;