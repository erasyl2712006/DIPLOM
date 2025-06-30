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
  Tab
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  materials, 
  subjects,
  getSubjectById,
  getTeacherById
} from '../../data/mock-data';
import { Material } from '../../data/mock-data';

const StudentMaterials: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  
  // Hard-coded student group ID for now
  const studentGroupId = 'g1';
  
  // Filter materials available for this student
  const studentMaterials = React.useMemo(() => {
    return materials.filter(material => material.groupIds.includes(studentGroupId));
  }, [studentGroupId]);
  
  // Apply additional filters
  const filteredMaterials = React.useMemo(() => {
    let filtered = studentMaterials;
    
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
    
    return filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }, [studentMaterials, selectedSubject, searchQuery]);
  
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

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Учебные материалы</h1>
        <p className="text-default-500">
          Доступные учебные материалы для ваших курсов
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
      </div>
      
      <Tabs aria-label="Materials view options">
        <Tab key="grid" title="Сетка">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredMaterials.map(material => {
              const subject = getSubjectById(material.subjectId);
              const teacher = getTeacherById(material.uploadedBy);
              const typeInfo = getMaterialTypeInfo(material.type);
              
              return (
                <Card key={material.id} className="border border-divider">
                  <CardBody>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-2 rounded-full bg-${typeInfo.color}-100 text-${typeInfo.color}`}>
                        <Icon icon={typeInfo.icon} width={18} height={18} />
                      </div>
                      <Chip color={typeInfo.color as any} variant="flat" size="sm">
                        {getMaterialTypeLabel(material.type)}
                      </Chip>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-1">{material.title}</h3>
                    {material.description && (
                      <p className="text-default-500 text-sm mb-3">{material.description}</p>
                    )}
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-xs text-default-500">
                        <p>{subject?.name}</p>
                        <p>{teacher?.name}</p>
                        <p>{material.uploadDate}</p>
                      </div>
                      <Button 
                        size="sm" 
                        color="primary" 
                        variant="flat"
                        endContent={<Icon icon="lucide:download" />}
                      >
                        Скачать
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
            
            {filteredMaterials.length === 0 && (
              <div className="col-span-full py-10 text-center">
                <Icon icon="lucide:file-x" className="mx-auto mb-2 text-default-400" width={48} />
                <p className="text-xl font-semibold">Материалы не найдены</p>
                <p className="text-default-500 mt-2">
                  Попробуйте изменить параметры поиска или выбрать другой предмет
                </p>
              </div>
            )}
          </div>
        </Tab>
        
        <Tab key="list" title="Список">
          <div className="mt-6">
            {filteredMaterials.map(material => {
              const subject = getSubjectById(material.subjectId);
              const teacher = getTeacherById(material.uploadedBy);
              const typeInfo = getMaterialTypeInfo(material.type);
              
              return (
                <Card key={material.id} className="border border-divider mb-4">
                  <CardBody>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-full bg-${typeInfo.color}-100 text-${typeInfo.color} flex-shrink-0`}>
                          <Icon icon={typeInfo.icon} width={20} height={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{material.title}</h3>
                          {material.description && (
                            <p className="text-default-500 text-sm mt-1">{material.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Chip color="primary" variant="flat" size="sm">{subject?.name}</Chip>
                            <Chip variant="flat" size="sm">{getMaterialTypeLabel(material.type)}</Chip>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between items-end">
                        <div className="text-xs text-default-500 text-right">
                          <p>{teacher?.name}</p>
                          <p>Загружено: {material.uploadDate}</p>
                        </div>
                        <Button 
                          size="sm" 
                          color="primary" 
                          endContent={<Icon icon="lucide:download" />}
                        >
                          Скачать
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
            
            {filteredMaterials.length === 0 && (
              <Card className="border border-divider">
                <CardBody className="py-10">
                  <div className="text-center">
                    <Icon icon="lucide:file-x" className="mx-auto mb-2 text-default-400" width={48} />
                    <p className="text-xl font-semibold">Материалы не найдены</p>
                    <p className="text-default-500 mt-2">
                      Попробуйте изменить параметры поиска или выбрать другой предмет
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default StudentMaterials;