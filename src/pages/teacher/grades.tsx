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
  Textarea,
  Select,
  SelectItem,
  addToast,
  Card
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  students, 
  subjects, 
  gradeEntries,
  getSubjectById,
  getStudentById,
  getGroupById
} from '../../data/mock-data';

// Add a custom UUID generator function
const generateUUID = () => {
  return Math.random().toString(36).substring(2, 9) + 
    Date.now().toString(36);
};

const TeacherGrades: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [editingGrade, setEditingGrade] = React.useState<EditGradeData | null>(null);
  const [gradesData, setGradesData] = React.useState(gradeEntries);
  const [recentlyChanged, setRecentlyChanged] = React.useState<string[]>([]);
  
  // Filter grades based on selected subject and search query
  const filteredGrades = React.useMemo(() => {
    let filtered = [...gradesData];
    
    // Filter by teacher (hardcoded to t1 for now)
    filtered = filtered.filter(grade => grade.teacherId === 't1');
    
    // Filter by subject if not "all"
    if (selectedSubject !== "all") {
      filtered = filtered.filter(grade => grade.subjectId === selectedSubject);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase();
      filtered = filtered.filter(grade => {
        const student = getStudentById(grade.studentId);
        const subject = getSubjectById(grade.subjectId);
        return (
          student?.name.toLowerCase().includes(lowerSearch) ||
          subject?.name.toLowerCase().includes(lowerSearch) ||
          grade.comment?.toLowerCase().includes(lowerSearch)
        );
      });
    }
    
    return filtered;
  }, [selectedSubject, searchQuery, gradesData]);
  
  // Start editing a grade
  const handleEditGrade = (gradeId: string) => {
    const grade = gradeEntries.find(g => g.id === gradeId);
    if (grade) {
      setEditingGrade({
        id: grade.id,
        studentId: grade.studentId,
        subjectId: grade.subjectId,
        grade: grade.grade,
        comment: grade.comment || ""
      });
      onOpen();
    }
  };

  // Add handlers for CRUD operations
  const handleAddGrade = () => {
    // Initialize editingGrade with default values for a new grade
    setEditingGrade({
      id: `new-${Date.now()}`,
      studentId: "",
      subjectId: selectedSubject !== "all" ? selectedSubject : subjects[0]?.id || "",
      grade: 5,
      comment: ""
    });
    onOpen();
  };
  
  // Save edited grade
  const handleSaveGrade = () => {
    if (!editingGrade) return;
    
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    
    if (editingGrade.id.startsWith('new-')) {
      // Creating a new grade - using generateUUID instead of uuidv4
      const newGrade = {
        ...editingGrade,
        id: `g-${generateUUID()}`,
        date: formattedDate,
        teacherId: 't1'
      };
      
      setGradesData([newGrade, ...gradesData]);
      setRecentlyChanged([newGrade.id]);
    } else {
      // Updating existing grade
      const updatedGrades = gradesData.map(g => 
        g.id === editingGrade.id ? {...editingGrade, date: formattedDate} : g
      );
      setGradesData(updatedGrades);
      setRecentlyChanged([editingGrade.id]);
    }
    
    onClose();
    
    addToast({
      title: "Оценка сохранена",
      description: "Изменения были успешно сохранены",
      color: "success",
    });
    
    // Clear highlight after 3 seconds
    setTimeout(() => setRecentlyChanged([]), 3000);
  };
  
  const handleDeleteGrade = (gradeId: string) => {
    setRecentlyChanged([gradeId]);
    
    setTimeout(() => {
      const updatedGrades = gradesData.filter(g => g.id !== gradeId);
      setGradesData(updatedGrades);
      
      addToast({
        title: "Оценка удалена",
        description: "Оценка была успешно удалена из системы",
        color: "success",
      });
      
      setRecentlyChanged([]);
    }, 400);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Журнал оценок</h1>
        <p className="text-default-500">
          Управление и просмотр оценок студентов
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="w-full max-w-xs">
          <Select
            label="Фильтр по предмету"
            selectedKeys={[selectedSubject]}
            onChange={(e) => setSelectedSubject(e.target.value)}
            aria-label="Фильтр предметов"
          >
            <SelectItem key="all" textValue="Все предметы">Все предметы</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id} textValue={subject.name}>
                {subject.name}
              </SelectItem>
            ))}
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
        
        <Button 
          color="primary" 
          endContent={<Icon icon="lucide:plus" />}
          onPress={handleAddGrade}
        >
          Добавить оценку
        </Button>
      </div>

      <Card className="shadow-sm border-divider">
        <Table removeWrapper aria-label="Grades management table">
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>SUBJECT</TableColumn>
            <TableColumn>GRADE</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>COMMENT</TableColumn>
            <TableColumn width={100}>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredGrades.map((grade) => {
              const student = getStudentById(grade.studentId);
              const subject = getSubjectById(grade.subjectId);
              const group = student ? getGroupById(student.groupId) : null;
              const isHighlighted = recentlyChanged.includes(grade.id);
              
              return (
                <TableRow 
                  key={grade.id}
                  className={isHighlighted ? 'bg-primary-50' : ''}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{student?.name}</p>
                      <p className="text-default-400 text-xs">{group?.name}</p>
                    </div>
                  </TableCell>
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
                  <TableCell>
                    <p className="text-default-600 truncate max-w-[200px]">
                      {grade.comment || "No comment"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => handleEditGrade(grade.id)}
                      >
                        <Icon icon="lucide:edit" className="text-default-500" />
                      </Button>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        color="danger"
                        onPress={() => handleDeleteGrade(grade.id)}
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

      {/* Edit Grade Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Grade</ModalHeader>
              <ModalBody>
                {editingGrade && (
                  <div className="space-y-4">
                    {editingGrade.id.startsWith('new-') ? (
                      <>
                        <Select
                          label="Студент"
                          placeholder="Выберите студента"
                          selectedKeys={editingGrade.studentId ? [editingGrade.studentId] : []}
                          onChange={(e) => setEditingGrade({...editingGrade, studentId: e.target.value})}
                          aria-label="Выберите студента для оценки"
                        >
                          {students.map(student => (
                            <SelectItem key={student.id} value={student.id} textValue={student.name}>
                              {student.name} ({getGroupById(student.groupId)?.name})
                            </SelectItem>
                          ))}
                        </Select>
                        
                        <Select
                          label="Предмет"
                          placeholder="Выберите предмет"
                          selectedKeys={editingGrade.subjectId ? [editingGrade.subjectId] : []}
                          onChange={(e) => setEditingGrade({...editingGrade, subjectId: e.target.value})}
                          aria-label="Выберите предмет для оценки"
                        >
                          {subjects.filter(subject => subject.teacherId === 't1').map(subject => (
                            <SelectItem key={subject.id} value={subject.id} textValue={subject.name}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-default-500 text-sm mb-1">Студент</p>
                          <p className="font-medium">{getStudentById(editingGrade.studentId)?.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-default-500 text-sm mb-1">Предмет</p>
                          <p className="font-medium">{getSubjectById(editingGrade.subjectId)?.name}</p>
                        </div>
                      </>
                    )}
                    
                    <Select
                      label="Оценка"
                      selectedKeys={[String(editingGrade.grade)]}
                      onChange={(e) => setEditingGrade({...editingGrade, grade: Number(e.target.value)})}
                      aria-label="Выберите оценку"
                    >
                      <SelectItem key="5" value="5" textValue="5 - Отлично">5 - Отлично</SelectItem>
                      <SelectItem key="4" value="4" textValue="4 - Хорошо">4 - Хорошо</SelectItem>
                      <SelectItem key="3" value="3" textValue="3 - Удовлетворительно">3 - Удовлетворительно</SelectItem>
                      <SelectItem key="2" value="2" textValue="2 - Неудовлетворительно">2 - Неудовлетворительно</SelectItem>
                      <SelectItem key="1" value="1" textValue="1 - Неудовлетворительно">1 - Неудовлетворительно</SelectItem>
                    </Select>
                    
                    <Textarea
                      label="Комментарий"
                      placeholder="Добавьте комментарий к оценке"
                      value={editingGrade.comment}
                      onValueChange={(value) => setEditingGrade({...editingGrade, comment: value})}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onPress={handleSaveGrade} 
                  isDisabled={editingGrade?.id.startsWith('new-') && (!editingGrade.studentId || !editingGrade.subjectId)}>
                  {editingGrade?.id.startsWith('new-') ? 'Добавить оценку' : 'Сохранить изменения'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TeacherGrades;