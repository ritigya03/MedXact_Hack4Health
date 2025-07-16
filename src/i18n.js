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
        headingLine1: "Smarter Health,",
        headingLine2: "Stronger Prevention",
        description:
          "Upload your health reports and unlock AI-driven insights, preventive measures, lifestyle advice, and personalized goals — all in one secure platform.",
        tagline: "AI Insights • Early Detection • Personalized Prevention",
        accessData: "Smarter Preventive Care",
        explore: "Explore MEDXACT",
        getStarted: "Start My Preventive Journey →",

        aboutTitle: "Transforming Preventive Healthcare",
        aboutDescription:
          "MEDXACT bridges the gap between patients and doctors through real-time health insights, personalized prevention plans, and secure data sharing. Our AI models analyze your reports and daily data to deliver actionable recommendations — from medical advice to Ayurveda and home remedies — helping you stay healthy and ahead of risks.",

        featuresTitle: "Your Preventive Care Command Center",
        featuresSubtitle:
          "Everything you need for proactive health management.",

        featureHealthTrackerTitle: "Upload & Analyze Reports",
        featureHealthTrackerDesc:
          "Upload your health reports and receive instant AI summaries, test explanations, and preventive recommendations tailored to your unique health profile.",

        featureAIInsightsTitle: "AI Health Insights",
        featureAIInsightsDesc:
          "Get personalized insights on health risks, lifestyle changes, diet plans, and even Ayurveda and home remedies, delivered in easy language and visual graphs.",

        featureSmartConsentTitle: "Smart Privacy & Consent",
        featureSmartConsentDesc:
          "AI-powered privacy tools keep your preventive health data secure.",

        featureSecureCommTitle: "Doctor Collaboration",
        featureSecureCommDesc:
          "Doctors can securely connect with patients, request consent, and collaborate on preventive care and goals.",

        featureEmergencyAccessTitle: "Real-Time Alerts",
        featureEmergencyAccessDesc:
          "Instant alerts for critical report findings, enabling timely action and appointments.",

        featureAnonResearchTitle: "Anonymous Preventive Research",
        featureAnonResearchDesc:
          "Contribute anonymously to prevention-focused medical research.",

        featureSecureStorageTitle: "Secure Health Records",
        featureSecureStorageDesc:
          "All your preventive care records, safely stored and easy to access.",

        featurePrivacyControlTitle: "Privacy & Control",
        featurePrivacyControlDesc:
          "You decide how your preventive health data is shared.",

        featureResearchImpactTitle: "Impactful Research",
        featureResearchImpactDesc:
          "Help drive advances in preventive medicine anonymously.",

        reviewsTitle: "Trusted by Patients & Healthcare Experts",
        reviewsSubtitle:
          "Hear how MEDXACT empowers proactive, preventive care.",

        review1Name: "Rina Sharma",
        review1Role: "Patient",
        review1Text:
          "MEDXACT gave me clear, personalized advice about my reports. The AI insights and lifestyle tips help me feel more in control of my health.",

        review2Name: "Dr. Ahuja",
        review2Role: "Medical Professional",
        review2Text:
          "As a doctor, I save hours collaborating securely with patients. The early warning alerts and goal tracking truly support preventive medicine.",

        review3Name: "S.K.",
        review3Role: "Privacy Advocate",
        review3Text:
          "Finally, a health platform that respects privacy while delivering advanced preventive care.",

        ctaTitle: "Ready for Smarter Preventive Care?",
        ctaSubtitle:
          "Join MEDXACT to transform how you and your doctor manage health, prevent risks, and stay ahead.",
        ctaButton: "Start My Preventive Journey",

        footerDescription:
          "Empowering smarter preventive healthcare through secure, intelligent technology.",
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
        Vaccine: "वैक्सीन",
        contact: "संपर्क",
        ai: "एआई",

        // LANDING PAGE
        headingLine1: "स्मार्ट स्वास्थ्य,",
        headingLine2: "मजबूत रोकथाम",
        description:
          "अपने मेडिकल रिकॉर्ड अपलोड करें और एआई-आधारित अंतर्दृष्टि, निवारक उपाय, जीवनशैली सलाह, और व्यक्तिगत लक्ष्यों को एक ही सुरक्षित प्लेटफॉर्म पर प्राप्त करें।",
        tagline: "एआई अंतर्दृष्टि • जल्दी पहचान • व्यक्तिगत निवारण",
        accessData: "स्मार्ट रोग-प्रतिरोधक देखभाल",
        explore: "MEDXACT का अन्वेषण करें",
        getStarted: "मेरी निवारक यात्रा शुरू करें →",

        aboutTitle: "निवारक स्वास्थ्य देखभाल में बदलाव",
        aboutDescription:
          "MEDXACT मरीजों और डॉक्टरों के बीच की दूरी को कम करता है, वास्तविक समय की स्वास्थ्य अंतर्दृष्टियों, व्यक्तिगत निवारक योजनाओं और सुरक्षित डेटा साझाकरण के माध्यम से। हमारे एआई मॉडल आपके रिपोर्ट और दैनिक डेटा का विश्लेषण करके कार्रवाई योग्य सिफारिशें प्रदान करते हैं — चिकित्सा सलाह से लेकर आयुर्वेद और घरेलू उपायों तक — ताकि आप स्वस्थ रहें और जोखिमों से आगे रहें।",

        featuresTitle: "आपका निवारक देखभाल कमांड सेंटर",
        featuresSubtitle:
          "सक्रिय स्वास्थ्य प्रबंधन के लिए आवश्यक हर चीज।",

        featureHealthTrackerTitle: "रिपोर्ट अपलोड और विश्लेषण",
        featureHealthTrackerDesc:
          "अपनी स्वास्थ्य रिपोर्ट अपलोड करें और तुरंत एआई सारांश, टेस्ट व्याख्या और व्यक्तिगत निवारक अनुशंसाएँ प्राप्त करें।",

        featureAIInsightsTitle: "एआई स्वास्थ्य अंतर्दृष्टियाँ",
        featureAIInsightsDesc:
          "स्वास्थ्य जोखिमों, जीवनशैली परिवर्तनों, आहार योजनाओं और यहां तक कि आयुर्वेद और घरेलू उपचारों पर व्यक्तिगत अंतर्दृष्टि प्राप्त करें, सरल भाषा और दृश्य ग्राफ़ में।",

        featureSmartConsentTitle: "स्मार्ट गोपनीयता और सहमति",
        featureSmartConsentDesc:
          "आपके निवारक स्वास्थ्य डेटा को सुरक्षित रखने के लिए एआई-संचालित गोपनीयता उपकरण।",

        featureSecureCommTitle: "डॉक्टर सहयोग",
        featureSecureCommDesc:
          "डॉक्टर मरीजों से सुरक्षित रूप से जुड़ सकते हैं, सहमति का अनुरोध कर सकते हैं और निवारक देखभाल और लक्ष्यों पर सहयोग कर सकते हैं।",

        featureEmergencyAccessTitle: "रीयल-टाइम अलर्ट",
        featureEmergencyAccessDesc:
          "महत्वपूर्ण रिपोर्ट निष्कर्षों के लिए तुरंत अलर्ट, समय पर कार्रवाई और नियुक्तियों को सक्षम करते हैं।",

        featureAnonResearchTitle: "गुमनाम निवारक अनुसंधान",
        featureAnonResearchDesc:
          "निवारण-केंद्रित चिकित्सा अनुसंधान में गुमनाम रूप से योगदान करें।",

        featureSecureStorageTitle: "सुरक्षित स्वास्थ्य रिकॉर्ड",
        featureSecureStorageDesc:
          "आपके सभी निवारक देखभाल रिकॉर्ड सुरक्षित रूप से संग्रहीत और आसानी से उपलब्ध।",

        featurePrivacyControlTitle: "गोपनीयता और नियंत्रण",
        featurePrivacyControlDesc:
          "आप तय करते हैं कि आपका निवारक स्वास्थ्य डेटा कैसे साझा किया जाए।",

        featureResearchImpactTitle: "प्रभावशाली अनुसंधान",
        featureResearchImpactDesc:
          "निवारक चिकित्सा में प्रगति को गुमनाम रूप से आगे बढ़ाने में मदद करें।",

        reviewsTitle: "मरीजों और स्वास्थ्य विशेषज्ञों द्वारा विश्वसनीय",
        reviewsSubtitle:
          "जानिए कैसे MEDXACT सक्रिय, निवारक देखभाल को सशक्त बनाता है।",

        review1Name: "रीना शर्मा",
        review1Role: "रोगी",
        review1Text:
          "MEDXACT ने मुझे मेरी रिपोर्टों के बारे में स्पष्ट, व्यक्तिगत सलाह दी। एआई अंतर्दृष्टि और जीवनशैली सुझावों ने मुझे अपने स्वास्थ्य पर नियंत्रण का एहसास दिलाया।",

        review2Name: "डॉ. आहूजा",
        review2Role: "चिकित्सा पेशेवर",
        review2Text:
          "डॉक्टर के रूप में, मैं मरीजों के साथ सुरक्षित रूप से सहयोग करके घंटों बचाता हूं। शुरुआती चेतावनी अलर्ट और लक्ष्य ट्रैकिंग वास्तव में निवारक चिकित्सा का समर्थन करते हैं।",

        review3Name: "एस. के.",
        review3Role: "गोपनीयता समर्थक",
        review3Text:
          "अंततः, एक ऐसा स्वास्थ्य प्लेटफॉर्म जो गोपनीयता का सम्मान करता है और उन्नत निवारक देखभाल प्रदान करता है।",

        ctaTitle: "स्मार्ट निवारक देखभाल के लिए तैयार हैं?",
        ctaSubtitle:
          "MEDXACT के साथ जुड़ें और यह बदलें कि आप और आपके डॉक्टर स्वास्थ्य का प्रबंधन कैसे करते हैं, जोखिमों को कैसे रोकते हैं और आगे कैसे रहते हैं।",
        ctaButton: "मेरी निवारक यात्रा शुरू करें",

        footerDescription:
          "सुरक्षित और बुद्धिमान तकनीक के माध्यम से स्मार्ट निवारक स्वास्थ्य देखभाल को सशक्त बनाना।",
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
