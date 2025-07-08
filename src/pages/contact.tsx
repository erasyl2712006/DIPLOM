import React from 'react';
    import { 
      Button, 
      Card, 
      CardBody, 
      CardHeader,
      Divider,
      Input,
      Textarea
    } from '@heroui/react';
    import { Icon } from '@iconify/react';
    import { MainNavbar } from '../components/main-navbar';
    import { addToast } from '@heroui/react';

    const ContactPage: React.FC = () => {
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast({
          title: "Сообщение отправлено",
          description: "Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.",
          color: "success",
        });
      };

      return (
        <div className="min-h-screen flex flex-col bg-background">
          <MainNavbar />
          
          <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-2 text-center">Контакты</h1>
            <p className="text-default-500 text-center mb-12">Свяжитесь с нами для получения дополнительной информации</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="border border-divider">
                <CardHeader>
                  <h2 className="text-2xl font-bold">Связаться с нами</h2>
                </CardHeader>
                <Divider />
                <CardBody>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label="Ваше имя"
                      placeholder="Введите ваше имя"
                      labelPlacement="outside"
                      required
                    />
                    
                    <Input
                      label="Электронная почта"
                      placeholder="example@email.com"
                      labelPlacement="outside"
                      type="email"
                      required
                    />
                    
                    <Input
                      label="Тема"
                      placeholder="Укажите тему сообщения"
                      labelPlacement="outside"
                      required
                    />
                    
                    <Textarea
                      label="Сообщение"
                      placeholder="Введите ваше сообщение"
                      labelPlacement="outside"
                      minRows={4}
                      required
                    />
                    
                    <Button color="primary" type="submit">
                      Отправить сообщение
                    </Button>
                  </form>
                </CardBody>
              </Card>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Информация о контактах</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon icon="lucide:map-pin" className="text-primary" width={24} height={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Адрес</h3>
                        <p className="text-default-600">ул. Образования 123, Академгородок</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon icon="lucide:phone" className="text-primary" width={24} height={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Телефон</h3>
                        <p className="text-default-600">+7 (555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon icon="lucide:mail" className="text-primary" width={24} height={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-default-600">info@college.edu</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon icon="lucide:clock" className="text-primary" width={24} height={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Часы работы</h3>
                        <p className="text-default-600">Понедельник - Пятница: 8:00 - 18:00</p>
                        <p className="text-default-600">Суббота: 9:00 - 14:00</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-6">Социальные сети</h2>
                  
                  <div className="flex gap-4">
                    <Button isIconOnly variant="flat" aria-label="Facebook">
                      <Icon icon="logos:facebook" width={24} />
                    </Button>
                    <Button isIconOnly variant="flat" aria-label="Twitter">
                      <Icon icon="logos:twitter" width={24} />
                    </Button>
                    <Button isIconOnly variant="flat" aria-label="Instagram">
                      <Icon icon="logos:instagram-icon" width={24} />
                    </Button>
                    <Button isIconOnly variant="flat" aria-label="LinkedIn">
                      <Icon icon="logos:linkedin-icon" width={24} />
                    </Button>
                  </div>
                </div>
              </div>
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

    export default ContactPage;