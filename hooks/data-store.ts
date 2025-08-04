import createContextHook from '@nkzw/create-context-hook';
import { useState } from 'react';
import { School, Class, Student, Grade, Attendance, Message, Notification } from '@/types/auth';

// Mock data for demo purposes
const mockSchools: School[] = [
  {
    id: '1',
    name: 'Central High School',
    address: '123 Education St, City',
    phone: '+1234567890',
    email: 'info@centralhigh.edu',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=200&auto=format&fit=crop',
    adminId: '2',
    isActive: true,
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Westside Elementary',
    address: '456 Learning Ave, Town',
    phone: '+0987654321',
    email: 'contact@westside.edu',
    logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=200&auto=format&fit=crop',
    adminId: '2',
    isActive: true,
    createdAt: Date.now(),
  },
];

const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Mathematics - Grade 10',
    schoolId: '1',
    teacherId: '3',
    schedule: 'Mon, Wed, Fri 9:00 AM - 10:30 AM',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Science - Grade 10',
    schoolId: '1',
    teacherId: '3',
    schedule: 'Tue, Thu 10:45 AM - 12:15 PM',
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'History - Grade 10',
    schoolId: '1',
    teacherId: '3',
    schedule: 'Mon, Wed 1:00 PM - 2:30 PM',
    createdAt: Date.now(),
  },
];

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    schoolId: '1',
    classId: '1',
    parentId: '4',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Sam Wilson',
    schoolId: '1',
    classId: '1',
    parentId: '4',
    createdAt: Date.now(),
  },
];

const mockGrades: Grade[] = [
  {
    id: '1',
    studentId: '1',
    classId: '1',
    subject: 'Mathematics',
    score: 85,
    maxScore: 100,
    date: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    createdAt: Date.now(),
  },
  {
    id: '2',
    studentId: '1',
    classId: '2',
    subject: 'Science',
    score: 92,
    maxScore: 100,
    date: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    createdAt: Date.now(),
  },
  {
    id: '3',
    studentId: '2',
    classId: '1',
    subject: 'Mathematics',
    score: 78,
    maxScore: 100,
    date: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    createdAt: Date.now(),
  },
];

const mockAttendance: Attendance[] = [
  {
    id: '1',
    studentId: '1',
    classId: '1',
    date: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    status: 'present',
    createdAt: Date.now(),
  },
  {
    id: '2',
    studentId: '1',
    classId: '2',
    date: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    status: 'present',
    createdAt: Date.now(),
  },
  {
    id: '3',
    studentId: '2',
    classId: '1',
    date: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    status: 'absent',
    createdAt: Date.now(),
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '3', // Teacher
    receiverId: '4', // Parent
    content: 'Hello, I wanted to discuss Alex\'s progress in Mathematics class.',
    read: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
  },
  {
    id: '2',
    senderId: '4', // Parent
    receiverId: '3', // Teacher
    content: 'Thank you for reaching out. When would be a good time to meet?',
    read: true,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
  },
  {
    id: '3',
    senderId: '3', // Teacher
    receiverId: '4', // Parent
    content: 'How about tomorrow after school at 3:30 PM?',
    read: false,
    createdAt: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Grade Posted',
    message: 'A new grade has been posted for Mathematics class.',
    userId: '4', // Parent
    read: false,
    createdAt: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
  },
  {
    id: '2',
    title: 'Upcoming Parent-Teacher Meeting',
    message: 'Don\'t forget the parent-teacher meeting on Friday at 5 PM.',
    userId: '4', // Parent
    read: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
  },
];

export const [DataContext, useData] = createContextHook(() => {
  const [schools, setSchools] = useState<School[]>(mockSchools);
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState<boolean>(false);

  // School methods
  const getSchools = () => schools;
  const getSchoolById = (id: string) => schools.find(school => school.id === id);
  const addSchool = (school: Omit<School, 'id' | 'createdAt'>) => {
    const newSchool: School = {
      ...school,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setSchools([...schools, newSchool]);
    return newSchool;
  };

  // Class methods
  const getClasses = (schoolId?: string) => 
    schoolId ? classes.filter(c => c.schoolId === schoolId) : classes;
  const getClassById = (id: string) => classes.find(c => c.id === id);
  const addClassToSchool = (classData: Omit<Class, 'id' | 'createdAt'>) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setClasses([...classes, newClass]);
    return newClass;
  };

  // Student methods
  const getStudents = (classId?: string) => 
    classId ? students.filter(s => s.classId === classId) : students;
  const getStudentById = (id: string) => students.find(s => s.id === id);
  const getStudentsByParent = (parentId: string) => 
    students.filter(s => s.parentId === parentId);
  const addStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setStudents([...students, newStudent]);
    return newStudent;
  };

  // Grade methods
  const getGradesByStudent = (studentId: string) => 
    grades.filter(g => g.studentId === studentId);
  const getGradesByClass = (classId: string) => 
    grades.filter(g => g.classId === classId);
  const addGrade = (grade: Omit<Grade, 'id' | 'createdAt'>) => {
    const newGrade: Grade = {
      ...grade,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setGrades([...grades, newGrade]);
    return newGrade;
  };

  // Attendance methods
  const getAttendanceByStudent = (studentId: string) => 
    attendance.filter(a => a.studentId === studentId);
  const getAttendanceByClass = (classId: string, date?: number) => 
    attendance.filter(a => a.classId === classId && (!date || a.date === date));
  const addAttendance = (attendanceData: Omit<Attendance, 'id' | 'createdAt'>) => {
    const newAttendance: Attendance = {
      ...attendanceData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setAttendance([...attendance, newAttendance]);
    return newAttendance;
  };

  // Message methods
  const getMessagesByUser = (userId: string) => 
    messages.filter(m => m.senderId === userId || m.receiverId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  const getConversation = (user1Id: string, user2Id: string) => 
    messages.filter(
      m => (m.senderId === user1Id && m.receiverId === user2Id) || 
           (m.senderId === user2Id && m.receiverId === user1Id)
    ).sort((a, b) => a.createdAt - b.createdAt);
  const sendMessage = (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      read: false,
      createdAt: Date.now(),
    };
    setMessages([...messages, newMessage]);
    return newMessage;
  };
  const markMessageAsRead = (messageId: string) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  // Notification methods
  const getNotificationsByUser = (userId: string) => 
    notifications.filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  const getUnreadNotificationsCount = (userId: string) => 
    notifications.filter(n => n.userId === userId && !n.read).length;
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: Date.now(),
    };
    setNotifications([...notifications, newNotification]);
    return newNotification;
  };

  return {
    loading,
    // School methods
    schools,
    getSchools,
    getSchoolById,
    addSchool,
    
    // Class methods
    classes,
    getClasses,
    getClassById,
    addClassToSchool,
    
    // Student methods
    students,
    getStudents,
    getStudentById,
    getStudentsByParent,
    addStudent,
    
    // Grade methods
    grades,
    getGradesByStudent,
    getGradesByClass,
    addGrade,
    
    // Attendance methods
    attendance,
    getAttendanceByStudent,
    getAttendanceByClass,
    addAttendance,
    
    // Message methods
    messages,
    getMessagesByUser,
    getConversation,
    sendMessage,
    markMessageAsRead,
    
    // Notification methods
    notifications,
    getNotificationsByUser,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    addNotification,
  };
});