// Mock data for the application

// Student data
export interface Student {
  id: string;
  name: string;
  email: string;
  groupId: string;
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

// Teacher data
export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjectIds: string[];
  avatar?: string;
  phone?: string;
  degree?: string;
  experience?: number;
}

// Group data
export interface Group {
  id: string;
  name: string;
  year: number;
  specialization: string;
}

// Subject data
export interface Subject {
  id: string;
  name: string;
  description?: string;
  credits: number;
}

// Schedule entry data
export interface ScheduleEntry {
  id: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5 | 6 | 0; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  subjectId: string;
  teacherId: string;
  groupId: string;
  roomNumber: string;
}

// Grade entry data
export interface GradeEntry {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  date: string; // YYYY-MM-DD format
  grade: number; // 1-5 scale
  comment?: string;
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

// Material data
export interface Material {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  uploadedBy: string;
  uploadDate: string;
  subjectId: string;
  type: 'document' | 'video' | 'link' | 'image';
  groupIds: string[];
}

// Attendance record data
export interface AttendanceRecord {
  id: string;
  studentId: string;
  scheduleEntryId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  recordedBy: string;
}

// Mock data

export const groups: Group[] = [
  { id: "g1", name: "CS-101", year: 1, specialization: "Computer Science" },
  { id: "g2", name: "CS-201", year: 2, specialization: "Computer Science" },
  { id: "g3", name: "ME-101", year: 1, specialization: "Mechanical Engineering" },
  { id: "g4", name: "EE-101", year: 1, specialization: "Electrical Engineering" },
];

export const subjects: Subject[] = [
  { id: "s1", name: "Introduction to Programming", credits: 5, description: "Basic programming concepts using Python" },
  { id: "s2", name: "Data Structures", credits: 6, description: "Fundamental data structures and algorithms" },
  { id: "s3", name: "Database Systems", credits: 5, description: "Database design and SQL" },
  { id: "s4", name: "Web Development", credits: 4, description: "Frontend and backend web technologies" },
  { id: "s5", name: "Operating Systems", credits: 5, description: "OS principles and concepts" },
  { id: "s6", name: "Computer Networks", credits: 4, description: "Network protocols and architecture" },
];

export const teachers: Teacher[] = [
  { 
    id: "t1", 
    name: "Dr. John Smith", 
    email: "john.smith@college.edu", 
    subjectIds: ["s1", "s2"], 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=10", 
    phone: "+1 555-1234",
    degree: "Ph.D. in Computer Science",
    experience: 10
  },
  { 
    id: "t2", 
    name: "Prof. Mary Johnson", 
    email: "mary.johnson@college.edu", 
    subjectIds: ["s3", "s5"], 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=11",
    phone: "+1 555-2345",
    degree: "Ph.D. in Information Systems",
    experience: 15
  },
  { 
    id: "t3", 
    name: "Dr. Robert Davis", 
    email: "robert.davis@college.edu", 
    subjectIds: ["s4", "s6"], 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=12",
    phone: "+1 555-3456",
    degree: "Ph.D. in Software Engineering",
    experience: 8
  },
  { 
    id: "t4", 
    name: "Prof. Elizabeth Taylor", 
    email: "elizabeth.taylor@college.edu", 
    subjectIds: ["s2", "s5"], 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=13",
    phone: "+1 555-4567",
    degree: "Ph.D. in Data Science",
    experience: 12
  },
];

export const students: Student[] = [
  { 
    id: "st1", 
    name: "Alex Johnson", 
    email: "alex.j@college.edu", 
    groupId: "g1", 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=20",
    phone: "+1 555-5678",
    address: "123 Campus Street, Apt 4B",
    dateOfBirth: "2003-05-12"
  },
  { 
    id: "st2", 
    name: "Jessica Williams", 
    email: "jessica.w@college.edu", 
    groupId: "g1", 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=21",
    phone: "+1 555-6789",
    address: "456 University Ave",
    dateOfBirth: "2002-08-24"
  },
  { 
    id: "st3", 
    name: "Michael Brown", 
    email: "michael.b@college.edu", 
    groupId: "g2", 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=22",
    phone: "+1 555-7890",
    address: "789 College Blvd",
    dateOfBirth: "2001-12-10"
  },
  { 
    id: "st4", 
    name: "Emily Davis", 
    email: "emily.d@college.edu", 
    groupId: "g2", 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=23",
    phone: "+1 555-8901",
    address: "101 Academia Street",
    dateOfBirth: "2002-03-18"
  },
  { 
    id: "st5", 
    name: "David Wilson", 
    email: "david.w@college.edu", 
    groupId: "g3", 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=24",
    phone: "+1 555-9012",
    address: "202 Learning Lane",
    dateOfBirth: "2003-07-02"
  },
  { 
    id: "st6", 
    name: "Sophia Martinez", 
    email: "sophia.m@college.edu", 
    groupId: "g4", 
    avatar: "https://img.heroui.chat/image/avatar?w=200&h=200&u=25",
    phone: "+1 555-0123",
    address: "303 Education Drive",
    dateOfBirth: "2002-11-14"
  },
];

export const scheduleEntries: ScheduleEntry[] = [
  {
    id: "sch1",
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "10:30",
    subjectId: "s1",
    teacherId: "t1",
    groupId: "g1",
    roomNumber: "A101"
  },
  {
    id: "sch2",
    dayOfWeek: 1, // Monday
    startTime: "11:00",
    endTime: "12:30",
    subjectId: "s3",
    teacherId: "t2",
    groupId: "g1",
    roomNumber: "B204"
  },
  {
    id: "sch3",
    dayOfWeek: 2, // Tuesday
    startTime: "09:00",
    endTime: "10:30",
    subjectId: "s2",
    teacherId: "t1",
    groupId: "g1",
    roomNumber: "A101"
  },
  {
    id: "sch4",
    dayOfWeek: 2, // Tuesday
    startTime: "11:00",
    endTime: "12:30",
    subjectId: "s4",
    teacherId: "t3",
    groupId: "g1",
    roomNumber: "C305"
  },
  {
    id: "sch5",
    dayOfWeek: 3, // Wednesday
    startTime: "09:00",
    endTime: "10:30",
    subjectId: "s5",
    teacherId: "t2",
    groupId: "g1",
    roomNumber: "B204"
  },
  {
    id: "sch6",
    dayOfWeek: 3, // Wednesday
    startTime: "11:00",
    endTime: "12:30",
    subjectId: "s6",
    teacherId: "t3",
    groupId: "g1",
    roomNumber: "C305"
  },
  {
    id: "sch7",
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "10:30",
    subjectId: "s2",
    teacherId: "t4",
    groupId: "g2",
    roomNumber: "A102"
  },
  {
    id: "sch8",
    dayOfWeek: 2, // Tuesday
    startTime: "13:00",
    endTime: "14:30",
    subjectId: "s5",
    teacherId: "t4",
    groupId: "g2",
    roomNumber: "B205"
  },
];

export const gradeEntries: GradeEntry[] = [
  {
    id: "g1",
    studentId: "st1",
    subjectId: "s1",
    teacherId: "t1",
    date: "2023-09-15",
    grade: 5,
    comment: "Excellent work on the programming assignment"
  },
  {
    id: "g2",
    studentId: "st1",
    subjectId: "s3",
    teacherId: "t2",
    date: "2023-09-18",
    grade: 4,
    comment: "Good understanding of database concepts"
  },
  {
    id: "g3",
    studentId: "st2",
    subjectId: "s1",
    teacherId: "t1",
    date: "2023-09-15",
    grade: 4,
    comment: "Good programming skills"
  },
  {
    id: "g4",
    studentId: "st2",
    subjectId: "s3",
    teacherId: "t2",
    date: "2023-09-18",
    grade: 5,
    comment: "Excellent SQL skills"
  },
  {
    id: "g5",
    studentId: "st3",
    subjectId: "s2",
    teacherId: "t4",
    date: "2023-09-16",
    grade: 4,
    comment: "Good understanding of data structures"
  },
  {
    id: "g6",
    studentId: "st3",
    subjectId: "s5",
    teacherId: "t4",
    date: "2023-09-19",
    grade: 3,
    comment: "Needs more work on OS concepts"
  },
  {
    id: "g7",
    studentId: "st1",
    subjectId: "s2",
    teacherId: "t1",
    date: "2023-09-22",
    grade: 4,
    comment: "Good algorithms implementation"
  },
  {
    id: "g8",
    studentId: "st2",
    subjectId: "s4",
    teacherId: "t3",
    date: "2023-09-21",
    grade: 5,
    comment: "Excellent web application project"
  },
];

// Add mock messages
export const messages: Message[] = [
  {
    id: 'm1',
    senderId: 't1',
    receiverId: 'st1',
    content: 'Пожалуйста, не забудьте подготовить презентацию к следующему уроку',
    timestamp: '2023-10-10T10:15:00',
    isRead: true
  },
  {
    id: 'm2',
    senderId: 'st1',
    receiverId: 't1',
    content: 'Презентация готова, я пришлю ее вам перед уроком',
    timestamp: '2023-10-10T14:30:00',
    isRead: false
  },
  {
    id: 'm3',
    senderId: 't2',
    receiverId: 'st1',
    content: 'Ваша последняя работа была очень хорошей. Продолжайте в том же духе!',
    timestamp: '2023-10-09T15:45:00',
    isRead: true
  },
  {
    id: 'm4',
    senderId: 't1',
    receiverId: 'st2',
    content: 'Мне нужно обсудить с вами вашу последнюю работу. Можете ли вы остаться после урока?',
    timestamp: '2023-10-08T09:20:00',
    isRead: true
  },
  {
    id: 'm5',
    senderId: '1', // admin
    receiverId: 't1',
    content: 'Напоминаю о собрании преподавателей в эту пятницу в 15:00',
    timestamp: '2023-10-11T08:00:00',
    isRead: false
  }
];

// Add mock materials
export const materials: Material[] = [
  {
    id: 'mat1',
    title: 'Введение в программирование: Лекция 1',
    description: 'Обзор основных концепций программирования и алгоритмов',
    uploadedBy: 't1',
    uploadDate: '2023-09-01',
    subjectId: 's1',
    type: 'document',
    groupIds: ['g1']
  },
  {
    id: 'mat2',
    title: 'Структуры данных: презентация',
    description: 'Слайды по основным структурам данных и их реализации',
    uploadedBy: 't1',
    uploadDate: '2023-09-05',
    subjectId: 's2',
    type: 'document',
    groupIds: ['g1', 'g2']
  },
  {
    id: 'mat3',
    title: 'SQL: видеоурок',
    description: 'Видео демонстрация SQL запросов и их применение',
    uploadedBy: 't2',
    uploadDate: '2023-09-10',
    subjectId: 's3',
    type: 'video',
    groupIds: ['g1']
  },
  {
    id: 'mat4',
    title: 'Введение в Web разработку',
    description: 'Материалы для изучения основ HTML, CSS и JavaScript',
    uploadedBy: 't3',
    uploadDate: '2023-09-15',
    subjectId: 's4',
    type: 'document',
    groupIds: ['g1']
  },
  {
    id: 'mat5',
    title: 'Дополнительные ресурсы по операционным системам',
    description: 'Ссылки на полезные ресурсы для углубленного изучения',
    uploadedBy: 't2',
    uploadDate: '2023-09-20',
    subjectId: 's5',
    type: 'link',
    groupIds: ['g2']
  }
];

// Add mock attendance records
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'att1',
    studentId: 'st1',
    scheduleEntryId: 'sch1',
    date: '2023-10-02',
    status: 'present',
    recordedBy: 't1'
  },
  {
    id: 'att2',
    studentId: 'st2',
    scheduleEntryId: 'sch1',
    date: '2023-10-02',
    status: 'present',
    recordedBy: 't1'
  },
  {
    id: 'att3',
    studentId: 'st1',
    scheduleEntryId: 'sch3',
    date: '2023-10-03',
    status: 'late',
    notes: 'Опоздал на 10 минут',
    recordedBy: 't1'
  },
  {
    id: 'att4',
    studentId: 'st2',
    scheduleEntryId: 'sch3',
    date: '2023-10-03',
    status: 'present',
    recordedBy: 't1'
  },
  {
    id: 'att5',
    studentId: 'st1',
    scheduleEntryId: 'sch5',
    date: '2023-10-04',
    status: 'absent',
    notes: 'Не был по болезни',
    recordedBy: 't2'
  },
  {
    id: 'att6',
    studentId: 'st2',
    scheduleEntryId: 'sch5',
    date: '2023-10-04',
    status: 'present',
    recordedBy: 't2'
  },
  {
    id: 'att7',
    studentId: 'st3',
    scheduleEntryId: 'sch7',
    date: '2023-10-02',
    status: 'excused',
    notes: 'Освобожден по семейным обстоятельствам',
    recordedBy: 't4'
  },
  {
    id: 'att8',
    studentId: 'st4',
    scheduleEntryId: 'sch7',
    date: '2023-10-02',
    status: 'present',
    recordedBy: 't4'
  }
];

