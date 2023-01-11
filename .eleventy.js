const eleventySass = require("eleventy-sass");
const moment = require('moment');
moment.locale('en');

module.exports = function(eleventyConfig) {
  // Eleventy SASS
  eleventyConfig.addPlugin(eleventySass, [
    {
      compileOptions: {
        permalink: function(permalinkString, inputPath) {
          return (data) => {
            return data.page.filePathStem.replace(/^\/sass\//, "/css/") + ".css";
          };
        }
      }
    }
  ]);

  // Date formatting
  // from: https://keepinguptodate.com/pages/2019/06/creating-blog-with-eleventy/
  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });

  // Date formatting
  // from: https://keepinguptodate.com/pages/2019/06/creating-blog-with-eleventy/
  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).utc().format('LL'); // E.g. May 31, 2019
  });

  // CSS Passthrough
  eleventyConfig.addPassthroughCopy('css')
  // Images Passthrough
  eleventyConfig.addPassthroughCopy('img')

  return {
    passthroughFileCopy: true
  }
};
