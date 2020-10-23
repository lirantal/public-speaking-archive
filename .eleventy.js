const fetch = require('node-fetch');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { getEmojiFlag } = require('countries-list')

async function getTweetText(tweetUrl) {

  const tweetUrlEncoded = encodeURIComponent(tweetUrl)
  const response = await fetch(`https://publish.twitter.com/oembed?url=${tweetUrlEncoded}`);
	const body = await response.json();

  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);
 
  const sanitizedTweetHTML = DOMPurify.sanitize(body.html);
  return sanitizedTweetHTML

}

function yearsCollection(collection) {
  const posts = collection.getFilteredByTag('post');
  const yearlyPostsDictionary = {}

  posts.forEach((postItem) => {
    const yearOfPost = new Date(postItem.data.date).getFullYear()
    if (yearlyPostsDictionary[yearOfPost]) {
      yearlyPostsDictionary[yearOfPost] = yearlyPostsDictionary[yearOfPost].concat(postItem)
    } else {
      yearlyPostsDictionary[yearOfPost] = [postItem]
    }
  })

  return yearlyPostsDictionary
}

async function resolveTweetText(value) {
  return await getTweetText(value)
}

function resolveCountryEmoji(value) {
  return getEmojiFlag(value)
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("contentByYear", yearsCollection)
  eleventyConfig.addLiquidShortcode("tweetText", resolveTweetText)
  eleventyConfig.addLiquidShortcode("countryEmoji", resolveCountryEmoji)
}