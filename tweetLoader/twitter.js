var elastic = require("./elastic.js");

const Twitter = require('twitter');
const fs = require('fs');
const readline = require('readline');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

elastic.waitForElasticAsync().then(()=>{

  const lineReader = readline.createInterface({
    input: fs.createReadStream('searches.txt')
  });

  var lines = [];
  lineReader.on('line', function(line) {
    lines.push(line);
  })

  lineReader.on('close', function() {
    client.get('search/tweets', {q: lines.join(" OR "), result_type: "recent", count: 100})
    .then(function (tweets) {
      var filterTweets = tweets.statuses.filter(t=>t.place);
      console.log(filterTweets);
      console.log(filterTweets.length);
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    })
  });

})
