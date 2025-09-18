import {getRequestConfig} from 'next-intl/server';
import { getLocale } from '@/app/actions/locale';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/i18n/config';
import { loadMessages } from '../../../messages';

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = await getLocale();

  return {
    locale,
    messages: await loadMessages(locale),
    localePrefix: 'never',
    localeDetection: false,
    defaultLocale: DEFAULT_LOCALE,
    locales: [...SUPPORTED_LOCALES],
    runtimeConfig: {
      locale: locale,
    }
  };
});