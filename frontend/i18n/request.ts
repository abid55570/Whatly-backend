/** next-intl request config — picks locale from cookie or default. */
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

type Dict = { [k: string]: unknown };

/** Deep-merge `over` onto `base` (English fallback): any key missing from the
 *  active locale falls back to the English string, so the UI never shows a raw
 *  key while translations are still being filled in. */
function deepMerge(base: Dict, over: Dict): Dict {
  const out: Dict = { ...base };
  for (const key of Object.keys(over)) {
    const b = base[key];
    const o = over[key];
    if (
      b && o &&
      typeof b === "object" && typeof o === "object" &&
      !Array.isArray(b) && !Array.isArray(o)
    ) {
      out[key] = deepMerge(b as Dict, o as Dict);
    } else {
      out[key] = o;
    }
  }
  return out;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("locale")?.value;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  const en = (await import(`@/messages/en.json`)).default as Dict;
  const messages =
    locale === "en"
      ? en
      : deepMerge(en, (await import(`@/messages/${locale}.json`)).default as Dict);

  return {
    locale,
    messages,
  };
});
