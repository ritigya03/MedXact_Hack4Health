"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";

export default function Settings() {
  const { t, i18n } = useTranslation();

  const [dummy, setDummy] = useState(0);

  // State for toggles
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    healthUpdates: true,
    researchDataSharing: false,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode).then(() => {
      console.log("Language switched to", langCode);
      setDummy((n) => n + 1);
    });
    setIsLanguageOpen(false);
  };

  return (
    <div className="min-h-screen">
        
      <div className="max-w-screen mx-auto px-[180px] py-12">
        <Navbar></Navbar>
        <div className="space-y-8 mt-10">
          {/* Change Password */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center space-x-2">
              <span className="text-blue-600">🔒</span>
              <span>{t("changePassword") || "Change Password"}</span>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Password updated (mock)");
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("currentPassword") || "Current Password"}
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("enterCurrentPassword") || "Enter current password"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("newPassword") || "New Password"}
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("enterNewPassword") || "Enter new password"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("confirmNewPassword") || "Confirm New Password"}
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t("confirmNewPassword") || "Confirm new password"}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {t("updatePassword") || "Update Password"}
                </button>
              </div>
            </form>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center space-x-2">
              <span className="text-teal-600">🔔</span>
              <span>{t("notificationSettings") || "Notification Settings"}</span>
            </h2>

            <div className="space-y-6">
              {[
                {
                  key: "emailNotifications",
                  label: t("emailNotifications") || "Email Notifications",
                  description: t("emailDescription") || "Receive notifications via email",
                  icon: "📧",
                },
                {
                  key: "smsNotifications",
                  label: t("smsNotifications") || "SMS Notifications",
                  description: t("smsDescription") || "Receive notifications via SMS",
                  icon: "📱",
                },
                {
                  key: "appointmentReminders",
                  label: t("appointmentReminders") || "Appointment Reminders",
                  description: t("appointmentDescription") || "Get reminders for upcoming appointments",
                  icon: "💬",
                },
                {
                  key: "healthUpdates",
                  label: t("healthUpdates") || "Health Updates",
                  description: t("healthDescription") || "Receive health tips and updates",
                  icon: "🩺",
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-400">{item.icon}</span>
                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings[item.key] ? "bg-teal-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings[item.key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    ></span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center space-x-2">
              <span className="text-blue-600">👥</span>
              <span>{t("privacySettings") || "Privacy Settings"}</span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400">💾</span>
                  <div>
                    <p className="font-medium text-slate-900">
                      {t("researchDataSharing") || "Research Data Sharing"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {t("researchDescription") ||
                        "Allow anonymized data to be used for medical research"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle("researchDataSharing")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.researchDataSharing
                      ? "bg-teal-600"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.researchDataSharing
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  ></span>
                </button>
              </div>

              {/* Example static entity */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">
                  {t("dataSharingConsents") || "Data Sharing Consents"}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  {t("dataSharingDescription") ||
                    "Organizations and entities you have granted consent to access your health data"}
                </p>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-slate-900">
                            Mumbai Research Institute
                          </h4>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          Research Organization
                        </p>
                        <p className="text-sm text-slate-500">
                          Purpose: Cardiovascular Health Study
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                          Granted on 2024-01-15
                        </p>
                      </div>
                      <button className="ml-4 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        {t("revoke") || "Revoke"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center space-x-2">
              <span className="text-teal-600">🌐</span>
              <span>{t("languagePreference") || "Language Preference"}</span>
            </h2>
            <div className="max-w-md">
              <label className="block text-sm mb-2">
                {t("selectLanguage") || "Select Language"}
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg flex justify-between items-center"
                >
                  <span>
                    {
                      languages.find((l) => l.code === i18n.language)?.label ||
                      "English"
                    }
                  </span>
                  <span>{isLanguageOpen ? "▲" : "▼"}</span>
                </button>
                {isLanguageOpen && (
                  <div className="absolute w-full mt-1 border border-slate-300 rounded-lg bg-white shadow z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex justify-between"
                      >
                        <span>{lang.label}</span>
                        {i18n.language === lang.code && (
                          <span className="text-teal-600">✔</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex justify-end space-x-4">
            <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
              {t("cancel") || "Cancel"}
            </button>
            <button
              onClick={() => alert("Settings saved (mock)")}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              {t("saveChanges") || "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
