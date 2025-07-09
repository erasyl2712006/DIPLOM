import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { 
  Card, 
  CardBody,
  CardHeader,
  CardFooter,
  Input, 
  Button, 
  Link, 
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuth } from '../contexts/auth-context';
import { MainNavbar } from '../components/main-navbar';

interface LocationState {
  from: { pathname: string };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login, isLoading } = useAuth();
  const history = useHistory();
  const location = useLocation<{ from?: Location }>();
  const from = location.state?.from?.pathname || getDefaultRedirectPath(email);
  
  // Add helper text to show available role logins
  const helpText = (
    <div className="mt-2 text-small text-default-500">
      <p>Для демо можно использовать:</p>
      <p>• admin (для входа как администратор)</p>
      <p>• teacher (для входа как преподаватель)</p>
      <p>• student (для входа как студент)</p>
      <p>• или полные email-адреса: admin@college.edu, teacher@college.edu, student@college.edu</p>
      <p>Пароль может быть любым (не пустым).</p>
    </div>
  );

  // Add function to determine redirect path based on email/role
  function getDefaultRedirectPath(emailOrRole: string): string {
    const normalizedInput = emailOrRole.trim().toLowerCase();
    if (normalizedInput === 'admin' || normalizedInput.includes('admin')) {
      return '/admin';
    } else if (normalizedInput === 'teacher' || normalizedInput.includes('teacher')) {
      return '/teacher';
    } else if (normalizedInput === 'student' || normalizedInput.includes('student')) {
      return '/student';
    }
    return '/';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      
      // Redirect based on role after successful login
      const redirectPath = getDefaultRedirectPath(email);
      console.log("Login successful, redirecting to:", redirectPath);
      history.push(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">Вход в систему</h1>
          <p className="text-small text-default-500">
            Введите свои данные для входа в систему управления колледжем
          </p>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email или роль"
              placeholder="Введите email или роль (admin/teacher/student)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              description={helpText}
            />
            
            <Input
              label="Пароль"
              placeholder="Введите пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            
            <div>
              <Button 
                type="submit" 
                color="primary" 
                fullWidth
                isLoading={isLoading}
                disabled={!email.trim() || !password.trim() || isLoading}
              >
                Войти
              </Button>
            </div>
          </form>
        </CardBody>
        <CardFooter className="justify-center flex-col">
          <p className="text-center text-small">
            Не зарегистрированы? Обратитесь к администратору
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;