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
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  students, 
  subjects, 
  gradeEntries,
  getSubjectById,
  getStudentById,
  getGroupById
} from '../../data/mock-data';

interface EditGradeData {
  id: string;
  studentId: string;
  subjectId: string;
  grade: number;
  comment: string;
}

const TeacherGrades: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [editingGrade, setEditingGrade] = React.useState<EditGradeData | null>(null);
  
  // Filter grades based on selected subject and search query
  const filteredGrades = React.useMemo(() => {
    let filtered = [...gradeEntries];
    
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
  }, [selectedSubject, searchQuery]);
  
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
  
  // Save edited grade
  const handleSaveGrade = () => {
    // In a real app, this would update the backend
    console.log("Saving grade:", editingGrade);
    onClose();
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Grade Book</h1>
        <p className="text-default-500">
          Manage and view student grades
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="w-full max-w-xs">
          <Select
            label="Filter by Subject"
            selectedKeys={[selectedSubject]}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <SelectItem key="all" value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        
        <div className="w-full max-w-xs">
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            isClearable
          />
        </div>
        
        <Button 
          color="primary" 
          endContent={<Icon icon="lucide:plus" />}
        >
          Add New Grade
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
              
              return (
                <TableRow key={grade.id}>
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

      {/* Edit Grade Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Grade</ModalHeader>
              <ModalBody>
                {editingGrade && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-default-500 text-sm mb-1">Student</p>
                      <p className="font-medium">{getStudentById(editingGrade.studentId)?.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-default-500 text-sm mb-1">Subject</p>
                      <p className="font-medium">{getSubjectById(editingGrade.subjectId)?.name}</p>
                    </div>
                    
                    <Select
                      label="Grade"
                      selectedKeys={[String(editingGrade.grade)]}
                      onChange={(e) => setEditingGrade({...editingGrade, grade: Number(e.target.value)})}
                    >
                      <SelectItem key="5" value="5">5 - Excellent</SelectItem>
                      <SelectItem key="4" value="4">4 - Good</SelectItem>
                      <SelectItem key="3" value="3">3 - Satisfactory</SelectItem>
                      <SelectItem key="2" value="2">2 - Unsatisfactory</SelectItem>
                      <SelectItem key="1" value="1">1 - Failed</SelectItem>
                    </Select>
                    
                    <Textarea
                      label="Comment"
                      placeholder="Add a comment about this grade"
                      value={editingGrade.comment}
                      onValueChange={(value) => setEditingGrade({...editingGrade, comment: value})}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveGrade}>
                  Save Changes
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