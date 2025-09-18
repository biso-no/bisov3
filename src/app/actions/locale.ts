import { createSessionClient } from "@/lib/appwrite";

export async function getLocale() {
    const { account } = await createSessionClient();
    const user = await account.get();
    return user.prefs?.locale;
}

export async function setLocale(locale: string) {
    const { account } = await createSessionClient();
    const user = await account.get();
    const prefs = user.prefs;
    if (!user) {
        return null;
    }
    await account.updatePrefs({ ...prefs, locale });
}