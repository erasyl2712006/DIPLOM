import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Avatar,
  Chip,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { teachers, getSubjectById } from '../../data/mock-data';
import { Teacher } from '../../data/mock-data';

const StudentTeachers: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  // View teacher details
  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    onOpen();
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Преподаватели</h1>
        <p className="text-default-500">
          Просмотр информации о профессорах и преподавателях
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Поиск преподавателей по имени или предмету..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Icon icon="lucide:search" className="text-default-400" />}
          className="max-w-md"
          isClearable
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="border border-divider">
            <CardBody className="p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar
                  src={teacher.avatar}
                  className="w-24 h-24 text-large mb-3"
                  isBordered
                />
                <h3 className="text-lg font-semibold">{teacher.name}</h3>
                <p className="text-default-500 text-sm">{teacher.degree}</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-default-500 text-sm mb-1">Email</p>
                  <p className="font-medium">{teacher.email}</p>
                </div>
                <div>
                  <p className="text-default-500 text-sm mb-1">Experience</p>
                  <p className="font-medium">{teacher.experience} years</p>
                </div>
                <div>
                  <p className="text-default-500 text-sm mb-1">Subjects</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {teacher.subjectIds.map(subjectId => {
                      const subject = getSubjectById(subjectId);
                      return subject && (
                        <Chip key={subjectId} color="primary" variant="flat" size="sm">
                          {subject.name}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  fullWidth 
                  color="primary"
                  variant="flat"
                  onPress={() => handleViewTeacher(teacher)}
                >
                  View Profile
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
        
        {filteredTeachers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Icon icon="lucide:search-x" className="mx-auto mb-3 text-default-400" width={40} />
            <p className="text-default-500">No teachers found matching your search criteria</p>
          </div>
        )}
      </div>

      {/* Teacher Details Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Teacher Profile</ModalHeader>
              <ModalBody>
                {selectedTeacher && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <Avatar
                        src={selectedTeacher.avatar}
                        className="w-32 h-32 text-large"
                        isBordered
                      />
                      <div>
                        <h2 className="text-xl font-semibold">{selectedTeacher.name}</h2>
                        <p className="text-default-500">{selectedTeacher.degree}</p>
                        
                        <div className="flex items-center gap-2 mt-4">
                          <div className="p-2 rounded-full bg-primary-100 text-primary">
                            <Icon icon="lucide:mail" width={16} height={16} />
                          </div>
                          <p>{selectedTeacher.email}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <div className="p-2 rounded-full bg-primary-100 text-primary">
                            <Icon icon="lucide:phone" width={16} height={16} />
                          </div>
                          <p>{selectedTeacher.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Divider />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Teaching Experience</h3>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-success-100 text-success">
                          <Icon icon="lucide:briefcase" width={16} height={16} />
                        </div>
                        <p><span className="font-semibold">{selectedTeacher.experience} years</span> of teaching experience</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Subjects</h3>
                      <div className="space-y-3">
                        {selectedTeacher.subjectIds.map(subjectId => {
                          const subject = getSubjectById(subjectId);
                          return subject && (
                            <Card key={subjectId} className="border border-divider">
                              <CardBody className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h4 className="font-medium">{subject.name}</h4>
                                    <p className="text-default-500 text-sm">{subject.credits} credits</p>
                                  </div>
                                  <Chip color="primary" variant="flat">
                                    {subject.credits} credits
                                  </Chip>
                                </div>
                                {subject.description && (
                                  <p className="text-default-500 text-sm mt-2">{subject.description}</p>
                                )}
                              </CardBody>
                            </Card>
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
                <Button color="primary" variant="flat" endContent={<Icon icon="lucide:mail" />}>
                  Contact Teacher
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StudentTeachers;