import createContextHook from '@nkzw/create-context-hook';
import { useState } from 'react';
import { School, Class, Student, Grade, Attendance, Message, Notification, StudentLocation, LocationAlert, SafeZone, EmergencyContact } from '@/types/auth';

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
    locationEnabled: true,
    lastLocation: {
      id: '1',
      studentId: '1',
      latitude: 48.8566,
      longitude: 2.3522,
      accuracy: 10,
      timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
      address: 'École Centrale, 123 Education St, Paris',
      isInSchool: true,
      batteryLevel: 85,
      deviceId: 'device_alex_001',
    },
    emergencyContacts: [
      {
        id: '1',
        name: 'Marie Johnson',
        phone: '+33123456789',
        relationship: 'Mère',
        isPrimary: true,
      },
      {
        id: '2',
        name: 'Pierre Johnson',
        phone: '+33987654321',
        relationship: 'Père',
        isPrimary: false,
      },
    ],
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Sam Wilson',
    schoolId: '1',
    classId: '1',
    parentId: '4',
    locationEnabled: false,
    emergencyContacts: [
      {
        id: '3',
        name: 'Sarah Wilson',
        phone: '+33555666777',
        relationship: 'Mère',
        isPrimary: true,
      },
    ],
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

const mockLocationAlerts: LocationAlert[] = [
  {
    id: '1',
    studentId: '1',
    parentId: '4',
    type: 'left_school',
    message: 'Alex Johnson a quitté l\'école à 15:30',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: 'École Centrale, 123 Education St, Paris',
    },
    acknowledged: false,
    createdAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
  },
  {
    id: '2',
    studentId: '1',
    parentId: '4',
    type: 'low_battery',
    message: 'Le téléphone d\'Alex Johnson a une batterie faible (15%)',
    acknowledged: true,
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
  },
];

const mockSafeZones: SafeZone[] = [
  {
    id: '1',
    studentId: '1',
    name: 'École',
    latitude: 48.8566,
    longitude: 2.3522,
    radius: 100,
    isActive: true,
    notifications: true,
    createdAt: Date.now(),
  },
  {
    id: '2',
    studentId: '1',
    name: 'Maison',
    latitude: 48.8606,
    longitude: 2.3376,
    radius: 50,
    isActive: true,
    notifications: true,
    createdAt: Date.now(),
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
  const [locationAlerts, setLocationAlerts] = useState<LocationAlert[]>(mockLocationAlerts);
  const [safeZones, setSafeZones] = useState<SafeZone[]>(mockSafeZones);
  const [studentLocations, setStudentLocations] = useState<StudentLocation[]>([]);
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

  // Location methods
  const updateStudentLocation = (location: Omit<StudentLocation, 'id'>) => {
    const newLocation: StudentLocation = {
      ...location,
      id: Date.now().toString(),
    };
    
    // Update student's last location
    setStudents(students.map(s => 
      s.id === location.studentId 
        ? { ...s, lastLocation: newLocation }
        : s
    ));
    
    // Add to locations history
    setStudentLocations(prev => [newLocation, ...prev.slice(0, 99)]); // Keep last 100 locations
    
    return newLocation;
  };

  const getStudentLocation = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.lastLocation;
  };

  const toggleStudentLocationTracking = (studentId: string, enabled: boolean) => {
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, locationEnabled: enabled }
        : s
    ));
  };

  // Location alerts methods
  const getLocationAlerts = (parentId: string) => 
    locationAlerts.filter(alert => alert.parentId === parentId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getUnacknowledgedAlertsCount = (parentId: string) => 
    locationAlerts.filter(alert => alert.parentId === parentId && !alert.acknowledged).length;

  const acknowledgeLocationAlert = (alertId: string) => {
    setLocationAlerts(alerts => alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const addLocationAlert = (alert: Omit<LocationAlert, 'id' | 'createdAt' | 'acknowledged'>) => {
    const newAlert: LocationAlert = {
      ...alert,
      id: Date.now().toString(),
      acknowledged: false,
      createdAt: Date.now(),
    };
    setLocationAlerts(prev => [newAlert, ...prev]);
    return newAlert;
  };

  // Safe zones methods
  const getSafeZonesByStudent = (studentId: string) => 
    safeZones.filter(zone => zone.studentId === studentId);

  const addSafeZone = (zone: Omit<SafeZone, 'id' | 'createdAt'>) => {
    const newZone: SafeZone = {
      ...zone,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setSafeZones(prev => [...prev, newZone]);
    return newZone;
  };

  const updateSafeZone = (zoneId: string, updates: Partial<SafeZone>) => {
    setSafeZones(zones => zones.map(zone => 
      zone.id === zoneId ? { ...zone, ...updates } : zone
    ));
  };

  const deleteSafeZone = (zoneId: string) => {
    setSafeZones(zones => zones.filter(zone => zone.id !== zoneId));
  };

  // Emergency contacts methods
  const updateEmergencyContacts = (studentId: string, contacts: EmergencyContact[]) => {
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, emergencyContacts: contacts }
        : s
    ));
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
    
    // Location methods
    studentLocations,
    updateStudentLocation,
    getStudentLocation,
    toggleStudentLocationTracking,
    
    // Location alerts methods
    locationAlerts,
    getLocationAlerts,
    getUnacknowledgedAlertsCount,
    acknowledgeLocationAlert,
    addLocationAlert,
    
    // Safe zones methods
    safeZones,
    getSafeZonesByStudent,
    addSafeZone,
    updateSafeZone,
    deleteSafeZone,
    
    // Emergency contacts methods
    updateEmergencyContacts,
  };
});