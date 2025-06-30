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
    name: 'Admin User',
    email: 'admin@college.edu',
    role: 'admin',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1'
  },
  {
    id: '2',
    name: 'Teacher User',
    email: 'teacher@college.edu',
    role: 'teacher',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=2'
  },
  {
    id: '3',
    name: 'Student User',
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // In a real app, you would validate the password here
      
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      
      addToast({
        title: 'Login successful',
        description: `Welcome back, ${foundUser.name}`,
        color: 'success',
      });
    } catch (error) {
      console.error('Login error:', error);
      addToast({
        title: 'Login failed',
        description: 'Invalid email or password',
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
      title: 'Logged out',
      description: 'You have been successfully logged out',
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