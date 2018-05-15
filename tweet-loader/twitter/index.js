const Twitter = require('twitter');

class TwitterClient {
    constructor(elastic) {
        this.elastic = elastic;
        this.client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });
    }

    async queryTwitterAndInsert(search) {
        const tweets = await this.client.get('search/tweets', {
            q: search.join(" OR "),
            result_type: "recent",
            count: 100
        });

        // Select only the tweets with a place
        const filteredTweets = tweets.statuses
            .filter(t=>t.place)
            .map(tweet => {
                return {
                    "id": tweet.id,
                    "location": tweet.place.bounding_box
                };
            });
        console.log(filteredTweets);
        await this.elastic.insertTweets(filteredTweets);
        console.log(`${filteredTweets.length} tweets inserted!`);
    }
}

module.exports = TwitterClient;