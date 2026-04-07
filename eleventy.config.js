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

  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", function (date) {
    return new Date(date).toLocaleDateString("en-US", {
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
