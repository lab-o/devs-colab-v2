// Import our classes
const ElasticClient = require("./elastic");
const TwitterClient = require("./twitter");

// Import our data
const tweetIndice = require('./elastic/indices/tweet');
const twitterSearches = require('./twitter/searches');

// Build the app
(async () => {
    console.log('[Main] App started.');
    const elastic = new ElasticClient([
        'elastic_first:9200',
        'elastic_second:9200'
    ]);

    console.log('[Main] Wait for elastic\'s ready state.');
    await elastic.waitForReadyState();

    console.log('[Main] Check indices.');
    await elastic.createIndices([ tweetIndice ]);

    console.log('[Main] Initialisaton OK, set-up twitter.');
    const twitter = new TwitterClient({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

    console.log('[Main] Query tweets.');
    const tweets = await twitter.getTweets(twitterSearches);

    console.log(`[Main] Insert ${tweets.length} tweet(s) in elastic.`);
    await elastic.insertTweets(tweets);
})()
.then(() => console.log('[Main] Application finished successfully.'))
.catch(console.error)