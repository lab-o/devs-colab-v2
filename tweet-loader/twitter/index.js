const Twitter = require('twitter');

class TwitterClient {
    constructor({ elastic, twitter }) {
        const { consumer_key, consumer_secret, access_token_key, access_token_secret } = twitter;
        this.elastic = elastic;
        this.client = new Twitter({ consumer_key, consumer_secret, access_token_key, access_token_secret });
    }

    async queryTwitterAndInsert(search) {
        const tweets = await this.client.get('search/tweets', {
            q: search.join(" OR "),
            result_type: "recent",
            count: 100
        });

        // Select only the tweets with a place
        const filteredTweets = tweets.statuses
            .filter(tweet => tweet.place)
            .map(tweet => {
                return {
                    "id": tweet.id,
                    "location": tweet.place.bounding_box
                };
            });
        console.log('[Twitter]', filteredTweets);
        await this.elastic.insertTweets(filteredTweets);
        console.log(`[Twitter] ${filteredTweets.length} tweets inserted!`);
    }
}

module.exports = TwitterClient;