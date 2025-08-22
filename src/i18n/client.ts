import type { Language, Translations } from './index';

// Client-side i18n manager
class I18nManager {
  private currentLanguage: Language = 'en';
  private translations: Record<Language, Translations> = {} as Record<Language, Translations>;
  private observers: Array<(language: Language) => void> = [];

  constructor() {
    // Load initial language from localStorage or browser
    this.loadLanguagePreference();
  }

  /**
   * Load language preference from localStorage or detect from browser
   */
  private loadLanguagePreference(): void {
    if (typeof window === 'undefined') return;

    // Try to get from localStorage first
    const stored = localStorage.getItem('vtryon-language');
    if (stored && this.isValidLanguage(stored)) {
      this.currentLanguage = stored as Language;
      return;
    }

    // Detect from browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.isValidLanguage(browserLang)) {
      this.currentLanguage = browserLang as Language;
    }
  }

  /**
   * Load translations for a specific language
   */
  private async loadTranslations(language: Language): Promise<Translations> {
    if (this.translations[language]) {
      return this.translations[language];
    }

    try {
      const translations = await import(`./${language}.json`);
      this.translations[language] = translations.default || translations;
      return this.translations[language];
    } catch (error) {
      console.error(`Failed to load translations for ${language}:`, error);
      throw error;
    }
  }

  /**
   * Validate if a string is a supported language
   */
  private isValidLanguage(lang: string): boolean {
    return ['en', 'es'].includes(lang);
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' ? current[key] : undefined;
    }, obj) || path;
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Set language and notify observers
   */
  async setLanguage(language: Language): Promise<void> {
    if (!this.isValidLanguage(language)) {
      console.warn(`Invalid language: ${language}`);
      return;
    }

    // Load translations if not already loaded
    await this.loadTranslations(language);

    this.currentLanguage = language;
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('vtryon-language', language);
    }

    // Notify observers
    this.observers.forEach(callback => callback(language));
  }

  /**
   * Get translation for a key
   */
  async translate(key: string, language?: Language): Promise<string> {
    const targetLanguage = language || this.currentLanguage;
    
    try {
      await this.loadTranslations(targetLanguage);
      const translations = this.translations[targetLanguage];
      return this.getNestedValue(translations, key);
    } catch (error) {
      console.error(`Translation error for key '${key}':`, error);
      return key;
    }
  }

  /**
   * Subscribe to language changes
   */
  onLanguageChange(callback: (language: Language) => void): () => void {
    this.observers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  /**
   * Update all elements with data-i18n attribute
   */
  async updatePageTranslations(): Promise<void> {
    if (typeof document === 'undefined') return;

    const elements = document.querySelectorAll('[data-i18n]');
    
    for (const element of elements) {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const translation = await this.translate(key);
        element.textContent = translation;
      }
    }

    // Update placeholder attributes
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    for (const element of placeholderElements) {
      const key = element.getAttribute('data-i18n-placeholder');
      if (key) {
        const translation = await this.translate(key);
        (element as HTMLInputElement).placeholder = translation;
      }
    }

    // Update alt attributes
    const altElements = document.querySelectorAll('[data-i18n-alt]');
    for (const element of altElements) {
      const key = element.getAttribute('data-i18n-alt');
      if (key) {
        const translation = await this.translate(key);
        (element as HTMLImageElement).alt = translation;
      }
    }

    // Update title attributes
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    for (const element of titleElements) {
      const key = element.getAttribute('data-i18n-title');
      if (key) {
        const translation = await this.translate(key);
        element.setAttribute('title', translation);
      }
    }
  }

  /**
   * Initialize client-side i18n
   */
  async init(): Promise<void> {
    // Load initial translations
    await this.loadTranslations(this.currentLanguage);
    
    // Update page translations
    await this.updatePageTranslations();

    // Listen for language change events
    this.onLanguageChange(async () => {
      await this.updatePageTranslations();
    });
  }
}

// Create global instance
const i18n = new I18nManager();

// Export for use in components
export default i18n;

// Export types
export type { Language, Translations };

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
  });
}