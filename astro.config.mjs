// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Domínio de produção: gera canonical e URLs absolutas de OG/Twitter.
  // Sem isso o og:image sai como caminho relativo e o preview no WhatsApp fica sem imagem.
  site: "https://maxfocos.com.br",
  integrations: [
    // /enare é cópia da home para campanha, fica fora do sitemap
    sitemap({ filter: (page) => !page.includes("/enare") }),
  ],
});
