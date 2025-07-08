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
  Divider,
  Tabs,
  Tab
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
  const location = useLocation<LocationState>();
  const [selectedTab, setSelectedTab] = React.useState<string>('students');
  
  const from = location.state?.from?.pathname || '/';
  
  // Enhance login handler to validate fields
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!password.trim()) {
      addToast({
        title: "Ошибка входа",
        description: "Пожалуйста, введите пароль",
        color: "danger",
      });
      return;
    }
    
    try {
      // Fill in predefined email based on selected role for demo purposes
      let demoEmail = '';
      switch (selectedTab) {
        case 'admin': demoEmail = 'admin@college.edu'; break;
        case 'teachers': demoEmail = 'teacher@college.edu'; break;
        case 'students': demoEmail = 'student@college.edu'; break;
      }
      
      await login(demoEmail || email, password);
      history.replace(from);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleTabChange = (key: React.Key) => {
    setSelectedTab(String(key));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainNavbar />
      
      <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
        <Card className="max-w-md w-full">
          <CardHeader className="flex flex-col items-center gap-4 pb-0">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Icon 
                icon="lucide:graduation-cap" 
                className="text-primary" 
                width={32} 
                height={32}
              />
            </div>
            <h1 className="text-2xl font-bold text-center">Вход в систему колледжа</h1>
            
            <div className="w-full">
              <Tabs 
                aria-label="Login options" 
                selectedKey={selectedTab}
                onSelectionChange={handleTabChange}
                variant="underlined"
                classNames={{
                  tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit px-0 h-12",
                  tabContent: "group-data-[selected=true]:text-primary"
                }}
              >
                <Tab key="students" title="Студенты" />
                <Tab key="teachers" title="Преподаватели" />
                <Tab key="admin" title="Администратор" />
              </Tabs>
            </div>
          </CardHeader>
          
          <CardBody>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                type="email"
                label="Email"
                placeholder={`${selectedTab === 'students' ? 'student' : selectedTab === 'teachers' ? 'teacher' : 'admin'}@college.edu`}
                value={email}
                onValueChange={setEmail}
                labelPlacement="outside"
                startContent={
                  <Icon icon="lucide:mail" className="text-default-400" width={16} />
                }
              />
              
              <Input
                type="password"
                label="Пароль"
                placeholder="Введите ваш пароль"
                value={password}
                onValueChange={setPassword}
                labelPlacement="outside"
                startContent={
                  <Icon icon="lucide:lock" className="text-default-400" width={16} />
                }
              />
              
              <div className="flex justify-between items-center">
                <Link href="#" size="sm">Забыли пароль?</Link>
              </div>
              
              <Button 
                color="primary" 
                type="submit" 
                isLoading={isLoading}
                className="mt-2"
                fullWidth
              >
                Войти
              </Button>
            </form>
          </CardBody>
          
          <CardFooter className="flex flex-col">
            <p className="text-center text-small text-default-500">
              Для демонстрации просто нажмите "Войти" с любым паролем.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;