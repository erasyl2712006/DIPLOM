import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Divider, 
  Avatar,
  Button,
  Input,
  Textarea,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { students, getGroupById } from '../../data/mock-data';
import { Student } from '../../data/mock-data';

const StudentProfile: React.FC = () => {
  // Using static student id for now
  const studentId = 'st1';
  const student = students.find(s => s.id === studentId);
  const group = student ? getGroupById(student.groupId) : null;
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingProfile, setEditingProfile] = React.useState<Student | null>(null);
  
  // Start editing profile
  const handleEditProfile = () => {
    if (student) {
      setEditingProfile({...student});
      onOpen();
    }
  };
  
  // Save profile changes
  const handleSaveProfile = () => {
    // In a real app, this would update the backend
    console.log("Saving profile:", editingProfile);
    onOpenChange(false);
  };

  if (!student || !group) return null;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-default-500">
          View and manage your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2 border border-divider">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <Button 
              color="primary" 
              variant="light"
              onPress={handleEditProfile}
              endContent={<Icon icon="lucide:edit" />}
            >
              Edit Profile
            </Button>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar 
                  src={student.avatar} 
                  className="w-32 h-32 text-large"
                  isBordered
                />
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold">{student.name}</h3>
                  <p className="text-default-500">Student</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-default-500 text-sm mb-1">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-default-500 text-sm mb-1">Phone</p>
                    <p className="font-medium">{student.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-default-500 text-sm mb-1">Date of Birth</p>
                    <p className="font-medium">{student.dateOfBirth || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-default-500 text-sm mb-1">Address</p>
                    <p className="font-medium">{student.address || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Academic Information */}
        <Card className="border border-divider">
          <CardHeader>
            <h2 className="text-lg font-semibold">Academic Information</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-default-500 text-sm mb-1">Student ID</p>
                <p className="font-medium">{student.id}</p>
              </div>
              <div>
                <p className="text-default-500 text-sm mb-1">Group</p>
                <p className="font-medium">{group.name}</p>
              </div>
              <div>
                <p className="text-default-500 text-sm mb-1">Year</p>
                <p className="font-medium">{group.year}</p>
              </div>
              <div>
                <p className="text-default-500 text-sm mb-1">Specialization</p>
                <p className="font-medium">{group.specialization}</p>
              </div>
              <div>
                <p className="text-default-500 text-sm mb-1">Status</p>
                <p className="font-medium">Active</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Additional Information */}
        <Card className="lg:col-span-3 border border-divider">
          <CardHeader>
            <h2 className="text-lg font-semibold">Additional Information</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="text-center text-default-500 py-4">
              <Icon icon="lucide:info" className="mx-auto mb-2" width={24} />
              <p>No additional information is available at this time.</p>
              <Button color="primary" variant="light" className="mt-4">
                Add Information
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
              <ModalBody>
                {editingProfile && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-2 mb-4">
                      <Avatar 
                        src={editingProfile.avatar} 
                        className="w-24 h-24 text-large"
                        isBordered
                      />
                      <Button size="sm" variant="flat">
                        Change Photo
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        value={editingProfile.name}
                        onValueChange={(value) => setEditingProfile({...editingProfile, name: value})}
                      />
                      
                      <Input
                        label="Email"
                        type="email"
                        value={editingProfile.email}
                        onValueChange={(value) => setEditingProfile({...editingProfile, email: value})}
                      />
                      
                      <Input
                        label="Phone"
                        type="tel"
                        value={editingProfile.phone || ""}
                        onValueChange={(value) => setEditingProfile({...editingProfile, phone: value})}
                      />
                      
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={editingProfile.dateOfBirth || ""}
                        onChange={(e) => setEditingProfile({...editingProfile, dateOfBirth: e.target.value})}
                      />
                    </div>
                    
                    <Textarea
                      label="Address"
                      value={editingProfile.address || ""}
                      onValueChange={(value) => setEditingProfile({...editingProfile, address: value})}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveProfile}>
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

export default StudentProfile;