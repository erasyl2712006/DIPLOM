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
  SelectItem
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
          onPress={onOpen}
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
          >
            {days.map((day) => (
              <SelectItem key={day.key} value={day.key}>
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
          <TableBody>
            {filteredSchedules.map((entry) => {
              const subject = getSubjectById(entry.subjectId);
              const teacher = getTeacherById(entry.teacherId);
              const group = getGroupById(entry.groupId);
              
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Chip color="primary" variant="flat" size="sm">
                      {getDayName(entry.dayOfWeek)}
                    </Chip>
                  </TableCell>
                  <TableCell>{entry.startTime} - {entry.endTime}</TableCell>
                  <TableCell>{subject?.name}</TableCell>
                  <TableCell>{teacher?.name}</TableCell>
                  <TableCell>{group?.name}</TableCell>
                  <TableCell>{entry.roomNumber}</TableCell>
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
                <Button color="primary" onPress={onClose}>
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