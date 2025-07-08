import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Button,
  Input,
  Switch,
  Tabs,
  Tab,
  Select,
  SelectItem,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';

const AdminSettings: React.FC = () => {
  const [systemName, setSystemName] = React.useState<string>("Система Управления Колледжем");
  const [emailNotifications, setEmailNotifications] = React.useState<boolean>(true);
  const [autoBackups, setAutoBackups] = React.useState<boolean>(true);
  const [allowStudentRegistration, setAllowStudentRegistration] = React.useState<boolean>(false);
  const [maintenanceMode, setMaintenanceMode] = React.useState<boolean>(false);
  
  // Add save settings functionality
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving settings...");
    
    addToast({
      title: "Настройки сохранены",
      description: "Изменения успешно сохранены",
      color: "success",
    });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Настройки системы</h1>
        <p className="text-default-500">
          Управление настройками и конфигурацией системы
        </p>
      </div>

      <Tabs aria-label="Настройки">
        <Tab key="general" title="Общие">
          <Card className="border border-divider mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Общие настройки</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Название системы"
                  value={systemName}
                  onValueChange={setSystemName}
                  labelPlacement="outside"
                />
                
                <Select
                  label="Часовой пояс"
                  labelPlacement="outside"
                  defaultSelectedKeys={["Europe/Moscow"]}
                >
                  <SelectItem key="Europe/Moscow" value="Europe/Moscow">
                    Москва (GMT+3)
                  </SelectItem>
                  <SelectItem key="Europe/Kaliningrad" value="Europe/Kaliningrad">
                    Калининград (GMT+2)
                  </SelectItem>
                  <SelectItem key="Asia/Yekaterinburg" value="Asia/Yekaterinburg">
                    Екатеринбург (GMT+5)
                  </SelectItem>
                  <SelectItem key="Asia/Novosibirsk" value="Asia/Novosibirsk">
                    Новосибирск (GMT+7)
                  </SelectItem>
                </Select>
                
                <Select
                  label="Формат даты"
                  labelPlacement="outside"
                  defaultSelectedKeys={["dd.mm.yyyy"]}
                >
                  <SelectItem key="dd.mm.yyyy" value="dd.mm.yyyy">
                    ДД.ММ.ГГГГ (31.12.2023)
                  </SelectItem>
                  <SelectItem key="mm.dd.yyyy" value="mm.dd.yyyy">
                    ММ.ДД.ГГГГ (12.31.2023)
                  </SelectItem>
                  <SelectItem key="yyyy-mm-dd" value="yyyy-mm-dd">
                    ГГГГ-ММ-ДД (2023-12-31)
                  </SelectItem>
                </Select>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p>Уведомления по электронной почте</p>
                    <p className="text-xs text-default-500">Отправлять уведомления по электронной почте</p>
                  </div>
                  <Switch 
                    isSelected={emailNotifications}
                    onValueChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p>Автоматическое резервное копирование</p>
                    <p className="text-xs text-default-500">Еженедельное резервное копирование данных</p>
                  </div>
                  <Switch 
                    isSelected={autoBackups}
                    onValueChange={setAutoBackups}
                  />
                </div>
                
                <Button color="primary" type="submit">
                  Сохранить настройки
                </Button>
              </form>
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="security" title="Безопасность">
          <Card className="border border-divider mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Настройки безопасности</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p>Разрешить регистрацию студентов</p>
                    <p className="text-xs text-default-500">Позволить студентам регистрироваться самостоятельно</p>
                  </div>
                  <Switch 
                    isSelected={allowStudentRegistration}
                    onValueChange={setAllowStudentRegistration}
                  />
                </div>
                
                <Select
                  label="Срок действия пароля"
                  labelPlacement="outside"
                  defaultSelectedKeys={["90"]}
                >
                  <SelectItem key="30" value="30">30 дней</SelectItem>
                  <SelectItem key="60" value="60">60 дней</SelectItem>
                  <SelectItem key="90" value="90">90 дней</SelectItem>
                  <SelectItem key="never" value="never">Без срока</SelectItem>
                </Select>
                
                <Select
                  label="Блокировка учетной записи"
                  labelPlacement="outside"
                  defaultSelectedKeys={["5"]}
                >
                  <SelectItem key="3" value="3">После 3 неудачных попыток</SelectItem>
                  <SelectItem key="5" value="5">После 5 неудачных попыток</SelectItem>
                  <SelectItem key="10" value="10">После 10 неудачных попыток</SelectItem>
                  <SelectItem key="never" value="never">Никогда не блокировать</SelectItem>
                </Select>
                
                <div>
                  <Button color="primary" className="mr-2">
                    Сбросить все пароли
                  </Button>
                  <Button color="danger" variant="flat">
                    Удалить все сессии
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="maintenance" title="Обслуживание">
          <Card className="border border-divider mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Обслуживание системы</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p>Режим обслуживания</p>
                    <p className="text-xs text-default-500">Временно отключить доступ пользователей к системе</p>
                  </div>
                  <Switch 
                    isSelected={maintenanceMode}
                    onValueChange={setMaintenanceMode}
                    color="danger"
                  />
                </div>
                
                {maintenanceMode && (
                  <Textarea
                    label="Сообщение о техническом обслуживании"
                    placeholder="Введите сообщение, которое будет показано пользователям"
                    labelPlacement="outside"
                    defaultValue="Система временно недоступна в связи с техническим обслуживанием. Пожалуйста, попробуйте позже."
                    minRows={3}
                  />
                )}
                
                <div className="space-y-2">
                  <Button color="primary" className="mr-2" startContent={<Icon icon="lucide:download" />}>
                    Резервное копирование
                  </Button>
                  <Button color="warning" variant="flat" startContent={<Icon icon="lucide:refresh-cw" />}>
                    Очистить кэш
                  </Button>
                </div>
                
                <Card className="bg-danger-50">
                  <CardBody>
                    <h4 className="text-danger font-semibold mb-2">Опасная зона</h4>
                    <p className="text-sm mb-4">Эти действия невозможно отменить. Пожалуйста, будьте осторожны.</p>
                    <Button color="danger" variant="flat">
                      Сбросить систему
                    </Button>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminSettings;