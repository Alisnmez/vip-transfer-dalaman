import { useEffect, useState, type ReactNode } from 'react'
import { LanguageContext, languageStorageKey, parseLanguage, type Language } from './language'

function savedLanguage(): Language {
  try {
    return parseLanguage(window.localStorage.getItem(languageStorageKey))
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(savedLanguage)

  useEffect(() => {
    const previousLanguage = document.documentElement.lang
    document.documentElement.lang = language
    try {
      window.localStorage.setItem(languageStorageKey, language)
    } catch {
      // The current session still works if the browser blocks storage.
    }
    return () => { document.documentElement.lang = previousLanguage }
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}
