// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // HEADINGS
        settingsAndPreferences: "Settings & Preferences",
        changePassword: "Change Password",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmNewPassword: "Confirm New Password",
        updatePassword: "Update Password",
        notificationSettings: "Notification Settings",
        emailNotifications: "Email Notifications",
        emailDescription: "Receive notifications via email",
        smsNotifications: "SMS Notifications",
        smsDescription: "Receive notifications via SMS",
        appointmentReminders: "Appointment Reminders",
        appointmentDescription: "Get reminders for upcoming appointments",
        healthUpdates: "Health Updates",
        healthUpdatesDescription: "Receive health tips and updates",
        privacySettings: "Privacy Settings",
        researchDataSharing: "Research Data Sharing",
        researchDataDescription:
          "Allow anonymized data to be used for medical research",
        dataSharingConsents: "Data Sharing Consents",
        organizationsGranted: "Organizations and entities you have granted consent to access your health data",
        languagePreference: "Language Preference",
        selectLanguage: "Select Language",
        cancel: "Cancel",
        saveChanges: "Save Changes",
        revoke: "Revoke",
        purpose: "Purpose",
        grantedOn: "Granted on",
        secureDecentralized: "MEDXACT Health Platform • Secure • Decentralized • HIPAA Compliant",
        settingsSaved: "Settings Saved",
      },
    },
    hi: {
      translation: {
        // HEADINGS
        settingsAndPreferences: "सेटिंग्स और प्राथमिकताएँ",
        changePassword: "पासवर्ड बदलें",
        currentPassword: "वर्तमान पासवर्ड",
        newPassword: "नया पासवर्ड",
        confirmNewPassword: "नए पासवर्ड की पुष्टि करें",
        updatePassword: "पासवर्ड अपडेट करें",
        notificationSettings: "सूचना सेटिंग्स",
        emailNotifications: "ईमेल सूचनाएँ",
        emailDescription: "ईमेल के माध्यम से सूचनाएँ प्राप्त करें",
        smsNotifications: "एसएमएस सूचनाएँ",
        smsDescription: "एसएमएस के माध्यम से सूचनाएँ प्राप्त करें",
        appointmentReminders: "नियुक्ति अनुस्मारक",
        appointmentDescription: "आगामी नियुक्तियों के लिए अनुस्मारक प्राप्त करें",
        healthUpdates: "स्वास्थ्य अपडेट",
        healthUpdatesDescription: "स्वास्थ्य टिप्स और अपडेट प्राप्त करें",
        privacySettings: "गोपनीयता सेटिंग्स",
        researchDataSharing: "अनुसंधान डेटा साझा करना",
        researchDataDescription:
          "गोपनीय रूप से डेटा का उपयोग चिकित्सा अनुसंधान के लिए करने की अनुमति दें",
        dataSharingConsents: "डेटा साझाकरण सहमति",
        organizationsGranted: "वे संगठन और संस्थाएँ जिन्हें आपने अपने स्वास्थ्य डेटा तक पहुँचने की अनुमति दी है",
        languagePreference: "भाषा वरीयता",
        selectLanguage: "भाषा चुनें",
        cancel: "रद्द करें",
        saveChanges: "परिवर्तन सहेजें",
        revoke: "रद्द करें",
        purpose: "उद्देश्य",
        grantedOn: "को अनुमति दी गई",
        secureDecentralized: "MEDXACT स्वास्थ्य प्लेटफार्म • सुरक्षित • विकेंद्रीकृत • HIPAA अनुरूप",
        settingsSaved: "सेटिंग्स सहेजी गईं",
      },
    },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
