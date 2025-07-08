import React from 'react';
    import { 
      Button, 
      Card, 
      CardBody, 
      CardHeader,
      Image,
      Divider 
    } from '@heroui/react';
    import { Icon } from '@iconify/react';
    import { MainNavbar } from '../components/main-navbar';

    const AboutPage: React.FC = () => {
      return (
        <div className="min-h-screen flex flex-col bg-background">
          <MainNavbar />
          
          <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">О нашем колледже</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">Наша история</h2>
                <p className="text-default-600 mb-4">
                  Наш колледж был основан в 1995 году с целью обеспечения качественного образования в области науки, технологии, инженерии и математики.
                </p>
                <p className="text-default-600 mb-4">
                  За 28 лет мы выпустили более 15,000 квалифицированных специалистов, которые успешно работают в различных отраслях по всей стране и за рубежом.
                </p>
              </div>
              <div>
                <Image
                  removeWrapper
                  alt="История колледжа"
                  className="w-full h-auto rounded-lg shadow-md"
                  src="https://avatars.mds.yandex.net/i?id=dde67292410e0e6e38533a3d7053c4eef304ed83-4577377-images-thumbs&n=13"
                />
              </div>
            </div>
            
            <Divider className="my-12" />
            
            <h2 className="text-3xl font-bold mb-8 text-center">Наши ценности</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="border border-divider">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon icon="lucide:book-open" className="text-primary" width={28} height={28} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">Качественное образование</h3>
                  <p className="text-default-600 text-center">
                    Мы стремимся обеспечить высокое качество образования, соответствующее международным стандартам.
                  </p>
                </CardBody>
              </Card>
              
              <Card className="border border-divider">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-success/10">
                      <Icon icon="lucide:users" className="text-success" width={28} height={28} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">Профессиональное развитие</h3>
                  <p className="text-default-600 text-center">
                    Мы помогаем студентам развивать профессиональные навыки и подготовиться к будущей карьере.
                  </p>
                </CardBody>
              </Card>
              
              <Card className="border border-divider">
                <CardBody className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-warning/10">
                      <Icon icon="lucide:lightbulb" className="text-warning" width={28} height={28} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">Инновации</h3>
                  <p className="text-default-600 text-center">
                    Мы внедряем новейшие технологии и методики обучения для обеспечения актуальности образования.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="bg-content3 py-8">
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

    export default AboutPage;