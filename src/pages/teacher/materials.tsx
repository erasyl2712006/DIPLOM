import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Button,
  Input,
  Chip,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  materials, 
  subjects, 
  groups,
  getSubjectById,
  getGroupById
} from '../../data/mock-data';
import { Material } from '../../data/mock-data';

const TeacherMaterials: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedMaterial, setSelectedMaterial] = React.useState<Material | null>(null);
  
  // Filter materials (only those uploaded by this teacher - hardcoded to t1 for now)
  const teacherMaterials = React.useMemo(() => {
    return materials.filter(material => material.uploadedBy === 't1');
  }, []);
  
  const filteredMaterials = React.useMemo(() => {
    let filtered = teacherMaterials;
    
    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(material => material.subjectId === selectedSubject);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(material => 
        material.title.toLowerCase().includes(lowerCaseQuery) ||
        material.description?.toLowerCase().includes(lowerCaseQuery) ||
        getSubjectById(material.subjectId)?.name.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Sort by upload date (newest first)
    return filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }, [teacherMaterials, selectedSubject, searchQuery]);
  
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
  
  // Handle add new material
  const handleAddMaterial = () => {
    setSelectedMaterial(null);
    onOpen();
  };
  
  // Handle edit material
  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    onOpen();
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Учебные материалы</h1>
        <p className="text-default-500">
          Управление учебными материалами для ваших курсов
        </p>
      </div>

      <Tabs aria-label="Materials options">
        <Tab key="my-materials" title="Мои материалы">
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex gap-4 flex-wrap">
                <Select
                  label="Предмет"
                  className="w-full max-w-xs"
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
                
                <Input
                  placeholder="Поиск материалов..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  startContent={<Icon icon="lucide:search" className="text-default-400" />}
                  isClearable
                  className="w-full max-w-xs"
                />
              </div>
              
              <Button 
                color="primary" 
                endContent={<Icon icon="lucide:plus" />}
                onPress={handleAddMaterial}
              >
                Добавить материал
              </Button>
            </div>

            <Card className="shadow-sm border-divider">
              <Table removeWrapper aria-label="Таблица учебных материалов">
                <TableHeader>
                  <TableColumn>НАЗВАНИЕ</TableColumn>
                  <TableColumn>ТИП</TableColumn>
                  <TableColumn>ПРЕДМЕТ</TableColumn>
                  <TableColumn>ДАТА</TableColumn>
                  <TableColumn>ГРУППЫ</TableColumn>
                  <TableColumn width={100}>ДЕЙСТВИЯ</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => {
                    const subject = getSubjectById(material.subjectId);
                    const typeInfo = getMaterialTypeInfo(material.type);
                    
                    return (
                      <TableRow key={material.id}>
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
                            <Tooltip content="Редактировать">
                              <Button 
                                isIconOnly 
                                size="sm" 
                                variant="light"
                                onPress={() => handleEditMaterial(material)}
                              >
                                <Icon icon="lucide:edit" className="text-default-500" />
                              </Button>
                            </Tooltip>
                            <Tooltip content="Удалить">
                              <Button isIconOnly size="sm" variant="light" color="danger">
                                <Icon icon="lucide:trash-2" />
                              </Button>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {filteredMaterials.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="text-center py-6">
                          <Icon icon="lucide:file-x" className="mx-auto mb-2 text-default-400" width={32} />
                          <p>Материалы не найдены</p>
                          <p className="text-xs text-default-500 mt-1">
                            Добавьте новые материалы или измените параметры поиска
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </Tab>
        
        <Tab key="all-materials" title="Все материалы">
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <Input
                placeholder="Поиск всех материалов..."
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                isClearable
                className="w-full max-w-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => {
                const materialType = index % 4;
                const typeInfo = getMaterialTypeInfo(
                  materialType === 0 ? 'document' : 
                  materialType === 1 ? 'video' : 
                  materialType === 2 ? 'link' : 
                  'image'
                );
                
                return (
                  <Card key={index} className="border border-divider">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon 
                          icon={typeInfo.icon} 
                          className={`text-${typeInfo.color}`} 
                          width={20} 
                        />
                        <Chip color={typeInfo.color as any} variant="flat" size="sm">
                          {getMaterialTypeLabel(
                            materialType === 0 ? 'document' : 
                            materialType === 1 ? 'video' : 
                            materialType === 2 ? 'link' : 
                            'image'
                          )}
                        </Chip>
                      </div>
                      
                      <h3 className="text-md font-semibold">
                        {index % 3 === 0 && "Введение в базы данных"}
                        {index % 3 === 1 && "Основы веб-разработки"}
                        {index % 3 === 2 && "Операционные системы"}
                      </h3>
                      
                      <p className="text-xs text-default-500 mt-1 mb-2">
                        {index % 2 === 0 ? "Доступен для CS-101" : "Доступен для CS-201"}
                      </p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-default-500">
                          {index % 2 === 0 ? "Проф. Иванов" : "Проф. Петров"}
                        </div>
                        <Button size="sm" variant="flat" color="primary">
                          Скачать
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Add/Edit Material Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedMaterial ? "Редактировать материал" : "Добавить учебный материал"}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Название материала"
                    placeholder="Введите название материала"
                    labelPlacement="outside"
                    defaultValue={selectedMaterial?.title || ""}
                  />
                  
                  <Textarea
                    label="Описание"
                    placeholder="Введите описание материала"
                    labelPlacement="outside"
                    defaultValue={selectedMaterial?.description || ""}
                  />
                  
                  <Select
                    label="Тип материала"
                    placeholder="Выберите тип материала"
                    labelPlacement="outside"
                    defaultSelectedKeys={selectedMaterial ? [selectedMaterial.type] : ["document"]}
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
                    defaultSelectedKeys={selectedMaterial ? [selectedMaterial.subjectId] : []}
                  >
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Select
                    label="Группы"
                    placeholder="Выберите группы"
                    selectionMode="multiple"
                    labelPlacement="outside"
                    defaultSelectedKeys={selectedMaterial?.groupIds || []}
                  >
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  {!selectedMaterial?.fileUrl && (
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
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onPress={onClose}>
                  {selectedMaterial ? "Сохранить" : "Добавить"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TeacherMaterials;