// Helper function to get a subject by ID
export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find(subject => subject.id === id);
};

// Helper function to get a teacher by ID
export const getTeacherById = (id: string): Teacher | undefined => {
  return teachers.find(teacher => teacher.id === id);
};

// Helper function to get a student by ID
export const getStudentById = (id: string): Student | undefined => {
  return students.find(student => student.id === id);
};

// Helper function to get a group by ID
export const getGroupById = (id: string): Group | undefined => {
  return groups.find(group => group.id === id);
};

// Helper function to get schedule entries for a student (via their group)
export const getStudentSchedule = (studentId: string): ScheduleEntry[] => {
  const student = getStudentById(studentId);
  if (!student) return [];
  
  return scheduleEntries.filter(entry => entry.groupId === student.groupId);
};

// Helper function to get schedule entries for a teacher
export const getTeacherSchedule = (teacherId: string): ScheduleEntry[] => {
  return scheduleEntries.filter(entry => entry.teacherId === teacherId);
};

// Helper function to get grades for a student
export const getStudentGrades = (studentId: string): GradeEntry[] => {
  return gradeEntries.filter(entry => entry.studentId === studentId);
};

// Helper function to get grades entered by a teacher
export const getTeacherGrades = (teacherId: string): GradeEntry[] => {
  return gradeEntries.filter(entry => entry.teacherId === teacherId);
};

// Helper function to get day name from day number
export const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
};

// Helper function to format time (24h format)
export const formatTime = (time: string): string => {
  return time;
};

// Helper function to get messages for a user
export const getMessages = (userId: string): Message[] => {
  return messages.filter(msg => msg.senderId === userId || msg.receiverId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Helper function to get materials for a user
export const getMaterialsForUser = (userId: string, role: 'student' | 'teacher' | 'admin'): Material[] => {
  if (role === 'admin') {
    return materials;
  } else if (role === 'teacher') {
    return materials.filter(mat => mat.uploadedBy === userId);
  } else {
    // For students, get materials based on their group
    const student = getStudentById(userId);
    if (!student) return [];
    return materials.filter(mat => mat.groupIds.includes(student.groupId));
  }
};

// Helper function to get attendance records for a student
export const getAttendanceForStudent = (studentId: string): AttendanceRecord[] => {
  return attendanceRecords.filter(record => record.studentId === studentId);
};

// Helper function to get attendance records for a class
export const getAttendanceForClass = (scheduleEntryId: string, date: string): AttendanceRecord[] => {
  return attendanceRecords.filter(record => record.scheduleEntryId === scheduleEntryId && record.date === date);
};

// Helper function to get student attendance summary
export const getStudentAttendanceSummary = (studentId: string): {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
} => {
  const records = getAttendanceForStudent(studentId);
  
  return {
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    excused: records.filter(r => r.status === 'excused').length,
    total: records.length
  };
};