import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Japanese translations
import jaCommon from "./locales/ja/common.json";
import jaAdmin from "./locales/ja/admin.json";
import jaStaff from "./locales/ja/staff.json";
import jaGuest from "./locales/ja/guest.json";
import jaTypes from "./locales/ja/types.json";
import jaAuth from "./locales/ja/auth.json";

// English translations
import enCommon from "./locales/en/common.json";
import enAdmin from "./locales/en/admin.json";
import enStaff from "./locales/en/staff.json";
import enGuest from "./locales/en/guest.json";
import enTypes from "./locales/en/types.json";
import enAuth from "./locales/en/auth.json";

export const resources = {
  ja: {
    common: jaCommon,
    admin: jaAdmin,
    staff: jaStaff,
    guest: jaGuest,
    types: jaTypes,
    auth: jaAuth,
  },
  en: {
    common: enCommon,
    admin: enAdmin,
    staff: enStaff,
    guest: enGuest,
    types: enTypes,
    auth: enAuth,
  },
} as const;

export const supportedLanguages = [
  { code: "ja", name: "日本語", nativeName: "日本語" },
  { code: "en", name: "English", nativeName: "English" },
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number]["code"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ja",
    defaultNS: "common",
    ns: ["common", "admin", "staff", "guest", "types", "auth"],

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
