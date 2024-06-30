import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

async function initI18n() {
  await i18next
    .use(
      resourcesToBackend((language: string, namespace: string) =>
        import(`./translations/${language}/${namespace}.json`).then((module) => module.default),
      ),
    )
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
}

initI18n();

export default i18next;
