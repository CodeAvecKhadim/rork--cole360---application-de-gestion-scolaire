// Configuration de l'application
export const CONFIG = {
  // Wave API Configuration
  WAVE: {
    API_URL: 'https://api.wave.com/v1',
    SANDBOX_URL: 'https://api.sandbox.wave.com/v1',
    API_KEY: process.env.EXPO_PUBLIC_WAVE_API_KEY || '',
    IS_SANDBOX: process.env.EXPO_PUBLIC_WAVE_SANDBOX === 'true',
  },
  
  // Orange Money API Configuration
  ORANGE_MONEY: {
    API_URL: 'https://api.orange.com/orange-money-webpay/dev/v1',
    API_KEY: process.env.EXPO_PUBLIC_ORANGE_MONEY_API_KEY || '',
    MERCHANT_KEY: process.env.EXPO_PUBLIC_ORANGE_MONEY_MERCHANT_KEY || '',
  },
  
  // App URLs
  APP: {
    BASE_URL: process.env.EXPO_PUBLIC_APP_URL || 'https://votre-app.com',
    SUCCESS_URL: process.env.EXPO_PUBLIC_APP_URL + '/payment/success' || 'https://votre-app.com/payment/success',
    ERROR_URL: process.env.EXPO_PUBLIC_APP_URL + '/payment/error' || 'https://votre-app.com/payment/error',
  }
};

// Validation de la configuration
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!CONFIG.WAVE.API_KEY) {
    errors.push('EXPO_PUBLIC_WAVE_API_KEY manquant');
  }
  
  if (!CONFIG.ORANGE_MONEY.API_KEY) {
    errors.push('EXPO_PUBLIC_ORANGE_MONEY_API_KEY manquant');
  }
  
  if (!CONFIG.ORANGE_MONEY.MERCHANT_KEY) {
    errors.push('EXPO_PUBLIC_ORANGE_MONEY_MERCHANT_KEY manquant');
  }
  
  if (errors.length > 0) {
    console.warn('Configuration incomplète:', errors.join(', '));
  }
  
  return errors.length === 0;
};