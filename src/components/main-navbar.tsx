import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link, 
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from '@heroui/react';
import { useAuth } from '../contexts/auth-context';
import { Icon } from '@iconify/react';

export const MainNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Navbar className="shadow-sm">
      <NavbarBrand>
        <Link 
          as={RouterLink} 
          to="/" 
          className="font-bold text-inherit flex items-center gap-2"
        >
          <Icon icon="lucide:graduation-cap" width={24} height={24} />
          <span>Система Управления Колледжем</span>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link as={RouterLink} to="/" color="foreground">
            Главная
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={RouterLink} to="/about" color="foreground">
            О нас
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={RouterLink} to="/news" color="foreground">
            Новости
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={RouterLink} to="/contact" color="foreground">
            Контакты
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {isAuthenticated ? (
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
              <DropdownItem key="role" className="text-primary" isReadOnly>
                Роль: {
                  user?.role === 'admin' ? 'Администратор' : 
                  user?.role === 'teacher' ? 'Преподаватель' : 
                  'Студент'
                }
              </DropdownItem>
              <DropdownItem key="dashboard">
                <Link 
                  as={RouterLink} 
                  to={`/${user?.role}`} 
                  className="w-full"
                >
                  Панель управления
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={logout}>
                Выйти
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button 
              as={RouterLink}
              to="/login" 
              color="primary" 
              variant="flat"
            >
              Войти
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
};