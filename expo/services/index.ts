// Export des services Firebase CRUD individuels
export { schoolService } from './schools';
export { classService } from './classes';
export { studentService } from './students';
export { gradeService } from './grades';
export { messageService } from './messages';

// Export des services existants
export { authService } from './auth';
export { locationService } from './location';
export { storageService } from './storage';

// Export des nouveaux services
export { subscriptionService } from './subscription';
export { paymentService } from './payment';
export { notificationService } from './notifications';

// Export des types et du service Firestore principal (pour compatibilité)
export type {
  School,
  Class,
  Student,
  Grade,
  Course,
  Message,
  LocationData
} from './firestore';

export { firestoreService } from './firestore';

console.log('📦 Services Firebase CRUD exportés avec succès');