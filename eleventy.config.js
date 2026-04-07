const i18n = require("./src/_data/i18n.json");
const site = require("./src/_data/site.json");

module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Events collection, sorted by date ascending (upcoming first)
  eleventyConfig.addCollection("events", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/events/*.md")
      .sort((a, b) => a.date - b.date);
  });

  // Announcements collection, sorted by date descending (newest first)
  eleventyConfig.addCollection("announcements", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/announcements/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Translation filter: {{ "nav.home" | t }}
  // Uses page lang, falls back to site default lang
  eleventyConfig.addFilter("t", function (key) {
    const lang = this.ctx.lang || site.lang || "it";
    const keys = key.split(".");
    let value = i18n[lang];
    for (const k of keys) {
      if (!value) break;
      value = value[k];
    }
    return value || key;
  });

  // Locale-aware date formatting
  eleventyConfig.addFilter("dateFormat", function (date) {
    const lang = this.ctx.lang || site.lang || "it";
    const locale = lang === "it" ? "it-IT" : "en-US";
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
