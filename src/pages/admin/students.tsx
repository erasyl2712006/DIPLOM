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
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { students, getGroupById, getStudentGrades, getSubjectById } from '../../data/mock-data';
import { Student } from '../../data/mock-data';

const AdminStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTab, setSelectedTab] = React.useState<string>("profile");

  // Filter students based on search query
  const filteredStudents = React.useMemo(() => {
    if (!searchQuery.trim()) return students;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return students.filter(student => 
      student.name.toLowerCase().includes(lowerCaseQuery) ||
      student.email.toLowerCase().includes(lowerCaseQuery) ||
      getGroupById(student.groupId)?.name.toLowerCase().includes(lowerCaseQuery) ||
      getGroupById(student.groupId)?.specialization.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);

  // Handle student selection for details view
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    onOpen();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-default-500">Manage student information and academic records</p>
        </div>
        
        <Button 
          color="primary" 
          endContent={<Icon icon="lucide:plus" />}
        >
          Add Student
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
              
              return (
                <TableRow key={student.id}>
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
              <ModalHeader className="flex flex-col gap-1">Student Details</ModalHeader>
              <ModalBody>
                {selectedStudent && (
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
                            <div>
                              <h2 className="text-xl font-semibold">{selectedStudent.name}</h2>
                              <p className="text-default-500">
                                {getGroupById(selectedStudent.groupId)?.name} - {getGroupById(selectedStudent.groupId)?.specialization}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-default-500 text-sm mb-1">Email</p>
                              <p>{selectedStudent.email}</p>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm mb-1">Phone</p>
                              <p>{selectedStudent.phone || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm mb-1">Date of Birth</p>
                              <p>{selectedStudent.dateOfBirth || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-default-500 text-sm mb-1">Address</p>
                              <p>{selectedStudent.address || "Not provided"}</p>
                            </div>
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
                          
                          <div className="flex justify-end mt-4">
                            <Button color="primary" size="sm" endContent={<Icon icon="lucide:plus" />}>
                              Add Grade
                            </Button>
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

export default AdminStudents;