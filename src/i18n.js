// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // NAVBAR
        medxact: "MEDXACT",
        dashboard: "Dashboard",
        profile: "Profile",
        settings: "Settings",
        contact: "Contact",
        ai: "AI",

        // LANDING PAGE
        headingLine1: "Your Health,",
        headingLine2: "Your Control",
        description: "Manage and share your medical records securely.",
        tagline: "Blockchain-backed • Privacy-first • AI-enabled",
        accessData: "Access My Health Data",
        explore: "Explore MEDXACT",
        getStarted: "Get Started Now →",

        aboutTitle: "Transforming Healthcare Data",
        aboutDescription:
          "MEDXACT empowers patients with complete control over their health records through cutting-edge technology and privacy-first design.",

        featuresTitle: "Advanced Features",
        featuresSubtitle:
          "Everything you need for modern healthcare management.",

        featureHealthTrackerTitle: "Health Tracker",
        featureHealthTrackerDesc:
          "Monitors your vitals, medication and health trends with real-time analysis.",

        featureAIInsightsTitle: "AI Health Insights",
        featureAIInsightsDesc:
          "Personalized health recommendations in simple language.",

        featureSmartConsentTitle: "Smart Consent",
        featureSmartConsentDesc:
          "AI-powered privacy protection for your sensitive data.",

        featureSecureCommTitle: "Secure Communication",
        featureSecureCommDesc:
          "Encrypted doctor-to-doctor collaboration platform.",

        featureEmergencyAccessTitle: "Emergency Access",
        featureEmergencyAccessDesc:
          "Instant critical information sharing, even offline.",

        featureAnonResearchTitle: "Anonymous Research",
        featureAnonResearchDesc:
          "Contribute to medical breakthroughs while staying private.",

        featureSecureStorageTitle: "Secure Storage",
        featureSecureStorageDesc: "Blockchain-verified medical records.",

        featurePrivacyControlTitle: "Privacy Control",
        featurePrivacyControlDesc: "You decide who sees your data.",

        featureResearchImpactTitle: "Research Impact",
        featureResearchImpactDesc: "Anonymous contribution to science.",

        reviewsTitle: "Trusted by Healthcare Professionals",
        reviewsSubtitle: "See what our users have to say.",

        review1Name: "Rina Sharma",
        review1Role: "Patient",
        review1Text:
          "It transformed my diabetes management. Everything is seamlessly accessible.",

        review2Name: "Dr. Ahuja",
        review2Role: "Medical Professional",
        review2Text:
          "The secure collaboration features save hours and improve patient outcomes.",

        review3Name: "S.K.",
        review3Role: "Privacy Advocate",
        review3Text:
          "Finally, a platform that truly respects patient privacy and data control.",

        ctaTitle: "Ready to Take Control of Your Health Data?",
        ctaSubtitle:
          "Join patients and healthcare professionals building a privacy-first healthcare future with MEDXACT.",
        ctaButton: "Access MEDXACT Now",

        footerDescription:
          "Empowering patients through secure, intelligent healthcare technology.",
        footerRights: "All rights reserved.",

        // HEADINGS (from your settings file)
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
        organizationsGranted:
          "Organizations and entities you have granted consent to access your health data",
        languagePreference: "Language Preference",
        selectLanguage: "Select Language",
        cancel: "Cancel",
        saveChanges: "Save Changes",
        revoke: "Revoke",
        purpose: "Purpose",
        grantedOn: "Granted on",
        secureDecentralized:
          "MEDXACT Health Platform • Secure • Decentralized • HIPAA Compliant",
        settingsSaved: "Settings Saved",
      },
    },
    hi: {
      translation: {
        // NAVBAR
        medxact: "मेडएक्सैक्ट",
        dashboard: "डैशबोर्ड",
        profile: "प्रोफ़ाइल",
        settings: "सेटिंग्स",
        contact: "संपर्क",
        ai: "एआई",

        // LANDING PAGE
        headingLine1: "आपका स्वास्थ्य,",
        headingLine2: "आपका नियंत्रण",
        description:
          "अपने मेडिकल रिकॉर्ड को सुरक्षित रूप से प्रबंधित और साझा करें।",
        tagline: "ब्लॉकचेन-समर्थित • गोपनीयता-प्रथम • एआई-सक्षम",
        accessData: "मेरे स्वास्थ्य डेटा तक पहुँचें",
        explore: "MEDXACT का अन्वेषण करें",
        getStarted: "अब शुरू करें →",

        aboutTitle: "हेल्थकेयर डेटा को बदलना",
        aboutDescription:
          "MEDXACT उन्नत तकनीक और गोपनीयता-प्रथम डिज़ाइन के माध्यम से रोगियों को पूरा नियंत्रण देता है।",

        featuresTitle: "उन्नत विशेषताएँ",
        featuresSubtitle:
          "आधुनिक स्वास्थ्य देखभाल प्रबंधन के लिए आवश्यक सब कुछ।",

        featureHealthTrackerTitle: "हेल्थ ट्रैकर",
        featureHealthTrackerDesc:
          "आपकी महत्वपूर्ण जानकारियाँ, दवाइयाँ और स्वास्थ्य प्रवृत्तियों की वास्तविक समय में निगरानी करता है।",

        featureAIInsightsTitle: "एआई स्वास्थ्य इनसाइट्स",
        featureAIInsightsDesc:
          "सरल भाषा में व्यक्तिगत स्वास्थ्य अनुशंसाएँ।",

        featureSmartConsentTitle: "स्मार्ट सहमति",
        featureSmartConsentDesc:
          "आपके संवेदनशील डेटा के लिए एआई-संचालित गोपनीयता सुरक्षा।",

        featureSecureCommTitle: "सुरक्षित संचार",
        featureSecureCommDesc:
          "डॉक्टर-टू-डॉक्टर एन्क्रिप्टेड सहयोग मंच।",

        featureEmergencyAccessTitle: "आपातकालीन पहुँच",
        featureEmergencyAccessDesc:
          "तत्काल महत्वपूर्ण जानकारी साझा करना, यहां तक कि ऑफलाइन भी।",

        featureAnonResearchTitle: "गुमनाम अनुसंधान",
        featureAnonResearchDesc:
          "गोपनीय रहते हुए चिकित्सा अनुसंधान में योगदान करें।",

        featureSecureStorageTitle: "सुरक्षित भंडारण",
        featureSecureStorageDesc: "ब्लॉकचेन-सत्यापित मेडिकल रिकॉर्ड।",

        featurePrivacyControlTitle: "गोपनीयता नियंत्रण",
        featurePrivacyControlDesc: "आप तय करते हैं कि आपका डेटा कौन देख सकता है।",

        featureResearchImpactTitle: "अनुसंधान प्रभाव",
        featureResearchImpactDesc: "विज्ञान में गुमनाम योगदान।",

        reviewsTitle: "स्वास्थ्य पेशेवरों द्वारा विश्वसनीय",
        reviewsSubtitle: "हमारे उपयोगकर्ताओं की राय जानें।",

        review1Name: "रीना शर्मा",
        review1Role: "रोगी",
        review1Text:
          "इसने मेरी डायबिटीज प्रबंधन को बदल दिया। सब कुछ सहजता से सुलभ है।",

        review2Name: "डॉ. आहूजा",
        review2Role: "चिकित्सा पेशेवर",
        review2Text:
          "सुरक्षित सहयोग सुविधाएँ घंटों बचाती हैं और रोगी परिणामों को बेहतर बनाती हैं।",

        review3Name: "एस. के.",
        review3Role: "गोपनीयता समर्थक",
        review3Text:
          "अंततः, एक ऐसा प्लेटफॉर्म जो वास्तव में रोगी की गोपनीयता और डेटा नियंत्रण का सम्मान करता है।",

        ctaTitle: "क्या आप अपने स्वास्थ्य डेटा का नियंत्रण चाहते हैं?",
        ctaSubtitle:
          "MEDXACT के साथ गोपनीयता-प्रथम स्वास्थ्य भविष्य का निर्माण करें।",
        ctaButton: "अब MEDXACT एक्सेस करें",

        footerDescription:
          "सुरक्षित, बुद्धिमान स्वास्थ्य तकनीक के माध्यम से रोगियों को सशक्त बनाना।",
        footerRights: "सर्वाधिकार सुरक्षित।",

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
        organizationsGranted:
          "वे संगठन और संस्थाएँ जिन्हें आपने अपने स्वास्थ्य डेटा तक पहुँचने की अनुमति दी है",
        languagePreference: "भाषा वरीयता",
        selectLanguage: "भाषा चुनें",
        cancel: "रद्द करें",
        saveChanges: "परिवर्तन सहेजें",
        revoke: "रद्द करें",
        purpose: "उद्देश्य",
        grantedOn: "को अनुमति दी गई",
        secureDecentralized:
          "MEDXACT स्वास्थ्य प्लेटफार्म • सुरक्षित • विकेंद्रीकृत • HIPAA अनुरूप",
        settingsSaved: "सेटिंग्स सहेजी गईं",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
