import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent,
  Link,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';
import { motion } from 'framer-motion';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Navigation links
  const navLinks = [
    { name: 'Панель управления', path: '/teacher/dashboard', icon: 'lucide:layout-dashboard' },
    { name: 'Расписание', path: '/teacher/schedule', icon: 'lucide:calendar' },
    { name: 'Оценки', path: '/teacher/grades', icon: 'lucide:file-text' },
    { name: 'Студенты', path: '/teacher/students', icon: 'lucide:users' },
    { name: 'Посещаемость', path: '/teacher/attendance', icon: 'lucide:check-square' },
    { name: 'Материалы', path: '/teacher/materials', icon: 'lucide:book-open' },
    { name: 'Сообщения', path: '/teacher/messages', icon: 'lucide:message-square' },
  ];

  const isActive = (path: string) => {
    if (path === '/teacher/dashboard') {
      return location.pathname === path || location.pathname === '/teacher';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-content1 shadow-sm border-r border-divider">
        <div className="p-4 border-b border-divider">
          <Link 
            as={RouterLink} 
            to="/" 
            className="flex items-center gap-2 text-primary font-semibold"
          >
            <Icon icon="lucide:graduation-cap" width={24} height={24} />
            <span>Система Колледжа</span>
          </Link>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <RouterLink
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full ${
                    isActive(link.path) 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-foreground hover:bg-content2'
                  }`}
                  aria-label={link.name}
                >
                  <Icon icon={link.icon} width={20} height={20} />
                  <span>{link.name}</span>
                </RouterLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-divider">
          <div className="flex items-center gap-3">
            <Avatar 
              src={user?.avatar} 
              name={user?.name} 
              size="sm" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-default-500 truncate">Преподаватель</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <Navbar maxWidth="full" className="border-b border-divider">
          <NavbarContent className="gap-4" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={user?.name}
                  size="sm"
                  src={user?.avatar}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Вы вошли как</p>
                  <p className="font-bold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="settings">Настройки</DropdownItem>
                <DropdownItem key="help_and_feedback">Помощь & Обратная связь</DropdownItem>
                <DropdownItem key="homepage" as={RouterLink} to="/">
                  Главная страница
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={logout}>
                  Выйти
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </Navbar>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;