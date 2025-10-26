import en from './en.json';

const catalog = { en };

export function useI18n(locale = 'en') {
  const t = (key) => {
    return (catalog[locale] && catalog[locale][key]) || key;
  };
  return { t };
}
