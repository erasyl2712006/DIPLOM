import React from 'react';
import { addToast } from '@heroui/react';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Администратор',
    email: 'admin@college.edu',
    role: 'admin',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1'
  },
  {
    id: '2',
    name: 'Преподаватель',
    email: 'teacher@college.edu',
    role: 'teacher',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=2'
  },
  {
    id: '3',
    name: 'Студент',
    email: 'student@college.edu',
    role: 'student',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=3'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Enhanced login function with better role detection
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email) {
        throw new Error('Email is required');
      }
      
      // Normalize email by trimming whitespace and converting to lowercase
      const normalizedEmail = email.trim().toLowerCase();
      
      // Allow login with simplified role names for demo
      let userToLogin;
      
      // Check if it's one of our special role keywords
      if (normalizedEmail === 'admin' || normalizedEmail === 'teacher' || normalizedEmail === 'student') {
        userToLogin = mockUsers.find(u => u.role === normalizedEmail);
      } else {
        // Normal email login - also case insensitive
        userToLogin = mockUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      }
      
      if (!userToLogin) {
        throw new Error('Пользователь не найден');
      }
      
      // In a real app, you would validate the password here
      // For demo, we'll allow any non-empty password
      if (!password.trim()) {
        throw new Error('Пароль обязателен');
      }
      
      setUser(userToLogin);
      localStorage.setItem('user', JSON.stringify(userToLogin));
      
      addToast({
        title: 'Вход выполнен успешно',
        description: `Добро пожаловать, ${userToLogin.name}`,
        color: 'success',
      });
    } catch (error) {
      console.error('Login error:', error);
      addToast({
        title: 'Ошибка входа',
        description: error instanceof Error ? error.message : 'Неверный email или пароль',
        color: 'danger',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    addToast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из системы',
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};