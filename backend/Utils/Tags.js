const natural = require('natural');
const sw = require('stopword');

function extractTags(reviews){
    const alltext = reviews.map(review => review.reviewText).join(' ').toLowerCase();
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(alltext);
    const filteredTokens = sw.removeStopwords(tokens);

    const freqMap = {};
  filteredTokens.forEach(word => {
    if (word.length >= 3) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }

  
  });
const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 5).map(([word]) => word); 
}
module.exports = extractTags;
