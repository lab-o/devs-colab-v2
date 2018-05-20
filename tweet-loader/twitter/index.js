// Import twitter module
const Twitter = require('twitter');

// Create our twitter model
class TwitterClient {
    constructor(settings) {
        this.client = new Twitter(settings);
    }

    async getTweets(search) {
        const tweets = await this.client.get('search/tweets', {
            q: search.join(" OR "),
            result_type: "recent",
            count: 100
        });

        // Select only the tweets with a place
        return tweets.statuses
            .filter(tweet => tweet.place)
            .map(tweet => ({
                "id": tweet.id,
                "location": tweet.place.bounding_box
            }))
    }
}

module.exports = TwitterClient;