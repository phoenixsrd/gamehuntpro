import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const SITES = [
  {
    name: "Epic Games",
    url: "https://store.epicgames.com/pt-BR/free-games",
    async scrape() {
      const { data } = await axios.get(this.url);
      const $ = cheerio.load(data);
      const freebies: any[] = [];
      $("section [data-component='CardGridDesktopBase'] a").each((_, el) => {
        const link = "https://store.epicgames.com" + $(el).attr("href");
        const title = $(el).find("span").first().text().trim();
        if (title) {
          freebies.push({ title, link, platform: "Epic Games" });
        }
      });
      return freebies;
    }
  },
  {
    name: "Steam",
    url: "https://store.steampowered.com/search/?specials=1&filter=free",
    async scrape() {
      const { data } = await axios.get(this.url);
      const $ = cheerio.load(data);
      const freebies: any[] = [];
      $(".search_result_row").each((_, el) => {
        const link = $(el).attr("href");
        const title = $(el).find(".title").text().trim();
        if (title) {
          freebies.push({ title, link, platform: "Steam" });
        }
      });
      return freebies;
    }
  }
];

async function main() {
  let all: any[] = [];
  for (const site of SITES) {
    try {
      const results = await site.scrape();
      all = all.concat(results);
    } catch (e) {
      console.error("Erro no scraping:", site.name, e);
    }
  }
  fs.writeFileSync("freebies.json", JSON.stringify(all, null, 2));
}

if (require.main === module) main();
