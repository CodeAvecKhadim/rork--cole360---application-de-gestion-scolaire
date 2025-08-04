export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'GN', name: 'Guinée', dialCode: '+224', flag: '🇬🇳' },
  { code: 'GM', name: 'Gambie', dialCode: '+220', flag: '🇬🇲' },
  { code: 'GW', name: 'Guinée-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { code: 'MR', name: 'Mauritanie', dialCode: '+222', flag: '🇲🇷' },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳' },
  { code: 'EG', name: 'Égypte', dialCode: '+20', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'ZA', name: 'Afrique du Sud', dialCode: '+27', flag: '🇿🇦' },
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲' },
  { code: 'CD', name: 'République Démocratique du Congo', dialCode: '+243', flag: '🇨🇩' },
  { code: 'CG', name: 'République du Congo', dialCode: '+242', flag: '🇨🇬' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
  { code: 'CF', name: 'République Centrafricaine', dialCode: '+236', flag: '🇨🇫' },
  { code: 'TD', name: 'Tchad', dialCode: '+235', flag: '🇹🇩' },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'LR', name: 'Libéria', dialCode: '+231', flag: '🇱🇷' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
  { code: 'CV', name: 'Cap-Vert', dialCode: '+238', flag: '🇨🇻' },
  { code: 'ST', name: 'São Tomé-et-Príncipe', dialCode: '+239', flag: '🇸🇹' },
  { code: 'GQ', name: 'Guinée équatoriale', dialCode: '+240', flag: '🇬🇶' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
  { code: 'SO', name: 'Somalie', dialCode: '+252', flag: '🇸🇴' },
  { code: 'ET', name: 'Éthiopie', dialCode: '+251', flag: '🇪🇹' },
  { code: 'ER', name: 'Érythrée', dialCode: '+291', flag: '🇪🇷' },
  { code: 'SD', name: 'Soudan', dialCode: '+249', flag: '🇸🇩' },
  { code: 'SS', name: 'Soudan du Sud', dialCode: '+211', flag: '🇸🇸' },
  { code: 'UG', name: 'Ouganda', dialCode: '+256', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
  { code: 'TZ', name: 'Tanzanie', dialCode: '+255', flag: '🇹🇿' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
  { code: 'ZM', name: 'Zambie', dialCode: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
  { code: 'NA', name: 'Namibie', dialCode: '+264', flag: '🇳🇦' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  { code: 'MU', name: 'Maurice', dialCode: '+230', flag: '🇲🇺' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
  { code: 'KM', name: 'Comores', dialCode: '+269', flag: '🇰🇲' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italie', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭' },
  { code: 'NL', name: 'Pays-Bas', dialCode: '+31', flag: '🇳🇱' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return COUNTRIES.find(country => country.dialCode === dialCode);
};

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Sénégal par défaut