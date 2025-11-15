import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

type Language = 'en' | 'es';
type NestedTranslations = typeof enTranslations;

export const translations = {
  en: enTranslations,
  es: esTranslations,
} as const;

export type { Language, NestedTranslations };

// Helper function to get nested translation values
export function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : path;
  }, obj);
}
