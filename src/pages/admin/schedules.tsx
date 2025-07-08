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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  addToast
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  scheduleEntries, 
  subjects, 
  teachers, 
  groups, 
  getSubjectById,
  getTeacherById,
  getGroupById,
  getDayName
} from '../../data/mock-data';

const AdminSchedules: React.FC = () => {
  const [selectedDay, setSelectedDay] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Days of the week
  const days = [
    { key: 'all', label: 'Все дни' },
    { key: '1', label: 'Понедельник' },
    { key: '2', label: 'Вторник' },
    { key: '3', label: 'Среда' },
    { key: '4', label: 'Четверг' },
    { key: '5', label: 'Пятница' },
    { key: '6', label: 'Суббота' },
    { key: '0', label: 'Воскресенье' },
  ];

  // Get status label in Russian
  const getDayRussianName = (dayNumber: number) => {
    switch (dayNumber) {
      case 0: return "Воскресенье";
      case 1: return "Понедельник";
      case 2: return "Вторник";
      case 3: return "Среда";
      case 4: return "Четверг";
      case 5: return "Пятница";
      case 6: return "Суббота";
      default: return "";
    }
  };
  
  // Filter schedules
  const filteredSchedules = React.useMemo(() => {
    let filtered = [...scheduleEntries];
    
    // Filter by day
    if (selectedDay !== 'all') {
      filtered = filtered.filter(entry => entry.dayOfWeek === parseInt(selectedDay));
    }
    
    // Filter by search
    if (searchQuery.trim() !== '') {
      const lowerCaseQuery = searchQuery.toLowerCase();
      
      filtered = filtered.filter(entry => {
        const subject = getSubjectById(entry.subjectId);
        const teacher = getTeacherById(entry.teacherId);
        const group = getGroupById(entry.groupId);
        
        return (
          subject?.name.toLowerCase().includes(lowerCaseQuery) ||
          teacher?.name.toLowerCase().includes(lowerCaseQuery) ||
          group?.name.toLowerCase().includes(lowerCaseQuery) ||
          entry.roomNumber.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }
    
    // Sort by day and start time
    return filtered.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek;
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [selectedDay, searchQuery]);

  // Add handlers for CRUD operations
  const handleAddSchedule = () => {
    onOpen();
  };
  
  const handleEditSchedule = (scheduleId: string) => {
    // In a real app, this would open a form to edit the schedule
    console.log("Edit schedule:", scheduleId);
    
    addToast({
      title: "Редактирование расписания",
      description: "Форма редактирования расписания открыта",
      color: "primary",
    });
  };
  
  const handleDeleteSchedule = (scheduleId: string) => {
    // In a real app, this would show a confirmation dialog and then delete the schedule entry
    console.log("Delete schedule:", scheduleId);
    
    addToast({
      title: "Запись расписания удалена",
      description: "Запись была успешно удалена из расписания",
      color: "success",
    });
  };
  
  const handleSaveSchedule = () => {
    // In a real app, this would save the new schedule entry
    console.log("Save schedule");
    onOpenChange(false);
    
    addToast({
      title: "Расписание сохранено",
      description: "Новая запись добавлена в расписание",
      color: "success",
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Расписание занятий</h1>
          <p className="text-default-500">
            Управление расписанием занятий для всего колледжа
          </p>
        </div>
        
        <Button 
          color="primary" 
          endContent={<Icon icon="lucide:plus" />}
          onPress={handleAddSchedule}
        >
          Добавить занятие
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="w-full max-w-xs">
          <Select
            label="День недели"
            selectedKeys={[selectedDay]}
            onChange={(e) => setSelectedDay(e.target.value)}
            aria-label="Фильтр по дню недели"
          >
            {days.map((day) => (
              <SelectItem key={day.key} value={day.key} textValue={day.label}>
                {day.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        
        <div className="w-full max-w-xs">
          <Input
            placeholder="Поиск..."
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
          <Button variant="flat" endContent={<Icon icon="lucide:printer" />}>
            Печать
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-divider">
        <Table removeWrapper aria-label="Таблица расписания занятий">
          <TableHeader>
            <TableColumn>ДЕНЬ</TableColumn>
            <TableColumn>ВРЕМЯ</TableColumn>
            <TableColumn>ПРЕДМЕТ</TableColumn>
            <TableColumn>ПРЕПОДАВАТЕЛЬ</TableColumn>
            <TableColumn>ГРУППА</TableColumn>
            <TableColumn>АУДИТОРИЯ</TableColumn>
            <TableColumn width={100}>ДЕЙСТВИЯ</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Нет доступного расписания">
            {filteredSchedules.map((entry) => {
              const subject = getSubjectById(entry.subjectId);
              const teacher = getTeacherById(entry.teacherId);
              const group = getGroupById(entry.groupId);
              
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Chip color="primary" variant="flat" size="sm">
                      {getDayRussianName(entry.dayOfWeek)}
                    </Chip>
                  </TableCell>
                  <TableCell>{entry.startTime} - {entry.endTime}</TableCell>
                  <TableCell>{subject?.name}</TableCell>
                  <TableCell>{teacher?.name}</TableCell>
                  <TableCell>{group?.name}</TableCell>
                  <TableCell>{entry.roomNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light"
                        onPress={() => handleEditSchedule(entry.id)}
                      >
                        <Icon icon="lucide:edit" className="text-default-500" />
                      </Button>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        color="danger"
                        onPress={() => handleDeleteSchedule(entry.id)}
                      >
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

      {/* Add Schedule Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Добавить занятие в расписание</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="День недели"
                    placeholder="Выберите день"
                  >
                    {days.slice(1).map((day) => (
                      <SelectItem key={day.key} value={day.key}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <div className="flex gap-2 items-center">
                    <Input
                      label="Время начала"
                      type="time"
                      placeholder="HH:MM"
                      className="flex-1"
                    />
                    <span className="mt-6">-</span>
                    <Input
                      label="Время окончания"
                      type="time"
                      placeholder="HH:MM"
                      className="flex-1"
                    />
                  </div>
                  
                  <Select
                    label="Предмет"
                    placeholder="Выберите предмет"
                  >
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label="Преподаватель"
                    placeholder="Выберите преподавателя"
                  >
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label="Группа"
                    placeholder="Выберите группу"
                  >
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Input
                    label="Аудитория"
                    placeholder="Введите номер аудитории"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onPress={handleSaveSchedule}>
                  Сохранить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminSchedules;