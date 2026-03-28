import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
}

export interface LocationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: Location.PermissionStatus;
}

export const locationService = {
  // Demander les permissions de géolocalisation
  async requestLocationPermissions(): Promise<LocationPermissionStatus> {
    try {
      console.log('Demande des permissions de géolocalisation...');
      
      // Demander d'abord la permission de base
      let { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Permission de géolocalisation refusée');
        return {
          granted: false,
          canAskAgain,
          status
        };
      }

      // Si on est sur mobile, demander aussi la permission en arrière-plan
      if (Platform.OS !== 'web') {
        const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
        console.log('Permission arrière-plan:', backgroundPermission.status);
      }

      console.log('Permissions de géolocalisation accordées');
      return {
        granted: true,
        canAskAgain,
        status
      };
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      throw error;
    }
  },

  // Vérifier les permissions actuelles
  async checkLocationPermissions(): Promise<LocationPermissionStatus> {
    try {
      const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
      
      return {
        granted: status === 'granted',
        canAskAgain,
        status
      };
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      throw error;
    }
  },

  // Obtenir la position actuelle
  async getCurrentLocation(): Promise<LocationData> {
    try {
      console.log('Récupération de la position actuelle...');
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      };

      console.log('Position obtenue:', locationData);
      return locationData;
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
      throw error;
    }
  },

  // Démarrer le suivi de position en temps réel
  async startLocationTracking(
    callback: (location: LocationData) => void,
    options?: {
      accuracy?: Location.Accuracy;
      timeInterval?: number;
      distanceInterval?: number;
    }
  ): Promise<Location.LocationSubscription> {
    try {
      console.log('Démarrage du suivi de position...');
      
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || Location.Accuracy.High,
          timeInterval: options?.timeInterval || 5000, // 5 secondes
          distanceInterval: options?.distanceInterval || 10 // 10 mètres
        },
        (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp
          };
          
          console.log('Nouvelle position:', locationData);
          callback(locationData);
        }
      );

      console.log('Suivi de position démarré');
      return subscription;
    } catch (error) {
      console.error('Erreur lors du démarrage du suivi:', error);
      throw error;
    }
  },

  // Arrêter le suivi de position
  stopLocationTracking(subscription: Location.LocationSubscription): void {
    try {
      subscription.remove();
      console.log('Suivi de position arrêté');
    } catch (error) {
      console.error('Erreur lors de l\'arrêt du suivi:', error);
    }
  },

  // Calculer la distance entre deux points (en mètres)
  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }
};