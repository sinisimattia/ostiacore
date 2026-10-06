const i18n = require("./src/_data/i18n.json");
const site = require("./src/_data/site.json");

module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Events split at build time: anything dated today or later is upcoming.
  // The site must be rebuilt for events to move from upcoming to past.
  function isUpcoming(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
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
