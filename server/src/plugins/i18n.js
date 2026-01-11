import fp from "fastify-plugin";
import i18next from "i18next";

import pl from "../locales/pl.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };

async function i18nPlugin(fastify) {
  await i18next.init({
    lng: "pl",
    fallbackLng: "en",
    resources: {
      pl: { translation: pl },
      en: { translation: en },
    },
  });

  // Add "t" to requests
  fastify.addHook("onRequest", async (request) => {
    const lang = request.headers["accept-language"]?.split(",")[0] || "pl";
    request.t = i18next.getFixedT(lang);
  });
}

export default fp(i18nPlugin);
