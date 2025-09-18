import {getRequestConfig} from 'next-intl/server';
import { getLocale } from '@/app/actions/locale';
 
export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const locale = await getLocale();
 
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    localePrefix: 'never',
    localeDetection: false,
    defaultLocale: 'no',
    locales: ['no', 'en'],
    runtimeConfig: {
      locale: locale,
    }
  };
});