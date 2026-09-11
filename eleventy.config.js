import { HtmlBasePlugin } from "@11ty/eleventy";
import { imageSize } from "./lib/imgsize.js";

// GitHub Pages serves this repo from a sub-path. The client's own server
// serves it from the root. PATH_PREFIX switches between the two without
// touching a single template: HtmlBasePlugin rewrites the URLs at build time.
const PATH_PREFIX = process.env.PATH_PREFIX || "/";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Static passthrough: assets and the CMS admin ship as-is.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/root": "." });

  // Gate types, ordered by their `order` field.
  eleventyConfig.addCollection("gates", (api) =>
    api.getFilteredByGlob("src/content/gates/*.md").sort((a, b) => a.data.order - b.data.order)
  );

  eleventyConfig.addCollection("gallery", (api) =>
    api.getFilteredByGlob("src/content/gallery/*.md").sort((a, b) => a.data.order - b.data.order)
  );

  // Current year for the footer.
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  // Turn "+371 29146306" into a tel: href.
  eleventyConfig.addFilter("telHref", (v) => "tel:" + String(v || "").replace(/[^\d+]/g, ""));

  // Intrinsic image dimensions, read from the file at build time so the
  // client never has to type width/height into the CMS.
  eleventyConfig.addFilter("imgW", (src) => (imageSize(src) || {}).width || "");
  eleventyConfig.addFilter("imgH", (src) => (imageSize(src) || {}).height || "");

  // Escape a value for use inside a JSON-LD string.
  eleventyConfig.addFilter("jsonStr", (v) => JSON.stringify(String(v == null ? "" : v)).slice(1, -1));

  return {
    pathPrefix: PATH_PREFIX,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
