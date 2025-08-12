import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  type UploadResult
} from 'firebase/storage';
import { storage } from '@/libs/firebase';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface FileUpload {
  file: Blob | File;
  path: string;
  metadata?: {
    contentType?: string;
    customMetadata?: Record<string, string>;
  };
}

export const storageService = {
  // Upload d'un fichier simple
  async uploadFile(upload: FileUpload): Promise<string> {
    try {
      console.log(`📤 Upload du fichier vers: ${upload.path}`);
      
      const storageRef = ref(storage, upload.path);
      const uploadResult: UploadResult = await uploadBytes(
        storageRef, 
        upload.file, 
        upload.metadata
      );
      
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log(`✅ Fichier uploadé avec succès: ${downloadURL}`);
      
      return downloadURL;
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload:', error);
      throw error;
    }
  },

  // Upload avec suivi de progression
  async uploadFileWithProgress(
    upload: FileUpload,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      console.log(`📤 Upload avec progression vers: ${upload.path}`);
      
      const storageRef = ref(storage, upload.path);
      const uploadTask = uploadBytesResumable(
        storageRef, 
        upload.file, 
        upload.metadata
      );

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress: UploadProgress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            };
            
            console.log(`📊 Progression: ${progress.progress.toFixed(1)}%`);
            onProgress?.(progress);
          },
          (error) => {
            console.error('❌ Erreur upload:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log(`✅ Upload terminé: ${downloadURL}`);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload avec progression:', error);
      throw error;
    }
  },

  // Upload d'une image de profil
  async uploadProfileImage(
    userId: string, 
    imageFile: Blob | File,
    type: 'user' | 'student' = 'user'
  ): Promise<string> {
    const path = `profiles/${type}s/${userId}/avatar.jpg`;
    return this.uploadFile({
      file: imageFile,
      path,
      metadata: {
        contentType: 'image/jpeg',
        customMetadata: {
          userId,
          type,
          uploadedAt: new Date().toISOString()
        }
      }
    });
  },

  // Upload d'un document scolaire
  async uploadDocument(
    studentId: string,
    documentType: 'bulletin' | 'certificat' | 'photo',
    file: Blob | File,
    fileName: string
  ): Promise<string> {
    const extension = fileName.split('.').pop() || 'pdf';
    const path = `documents/${studentId}/${documentType}/${Date.now()}.${extension}`;
    
    return this.uploadFile({
      file,
      path,
      metadata: {
        contentType: file.type || 'application/pdf',
        customMetadata: {
          studentId,
          documentType,
          originalName: fileName,
          uploadedAt: new Date().toISOString()
        }
      }
    });
  },

  // Supprimer un fichier
  async deleteFile(filePath: string): Promise<void> {
    try {
      console.log(`🗑️ Suppression du fichier: ${filePath}`);
      
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
      
      console.log(`✅ Fichier supprimé: ${filePath}`);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw error;
    }
  },

  // Lister les fichiers d'un dossier
  async listFiles(folderPath: string): Promise<string[]> {
    try {
      console.log(`📂 Liste des fichiers dans: ${folderPath}`);
      
      const storageRef = ref(storage, folderPath);
      const result = await listAll(storageRef);
      
      const urls: string[] = [];
      for (const itemRef of result.items) {
        const url = await getDownloadURL(itemRef);
        urls.push(url);
      }
      
      console.log(`📋 ${urls.length} fichiers trouvés`);
      return urls;
    } catch (error) {
      console.error('❌ Erreur lors de la liste:', error);
      throw error;
    }
  },

  // Obtenir l'URL de téléchargement d'un fichier
  async getDownloadURL(filePath: string): Promise<string> {
    try {
      const storageRef = ref(storage, filePath);
      const url = await getDownloadURL(storageRef);
      console.log(`🔗 URL obtenue pour: ${filePath}`);
      return url;
    } catch (error) {
      console.error('❌ Erreur lors de l\'obtention de l\'URL:', error);
      throw error;
    }
  },

  // Helpers pour les chemins de fichiers
  paths: {
    userAvatar: (userId: string) => `profiles/users/${userId}/avatar.jpg`,
    studentAvatar: (studentId: string) => `profiles/students/${studentId}/avatar.jpg`,
    studentDocument: (studentId: string, type: string, fileName: string) => 
      `documents/${studentId}/${type}/${fileName}`,
    schoolLogo: (schoolId: string) => `schools/${schoolId}/logo.png`,
    classPicture: (classId: string) => `classes/${classId}/picture.jpg`
  }
};

console.log('💾 Service Storage Firebase initialisé');