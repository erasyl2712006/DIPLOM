import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Button,
  Input,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Textarea,
  Tooltip,
  addToast
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  materials, 
  subjects, 
  groups,
  teachers,
  getSubjectById,
  getTeacherById
} from '../../data/mock-data';
import { motion, AnimatePresence } from 'framer-motion';

const AdminMaterials: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = React.useState<{id: string, title: string, description: string, type: string, subjectId: string, groupIds: string[], uploadDate: string, uploadedBy: string, fileUrl: string} | null>(null);
  const [materialsData, setMaterialsData] = React.useState(materials);
  const [recentAction, setRecentAction] = React.useState<{id: string, type: string} | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  // Filter materials
  const filteredMaterials = React.useMemo(() => {
    let filtered = [...materials];
    
    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(material => material.subjectId === selectedSubject);
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(material => material.type === selectedType);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(lowerCaseQuery) ||
        material.description?.toLowerCase().includes(lowerCaseQuery) ||
        getSubjectById(material.subjectId)?.name.toLowerCase().includes(lowerCaseQuery) ||
        getTeacherById(material.uploadedBy)?.name.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Sort by upload date (newest first)
    return filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }, [selectedSubject, selectedType, searchQuery]);
  
  // Get material type icon and color
  const getMaterialTypeInfo = (type: string) => {
    switch (type) {
      case 'document':
        return { icon: 'lucide:file-text', color: 'primary' };
      case 'video':
        return { icon: 'lucide:video', color: 'danger' };
      case 'link':
        return { icon: 'lucide:link', color: 'success' };
      case 'image':
        return { icon: 'lucide:image', color: 'secondary' };
      default:
        return { icon: 'lucide:file', color: 'default' };
    }
  };
  
  // Get material type label in Russian
  const getMaterialTypeLabel = (type: string) => {
    switch (type) {
      case 'document': return "Документ";
      case 'video': return "Видео";
      case 'link': return "Ссылка";
      case 'image': return "Изображение";
      default: return type;
    }
  };

  // Add handlers for CRUD operations
  const handleAddMaterial = () => {
    onOpen();
  };
  
  const handleDownloadMaterial = (materialId: string) => {
    // In a real app, this would download the material
    console.log("Download material:", materialId);
    
    addToast({
      title: "Загрузка началась",
      description: "Материал скачивается",
      color: "primary",
    });
  };
  
  const handleEditMaterial = (materialId: string) => {
    // In a real app, this would open a form to edit the material
    console.log("Edit material:", materialId);
    
    addToast({
      title: "Редактирование материала",
      description: "Форма редактирования материала открыта",
      color: "primary",
    });
  };
  
  const handleDeleteMaterial = (materialId: string) => {
    setRecentAction({id: materialId, type: 'deleted'});
    
    // Delay actual removal to show animation
    setTimeout(() => {
      const updatedMaterials = materialsData.filter(m => m.id !== materialId);
      setMaterialsData(updatedMaterials);
      
      addToast({
        title: "Материал удален",
        description: "Материал был успешно удален из системы",
        color: "success",
      });
      
      setRecentAction(null);
    }, 500);
  };

  // Add a simple UUID generator function to replace the external package
  const generateUUID = () => {
    return Math.random().toString(36).substring(2, 9) + 
      Date.now().toString(36);
  };
  
  const handleSaveMaterial = () => {
    // In a real app, this would save to the backend
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (selectedMaterial) {
      // Update existing material
      const updatedMaterials = materialsData.map(m => 
        m.id === selectedMaterial.id ? {...selectedMaterial, uploadDate: currentDate} : m
      );
      setMaterialsData(updatedMaterials);
      setRecentAction({id: selectedMaterial.id, type: 'updated'});
    } else {
      // Create new material with random ID - using our custom generator
      const newMaterial = {
        id: `m-${generateUUID()}`,
        title: document.querySelector<HTMLInputElement>('input[placeholder="Введите название материала"]')?.value || 'New Material',
        description: document.querySelector<HTMLTextAreaElement>('textarea[placeholder="Введите описание материала"]')?.value,
        type: document.querySelector<HTMLSelectElement>('select[aria-label="Тип материала"]')?.value || 'document',
        subjectId: document.querySelector<HTMLSelectElement>('select[aria-label="Предмет"]')?.value || subjects[0].id,
        groupIds: [],
        uploadDate: currentDate,
        uploadedBy: 'admin',
        fileUrl: ''
      };
      setMaterialsData([newMaterial, ...materialsData]);
      setRecentAction({id: newMaterial.id, type: 'added'});
    }
    
    onOpenChange(false);
    
    addToast({
      title: "Материал сохранен",
      description: "Новый материал добавлен в систему",
      color: "success",
    });
    
    // Clear highlight after animation completes
    setTimeout(() => setRecentAction(null), 3000);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Учебные материалы</h1>
          <p className="text-default-500">
            Управление учебными материалами для всех курсов
          </p>
        </div>
        
        <Button 
          color="primary" 
          endContent={<Icon icon="lucide:plus" />}
          onPress={handleAddMaterial}
        >
          Добавить материал
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 flex-wrap">
        <div className="w-full max-w-xs">
          <Select
            label="Предмет"
            selectedKeys={[selectedSubject]}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <SelectItem key="all" value="all">Все предметы</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </Select>
        </div>
        
        <div className="w-full max-w-xs">
          <Select
            label="Тип материала"
            selectedKeys={[selectedType]}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <SelectItem key="all" value="all">Все типы</SelectItem>
            <SelectItem key="document" value="document">Документ</SelectItem>
            <SelectItem key="video" value="video">Видео</SelectItem>
            <SelectItem key="link" value="link">Ссылка</SelectItem>
            <SelectItem key="image" value="image">Изображение</SelectItem>
          </Select>
        </div>
        
        <div className="w-full max-w-xs">
          <Input
            placeholder="Поиск материалов..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            isClearable
          />
        </div>
      </div>

      <Card className="shadow-sm border-divider">
        <Table removeWrapper aria-label="Таблица учебных материалов">
          <TableHeader>
            <TableColumn>НАЗВАНИЕ</TableColumn>
            <TableColumn>ТИП</TableColumn>
            <TableColumn>ПРЕДМЕТ</TableColumn>
            <TableColumn>ЗАГРУЗИЛ</TableColumn>
            <TableColumn>ДАТА</TableColumn>
            <TableColumn>ГРУППЫ</TableColumn>
            <TableColumn width={100}>ДЕЙСТВИЯ</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => {
              const subject = getSubjectById(material.subjectId);
              const typeInfo = getMaterialTypeInfo(material.type);
              const isHighlighted = recentAction && recentAction.id === material.id;
              
              return (
                <TableRow 
                  key={material.id} 
                  className={isHighlighted ? 
                    recentAction?.type === 'deleted' ? 'bg-danger-50' : 
                    recentAction?.type === 'added' ? 'bg-success-50' : 
                    'bg-primary-50' : ''
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon icon={typeInfo.icon} className={`text-${typeInfo.color}`} />
                      <div>
                        <p className="font-medium">{material.title}</p>
                        {material.description && (
                          <p className="text-xs text-default-500 truncate max-w-[200px]">
                            {material.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip color={typeInfo.color as any} variant="flat" size="sm">
                      {getMaterialTypeLabel(material.type)}
                    </Chip>
                  </TableCell>
                  <TableCell>{subject?.name}</TableCell>
                  <TableCell>{material.uploadedBy}</TableCell>
                  <TableCell>{material.uploadDate}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {material.groupIds.map((groupId) => {
                        const group = groups.find(g => g.id === groupId);
                        return group && (
                          <Chip key={groupId} size="sm" variant="flat">
                            {group.name}
                          </Chip>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tooltip content="Скачать">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light"
                          onPress={() => handleDownloadMaterial(material.id)}
                        >
                          <Icon icon="lucide:download" className="text-default-500" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Редактировать">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light"
                          onPress={() => handleEditMaterial(material.id)}
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
                          onPress={() => handleDeleteMaterial(material.id)}
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

      {/* Add Material Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Добавить учебный материал</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Название материала"
                    placeholder="Введите название материала"
                    labelPlacement="outside"
                  />
                  
                  <Textarea
                    label="Описание"
                    placeholder="Введите описание материала"
                    labelPlacement="outside"
                  />
                  
                  <Select
                    label="Тип материала"
                    placeholder="Выберите тип материала"
                    labelPlacement="outside"
                  >
                    <SelectItem key="document" value="document">Документ</SelectItem>
                    <SelectItem key="video" value="video">Видео</SelectItem>
                    <SelectItem key="link" value="link">Ссылка</SelectItem>
                    <SelectItem key="image" value="image">Изображение</SelectItem>
                  </Select>
                  
                  <Select
                    label="Предмет"
                    placeholder="Выберите предмет"
                    labelPlacement="outside"
                  >
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label="Преподаваемые предметы"
                    selectionMode="multiple"
                    labelPlacement="outside"
                    aria-label="Выберите преподаваемые предметы"
                  >
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id} textValue={subject.name}>
                        {subject.name} ({subject.credits} кредитов)
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <div className="flex items-center gap-3 border border-dashed border-default-300 rounded-medium p-4">
                    <div className="p-3 rounded-full bg-primary-100 text-primary">
                      <Icon icon="lucide:upload" width={20} height={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">Перетащите файлы сюда или нажмите для загрузки</p>
                      <p className="text-xs text-default-500">Максимальный размер: 100MB</p>
                    </div>
                    <Button size="sm" color="primary">Загрузить</Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onPress={handleSaveMaterial}>
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

export default AdminMaterials;