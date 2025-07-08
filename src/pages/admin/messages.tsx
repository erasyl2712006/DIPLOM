import React from 'react';
import { 
  Card, 
  CardBody,
  Divider,
  Button,
  Input,
  Avatar,
  Chip,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  messages,
  students,
  teachers,
  getStudentById,
  getTeacherById
} from '../../data/mock-data';
import { User } from '../../contexts/auth-context';
import { 
  Select,
  SelectItem
} from '@heroui/react';

const AdminMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [newMessage, setNewMessage] = React.useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Combine students and teachers for user list
  const allUsers = React.useMemo(() => {
    const userList = [
      ...students.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        avatar: student.avatar,
        role: 'student' as const
      })),
      ...teachers.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        avatar: teacher.avatar,
        role: 'teacher' as const
      }))
    ];
    
    return userList;
  }, []);
  
  // Filter conversations by search query
  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) return allUsers;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery)
    );
  }, [allUsers, searchQuery]);
  
  // Get conversation messages
  const conversationMessages = React.useMemo(() => {
    if (!selectedConversation) return [];
    
    return messages
      .filter(msg => 
        (msg.senderId === '1' && msg.receiverId === selectedConversation) || 
        (msg.senderId === selectedConversation && msg.receiverId === '1')
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [selectedConversation]);
  
  // Get selected user
  const selectedUser = React.useMemo(() => {
    if (!selectedConversation) return null;
    
    return allUsers.find(user => user.id === selectedConversation) || null;
  }, [selectedConversation, allUsers]);
  
  // Scroll to bottom of messages on new message or conversation change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessages]);
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, this would send the message to the API
    console.log('Sending message:', newMessage);
    
    // Clear input
    setNewMessage('');
  };
  
  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Сообщения</h1>
        <p className="text-default-500">
          Общение с преподавателями и студентами
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="border border-divider lg:col-span-1">
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                isClearable
                size="sm"
              />
              <Button 
                isIconOnly 
                variant="flat" 
                size="sm"
                color="primary"
                onPress={onOpen}
              >
                <Icon icon="lucide:edit" />
              </Button>
            </div>
            
            <Divider />
            
            <div className="mt-4 space-y-1 max-h-[500px] overflow-y-auto">
              {filteredConversations.map(user => {
                const unreadCount = messages.filter(
                  msg => msg.senderId === user.id && msg.receiverId === '1' && !msg.isRead
                ).length;
                
                return (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                      selectedConversation === user.id 
                        ? 'bg-primary/10' 
                        : 'hover:bg-content2'
                    }`}
                    onClick={() => setSelectedConversation(user.id)}
                  >
                    <Badge 
                      content={unreadCount > 0 ? unreadCount : null}
                      color="danger"
                      placement="top-right"
                      isInvisible={unreadCount === 0}
                    >
                      <Avatar 
                        src={user.avatar} 
                        name={user.name}
                        size="sm"
                      />
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-medium truncate">{user.name}</p>
                        <Chip size="sm" variant="flat" color={user.role === 'student' ? 'primary' : 'success'}>
                          {user.role === 'student' ? 'Студент' : 'Преподаватель'}
                        </Chip>
                      </div>
                      <p className="text-xs text-default-500 truncate">{user.email}</p>
                    </div>
                  </div>
                );
              })}
              
              {filteredConversations.length === 0 && (
                <div className="text-center py-6 text-default-500">
                  <Icon icon="lucide:search-x" className="mx-auto mb-2" width={24} />
                  <p>Пользователи не найдены</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Conversation */}
        <Card className="border border-divider lg:col-span-2 flex flex-col h-[600px]">
          {selectedUser ? (
            <>
              {/* Conversation Header */}
              <div className="flex items-center justify-between p-4 border-b border-divider">
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={selectedUser.avatar} 
                    name={selectedUser.name}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-xs text-default-500">
                      {selectedUser.role === 'student' ? 'Студент' : 'Преподаватель'}
                    </p>
                  </div>
                </div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                      <Icon icon="lucide:more-vertical" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem>Профиль пользователя</DropdownItem>
                    <DropdownItem>Очистить историю</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {conversationMessages.length > 0 ? (
                  <div className="space-y-4">
                    {conversationMessages.map(msg => {
                      const isCurrentUser = msg.senderId === '1';
                      
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isCurrentUser ? 'bg-primary-100' : 'bg-content2'} rounded-lg p-3`}>
                            <p>{msg.content}</p>
                            <p className="text-xs text-default-400 text-right mt-1">
                              {formatMessageTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-default-500">
                      <Icon icon="lucide:message-square" className="mx-auto mb-2" width={32} />
                      <p>Начните общение</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-divider">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onValueChange={setNewMessage}
                    minRows={1}
                    maxRows={4}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    color="primary" 
                    isIconOnly
                    onPress={handleSendMessage}
                    isDisabled={!newMessage.trim()}
                  >
                    <Icon icon="lucide:send" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-default-500">
                <Icon icon="lucide:message-circle" className="mx-auto mb-4" width={48} />
                <p className="text-lg">Выберите диалог</p>
                <p className="mt-2">Выберите пользователя из списка слева, чтобы начать общение</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* New Message Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Новое сообщение</ModalHeader>
              <ModalBody>
                <Select
                  label="Получатель"
                  placeholder="Выберите получателя"
                >
                  <SelectItem key="all" value="all">Всем пользователям</SelectItem>
                  <SelectItem key="all-teachers" value="all-teachers">Всем преподавателям</SelectItem>
                  <SelectItem key="all-students" value="all-students">Всем студентам</SelectItem>
                  <SelectItem key="divider-1" isReadOnly isDisabled className="text-default-300">
                    Преподаватели
                  </SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                  <SelectItem key="divider-2" isReadOnly isDisabled className="text-default-300">
                    Студенты
                  </SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </Select>
                <Textarea
                  label="Сообщение"
                  placeholder="Введите текст сообщения"
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onPress={onClose}>
                  Отправить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminMessages;