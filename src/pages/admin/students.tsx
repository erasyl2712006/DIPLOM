import React from 'react';
import { 
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Progress,
  Select,
  SelectItem,
  addToast
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  students, 
  getGroupById, 
  getStudentGrades, 
  getSubjectById,
  subjects
} from '../../data/mock-data';
import { ChangeIndicator } from '../../components/change-indicator';
import { 
  getFromLocalStorage, 
  saveToLocalStorage, 
  updateCollectionItem, 
  addCollectionItem, 
  removeCollectionItem 
} from '../../data/local-storage';

// Add missing Student type definition
interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  groupId: string;
  avatar: string;
  dateOfBirth?: string;
  address?: string;
}

// Add a custom UUID generator function
const generateUUID = () => {
  return Math.random().toString(36).substring(2, 9) + 
    Date.now().toString(36);
};

const AdminStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTab, setSelectedTab] = React.useState<string>("profile");
  const [newStudent, setNewStudent] = React.useState({
    name: '',
    email: '',
    phone: '',
    groupId: '',
    dateOfBirth: '',
    address: ''
  });
  const [studentsData, setStudentsData] = React.useState(students);
  const [recentlyChanged, setRecentlyChanged] = React.useState<Record<string, string>>({});
  const [newGrade, setNewGrade] = React.useState({
    subjectId: '',
    grade: 0,
    comment: ''
  });

  // Add missing groupIds definition
  const groupIds = React.useMemo(() => {
    return Array.from(new Set(students.map(student => student.groupId)));
  }, []);

  // Filter students based on search query
  const filteredStudents = React.useMemo(() => {
    if (!searchQuery.trim()) return studentsData;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return studentsData.filter(student => 
      student.name.toLowerCase().includes(lowerCaseQuery) ||
      student.email.toLowerCase().includes(lowerCaseQuery) ||
      getGroupById(student.groupId)?.name.toLowerCase().includes(lowerCaseQuery) ||
      getGroupById(student.groupId)?.specialization.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, studentsData]);

  // Initialize students data from localStorage or fall back to mock data
  React.useEffect(() => {
    const savedStudents = getFromLocalStorage<Student[]>('students', students);
    setStudentsData(savedStudents);
  }, []);

  // Handle student selection for details view
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent({...student});
    onOpen();
  };

  // Add handlers for CRUD operations with localStorage persistence
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      groupId: '',
      dateOfBirth: '',
      address: ''
    });
    onOpen();
    
    addToast({
      title: "Добавление студента",
      description: "Форма добавления студента открыта",
      color: "primary",
    });
  };
  
  const handleEditStudent = (studentId: string) => {
    const student = studentsData.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent({...student});
      onOpen();
    }
  };
  
  const handleDeleteStudent = (studentId: string) => {
    // Update in localStorage and state
    const updatedStudents = removeCollectionItem('students', studentId, students);
    setStudentsData(updatedStudents);
    
    // Show success toast
    setRecentlyChanged({ [studentId]: 'deleted' });
    
    addToast({
      title: "Студент удален",
      description: "Студент был успешно удален из системы",
      color: "success",
    });
    
    // Clear change indicator after 3 seconds
    setTimeout(() => setRecentlyChanged({}), 3000);
  };

  // Add form change handler
  const handleFormChange = (field: string, value: any) => {
    if (selectedStudent) {
      setSelectedStudent({
        ...selectedStudent,
        [field]: value
      });
    } else {
      setNewStudent({
        ...newStudent,
        [field]: value
      });
    }
  };

  // Add save student function with localStorage persistence
  const handleSaveStudent = () => {
    if (selectedStudent) {
      // Update existing student in localStorage
      const updatedStudents = updateCollectionItem<Student>(
        'students', 
        selectedStudent.id, 
        selectedStudent, 
        students
      );
      
      setStudentsData(updatedStudents);
      setRecentlyChanged({ [selectedStudent.id]: 'updated' });
    } else {
      // Add new student with generated ID
      const newStudentWithId = {
        ...newStudent,
        id: `st-${generateUUID()}`,
        avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=${Math.floor(Math.random() * 100)}`
      } as Student;
      
      const updatedStudents = addCollectionItem('students', newStudentWithId, students);
      setStudentsData(updatedStudents);
      setRecentlyChanged({ [newStudentWithId.id]: 'added' });
    }
    
    onOpenChange(false);
    
    addToast({
      title: selectedStudent ? "Студент обновлен" : "Студент добавлен",
      description: selectedStudent 
        ? "Данные студента успешно обновлены" 
        : "Новый студент успешно добавлен в систему",
      color: "success",
    });
    
    // Clear change indicator after 3 seconds
    setTimeout(() => setRecentlyChanged({}), 3000);
  };

  // Fix the handleAddGrade function that was causing issues
  const handleAddGrade = (studentId: string) => {
    if (!newGrade.subjectId) {
      addToast({
        title: "Ошибка",
        description: "Выберите предмет для оценки",
        color: "danger",
      });
      return;
    }
    
    const gradeId = `g-${generateUUID()}`;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    
    // Create new grade
    const grade = {
      id: gradeId,
      studentId: studentId,
      subjectId: newGrade.subjectId,
      grade: newGrade.grade,
      comment: newGrade.comment,
      date: formattedDate,
      teacherId: 't1' // Default teacher for admin added grades
    };
    
    // Get existing grades from localStorage
    const existingGrades = getFromLocalStorage('grades', gradeEntries);
    const updatedGrades = [...existingGrades, grade];
    
    // Save to localStorage
    saveToLocalStorage('grades', updatedGrades);
    
    // Reset form
    setNewGrade({
      subjectId: '',
      grade: 5, // Make sure this is initialized correctly
      comment: ''
    });
    
    addToast({
      title: "Оценка добавлена",
      description: "Оценка успешно добавлена студенту",
      color: "success",
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Студенты</h1>
          <p className="text-default-500">Управление информацией о студентах</p>
        </div>
        
        <Button 
          color="primary" 
          endContent={<Icon icon="lucide:plus" />}
          onPress={handleAddStudent}
        >
          Добавить студента
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by name, email or group..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            isClearable
          />
        </div>
        
        <div className="flex gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" endContent={<Icon icon="lucide:chevron-down" />}>
                Group
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Filter by group">
              <DropdownItem key="all">All Groups</DropdownItem>
              <DropdownItem key="g1">CS-101</DropdownItem>
              <DropdownItem key="g2">CS-201</DropdownItem>
              <DropdownItem key="g3">ME-101</DropdownItem>
              <DropdownItem key="g4">EE-101</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <Tooltip content="Export to CSV">
            <Button isIconOnly variant="flat" color="default" aria-label="Export">
              <Icon icon="lucide:download" />
            </Button>
          </Tooltip>
          <Tooltip content="Print">
            <Button isIconOnly variant="flat" color="default" aria-label="Print">
              <Icon icon="lucide:printer" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <Card className="shadow-sm border-divider">
        <Table removeWrapper aria-label="Students management table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>GROUP</TableColumn>
            <TableColumn>CONTACT</TableColumn>
            <TableColumn width={100}>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => {
              const group = getGroupById(student.groupId);
              const isRecentlyChanged = recentlyChanged[student.id];
              
              return (
                <TableRow 
                  key={student.id}
                  className={`${
                    isRecentlyChanged === 'deleted' ? 'bg-danger-50' : 
                    isRecentlyChanged === 'added' ? 'bg-success-50' : 
                    isRecentlyChanged === 'updated' ? 'bg-primary-50' : ''
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={student.avatar} name={student.name} size="sm" />
                      <p className="font-medium">{student.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {group && (
                      <div>
                        <p>{group.name}</p>
                        <p className="text-default-400 text-xs">{group.specialization}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{student.phone || "Not provided"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip content="View Details">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          onPress={() => handleStudentSelect(student)}
                        >
                          <Icon icon="lucide:eye" className="text-default-500" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Edit">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light"
                          onPress={() => handleEditStudent(student.id)}
                        >
                          <Icon icon="lucide:edit" className="text-default-500" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          color="danger"
                          onPress={() => handleDeleteStudent(student.id)}
                        >
                          <Icon icon="lucide:trash-2" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Student Details Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedStudent ? "Информация о студенте" : "Добавление нового студента"}
              </ModalHeader>
              <ModalBody>
                {selectedStudent ? (
                  <div>
                    <Tabs 
                      selectedKey={selectedTab}
                      onSelectionChange={(key) => setSelectedTab(key as string)}
                      aria-label="Student details tabs"
                    >
                      <Tab key="profile" title="Profile">
                        <div className="space-y-6 py-4">
                          <div className="flex items-center gap-4">
                            <Avatar src={selectedStudent.avatar} name={selectedStudent.name} size="lg" />
                            <div className="flex-1">
                              <Input
                                label="ФИО"
                                value={selectedStudent.name}
                                onValueChange={(value) => handleFormChange("name", value)}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Email"
                              value={selectedStudent.email}
                              onValueChange={(value) => handleFormChange("email", value)}
                            />
                            <Input
                              label="Телефон"
                              value={selectedStudent.phone || ""}
                              onValueChange={(value) => handleFormChange("phone", value)}
                            />
                            <Select
                              label="Группа"
                              placeholder="Выберите группу"
                              selectedKeys={[selectedStudent.groupId]}
                              onChange={(e) => handleFormChange("groupId", e.target.value)}
                              aria-label="Выберите группу студента"
                            >
                              {groupIds.map(groupId => {
                                const group = getGroupById(groupId);
                                return group && (
                                  <SelectItem key={group.id} value={group.id} textValue={group.name}>
                                    {group.name} - {group.specialization}
                                  </SelectItem>
                                );
                              })}
                            </Select>
                            <Input
                              label="Дата рождения"
                              type="date"
                              value={selectedStudent.dateOfBirth || ""}
                              onChange={(e) => handleFormChange("dateOfBirth", e.target.value)}
                            />
                            <Input
                              label="Адрес"
                              value={selectedStudent.address || ""}
                              onValueChange={(value) => handleFormChange("address", value)}
                              className="col-span-2"
                            />
                          </div>
                        </div>
                      </Tab>
                      <Tab key="grades" title="Grades">
                        <div className="space-y-4 py-4">
                          <h3 className="text-lg font-semibold">Academic Performance</h3>
                          
                          <Table removeWrapper aria-label="Student grades">
                            <TableHeader>
                              <TableColumn>SUBJECT</TableColumn>
                              <TableColumn>GRADE</TableColumn>
                              <TableColumn>DATE</TableColumn>
                              <TableColumn>COMMENT</TableColumn>
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
                          
                          {/* Add form for new grade */}
                          <div className="mt-4 p-4 border border-dashed rounded-lg border-default-300">
                            <h4 className="font-medium mb-3">Add New Grade</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Select
                                label="Предмет"
                                placeholder="Выберите предмет"
                                selectedKeys={newGrade.subjectId ? [newGrade.subjectId] : []}
                                onChange={(e) => setNewGrade({...newGrade, subjectId: e.target.value})}
                              >
                                {subjects?.map(subject => (
                                  <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                                ))}
                              </Select>
                              
                              <Select
                                label="Оценка"
                                selectedKeys={[String(newGrade.grade)]}
                                onChange={(e) => setNewGrade({...newGrade, grade: Number(e.target.value)})}
                              >
                                <SelectItem key="5" value="5">5 - Отлично</SelectItem>
                                <SelectItem key="4" value="4">4 - Хорошо</SelectItem>
                                <SelectItem key="3" value="3">3 - Удовлетворительно</SelectItem>
                                <SelectItem key="2" value="2">2 - Неудовлетворительно</SelectItem>
                                <SelectItem key="1" value="1">1 - Неудовлетворительно</SelectItem>
                              </Select>
                              
                              <Input
                                label="Комментарий"
                                placeholder="Добавьте комментарий к оценке"
                                value={newGrade.comment}
                                onValueChange={(value) => setNewGrade({...newGrade, comment: value})}
                                className="md:col-span-2"
                              />
                              
                              <Button 
                                color="primary" 
                                onPress={() => handleAddGrade(selectedStudent.id)}
                                className="md:col-span-2"
                              >
                                Добавить оценку
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab key="attendance" title="Attendance">
                        <Card className="mt-4">
                          <CardHeader>
                            <h3 className="text-lg font-semibold">Attendance Stats</h3>
                          </CardHeader>
                          <CardBody>
                            <p className="text-center text-default-500">
                              Attendance tracking functionality will be available in the next update.
                            </p>
                          </CardBody>
                        </Card>
                      </Tab>
                    </Tabs>
                  </div>
                ) : (
                  <div className="space-y-6 py-4">
                    <Input
                      label="ФИО"
                      placeholder="Введите ФИО студента"
                      value={newStudent.name}
                      onValueChange={(value) => handleFormChange("name", value)}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        placeholder="email@example.com"
                        value={newStudent.email}
                        onValueChange={(value) => handleFormChange("email", value)}
                      />
                      <Input
                        label="Телефон"
                        placeholder="+7 (XXX) XXX-XX-XX"
                        value={newStudent.phone}
                        onValueChange={(value) => handleFormChange("phone", value)}
                      />
                      <Select
                        label="Группа"
                        placeholder="Выберите группу"
                        selectedKeys={newStudent.groupId ? [newStudent.groupId] : []}
                        onChange={(e) => handleFormChange("groupId", e.target.value)}
                        aria-label="Выберите группу студента"
                      >
                        {groupIds.map(groupId => {
                          const group = getGroupById(groupId);
                          return group && (
                            <SelectItem key={group.id} value={group.id} textValue={group.name}>
                              {group.name} - {group.specialization}
                            </SelectItem>
                          );
                        })}
                      </Select>
                      <Input
                        label="Дата рождения"
                        type="date"
                        placeholder="YYYY-MM-DD"
                        value={newStudent.dateOfBirth}
                        onChange={(e) => handleFormChange("dateOfBirth", e.target.value)}
                      />
                      <Input
                        label="Адрес"
                        placeholder="Введите адрес"
                        value={newStudent.address}
                        onValueChange={(value) => handleFormChange("address", value)}
                        className="col-span-2"
                      />
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {selectedStudent ? "Закрыть" : "Отмена"}
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleSaveStudent}
                  isDisabled={selectedStudent 
                    ? !selectedStudent.name || !selectedStudent.email || !selectedStudent.groupId
                    : !newStudent.name || !newStudent.email || !newStudent.groupId
                  }
                >
                  {selectedStudent ? "Сохранить изменения" : "Добавить студента"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminStudents;