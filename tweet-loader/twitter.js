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

async function queryTwitterAndInsert(search)
{
  var tweets = await client.get('search/tweets', {q: search.join(" OR "), result_type: "recent", count: 100});
  // Select only the tweets with a place
  var filterTweets = tweets.statuses
    .filter(t=>t.place)
    .map(t => {
      return {
        "id": t.id,
        "location": t.place.bounding_box
      };
    });
  console.log(filterTweets);
  await elastic.insertTweets(filterTweets);
  console.log(`${filterTweets.length} tweets inserted!`);
}

elastic.waitForElasticAsync().then(()=>{
  const lineReader = readline.createInterface({
    input: fs.createReadStream('searches.txt')
  });

  var lines = [];
  lineReader.on('line', function(line) {
    lines.push(line);
  })

  lineReader.on('close', function() {
    queryTwitterAndInsert(lines)
      .catch(function (error) {
        console.log(error);
        throw error;
      })
  });
}).catch(function (error) {
  console.log(error);
  throw error;
})
