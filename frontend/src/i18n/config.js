import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      settings: {
        title: 'Settings',
        subtitle: 'Manage your hiking app preferences',
        profile: 'Profile',
        adventureEnthusiast: 'Adventure Enthusiast',
        preferences: 'Preferences',
        notifications: 'Notifications',
        notificationsDesc: 'Get updates about your hikes',
        locationServices: 'Location Services',
        locationDesc: 'Help find nearby trails',
        languageRegion: 'Language & Region',
        support: 'Support',
        helpCenter: 'Help Center',
        helpCenterDesc: 'Get answers to common questions',
        contactSupport: 'Contact Support',
        contactSupportDesc: 'Reach out for help',
        signOut: 'Sign Out',
        selectLanguage: 'Select Language'
      }
    }
  },
  es: {
    translation: {
      settings: {
        title: 'Configuración',
        subtitle: 'Administra las preferencias de tu aplicación de senderismo',
        profile: 'Perfil',
        adventureEnthusiast: 'Entusiasta de la Aventura',
        preferences: 'Preferencias',
        notifications: 'Notificaciones',
        notificationsDesc: 'Recibe actualizaciones sobre tus caminatas',
        locationServices: 'Servicios de Ubicación',
        locationDesc: 'Ayuda a encontrar senderos cercanos',
        languageRegion: 'Idioma y Región',
        support: 'Soporte',
        helpCenter: 'Centro de Ayuda',
        helpCenterDesc: 'Obtén respuestas a preguntas comunes',
        contactSupport: 'Contactar Soporte',
        contactSupportDesc: 'Comunícate para obtener ayuda',
        signOut: 'Cerrar Sesión',
        selectLanguage: 'Seleccionar Idioma'
      }
    }
  },
  fr: {
    translation: {
      settings: {
        title: 'Paramètres',
        subtitle: 'Gérez les préférences de votre application de randonnée',
        profile: 'Profil',
        adventureEnthusiast: 'Passionné d\'Aventure',
        preferences: 'Préférences',
        notifications: 'Notifications',
        notificationsDesc: 'Recevez des mises à jour sur vos randonnées',
        locationServices: 'Services de Localisation',
        locationDesc: 'Aide à trouver des sentiers à proximité',
        languageRegion: 'Langue et Région',
        support: 'Support',
        helpCenter: 'Centre d\'Aide',
        helpCenterDesc: 'Obtenez des réponses aux questions courantes',
        contactSupport: 'Contacter le Support',
        contactSupportDesc: 'Contactez-nous pour obtenir de l\'aide',
        signOut: 'Se Déconnecter',
        selectLanguage: 'Sélectionner la Langue'
      }
    }
  },
  de: {
    translation: {
      settings: {
        title: 'Einstellungen',
        subtitle: 'Verwalten Sie Ihre Wanderungs-App-Einstellungen',
        profile: 'Profil',
        adventureEnthusiast: 'Abenteuer-Enthusiast',
        preferences: 'Einstellungen',
        notifications: 'Benachrichtigungen',
        notificationsDesc: 'Erhalten Sie Updates zu Ihren Wanderungen',
        locationServices: 'Standortdienste',
        locationDesc: 'Hilft beim Finden von Wanderwegen in der Nähe',
        languageRegion: 'Sprache & Region',
        support: 'Unterstützung',
        helpCenter: 'Hilfezentrum',
        helpCenterDesc: 'Erhalten Sie Antworten auf häufige Fragen',
        contactSupport: 'Support Kontaktieren',
        contactSupportDesc: 'Kontaktieren Sie uns für Hilfe',
        signOut: 'Abmelden',
        selectLanguage: 'Sprache Auswählen'
      }
    }
  }
};

// Language code mapping
export const languageMap = {
  'English (US)': 'en',
  'English (UK)': 'en',
  'Spanish (ES)': 'es',
  'French (FR)': 'fr',
  'German (DE)': 'de',
  'Italian (IT)': 'en', // Add Italian translations if needed
  'Portuguese (BR)': 'en', // Add Portuguese translations if needed
  'Japanese (JP)': 'en', // Add Japanese translations if needed
  'Chinese (CN)': 'en', // Add Chinese translations if needed
  'Korean (KR)': 'en' // Add Korean translations if needed
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;