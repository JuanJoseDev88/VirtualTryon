import en from './en.json';
import es from './es.json';

export type Language = 'en' | 'es';
export type Translations = typeof en;

const translations: Record<Language, Translations> = {
  en,
  es
};

// Default language
export const DEFAULT_LANGUAGE: Language = 'en';

// Available languages
export const LANGUAGES: Language[] = ['en', 'es'];

// Language display names
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  es: 'Español'
};

/**
 * Get nested translation value by key path
 * @param obj - Translation object
 * @param path - Dot-separated key path (e.g., 'landing.hero.title')
 * @returns Translation value or key path if not found
 */
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? current[key] : undefined;
  }, obj) || path;
}

/**
 * Get translation for a specific key and language
 * @param key - Translation key (supports dot notation like 'landing.hero.title')
 * @param language - Target language
 * @returns Translated string or key if translation not found
 */
export function getTranslation(key: string, language: Language = DEFAULT_LANGUAGE): string {
  const translation = translations[language];
  if (!translation) {
    console.warn(`Language '${language}' not found, falling back to '${DEFAULT_LANGUAGE}'`);
    return getNestedValue(translations[DEFAULT_LANGUAGE], key);
  }
  
  return getNestedValue(translation, key);
}

/**
 * Create a translation function for a specific language
 * @param language - Target language
 * @returns Translation function
 */
export function createTranslator(language: Language = DEFAULT_LANGUAGE) {
  return (key: string): string => getTranslation(key, language);
}

/**
 * Detect language from browser or accept-language header
 * @param acceptLanguage - Accept-Language header value
 * @returns Detected language or default
 */
export function detectLanguage(acceptLanguage?: string): Language {
  if (!acceptLanguage) return DEFAULT_LANGUAGE;
  
  // Extract language codes from accept-language header
  const preferredLanguages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase())
    .map(lang => lang.split('-')[0]); // Remove region code
  
  // Find first supported language
  for (const lang of preferredLanguages) {
    if (LANGUAGES.includes(lang as Language)) {
      return lang as Language;
    }
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Validate if a string is a supported language
 * @param lang - Language string to validate
 * @returns True if language is supported
 */
export function isValidLanguage(lang: string): lang is Language {
  return LANGUAGES.includes(lang as Language);
}