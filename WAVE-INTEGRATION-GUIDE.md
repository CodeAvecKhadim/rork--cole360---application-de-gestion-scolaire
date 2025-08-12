# Guide d'intégration Wave Business API

## Étapes pour rendre l'API Wave fonctionnelle

### 1. Obtenir les identifiants Wave Business

1. **Créer un compte Wave Business** :
   - Rendez-vous sur [Wave Business](https://business.wave.com)
   - Créez un compte marchand
   - Complétez la vérification KYC

2. **Obtenir les clés API** :
   - Connectez-vous à votre tableau de bord Wave Business
   - Allez dans "Développeurs" > "API Keys"
   - Générez votre `API_KEY` et `SECRET_KEY`
   - Notez l'URL de l'API (sandbox vs production)

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine de votre projet :

```env
# Configuration Wave Business
EXPO_PUBLIC_WAVE_API_KEY=sk_live_xxxxxxxxxxxxxxxx
EXPO_PUBLIC_WAVE_SANDBOX=false

# Configuration Orange Money (optionnel)
EXPO_PUBLIC_ORANGE_MONEY_API_KEY=your_orange_money_api_key
EXPO_PUBLIC_ORANGE_MONEY_MERCHANT_KEY=your_orange_money_merchant_key

# URLs de l'application
EXPO_PUBLIC_APP_URL=https://votre-domaine.com
```

### 3. Configuration des webhooks Wave

1. **Dans votre tableau de bord Wave Business** :
   - Allez dans "Développeurs" > "Webhooks"
   - Ajoutez une nouvelle URL de webhook : `https://votre-domaine.com/api/webhooks/wave`
   - Sélectionnez les événements : `payment.successful`, `payment.failed`, `payment.cancelled`

2. **Créer l'endpoint webhook** (backend requis) :
```typescript
// api/webhooks/wave.ts
export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['wave-signature'];
  const payload = req.body;

  // Vérifier la signature du webhook
  const isValid = verifyWaveSignature(payload, signature, process.env.WAVE_WEBHOOK_SECRET);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Traiter l'événement
  const { event_type, data } = payload;
  
  switch (event_type) {
    case 'payment.successful':
      await paymentService.confirmPayment(data.client_reference);
      break;
    case 'payment.failed':
    case 'payment.cancelled':
      await paymentService.failPayment(data.client_reference, event_type);
      break;
  }

  res.status(200).json({ received: true });
}
```

### 4. Test en mode sandbox

1. **Utiliser l'environnement de test** :
   ```env
   EXPO_PUBLIC_WAVE_SANDBOX=true
   EXPO_PUBLIC_WAVE_API_KEY=sk_test_xxxxxxxxxxxxxxxx
   ```

2. **Numéros de test Wave** :
   - Succès : +221701234567
   - Échec : +221701234568
   - Annulation : +221701234569

### 5. Gestion des erreurs courantes

#### Erreur 401 - Unauthorized
- Vérifiez votre `API_KEY`
- Assurez-vous d'utiliser la bonne URL (sandbox vs production)

#### Erreur 400 - Bad Request
- Vérifiez le format du numéro de téléphone
- Assurez-vous que le montant est valide (minimum 100 XOF)

#### Erreur 403 - Forbidden
- Votre compte Wave Business n'est pas encore vérifié
- Contactez le support Wave

### 6. Sécurité

1. **Ne jamais exposer les clés API** :
   - Utilisez uniquement `EXPO_PUBLIC_` pour les variables côté client
   - Les appels API sensibles doivent passer par votre backend

2. **Validation des webhooks** :
   - Toujours vérifier la signature des webhooks
   - Utiliser HTTPS uniquement

3. **Gestion des montants** :
   - Validez les montants côté serveur
   - Implémentez des limites de transaction

### 7. Monitoring et logs

1. **Logs des transactions** :
   - Enregistrez tous les appels API
   - Surveillez les taux d'échec
   - Alertes pour les erreurs critiques

2. **Métriques importantes** :
   - Taux de conversion des paiements
   - Temps de réponse de l'API
   - Erreurs par type

### 8. Mise en production

1. **Checklist avant production** :
   - [ ] Compte Wave Business vérifié
   - [ ] Clés API de production configurées
   - [ ] Webhooks configurés et testés
   - [ ] Tests de bout en bout réalisés
   - [ ] Monitoring en place

2. **Variables d'environnement production** :
   ```env
   EXPO_PUBLIC_WAVE_API_KEY=sk_live_xxxxxxxxxxxxxxxx
   EXPO_PUBLIC_WAVE_SANDBOX=false
   EXPO_PUBLIC_APP_URL=https://votre-app-production.com
   ```

## Support

- **Documentation Wave** : https://docs.wave.com
- **Support Wave Business** : support@wave.com
- **Status API** : https://status.wave.com

## Notes importantes

- Wave Business est principalement disponible au Sénégal
- Les montants sont en Francs CFA (XOF)
- Délai de traitement : généralement instantané
- Frais : vérifiez les tarifs sur votre tableau de bord Wave Business