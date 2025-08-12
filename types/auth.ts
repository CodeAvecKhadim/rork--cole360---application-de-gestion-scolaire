export type UserRole = 'admin' | 'schoolAdmin' | 'teacher' | 'parent';

// Interface pour les permissions utilisateur
export interface UserPermissions {
  canViewStudents: boolean;
  canEditStudents: boolean;
  canViewGrades: boolean;
  canEditGrades: boolean;
  canViewAttendance: boolean;
  canEditAttendance: boolean;
  canViewMessages: boolean;
  canSendMessages: boolean;
  canManageSchool: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}

// Interface pour les sessions utilisateur
export interface UserSession {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivity: number;
  createdAt: number;
  expiresAt: number;
}

// Interface pour les tentatives de connexion
export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  timestamp: number;
}

// Interface pour les logs de sécurité
export interface SecurityLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: any;
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string;
  country: string;
  countryCode: string;
  phone: string;
  permissions: UserPermissions;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: number;
  lastPasswordChange: number;
  failedLoginAttempts: number;
  lockedUntil?: number;
  createdAt: number;
  updatedAt: number;
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
  locationEnabled: boolean;
  lastLocation?: StudentLocation;
  emergencyContacts: EmergencyContact[];
  createdAt: number;
}

export interface StudentLocation {
  id: string;
  studentId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
  isInSchool: boolean;
  batteryLevel?: number;
  deviceId: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface LocationAlert {
  id: string;
  studentId: string;
  parentId: string;
  type: 'left_school' | 'arrived_school' | 'emergency' | 'low_battery' | 'location_disabled';
  message: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  acknowledged: boolean;
  createdAt: number;
}

export interface SafeZone {
  id: string;
  studentId: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  isActive: boolean;
  notifications: boolean;
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
  studentsCount: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired';
  paymentMethod?: 'wave' | 'orange_money';
  transactionId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  pricePerStudent: number;
  maxStudents: number;
  features: string[];
  duration: number; // en mois
  isActive: boolean;
}

export interface PaymentTransaction {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'wave' | 'orange_money';
  phoneNumber: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transactionReference?: string;
  externalTransactionId?: string;
  failureReason?: string;
  createdAt: number;
  updatedAt: number;
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