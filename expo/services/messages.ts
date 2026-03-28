import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  or
} from 'firebase/firestore';
import { db } from '@/libs/firebase';
import type { Message } from '@/services/firestore';

/**
 * Service CRUD pour la collection 'messages'
 */
class MessageService {
  private collectionName = 'messages';

  /**
   * Créer un nouveau message
   */
  async create(messageData: Omit<Message, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...messageData,
        dateEnvoi: serverTimestamp(),
        lu: false
      });
      console.log('Message créé avec l\'ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création du message:', error);
      throw error;
    }
  }

  /**
   * Lire un message par son ID
   */
  async getById(id: string): Promise<Message | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Message;
      } else {
        console.log('Aucun message trouvé avec l\'ID:', id);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du message:', error);
      throw error;
    }
  }

  /**
   * Lire tous les messages
   */
  async getAll(): Promise<Message[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('dateEnvoi', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      
      console.log(`${messages.length} messages récupérés`);
      return messages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un message
   */
  async update(id: string, updateData: Partial<Omit<Message, 'id'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updateData,
        dateModification: serverTimestamp()
      });
      console.log('Message mis à jour:', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du message:', error);
      throw error;
    }
  }

  /**
   * Supprimer un message
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log('Message supprimé:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      throw error;
    }
  }

  /**
   * Obtenir les messages envoyés par un utilisateur
   */
  async getBySender(senderId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('expediteur_id', '==', senderId),
        orderBy('dateEnvoi', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      
      return messages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages par expéditeur:', error);
      throw error;
    }
  }

  /**
   * Obtenir les messages reçus par un utilisateur
   */
  async getByReceiver(receiverId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('destinataire_id', '==', receiverId),
        orderBy('dateEnvoi', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      
      return messages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages par destinataire:', error);
      throw error;
    }
  }

  /**
   * Obtenir tous les messages d'une conversation entre deux utilisateurs
   */
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    try {
      // Récupérer manuellement les messages dans les deux sens car Firestore or() a des limitations
      const sentMessages = await this.getMessagesBetween(userId1, userId2);
      const receivedMessages = await this.getMessagesBetween(userId2, userId1);
      
      const allMessages = [...sentMessages, ...receivedMessages];
      return allMessages.sort((a, b) => {
        const dateA = a.dateEnvoi?.toDate?.() || new Date(a.dateEnvoi);
        const dateB = b.dateEnvoi?.toDate?.() || new Date(b.dateEnvoi);
        return dateA.getTime() - dateB.getTime();
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la conversation:', error);
      throw error;
    }
  }

  /**
   * Méthode helper pour récupérer les messages entre deux utilisateurs dans un sens
   */
  private async getMessagesBetween(senderId: string, receiverId: string): Promise<Message[]> {
    const q = query(
      collection(db, this.collectionName),
      where('expediteur_id', '==', senderId),
      where('destinataire_id', '==', receiverId),
      orderBy('dateEnvoi', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });
    
    return messages;
  }

  /**
   * Marquer un message comme lu
   */
  async markAsRead(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        lu: true,
        dateLecture: serverTimestamp()
      });
      console.log('Message marqué comme lu:', id);
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }

  /**
   * Marquer tous les messages d'un destinataire comme lus
   */
  async markAllAsRead(receiverId: string): Promise<void> {
    try {
      const unreadMessages = await this.getUnreadMessages(receiverId);
      
      const updatePromises = unreadMessages.map(message => 
        this.markAsRead(message.id!)
      );
      
      await Promise.all(updatePromises);
      console.log(`${unreadMessages.length} messages marqués comme lus pour ${receiverId}`);
    } catch (error) {
      console.error('Erreur lors du marquage de tous les messages comme lus:', error);
      throw error;
    }
  }

  /**
   * Obtenir les messages non lus d'un utilisateur
   */
  async getUnreadMessages(receiverId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('destinataire_id', '==', receiverId),
        where('lu', '==', false),
        orderBy('dateEnvoi', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      
      return messages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages non lus:', error);
      throw error;
    }
  }

  /**
   * Compter les messages non lus d'un utilisateur
   */
  async getUnreadCount(receiverId: string): Promise<number> {
    try {
      const unreadMessages = await this.getUnreadMessages(receiverId);
      return unreadMessages.length;
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
      throw error;
    }
  }

  /**
   * Obtenir les messages par type
   */
  async getByType(type: 'info' | 'urgent' | 'normal'): Promise<Message[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('type', '==', type),
        orderBy('dateEnvoi', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      
      return messages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages par type:', error);
      throw error;
    }
  }

  /**
   * Rechercher des messages par contenu ou sujet
   */
  async searchMessages(searchTerm: string, userId?: string): Promise<Message[]> {
    try {
      let messages: Message[] = [];
      
      if (userId) {
        // Récupérer les messages envoyés et reçus séparément
        const sentMessages = await this.getBySender(userId);
        const receivedMessages = await this.getByReceiver(userId);
        messages = [...sentMessages, ...receivedMessages];
      } else {
        messages = await this.getAll();
      }
      
      // Filtrer par terme de recherche
      const filteredMessages = messages.filter(message => {
        const searchText = `${message.sujet} ${message.contenu}`.toLowerCase();
        return searchText.includes(searchTerm.toLowerCase());
      });
      
      // Trier par date
      return filteredMessages.sort((a, b) => {
        const dateA = a.dateEnvoi?.toDate?.() || new Date(a.dateEnvoi);
        const dateB = b.dateEnvoi?.toDate?.() || new Date(b.dateEnvoi);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de messages:', error);
      throw error;
    }
  }

  /**
   * Obtenir les messages récents
   */
  async getRecentMessages(limitCount: number = 10): Promise<Message[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('dateEnvoi', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });
      
      return messages;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages récents:', error);
      throw error;
    }
  }

  /**
   * Envoyer un message
   */
  async sendMessage(
    senderId: string, 
    receiverId: string, 
    subject: string, 
    content: string, 
    type: 'info' | 'urgent' | 'normal' = 'normal'
  ): Promise<string> {
    return this.create({
      expediteur_id: senderId,
      destinataire_id: receiverId,
      sujet: subject,
      contenu: content,
      type: type,
      lu: false,
      dateEnvoi: serverTimestamp()
    });
  }
}

// Instance unique du service
export const messageService = new MessageService();
export default messageService;

console.log('💬 Service Messages initialisé');