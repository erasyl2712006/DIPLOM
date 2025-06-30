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
  let greeting = 'Good morning';
  if (hours >= 12 && hours < 18) {
    greeting = 'Good afternoon';
  } else if (hours >= 18) {
    greeting = 'Good evening';
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{greeting}, Admin</h1>
        <p className="text-default-500">
          Here's what's happening in your college management system.
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
              <p className="text-sm text-default-500">Total Students</p>
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
              <p className="text-sm text-default-500">Total Teachers</p>
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
              <p className="text-sm text-default-500">Student Groups</p>
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
              <p className="text-sm text-default-500">Total Subjects</p>
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
              <h2 className="text-lg font-semibold">Recent Activities</h2>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <ul className="divide-y divide-divider">
                {/* Activity items */}
                {[
                  {
                    icon: 'lucide:user-plus',
                    color: 'bg-primary-100 text-primary',
                    title: 'New student registered',
                    description: 'Jessica Williams was added to CS-101 group',
                    time: '2 hours ago'
                  },
                  {
                    icon: 'lucide:calendar-plus',
                    color: 'bg-success-100 text-success',
                    title: 'Schedule updated',
                    description: 'Web Development class moved to room C305',
                    time: '4 hours ago'
                  },
                  {
                    icon: 'lucide:clipboard-edit',
                    color: 'bg-warning-100 text-warning',
                    title: 'Grade updated',
                    description: 'Dr. John Smith updated grades for Programming class',
                    time: '5 hours ago'
                  },
                  {
                    icon: 'lucide:file-plus',
                    color: 'bg-secondary-100 text-secondary',
                    title: 'New course material added',
                    description: 'Prof. Mary Johnson uploaded new materials for Database Systems',
                    time: '1 day ago'
                  },
                  {
                    icon: 'lucide:user-minus',
                    color: 'bg-danger-100 text-danger',
                    title: 'Student removed',
                    description: 'A student was removed from ME-101 group',
                    time: '2 days ago'
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
              <h2 className="text-lg font-semibold">System Notifications</h2>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              <ul className="divide-y divide-divider">
                {/* Notification items */}
                {[
                  {
                    title: 'System Update',
                    description: 'The system will be updated tonight at 2:00 AM. Expect 10 minutes of downtime.',
                    color: 'warning',
                    time: 'Today'
                  },
                  {
                    title: 'Data Backup',
                    description: 'Weekly data backup scheduled for Sunday, 12:00 AM.',
                    color: 'primary',
                    time: 'Tomorrow'
                  },
                  {
                    title: 'End of Semester',
                    description: 'Reminder: End of semester is in 2 weeks. Ensure all grades are submitted.',
                    color: 'danger',
                    time: '2 weeks'
                  },
                  {
                    title: 'New Feature',
                    description: 'Attendance tracking module will be available next week.',
                    color: 'success',
                    time: '1 week'
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