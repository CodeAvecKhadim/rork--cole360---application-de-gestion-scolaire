import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { db } from '@/libs/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { authService } from './auth';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  id?: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  type: 'absence' | 'grade' | 'message' | 'general';
  read: boolean;
  createdAt: number;
  pushToken?: string;
}

export interface AbsenceNotificationData {
  studentId: string;
  studentName: string;
  className: string;
  teacherName: string;
  date: string;
  parentId: string;
}

class NotificationService {
  private async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('🌐 Notifications push non supportées sur web');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('❌ Permission de notification refusée');
        return false;
      }

      console.log('✅ Permissions de notification accordées');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la demande de permissions:', error);
      return false;
    }
  }

  async registerForPushNotifications(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'ecole-360---rork-fix'
      });

      console.log('📱 Token de notification obtenu:', token.data);
      
      // Sauvegarder le token dans Firestore pour l'utilisateur actuel
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        await this.savePushToken(currentUser.uid, token.data);
      }

      return token.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement des notifications:', error);
      return null;
    }
  }

  private async savePushToken(userId: string, token: string): Promise<void> {
    try {
      // Vérifier si l'utilisateur a déjà un token
      const tokensRef = collection(db, 'push_tokens');
      const q = query(tokensRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Créer un nouveau token
        await addDoc(tokensRef, {
          userId,
          token,
          platform: Platform.OS,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          active: true
        });
        console.log('💾 Token de notification sauvegardé');
      } else {
        // Mettre à jour le token existant
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          token,
          updatedAt: Date.now(),
          active: true
        });
        console.log('🔄 Token de notification mis à jour');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde du token:', error);
    }
  }

  async sendAbsenceNotification(data: AbsenceNotificationData): Promise<void> {
    try {
      console.log('📤 Envoi de notification d\'absence pour:', data.studentName);

      // Récupérer le token push du parent
      const parentToken = await this.getPushToken(data.parentId);
      
      const notificationData: NotificationData = {
        userId: data.parentId,
        title: `Absence de ${data.studentName}`,
        body: `Votre enfant ${data.studentName} a été marqué absent en classe de ${data.className} le ${data.date}.`,
        type: 'absence',
        read: false,
        createdAt: Date.now(),
        data: {
          studentId: data.studentId,
          studentName: data.studentName,
          className: data.className,
          teacherName: data.teacherName,
          date: data.date,
          type: 'absence'
        },
        pushToken: parentToken || undefined
      };

      // Sauvegarder la notification dans Firestore
      await this.saveNotification(notificationData);

      // Envoyer la notification push si on a un token
      if (parentToken && Platform.OS !== 'web') {
        await this.sendPushNotification({
          to: parentToken,
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data,
          sound: 'default',
          priority: 'high'
        });
      }

      console.log('✅ Notification d\'absence envoyée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification d\'absence:', error);
    }
  }

  private async getPushToken(userId: string): Promise<string | null> {
    try {
      const tokensRef = collection(db, 'push_tokens');
      const q = query(
        tokensRef, 
        where('userId', '==', userId),
        where('active', '==', true)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const tokenDoc = querySnapshot.docs[0];
        return tokenDoc.data().token;
      }

      return null;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  private async saveNotification(notification: NotificationData): Promise<void> {
    try {
      const notificationsRef = collection(db, 'notifications');
      await addDoc(notificationsRef, notification);
      console.log('💾 Notification sauvegardée dans Firestore');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la notification:', error);
    }
  }

  private async sendPushNotification(message: {
    to: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    sound?: string;
    priority?: string;
  }): Promise<void> {
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      
      if (result.data && result.data.status === 'ok') {
        console.log('✅ Notification push envoyée avec succès');
      } else {
        console.error('❌ Erreur lors de l\'envoi de la notification push:', result);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification push:', error);
    }
  }

  async getNotifications(userId: string): Promise<NotificationData[]> {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      const notifications: NotificationData[] = [];
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        } as NotificationData);
      });

      // Trier par date de création (plus récent en premier)
      return notifications.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: Date.now()
      });
      console.log('✅ Notification marquée comme lue');
    } catch (error) {
      console.error('❌ Erreur lors du marquage de la notification:', error);
    }
  }

  // Écouter les notifications en temps réel
  setupNotificationListener(): void {
    if (Platform.OS === 'web') {
      return;
    }

    // Notification reçue quand l'app est au premier plan
    Notifications.addNotificationReceivedListener(notification => {
      console.log('📨 Notification reçue:', notification);
    });

    // Notification cliquée
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification cliquée:', response);
      const data = response.notification.request.content.data;
      
      // Gérer la navigation selon le type de notification
      if (data?.type === 'absence' && data?.studentId) {
        // Naviguer vers la page de l'étudiant
        console.log('🔄 Navigation vers l\'étudiant:', data.studentId);
      }
    });
  }
}

export const notificationService = new NotificationService();

console.log('📱 Service de notifications initialisé');