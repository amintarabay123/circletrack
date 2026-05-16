import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, type Lang, type TranslationKeys } from "@/constants/i18n";

const LANG_KEY = "circletrack_lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => translations.en[key],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((stored) => {
      if (stored === "es" || stored === "en") setLangState(stored);
    });
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(LANG_KEY, l);
  };

  const t = (key: TranslationKeys): string => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
