export type UserRole = 'admin' | 'schoolAdmin' | 'teacher' | 'parent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string;
  createdAt: number;
}

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  adminId: string;
  isActive: boolean;
  createdAt: number;
}

export interface Class {
  id: string;
  name: string;
  schoolId: string;
  teacherId: string;
  schedule: string;
  createdAt: number;
}

export interface Student {
  id: string;
  name: string;
  schoolId: string;
  classId: string;
  parentId: string;
  createdAt: number;
}

export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  score: number;
  maxScore: number;
  date: number;
  createdAt: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: number;
  status: 'present' | 'absent' | 'late';
  createdAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: number;
}

export interface Subscription {
  id: string;
  userId: string;
  schoolId: string;
  plan: 'free' | 'standard' | 'premium';
  startDate: number;
  endDate: number;
  active: boolean;
  createdAt: number;
}

export interface SubjectGrade {
  subject: string;
  coefficient: number;
  compositionGrades: number[];
  subjectAverage: number;
  subjectRank: number;
  classAverage: number;
  teacherAppreciation: string;
}

export interface StudentBulletin {
  id: string;
  studentId: string;
  schoolId: string;
  classId: string;
  period: 'Semestre 1' | 'Semestre 2' | 'Annuel';
  schoolYear: string;
  subjectGrades: SubjectGrade[];
  generalAverage: number;
  classRank: number;
  totalStudents: number;
  councilDecision: 'Passage' | 'Redoublement' | 'En attente';
  councilAppreciation: string;
  pdfGenerated: boolean;
  pdfUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface StudentInfo {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  matricule: string;
  className: string;
  schoolName: string;
  schoolAddress: string;
}