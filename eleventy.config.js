const i18n = require("./src/_data/i18n.json");
const site = require("./src/_data/site.json");

// All dates are shown and compared in the venue's time zone,
// regardless of where the site is built (Netlify builds in UTC).
const TIME_ZONE = "Europe/Rome";

module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Self-hosted variable fonts (Latin subset only)
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2":
      "fonts/unbounded.woff2",
    "node_modules/@fontsource-variable/martian-mono/files/martian-mono-latin-standard-normal.woff2":
      "fonts/martian-mono.woff2",
  });

  // Calendar day in Rome as "YYYY-MM-DD", so string comparison orders days
  function romeDay(date) {
    return new Date(date).toLocaleDateString("sv-SE", { timeZone: TIME_ZONE });
  }

  // Events split at build time: anything dated today or later is upcoming.
  // The site must be rebuilt for events to move from upcoming to past.
  function isUpcoming(date) {
    return romeDay(date) >= romeDay(new Date());
  }

  // Upcoming events, sorted by date ascending (soonest first)
  eleventyConfig.addCollection("upcomingEvents", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/events/*.md")
      .filter((event) => isUpcoming(event.date))
      .sort((a, b) => a.date - b.date);
  });

  // Past events, sorted by date descending (most recent first)
  eleventyConfig.addCollection("pastEvents", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/events/*.md")
      .filter((event) => !isUpcoming(event.date))
      .sort((a, b) => b.date - a.date);
  });

  // Upcoming/past check for templates: {% if page.date | isUpcoming %}
  eleventyConfig.addFilter("isUpcoming", isUpcoming);

  // Announcements collection, sorted by date descending (newest first)
  eleventyConfig.addCollection("announcements", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/announcements/*.md")
      .sort((a, b) => b.date - a.date);
  });

  function translate(ctx, key) {
    const lang = ctx.lang || site.lang || "it";
    const keys = key.split(".");
    let value = i18n[lang];
    for (const k of keys) {
      if (!value) break;
      value = value[k];
    }
    return value || key;
  }

  // Translation filter: {{ "nav.home" | t }}
  // Uses page lang, falls back to site default lang
  eleventyConfig.addFilter("t", function (key) {
    return translate(this.ctx, key);
  });

  // Counted noun from i18n "count.<noun>": {{ 2 | countOf("event") }} -> "2 eventi"
  eleventyConfig.addFilter("countOf", function (n, noun) {
    const form = n === 1 ? "one" : "other";
    return `${n} ${translate(this.ctx, `count.${noun}.${form}`)}`;
  });

  function localeOf(ctx) {
    const lang = ctx.lang || site.lang || "it";
    return lang === "it" ? "it-IT" : "en-US";
  }

  function dateParts(date, locale, options) {
    const parts = new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, ...options })
      .formatToParts(new Date(date));
    return Object.fromEntries(parts.map((p) => [p.type, p.value]));
  }

  // Locale-aware date formatting: "24 luglio 2026"
  eleventyConfig.addFilter("dateFormat", function (date) {
    return new Date(date).toLocaleDateString(localeOf(this.ctx), {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Start time: "19:46"
  eleventyConfig.addFilter("timeFormat", function (date) {
    const p = dateParts(date, localeOf(this.ctx), { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    return `${p.hour}:${p.minute}`;
  });

  // Day and month for event cards: "24.07"
  eleventyConfig.addFilter("dayMonth", function (date) {
    const p = dateParts(date, localeOf(this.ctx), { day: "2-digit", month: "2-digit" });
    return `${p.day}.${p.month}`;
  });

  // Year, weekday and start time for event cards: "2026 / ven / 19:46"
  eleventyConfig.addFilter("dateMeta", function (date) {
    const p = dateParts(date, localeOf(this.ctx), {
      year: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    return `${p.year} / ${p.weekday.replace(".", "")} / ${p.hour}:${p.minute}`;
  });

  // Machine-readable date for <time datetime="">
  eleventyConfig.addFilter("isoDate", function (date) {
    return new Date(date).toISOString();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
