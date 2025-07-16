import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang).then(() => {
      console.log("Language switched to", lang);
    });
    setOpen(false);
  };

  return (
    <div className="fixed bottom-3 right-5 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-teal-600 text-white rounded-full px-4 py-2 shadow-lg flex items-center space-x-2"
        >
          <span role="img" aria-label="language">
            🌐
          </span>
          <span className="hidden sm:inline">
            {
              languages.find((l) => l.code === i18n.language)?.label ||
              "English"
            }
          </span>
          <span>{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    i18n.language === lang.code
                      ? "text-teal-600 font-semibold"
                      : "text-gray-700"
                  } hover:bg-gray-100`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
