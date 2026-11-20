import { createContext, useContext } from 'react'

export const languages = { en: 'English', de: 'Deutsch', ru: 'Русский' } as const
export type Language = keyof typeof languages
export type LocalizedText = Record<Language, string>

export const languageStorageKey = 'dalamanway-language'

export function parseLanguage(value: string | null): Language {
  return value === 'de' || value === 'ru' ? value : 'en'
}

export const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void } | null>(null)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('The public site requires a language provider.')
  return context
}
