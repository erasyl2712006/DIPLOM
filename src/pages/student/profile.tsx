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
  ModalFooter,
  addToast
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { students, getGroupById } from '../../data/mock-data';
import { Student } from '../../data/mock-data';
import { 
  getFromLocalStorage, 
  saveToLocalStorage, 
  updateCollectionItem 
} from '../../data/local-storage';
import { useAuth } from '../../contexts/auth-context';

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  
  // Use the authenticated user's ID instead of static ID
  const studentId = user?.id || 'st1';
  
  // Initialize student data from localStorage
  const [studentData, setStudentData] = React.useState<Student | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editingProfile, setEditingProfile] = React.useState<Student | null>(null);
  
  React.useEffect(() => {
    const savedStudents = getFromLocalStorage<Student[]>('students', students);
    const student = savedStudents.find(s => s.id === studentId);
    if (student) {
      setStudentData(student);
    }
  }, [studentId]);
  
  // Fix edit profile functionality with localStorage persistence
  const handleEditProfile = () => {
    if (studentData) {
      setEditingProfile({...studentData});
      onOpen();
    }
  };
  
  const handleSaveProfile = () => {
    if (!editingProfile) return;
    
    // Update in localStorage
    const updatedStudents = updateCollectionItem<Student>(
      'students', 
      editingProfile.id, 
      editingProfile, 
      students
    );
    
    // Update local state
    setStudentData(editingProfile);
    onOpenChange(false);
    
    addToast({
      title: "Профиль обновлен",
      description: "Ваши изменения были успешно сохранены",
      color: "success",
    });
  };
  
  // Handle adding additional information
  const handleAddInformation = () => {
    // In a real app, this would open a form to add additional information
    console.log("Add additional information");
    
    addToast({
      title: "Добавление информации",
      description: "Форма для добавления дополнительной информации открыта",
      color: "primary",
    });
  };
  
  // Handle changing profile photo
  const handleChangePhoto = () => {
    // In a real app, this would open a file picker
    console.log("Change photo");
    
    addToast({
      title: "Изменение фото",
      description: "Выберите новое фото профиля",
      color: "primary",
    });
  };

  if (!studentData) return null;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Мой профиль</h1>
        <p className="text-default-500">
          Просмотр и управление вашей личной информацией
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2 border border-divider">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Личная информация</h2>
            <Button 
              color="primary" 
              variant="light"
              onPress={handleEditProfile}
              endContent={<Icon icon="lucide:edit" />}
            >
              Редактировать профиль
            </Button>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar 
                  src={studentData?.avatar} 
                  className="w-32 h-32 text-large"
                  isBordered
                />
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold">{studentData?.name}</h3>
                  <p className="text-default-500">Студент</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-default-500 text-sm mb-1">Email</p>
                    <p className="font-medium">{studentData?.email}</p>
                  </div>
                  <div>
                    <p className="text-default-500 text-sm mb-1">Телефон</p>
                    <p className="font-medium">{studentData?.phone || "Не указан"}</p>
                  </div>
                  <div>
                    <p className="text-default-500 text-sm mb-1">Дата рождения</p>
                    <p className="font-medium">{studentData?.dateOfBirth || "Не указан"}</p>
                  </div>
                  <div>
                    <p className="text-default-500 text-sm mb-1">Адрес</p>
                    <p className="font-medium">{studentData?.address || "Не указан"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Academic Information */}
        <Card className="border border-divider">
          <CardHeader>
            <h2 className="text-lg font-semibold">Академическая информация</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-default-500 text-sm mb-1">Студентский ID</p>
                <p className="font-medium">{studentData?.id}</p>
              </div>
              <div>
                <p className="text-default-500 text-sm mb-1">Группа</p>
                <p className="font-medium">{studentData?.group?.name}</p>
              </div>
              <div>
                <p className="text-default-500 text-sm mb-1">Год</p>
                <p className="font-medium">{studentData?.group?.year}</p>
              </div>
              <div>
                <p className="text-default-500 text-sm mb-1">Специализация</p>
                <p className="font-medium">{studentData?.group?.specialization}</p>
              </div>
              <div>
                <p className="text-default-500 text-sm mb-1">Статус</p>
                <p className="font-medium">Активен</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Additional Information */}
        <Card className="lg:col-span-3 border border-divider">
          <CardHeader>
            <h2 className="text-lg font-semibold">Дополнительная информация</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="text-center text-default-500 py-4">
              <Icon icon="lucide:info" className="mx-auto mb-2" width={24} />
              <p>На данный момент дополнительная информация не доступна.</p>
              <Button color="primary" variant="light" className="mt-4" onPress={handleAddInformation}>
                Добавить информацию
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
              <ModalHeader className="flex flex-col gap-1">Редактировать профиль</ModalHeader>
              <ModalBody>
                {editingProfile && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-2 mb-4">
                      <Avatar 
                        src={editingProfile.avatar} 
                        className="w-24 h-24 text-large"
                        isBordered
                      />
                      <Button size="sm" variant="flat" onPress={handleChangePhoto}>
                        Изменить фото
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="ФИО"
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
                        label="Телефон"
                        type="tel"
                        value={editingProfile.phone || ""}
                        onValueChange={(value) => setEditingProfile({...editingProfile, phone: value})}
                      />
                      
                      <Input
                        label="Дата рождения"
                        type="date"
                        value={editingProfile.dateOfBirth || ""}
                        onChange={(e) => setEditingProfile({...editingProfile, dateOfBirth: e.target.value})}
                      />
                    </div>
                    
                    <Textarea
                      label="Адрес"
                      value={editingProfile.address || ""}
                      onValueChange={(value) => setEditingProfile({...editingProfile, address: value})}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onOpenChange}>
                  Отмена
                </Button>
                <Button color="primary" onPress={handleSaveProfile}>
                  Сохранить изменения
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