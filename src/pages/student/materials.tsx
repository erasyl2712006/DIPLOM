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
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  materials, 
  subjects, 
  getSubjectById,
  getTeacherById
} from '../../data/mock-data';

const StudentMaterials: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");

  // Filter materials
  const filteredMaterials = React.useMemo(() => {
    let filtered = [...materials];
    
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
  }, [selectedSubject, searchQuery]);
  
  // Get material type icon and color
  const getMaterialTypeInfo = (type: string) => {
    switch (type) {
      case 'document': return { icon: 'lucide:file-text', color: 'primary' };
      case 'video': return { icon: 'lucide:video', color: 'danger' };
      case 'link': return { icon: 'lucide:link', color: 'success' };
      case 'image': return { icon: 'lucide:image', color: 'secondary' };
      default: return { icon: 'lucide:file', color: 'default' };
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

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Учебные материалы</h1>
        <p className="text-default-500">
          Доступ к учебным материалам по вашим предметам
        </p>
      </div>

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
        
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" endContent={<Icon icon="lucide:chevron-down" />}>
              Сортировка
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>По дате (новые)</DropdownItem>
            <DropdownItem>По дате (старые)</DropdownItem>
            <DropdownItem>По названию (А-Я)</DropdownItem>
            <DropdownItem>По названию (Я-А)</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const subject = getSubjectById(material.subjectId);
          const teacher = getTeacherById(material.uploadedBy);
          const typeInfo = getMaterialTypeInfo(material.type);
          
          return (
            <Card key={material.id} className="border border-divider">
              <CardHeader className="flex gap-2">
                <Icon 
                  icon={typeInfo.icon} 
                  className={`text-${typeInfo.color}`} 
                  width={20} 
                />
                <Chip color={typeInfo.color as any} variant="flat" size="sm">
                  {getMaterialTypeLabel(material.type)}
                </Chip>
              </CardHeader>
              <CardBody className="pt-0">
                <h3 className="text-lg font-semibold">{material.title}</h3>
                {material.description && (
                  <p className="text-default-500 text-sm mt-1 mb-3">
                    {material.description}
                  </p>
                )}
                
                <div className="space-y-2 mt-4 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:book-open" className="text-default-500" width={16} />
                    <span>{subject?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:user" className="text-default-500" width={16} />
                    <span>{teacher?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:calendar" className="text-default-500" width={16} />
                    <span>{material.uploadDate}</span>
                  </div>
                </div>
                
                <Button 
                  color="primary" 
                  variant="flat" 
                  fullWidth
                  endContent={<Icon icon="lucide:download" />}
                >
                  Скачать
                </Button>
              </CardBody>
            </Card>
          );
        })}

        {filteredMaterials.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Icon icon="lucide:file-x" className="mx-auto mb-3 text-default-400" width={40} />
            <p className="text-default-500">Материалы не найдены</p>
            <p className="text-xs text-default-500 mt-1">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMaterials;