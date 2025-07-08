import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Chip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { students, teachers, groups, subjects } from '../../data/mock-data';

const AdminDashboard: React.FC = () => {
  // Get current date for the greeting
  const currentDate = new Date();
  const hours = currentDate.getHours();
  
  // Determine appropriate greeting based on time of day
  let greeting = 'Доброе утро';
  if (hours >= 12 && hours < 18) {
    greeting = 'Добрый день';
  } else if (hours >= 18) {
    greeting = 'Добрый вечер';
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{greeting}, Администратор</h1>
        <p className="text-default-500">
          Вот что происходит в системе управления колледжем.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-divider">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-primary-100 text-primary">
              <Icon icon="lucide:users" width={24} height={24} />
            </div>
            <div>
              <p className="text-sm text-default-500">Всего студентов</p>
              <h3 className="text-2xl font-bold">{students.length}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="border border-divider">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-success-100 text-success">
              <Icon icon="lucide:book-open" width={24} height={24} />
            </div>
            <div>
              <p className="text-sm text-default-500">Всего учителей</p>
              <h3 className="text-2xl font-bold">{teachers.length}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="border border-divider">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-warning-100 text-warning">
              <Icon icon="lucide:layers" width={24} height={24} />
            </div>
            <div>
              <p className="text-sm text-default-500">Группы студентов</p>
              <h3 className="text-2xl font-bold">{groups.length}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="border border-divider">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary">
              <Icon icon="lucide:book" width={24} height={24} />
            </div>
            <div>
              <p className="text-sm text-default-500">Всего предметов</p>
              <h3 className="text-2xl font-bold">{subjects.length}</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="border border-divider">
            <CardHeader className="flex gap-3">
              <h2 className="text-lg font-semibold">Недавняя активность</h2>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <ul className="divide-y divide-divider">
                {/* Activity items */}
                {[
                  {
                    icon: 'lucide:user-plus',
                    color: 'bg-primary-100 text-primary',
                    title: 'Зарегистрирован новый студент',
                    description: 'Иванова Мария добавлена в группу ИТ-101',
                    time: '2 часа назад'
                  },
                  {
                    icon: 'lucide:calendar-plus',
                    color: 'bg-success-100 text-success',
                    title: 'Расписание обновлено',
                    description: 'Класс Информатика перенесен в аудиторию C305',
                    time: '4 часа назад'
                  },
                  {
                    icon: 'lucide:clipboard-edit',
                    color: 'bg-warning-100 text-warning',
                    title: 'Оценки обновлены',
                    description: 'Доктор Джон Смит обновил оценки для класса Программирование',
                    time: '5 часов назад'
                  },
                  {
                    icon: 'lucide:file-plus',
                    color: 'bg-secondary-100 text-secondary',
                    title: 'Добавлен новый материал',
                    description: 'Преподаватель Мария Джонсон загрузила новые материалы для предмета Базы данных',
                    time: '1 день назад'
                  },
                  {
                    icon: 'lucide:user-minus',
                    color: 'bg-danger-100 text-danger',
                    title: 'Студент удален',
                    description: 'Студент был удален из группы ME-101',
                    time: '2 дня назад'
                  }
                ].map((activity, index) => (
                  <li key={index} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${activity.color} flex-shrink-0`}>
                        <Icon icon={activity.icon} width={20} height={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-default-500 text-sm">{activity.description}</p>
                        <p className="text-xs text-default-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* System Notifications */}
        <div>
          <Card className="border border-divider">
            <CardHeader className="flex gap-3">
              <h2 className="text-lg font-semibold">Системные уведомления</h2>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <ul className="divide-y divide-divider">
                {/* Notification items */}
                {[
                  {
                    title: 'Обновление системы',
                    description: 'Система будет обновлена сегодня в 2:00. Ожидается 10 минут простоя.',
                    color: 'warning',
                    time: 'Сегодня'
                  },
                  {
                    title: 'Бэкап данных',
                    description: 'Бэкап данных будет проводиться на воскресенье, в 12:00.',
                    color: 'primary',
                    time: 'Завтра'
                  },
                  {
                    title: 'Конец семестра',
                    description: 'Помните: конец семестра через 2 недели. Убедитесь, что все оценки сданы.',
                    color: 'danger',
                    time: '2 недели'
                  },
                  {
                    title: 'Новая функция',
                    description: 'Модуль отслеживания присутствия будет доступен в следующей неделе.',
                    color: 'success',
                    time: '1 неделя'
                  }
                ].map((notification, index) => (
                  <li key={index} className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Chip color={notification.color as any} size="sm">{notification.time}</Chip>
                      </div>
                      <p className="text-default-500 text-sm">{notification.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;