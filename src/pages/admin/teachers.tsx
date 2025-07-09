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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
  Card,
  Select,
  SelectItem,
  addToast
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { teachers, subjects, getSubjectById } from '../../data/mock-data';
import { Teacher } from '../../data/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationWrapper } from '../../components/animation-wrapper';
import { 
  getFromLocalStorage, 
  saveToLocalStorage, 
  updateCollectionItem, 
  addCollectionItem, 
  removeCollectionItem 
} from '../../data/local-storage';

// Add a custom UUID generator function
const generateUUID = () => {
  return Math.random().toString(36).substring(2, 9) + 
    Date.now().toString(36);
};

const AdminTeachers: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null);
  const [newTeacher, setNewTeacher] = React.useState({
    name: '',
    email: '',
    phone: '',
    degree: '',
    experience: 0,
    subjectIds: [],
  });
  const [teachersData, setTeachersData] = React.useState(teachers);
  const [recentlyChanged, setRecentlyChanged] = React.useState<Record<string, string>>({});
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // Initialize teachers data from localStorage or fall back to mock data
  React.useEffect(() => {
    const savedTeachers = getFromLocalStorage<Teacher[]>('teachers', teachers);
    setTeachersData(savedTeachers);
  }, []);

  // Filter teachers based on search query
  const filteredTeachers = React.useMemo(() => {
    if (!searchQuery.trim()) return teachersData;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return teachersData.filter(teacher => 
      teacher.name.toLowerCase().includes(lowerCaseQuery) ||
      teacher.email.toLowerCase().includes(lowerCaseQuery) ||
      teacher.subjectIds.some(subjectId => {
        const subject = getSubjectById(subjectId);
        return subject?.name.toLowerCase().includes(lowerCaseQuery);
      })
    );
  }, [searchQuery, teachersData]);

  // Handle teacher selection for details view
  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher({...teacher});
    onOpen();
  };

  // Add handlers for CRUD operations with localStorage persistence
  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      degree: '',
      experience: 0,
      subjectIds: [],
    });
    onOpen();
  };
  
  const handleEditTeacher = (teacherId: string) => {
    const teacher = teachersData.find(t => t.id === teacherId);
    if (teacher) {
      setSelectedTeacher({...teacher});
      onOpen();
    }
  };
  
  // Delete teacher with localStorage persistence
  const handleDeleteTeacher = (teacherId: string) => {
    setRecentlyChanged({ [teacherId]: 'deleted' });
    
    // Update localStorage and state with delay for animation
    setTimeout(() => {
      const updatedTeachers = removeCollectionItem('teachers', teacherId, teachers);
      setTeachersData(updatedTeachers);
      
      addToast({
        title: "Преподаватель удален",
        description: "Преподаватель был успешно удален из системы",
        color: "success",
      });
      
      // Clear after animation completes
      setRecentlyChanged({});
    }, 300);
  };

  // Add form change handlers
  const handleFormChange = (field: string, value: any) => {
    if (selectedTeacher) {
      setSelectedTeacher({
        ...selectedTeacher,
        [field]: value
      });
    } else {
      setNewTeacher({
        ...newTeacher,
        [field]: value
      });
    }
  };

  // Save teacher with localStorage persistence
  const handleSaveTeacher = () => {
    if (selectedTeacher) {
      // Update existing teacher
      const updatedTeachers = updateCollectionItem<Teacher>(
        'teachers', 
        selectedTeacher.id, 
        selectedTeacher, 
        teachers
      );
      
      setTeachersData(updatedTeachers);
      setRecentlyChanged({ [selectedTeacher.id]: 'updated' });
    } else {
      // Add new teacher with generated ID
      const newTeacherWithId = {
        ...newTeacher,
        id: `t-${generateUUID()}`,
        avatar: `https://img.heroui.chat/image/avatar?w=200&h=200&u=${Math.floor(Math.random() * 100)}`
      } as Teacher;
      
      const updatedTeachers = addCollectionItem('teachers', newTeacherWithId, teachers);
      setTeachersData(updatedTeachers);
      setRecentlyChanged({ [newTeacherWithId.id]: 'added' });
    }
    
    onClose();
    
    addToast({
      title: selectedTeacher ? "Преподаватель обновлен" : "Преподаватель добавлен",
      description: selectedTeacher 
        ? "Данные преподавателя успешно обновлены" 
        : "Новый преподаватель успешно добавлен в систему",
      color: "success",
    });
    
    // Clear change indicator after 3 seconds
    setTimeout(() => setRecentlyChanged({}), 3000);
  };

  // Render teacher subjects as chips
  const renderSubjects = (subjectIds: string[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {subjectIds.map(subjectId => {
          const subject = getSubjectById(subjectId);
          return subject ? (
            <Chip
              key={subjectId}
              color="primary"
              variant="flat"
              size="sm"
            >
              {subject.name}
            </Chip>
          ) : null;
        })}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Преподаватели</h1>
          <p className="text-default-500">Управление информацией о преподавателях</p>
        </div>
        
        <Button 
          color="primary" 
          endContent={<Icon icon="lucide:plus" />}
          onPress={handleAddTeacher}
        >
          Добавить преподавателя
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="w-full max-w-md">
          <Input
            placeholder="Поиск по имени, email или предмету..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            isClearable
          />
        </div>
        
        <div className="flex gap-2">
          <Tooltip content="Экспорт в CSV">
            <Button isIconOnly variant="flat" color="default" aria-label="Export">
              <Icon icon="lucide:download" />
            </Button>
          </Tooltip>
          <Tooltip content="Печать">
            <Button isIconOnly variant="flat" color="default" aria-label="Print">
              <Icon icon="lucide:printer" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <Card className="shadow-sm border-divider">
        <Table removeWrapper aria-label="Таблица управления преподавателями">
          <TableHeader>
            <TableColumn>ИМЯ</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ПРЕДМЕТЫ</TableColumn>
            <TableColumn>ОПЫТ</TableColumn>
            <TableColumn width={100}>ДЕЙСТВИЯ</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredTeachers.map((teacher) => {
              const isRecentlyChanged = recentlyChanged[teacher.id];
              
              return (
                <TableRow 
                  key={teacher.id}
                  className={`relative ${
                    isRecentlyChanged === 'deleted' ? 'bg-danger-50' : 
                    isRecentlyChanged === 'added' ? 'bg-success-50' : 
                    isRecentlyChanged === 'updated' ? 'bg-primary-50' : ''
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={teacher.avatar} name={teacher.name} size="sm" />
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-default-400 text-xs">{teacher.degree}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{renderSubjects(teacher.subjectIds)}</TableCell>
                  <TableCell>
                    <Chip color={teacher.experience > 10 ? "success" : "warning"} variant="flat">
                      {teacher.experience} лет
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip content="Просмотр">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          onPress={() => handleTeacherSelect(teacher)}
                        >
                          <Icon icon="lucide:eye" className="text-default-500" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Редактировать">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light"
                          onPress={() => handleEditTeacher(teacher.id)}
                        >
                          <Icon icon="lucide:edit" className="text-default-500" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Удалить">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          color="danger"
                          onPress={() => handleDeleteTeacher(teacher.id)}
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

      {/* Teacher Details Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedTeacher ? "Информация о преподавателе" : "Добавление нового преподавателя"}
              </ModalHeader>
              <ModalBody>
                {selectedTeacher ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar src={selectedTeacher.avatar} name={selectedTeacher.name} size="lg" />
                      <div>
                        <Input
                          label="ФИО"
                          value={selectedTeacher.name}
                          onValueChange={(value) => handleFormChange("name", value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        value={selectedTeacher.email}
                        onValueChange={(value) => handleFormChange("email", value)}
                      />
                      <Input
                        label="Телефон"
                        value={selectedTeacher.phone}
                        onValueChange={(value) => handleFormChange("phone", value)}
                      />
                      <Input
                        label="Ученая степень"
                        value={selectedTeacher.degree}
                        onValueChange={(value) => handleFormChange("degree", value)}
                      />
                      <Input
                        type="number"
                        label="Опыт (лет)"
                        value={selectedTeacher.experience.toString()}
                        onValueChange={(value) => handleFormChange("experience", parseInt(value) || 0)}
                      />
                    </div>
                    
                    <Select
                      label="Преподаваемые предметы"
                      selectionMode="multiple"
                      selectedKeys={selectedTeacher.subjectIds}
                      onSelectionChange={(keys) => {
                        const selectedKeys = Array.from(keys as Set<string>);
                        handleFormChange("subjectIds", selectedKeys);
                      }}
                      classNames={{
                        trigger: "min-h-[60px]"
                      }}
                    >
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id} textValue={subject.name}>
                          {subject.name} ({subject.credits} кредитов)
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Input
                      label="ФИО"
                      placeholder="Введите ФИО преподавателя"
                      value={newTeacher.name}
                      onValueChange={(value) => handleFormChange("name", value)}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        placeholder="email@example.com"
                        value={newTeacher.email}
                        onValueChange={(value) => handleFormChange("email", value)}
                      />
                      <Input
                        label="Телефон"
                        placeholder="+7 (XXX) XXX-XX-XX"
                        value={newTeacher.phone}
                        onValueChange={(value) => handleFormChange("phone", value)}
                      />
                      <Input
                        label="Ученая степень"
                        placeholder="Например: Кандидат наук"
                        value={newTeacher.degree}
                        onValueChange={(value) => handleFormChange("degree", value)}
                      />
                      <Input
                        type="number"
                        label="Опыт (лет)"
                        value={newTeacher.experience.toString()}
                        onValueChange={(value) => handleFormChange("experience", parseInt(value) || 0)}
                      />
                    </div>
                    
                    <Select
                      label="Преподаваемые предметы"
                      selectionMode="multiple"
                      placeholder="Выберите предметы"
                      selectedKeys={newTeacher.subjectIds}
                      onSelectionChange={(keys) => {
                        const selectedKeys = Array.from(keys as Set<string>);
                        handleFormChange("subjectIds", selectedKeys);
                      }}
                      classNames={{
                        trigger: "min-h-[60px]"
                      }}
                      aria-label="Выберите предметы"
                    >
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id} textValue={subject.name}>
                          {subject.name} ({subject.credits} кредитов)
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Закрыть
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleSaveTeacher}
                  isDisabled={selectedTeacher 
                    ? !selectedTeacher.name || !selectedTeacher.email 
                    : !newTeacher.name || !newTeacher.email
                  }
                >
                  {selectedTeacher ? "Сохранить изменения" : "Добавить преподавателя"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminTeachers;