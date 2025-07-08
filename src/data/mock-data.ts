// Mock data for the application

// Student data
export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  groupId: string;
  avatar: string;
  dateOfBirth?: string;
  address?: string;
}

// Teacher data
export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  degree: string;
  experience: number;
  subjectIds: string[];
  avatar?: string;
}

// Group data
export interface Group {
  id: string;
  name: string;
  specialization: string;
  year: number;
  students: number;
}

// Subject data
export interface Subject {
  id: string;
  name: string;
  credits: number;
  description?: string;
}

// Schedule entry data
export interface ScheduleEntry {
  id: string;
  subjectId: string;
  teacherId: string;
  groupId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  roomNumber: string;
}

// Grade entry data
export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  grade: number;
  date: string;
  comment?: string;
}

// Attendance record
export interface AttendanceRecord {
  id: string;
  studentId: string;
  scheduleEntryId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

// Material data
export interface Material {
  id: string;
  title: string;
  description?: string;
  type: 'document' | 'video' | 'link' | 'image';
  subjectId: string;
  uploadedBy: string;
  uploadDate: string;
  fileUrl?: string;
  groupIds: string[];
}

// Message data
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

// Sample data
export const students: Student[] = [
  {
    id: 'st1',
    name: 'Иванов Иван',
    email: 'ivanov@student.edu',
    phone: '+7 (999) 123-4567',
    dateOfBirth: '2000-05-15',
    groupId: 'g1',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=11'
  },
  {
    id: 'st2',
    name: 'Петрова Мария',
    email: 'petrova@student.edu',
    phone: '+7 (999) 234-5678',
    groupId: 'g1',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=12'
  },
  {
    id: 'st3',
    name: 'Сидоров Алексей',
    email: 'sidorov@student.edu',
    phone: '+7 (999) 345-6789',
    groupId: 'g2',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=13'
  },
  {
    id: 'st4',
    name: 'Кузнецова Елена',
    email: 'kuznetsova@student.edu',
    groupId: 'g3',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=14'
  },
  {
    id: 'st5',
    name: 'Смирнов Дмитрий',
    email: 'smirnov@student.edu',
    groupId: 'g4',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=15'
  }
];

export const teachers: Teacher[] = [
  {
    id: 't1',
    name: 'Иванова Елена Петровна',
    email: 'ivanova@teacher.edu',
    phone: '+7 (999) 456-7890',
    degree: 'Кандидат наук',
    experience: 12,
    subjectIds: ['s1', 's2'],
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=21'
  },
  {
    id: 't2',
    name: 'Петров Сергей Иванович',
    email: 'petrov@teacher.edu',
    phone: '+7 (999) 567-8901',
    degree: 'Доктор наук',
    experience: 20,
    subjectIds: ['s3', 's4'],
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=22'
  },
  {
    id: 't3',
    name: 'Сидорова Анна Михайловна',
    email: 'sidorova@teacher.edu',
    phone: '+7 (999) 678-9012',
    degree: 'Кандидат наук',
    experience: 8,
    subjectIds: ['s5', 's6'],
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=23'
  }
];

export const groups: Group[] = [
  { id: 'g1', name: 'CS-101', specialization: 'Компьютерные науки', year: 1 },
  { id: 'g2', name: 'CS-201', specialization: 'Компьютерные науки', year: 2 },
  { id: 'g3', name: 'ME-101', specialization: 'Машиностроение', year: 1 },
  { id: 'g4', name: 'EE-101', specialization: 'Электротехника', year: 1 }
];

export const subjects: Subject[] = [
  { id: 's1', name: 'Программирование', credits: 4 },
  { id: 's2', name: 'Базы данных', credits: 3 },
  { id: 's3', name: 'Математика', credits: 5 },
  { id: 's4', name: 'Физика', credits: 4 },
  { id: 's5', name: 'Информатика', credits: 3 },
  { id: 's6', name: 'Английский язык', credits: 2 }
];

export const scheduleEntries: ScheduleEntry[] = [
  // Monday
  {
    id: 'sch1',
    subjectId: 's1',
    teacherId: 't1',
    groupId: 'g1',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:30',
    roomNumber: 'A101'
  },
  {
    id: 'sch2',
    subjectId: 's2',
    teacherId: 't1',
    groupId: 'g1',
    dayOfWeek: 1,
    startTime: '11:00',
    endTime: '12:30',
    roomNumber: 'A102'
  },
  // Tuesday
  {
    id: 'sch3',
    subjectId: 's3',
    teacherId: 't2',
    groupId: 'g1',
    dayOfWeek: 2,
    startTime: '09:00',
    endTime: '10:30',
    roomNumber: 'B201'
  },
  // Wednesday
  {
    id: 'sch4',
    subjectId: 's1',
    teacherId: 't1',
    groupId: 'g2',
    dayOfWeek: 3,
    startTime: '13:00',
    endTime: '14:30',
    roomNumber: 'A101'
  },
  // Thursday
  {
    id: 'sch5',
    subjectId: 's4',
    teacherId: 't2',
    groupId: 'g1',
    dayOfWeek: 4,
    startTime: '09:00',
    endTime: '10:30',
    roomNumber: 'C301'
  },
  // Friday
  {
    id: 'sch6',
    subjectId: 's5',
    teacherId: 't3',
    groupId: 'g1',
    dayOfWeek: 5,
    startTime: '11:00',
    endTime: '12:30',
    roomNumber: 'C305'
  }
];

export const gradeEntries: Grade[] = [
  {
    id: 'g1',
    studentId: 'st1',
    subjectId: 's1',
    teacherId: 't1',
    grade: 5,
    date: '2023-09-15',
    comment: 'Отлично справился с заданием'
  },
  {
    id: 'g2',
    studentId: 'st1',
    subjectId: 's2',
    teacherId: 't1',
    grade: 4,
    date: '2023-09-20'
  },
  {
    id: 'g3',
    studentId: 'st1',
    subjectId: 's3',
    teacherId: 't2',
    grade: 3,
    date: '2023-09-25',
    comment: 'Требуется больше работы над материалом'
  },
  {
    id: 'g4',
    studentId: 'st2',
    subjectId: 's1',
    teacherId: 't1',
    grade: 4,
    date: '2023-09-15'
  },
  {
    id: 'g5',
    studentId: 'st2',
    subjectId: 's2',
    teacherId: 't1',
    grade: 5,
    date: '2023-09-20',
    comment: 'Прекрасное решение задачи'
  }
];

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'a1',
    studentId: 'st1',
    scheduleEntryId: 'sch1',
    date: '2023-09-04',
    status: 'present'
  },
  {
    id: 'a2',
    studentId: 'st1',
    scheduleEntryId: 'sch2',
    date: '2023-09-04',
    status: 'present'
  },
  {
    id: 'a3',
    studentId: 'st1',
    scheduleEntryId: 'sch3',
    date: '2023-09-05',
    status: 'late',
    notes: 'Опоздал на 10 минут'
  },
  {
    id: 'a4',
    studentId: 'st2',
    scheduleEntryId: 'sch1',
    date: '2023-09-04',
    status: 'absent',
    notes: 'Болезнь'
  },
  {
    id: 'a5',
    studentId: 'st2',
    scheduleEntryId: 'sch2',
    date: '2023-09-04',
    status: 'absent',
    notes: 'Болезнь'
  }
];

export const materials: Material[] = [
  {
    id: 'm1',
    title: 'Введение в программирование',
    description: 'Основные концепции и принципы программирования',
    type: 'document',
    subjectId: 's1',
    uploadedBy: 't1',
    uploadDate: '2023-08-25',
    fileUrl: 'https://example.com/file1.pdf',
    groupIds: ['g1', 'g2']
  },
  {
    id: 'm2',
    title: 'SQL для начинающих',
    description: 'Базовые запросы SQL и работа с базами данных',
    type: 'document',
    subjectId: 's2',
    uploadedBy: 't1',
    uploadDate: '2023-08-26',
    fileUrl: 'https://example.com/file2.pdf',
    groupIds: ['g1']
  },
  {
    id: 'm3',
    title: 'Видеолекция: Алгоритмы сортировки',
    description: 'Обзор алгоритмов сортировки и их применение',
    type: 'video',
    subjectId: 's1',
    uploadedBy: 't1',
    uploadDate: '2023-09-01',
    fileUrl: 'https://example.com/video1.mp4',
    groupIds: ['g2']
  }
];

export const messages: Message[] = [
  {
    id: 'msg1',
    senderId: 'st1',
    receiverId: 't1',
    content: 'Здравствуйте, когда будет доступно задание по программированию?',
    timestamp: '2023-09-10T10:30:00',
    isRead: true
  },
  {
    id: 'msg2',
    senderId: 't1',
    receiverId: 'st1',
    content: 'Здравствуйте! Задание будет доступно завтра в системе. Не забудьте проверить.',
    timestamp: '2023-09-10T11:15:00',
    isRead: true
  },
  {
    id: 'msg3',
    senderId: 'st2',
    receiverId: 't1',
    content: 'Добрый день, можно ли перенести сдачу проекта на следующую неделю?',
    timestamp: '2023-09-11T09:45:00',
    isRead: false
  }
];

// Helper functions
export const getStudentById = (id: string): Student | undefined => {
  return students.find(student => student.id === id);
};

export const getScheduleEntryById = (id: string) => {
  return scheduleEntries.find(entry => entry.id === id);
};

export const getStudentAttendanceSummary = (studentId: string) => {
  const records = attendanceRecords.filter(record => record.studentId === studentId);
  
  return {
    total: records.length,
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    excused: records.filter(r => r.status === 'excused').length
  };
};

export const getTeacherSchedule = (teacherId: string) => {
  return scheduleEntries.filter(entry => entry.teacherId === teacherId);
};

export const getStudentSchedule = (studentId: string) => {
  const student = students.find(s => s.id === studentId);
  if (!student) return [];
  
  return scheduleEntries.filter(entry => entry.groupId === student.groupId);
};

export const getTeacherGrades = (teacherId: string) => {
  return gradeEntries.filter(grade => grade.teacherId === teacherId);
};

export const getStudentGrades = (studentId: string) => {
  return gradeEntries.filter(grade => grade.studentId === studentId);
};

export const getTeacherById = (teacherId: string) => {
  return teachers.find(teacher => teacher.id === teacherId);
};

export const getDayName = (dayNumber: number): string => {
  const days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
  ];
  
  return days[dayNumber] || '';
};

export const getGroupById = (groupId: string) => {
  return groups.find(group => group.id === groupId);
};

export const getSubjectById = (subjectId: string) => {
  return subjects.find(subject => subject.id === subjectId);
};