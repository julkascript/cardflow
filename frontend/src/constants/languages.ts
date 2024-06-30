import BG from '../../assets/flags/bg.svg';
import EN from '../../assets/flags/uk.svg';

export const languages: Readonly<Record<languageCode, Language>> = Object.freeze({
  bg: {
    name: 'Български',
    code: 'bg',
    flag: BG,
  },
  en: {
    name: 'English',
    code: 'en',
    flag: EN,
  },
});

export type languageCode = 'bg' | 'en';

type Language = {
  name: string;
  code: languageCode;
  flag: string;
};
