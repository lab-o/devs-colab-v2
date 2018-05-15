// Import our classes
const ElasticClient = require("./elastic");
const TwitterClient = require("./twitter");
const twitterSearches = require('./twitter/searches');

// Build the app
(async () => {
    console.log('APP STARTED');
    const elastic = new ElasticClient();
    console.log('INIT ELASTIC');
    await elastic.initElastic();
    console.log('ELASTIC INITIALISED');
    const twitter = new TwitterClient(elastic);
    console.log('QUERY TWITTER AND INSERT');
    await twitter.queryTwitterAndInsert(twitterSearches);
    console.log('INSERT OK');
})()
.then(() => console.log('Application finished successfully.'))
.catch(console.error)