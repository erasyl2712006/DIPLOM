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
  useDisclosure,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { 
  messages,
  teachers,
  getTeacherById,
  getSubjectById
} from '../../data/mock-data';
import { User } from '../../contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingIndicator } from '../../components/typing-indicator';
import { 
  getFromLocalStorage, 
  saveToLocalStorage 
} from '../../data/local-storage';

const StudentMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [newMessage, setNewMessage] = React.useState<string>("");
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const [messagesData, setMessagesData] = React.useState(messages);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Load messages from localStorage on component mount
  React.useEffect(() => {
    const savedMessages = getFromLocalStorage<typeof messages>('messages', messages);
    setMessagesData(savedMessages);
  }, []);
  
  // Filter teachers by search query
  const filteredTeachers = React.useMemo(() => {
    if (!searchQuery.trim()) return teachers;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return teachers.filter(teacher => 
      teacher.name.toLowerCase().includes(lowerCaseQuery) ||
      teacher.email.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);
  
  // Get conversation messages
  const conversationMessages = React.useMemo(() => {
    if (!selectedConversation) return [];
    
    return messagesData
      .filter(msg => 
        (msg.senderId === 'st1' && msg.receiverId === selectedConversation) || 
        (msg.senderId === selectedConversation && msg.receiverId === 'st1')
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [selectedConversation, messagesData]);
  
  // Get selected teacher
  const selectedTeacher = React.useMemo(() => {
    if (!selectedConversation) return null;
    
    return teachers.find(teacher => teacher.id === selectedConversation) || null;
  }, [selectedConversation]);
  
  // Scroll to bottom of messages on new message or conversation change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessages]);
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Create a new message object
    const newMessageObj = {
      id: `msg-${Date.now()}`,
      senderId: 'st1',
      receiverId: selectedConversation,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    // Update state with the new message
    const updatedMessages = [...messagesData, newMessageObj];
    setMessagesData(updatedMessages);
    
    // Save to localStorage
    saveToLocalStorage('messages', updatedMessages);
    
    // Show success toast
    addToast({
      title: "Сообщение отправлено",
      description: "Ваше сообщение успешно отправлено",
      color: "success",
    });
    
    // Clear input
    setNewMessage('');
  };

  // Handle creating a new message
  const handleCreateMessage = () => {
    // In a real app, this would prepare a new message
    onOpen();
  };
  
  // Handle sending a new message from the modal
  const handleSendNewMessage = () => {
    // In a real app, this would send the new message
    onOpenChange(false);
    
    addToast({
      title: "Сообщение отправлено",
      description: "Ваше сообщение успешно отправлено",
      color: "success",
    });
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
          Общение с преподавателями
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher List */}
        <Card className="border border-divider lg:col-span-1">
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <Input
                placeholder="Поиск преподавателей..."
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
                onPress={handleCreateMessage}
              >
                <Icon icon="lucide:edit" />
              </Button>
            </div>
            
            <Divider />
            
            <div className="mt-4 space-y-1 max-h-[500px] overflow-y-auto">
              {filteredTeachers.map(teacher => {
                const unreadCount = messages.filter(
                  msg => msg.senderId === teacher.id && msg.receiverId === 'st1' && !msg.isRead
                ).length;
                
                return (
                  <div
                    key={teacher.id}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                      selectedConversation === teacher.id 
                        ? 'bg-primary/10' 
                        : 'hover:bg-content2'
                    }`}
                    onClick={() => setSelectedConversation(teacher.id)}
                  >
                    <Badge 
                      content={unreadCount > 0 ? unreadCount : null}
                      color="danger"
                      placement="top-right"
                      isInvisible={unreadCount === 0}
                    >
                      <Avatar 
                        src={teacher.avatar} 
                        name={teacher.name}
                        size="sm"
                      />
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{teacher.name}</p>
                      <p className="text-xs text-default-500 truncate">
                        {teacher.subjectIds.map(id => getSubjectById(id)?.name).join(', ')}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {filteredTeachers.length === 0 && (
                <div className="text-center py-6 text-default-500">
                  <Icon icon="lucide:search-x" className="mx-auto mb-2" width={24} />
                  <p>Преподаватели не найдены</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Conversation */}
        <Card className="border border-divider lg:col-span-2 flex flex-col h-[600px]">
          {selectedTeacher ? (
            <>
              {/* Conversation Header */}
              <div className="flex items-center justify-between p-4 border-b border-divider">
                <div className="flex items-center gap-3">
                  <Avatar 
                    src={selectedTeacher.avatar} 
                    name={selectedTeacher.name}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium">{selectedTeacher.name}</p>
                    <p className="text-xs text-default-500">
                      {selectedTeacher.degree}
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
                    <DropdownItem>Профиль преподавателя</DropdownItem>
                    <DropdownItem>Очистить историю</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {conversationMessages.length > 0 ? (
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {conversationMessages.map(msg => {
                        const isCurrentUser = msg.senderId === 'st1';
                        
                        return (
                          <motion.div 
                            key={msg.id} 
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                              opacity: { duration: 0.2 }
                            }}
                          >
                            <motion.div 
                              className={`max-w-[70%] ${isCurrentUser ? 'bg-primary-100' : 'bg-content2'} rounded-lg p-3`}
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <p>{msg.content}</p>
                              <p className="text-xs text-default-400 text-right mt-1">
                                {formatMessageTime(msg.timestamp)}
                                {isCurrentUser && msg.id.startsWith('temp-') && (
                                  <span className="ml-2 text-primary-500">
                                    <Icon icon="lucide:check" width={12} />
                                  </span>
                                )}
                              </p>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <motion.div 
                        className="flex justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <TypingIndicator />
                      </motion.div>
                    )}
                    
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
                <p className="mt-2">Выберите преподавателя из списка слева, чтобы начать общение</p>
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
                  placeholder="Выберите преподавателя"
                  aria-label="Выберите получателя сообщения"
                >
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id} textValue={teacher.name}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </Select>
                <Textarea
                  label="Сообщение"
                  placeholder="Введите текст сообщения"
                  minRows={3}
                  aria-label="Текст сообщения"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onPress={handleSendNewMessage}>
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

export default StudentMessages;