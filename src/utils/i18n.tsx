import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (en) => en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('tejas_lang');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tejas_lang', lang);
    } catch {
      // ignore storage failure
    }
  }, [lang]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'hi' : 'en'));
  const t = (en: string, hi: string) => (lang === 'hi' ? hi : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}

export const CATEGORY_HINDI_NAMES: Record<string, string> = {
  'spices-masala': 'मसाले व पाउडर',
  'khada-masala': 'खड़ा मसाला',
  'agarbatti': 'प्रीमियम अगरबत्ती',
  'dhoop': 'हर्बल धूप व कोन',
  'pooja-samagri': 'पूजा सामग्री',
  'dry-fruits': 'ड्राई फ्रूट्स व मेवे',
  'oils-ghee': 'शुद्ध तेल व घी',
  'kirana-dals': 'दाल, चावल व किराना',
  'snacks-namkeen': 'स्नैक्स व नमकीन',
  'tea-beverages': 'चाय व पेय पदार्थ',
};
