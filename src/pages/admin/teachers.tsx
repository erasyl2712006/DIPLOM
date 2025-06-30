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
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { teachers, subjects, getSubjectById } from '../../data/mock-data';
import { Teacher } from '../../data/mock-data';

const AdminTeachers: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // Filter teachers based on search query
  const filteredTeachers = React.useMemo(() => {
    if (!searchQuery.trim()) return teachers;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(lowerCaseQuery) ||
      teacher.email.toLowerCase().includes(lowerCaseQuery) ||
      teacher.subjectIds.some(subjectId => {
        const subject = getSubjectById(subjectId);
        return subject?.name.toLowerCase().includes(lowerCaseQuery);
      })
    );
  }, [searchQuery]);

  // Handle teacher selection for details view
  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    onOpen();
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
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-default-500">Manage teacher information and assignments</p>
        </div>
        
        <Button 
          color="primary" 
          endContent={<Icon icon="lucide:plus" />}
        >
          Add Teacher
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="w-full max-w-md">
          <Input
            placeholder="Search by name, email or subject..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            isClearable
          />
        </div>
        
        <div className="flex gap-2">
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
        <Table removeWrapper aria-label="Teachers management table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>SUBJECTS</TableColumn>
            <TableColumn>EXPERIENCE</TableColumn>
            <TableColumn width={100}>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
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
                    {teacher.experience} years
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tooltip content="View Details">
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => handleTeacherSelect(teacher)}
                      >
                        <Icon icon="lucide:eye" className="text-default-500" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Edit">
                      <Button isIconOnly size="sm" variant="light">
                        <Icon icon="lucide:edit" className="text-default-500" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete">
                      <Button isIconOnly size="sm" variant="light" color="danger">
                        <Icon icon="lucide:trash-2" />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Teacher Details Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Teacher Details</ModalHeader>
              <ModalBody>
                {selectedTeacher && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar src={selectedTeacher.avatar} name={selectedTeacher.name} size="lg" />
                      <div>
                        <h2 className="text-xl font-semibold">{selectedTeacher.name}</h2>
                        <p className="text-default-500">{selectedTeacher.degree}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-default-500 text-sm mb-1">Email</p>
                        <p>{selectedTeacher.email}</p>
                      </div>
                      <div>
                        <p className="text-default-500 text-sm mb-1">Phone</p>
                        <p>{selectedTeacher.phone}</p>
                      </div>
                      <div>
                        <p className="text-default-500 text-sm mb-1">Experience</p>
                        <p>{selectedTeacher.experience} years</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-default-500 text-sm mb-2">Teaching Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeacher.subjectIds.map(subjectId => {
                          const subject = getSubjectById(subjectId);
                          return subject && (
                            <Chip key={subjectId} color="primary" variant="flat">
                              {subject.name} ({subject.credits} credits)
                            </Chip>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary">
                  Edit Information
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