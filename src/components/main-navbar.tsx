import React from 'react';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Button,
  Link 
} from '@heroui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';

export const MainNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <Navbar maxWidth="xl" isBordered>
      <NavbarBrand>
        <div className="flex items-center gap-2">
          <Icon icon="lucide:book-open" width={24} height={24} className="text-primary" />
          <p className="font-bold text-inherit">Система Управления Колледжем</p>
        </div>
      </NavbarBrand>
      
      <NavbarContent justify="center">
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
          <>
            <NavbarItem>
              <Link 
                as={RouterLink} 
                to={`/${user?.role}`}
                color="foreground"
              >
                {user?.name}
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button 
                color="danger" 
                variant="flat"
                onPress={logout}
              >
                Выйти
              </Button>
            </NavbarItem>
          </>
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