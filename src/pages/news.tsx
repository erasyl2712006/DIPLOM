import React from 'react';
    import { 
      Button, 
      Card, 
      CardBody, 
      CardFooter,
      Image,
      Divider 
    } from '@heroui/react';
    import { Icon } from '@iconify/react';
    import { MainNavbar } from '../components/main-navbar';

    const NewsPage: React.FC = () => {
      // Sample news data
      const newsList = [
        {
          id: 1,
          title: 'Открытие новой компьютерной лаборатории',
          content: 'Колледж с гордостью объявляет об открытии новой современной компьютерной лаборатории, оснащенной новейшими технологиями. Студенты теперь имеют доступ к самому современному оборудованию для обучения программированию и информационным технологиям.',
          date: '2023-06-15',
          imageId: '15'
        },
        {
          id: 2,
          title: 'Награды за академические достижения',
          content: 'Поздравляем всех студентов, получивших награды за академические достижения на ежегодной церемонии. Их усердная работа и преданность учебе являются примером для всех студентов нашего колледжа.',
          date: '2023-05-28',
          imageId: '16'
        },
        {
          id: 3,
          title: 'Предстоящая студенческая конференция',
          content: 'Приглашаем на предстоящую студенческую конференцию, посвященную инновациям и будущим технологиям в образовании. Конференция состоится в главном зале колледжа, регистрация открыта для всех студентов и преподавателей.',
          date: '2023-07-10',
          imageId: '17'
        },
        {
          id: 4,
          title: 'Новая образовательная программа',
          content: 'С нового учебного года в нашем колледже будет запущена новая образовательная программа по искусственному интеллекту и машинному обучению, разработанная в сотрудничестве с ведущими IT-компаниями.',
          date: '2023-06-05',
          imageId: '18'
        },
        {
          id: 5,
          title: 'Спортивные достижения',
          content: 'Наша баскетбольная команда заняла первое место в региональном чемпионате среди колледжей. Поздравляем спортсменов с заслуженной победой и благодарим за представление нашего колледжа!',
          date: '2023-06-02',
          imageId: '19'
        },
        {
          id: 6,
          title: 'День открытых дверей',
          content: 'Приглашаем всех желающих на День открытых дверей, который состоится в следующую субботу. Вы сможете познакомиться с преподавателями, узнать больше о наших образовательных программах и задать интересующие вопросы.',
          date: '2023-07-01',
          imageId: '20'
        }
      ];

      // Format date to Russian format
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      };

      return (
        <div className="min-h-screen flex flex-col bg-background">
          <MainNavbar />
          
          <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-2 text-center">Новости колледжа</h1>
            <p className="text-default-500 text-center mb-12">Будьте в курсе последних событий и мероприятий</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsList.map((news) => (
                <Card key={news.id} className="border border-divider">
                  <Image
                    removeWrapper
                    alt={news.title}
                    className="w-full h-48 object-cover"
                    src={`https://www.gov.kz/uploads/2025/1/5/e8051efa3d9a5b4ff643337520540cf3_original.49584.jpg`}
                  />
                  <CardBody>
                    <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                    <p className="text-default-500">
                      {news.content.length > 120 ? `${news.content.substring(0, 120)}...` : news.content}
                    </p>
                  </CardBody>
                  <CardFooter className="flex justify-between">
                    <Button variant="light">
                      Подробнее
                    </Button>
                    <p className="text-default-400 text-sm">
                      {formatDate(news.date)}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <footer className="bg-content3 py-8 mt-auto">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <p className="text-default-500 text-sm">
                  &copy; {new Date().getFullYear()} Система Управления Колледжем
                </p>
              </div>
            </div>
          </footer>
        </div>
      );
    };

    export default NewsPage;