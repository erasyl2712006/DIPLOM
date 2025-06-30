import React from 'react';
import { 
  Button, 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader,
  Divider,
  Image
} from '@heroui/react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { MainNavbar } from '../components/main-navbar';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <Image
            removeWrapper
            alt="Кампус колледжа"
            className="z-0 w-full h-[500px] object-cover brightness-[0.7]"
            src="https://img.heroui.chat/image/places?w=1500&h=500&u=1"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Добро пожаловать в Систему Управления Колледжем</h1>
          <p className="text-xl mb-8 max-w-2xl text-center">
            Комплексная платформа для студентов, преподавателей и администраторов
          </p>
          <div className="flex gap-4">
            <Button 
              as={Link} 
              to="/login" 
              color="primary" 
              size="lg"
              endContent={<Icon icon="lucide:arrow-right" />}
            >
              Войти
            </Button>
            <Button 
              as={Link} 
              to="/about" 
              variant="bordered" 
              size="lg"
              className="text-white border-white"
            >
              Узнать больше
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Возможности</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Features */}
            <Card>
              <CardHeader className="flex gap-3">
                <div className="flex items-center justify-center p-3 bg-primary/10 rounded-full">
                  <Icon icon="lucide:users" className="text-primary" width={24} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold">Для студентов</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <ul className="list-disc list-inside space-y-2">
                  <li>Управление личным профилем</li>
                  <li>Доступ к расписанию с возможностью фильтрации</li>
                  <li>Журнал оценок и отслеживание успеваемости</li>
                  <li>Информация о преподавателях и контактные данные</li>
                  <li>Учебные материалы и ресурсы</li>
                </ul>
              </CardBody>
            </Card>
            
            {/* Teacher Features */}
            <Card>
              <CardHeader className="flex gap-3">
                <div className="flex items-center justify-center p-3 bg-primary/10 rounded-full">
                  <Icon icon="lucide:book-open" className="text-primary" width={24} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold">Для преподавателей</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <ul className="list-disc list-inside space-y-2">
                  <li>Управление расписанием занятий</li>
                  <li>Редактирование и ведение журнала оценок</li>
                  <li>Отслеживание успеваемости студентов</li>
                  <li>Загрузка учебных материалов</li>
                  <li>Инструменты для коммуникации</li>
                </ul>
              </CardBody>
            </Card>
            
            {/* Admin Features */}
            <Card>
              <CardHeader className="flex gap-3">
                <div className="flex items-center justify-center p-3 bg-primary/10 rounded-full">
                  <Icon icon="lucide:settings" className="text-primary" width={24} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold">Для администраторов</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <ul className="list-disc list-inside space-y-2">
                  <li>Полное управление студентами и преподавателями</li>
                  <li>Редактирование данных и настройка системы</li>
                  <li>Создание и управление расписаниями</li>
                  <li>Аналитика производительности и отчеты</li>
                  <li>Общесистемные объявления</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
      
      {/* News Section */}
      <section className="py-16 px-4 bg-content2">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Новости колледжа</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden">
                <Image
                  removeWrapper
                  alt={`Изображение новости ${item}`}
                  className="w-full h-48 object-cover"
                  src={`https://img.heroui.chat/image/places?w=600&h=400&u=${item+10}`}
                />
                <CardBody>
                  <h3 className="text-xl font-semibold mb-2">
                    {item === 1 && "Открытие новой компьютерной лаборатории"}
                    {item === 2 && "Награды за академические достижения"}
                    {item === 3 && "Предстоящая студенческая конференция"}
                  </h3>
                  <p className="text-default-500">
                    {item === 1 && "Колледж с гордостью объявляет об открытии новой современной компьютерной лаборатории, оснащенной новейшими технологиями."}
                    {item === 2 && "Поздравляем всех студентов, получивших награды за академические достижения на ежегодной церемонии."}
                    {item === 3 && "Приглашаем на предстоящую студенческую конференцию, посвященную инновациям и будущим технологиям в образовании."}
                  </p>
                </CardBody>
                <CardFooter className="flex justify-between">
                  <Button as={Link} to="/news" variant="light">
                    Подробнее
                  </Button>
                  <p className="text-default-400 text-sm">
                    {`${new Date().getDate() - item} дней назад`}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button as={Link} to="/news" color="primary" variant="ghost">
              Все новости
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-content3 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Контакты</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Icon icon="lucide:map-pin" />
                  <span>ул. Образования 123, Академгородок</span>
                </p>
                <p className="flex items-center gap-2">
                  <Icon icon="lucide:phone" />
                  <span>+7 (555) 123-4567</span>
                </p>
                <p className="flex items-center gap-2">
                  <Icon icon="lucide:mail" />
                  <span>info@college.edu</span>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="hover:text-primary transition-colors">
                    Новости и события
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary transition-colors">
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary transition-colors">
                    Вход
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Мы в соцсетях</h3>
              <div className="flex gap-4">
                <Button isIconOnly variant="light" aria-label="Facebook">
                  <Icon icon="logos:facebook" width={24} />
                </Button>
                <Button isIconOnly variant="light" aria-label="Twitter">
                  <Icon icon="logos:twitter" width={24} />
                </Button>
                <Button isIconOnly variant="light" aria-label="Instagram">
                  <Icon icon="logos:instagram-icon" width={24} />
                </Button>
                <Button isIconOnly variant="light" aria-label="LinkedIn">
                  <Icon icon="logos:linkedin-icon" width={24} />
                </Button>
              </div>
            </div>
          </div>
          
          <Divider className="my-6" />
          
          <p className="text-center text-default-500 text-sm">
            &copy; {new Date().getFullYear()} Система Управления Колледжем. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;