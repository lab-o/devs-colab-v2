const { Client } = require('elasticsearch');
const TweetIndice = require('./indices/tweet');
const pause = require('../services/pause');

class ElasticClient {
    constructor(hosts) {
        this.client = new Client({ hosts, log: 'error' })
        console.log(`[Elastic] Create elasticsearch client from hosts (${hosts.join(', ')}).`);
    }

    async waitForReadyState() {
        const state = await this.client.ping({ requestTimeout: 30000 })
        .catch(e => console.log(`[Elastic] ${e.message}.`));
        if (!state) {
            console.log('[Elastic] Retry state\'s verification in 5 seconds.');
            await pause(5000);
            return await this.waitForReadyState();
        }
        console.log('[Elastic] Client are ready.');
        return state;
    }

    async createIndices() {
        console.log('[Elastic] Check if "tweet" index exists.');
        const indiceExists = await this.client.indices.exists({ index: 'tweet' });
        if (indiceExists) console.log('[Elastic] Index "tweet" already exists, skipping creation process.');
        else {
            console.log('[Elastic] Index does not exist, creating it.');
            await this.client.indices.create(TweetIndice);
            console.log('[Elastic] Index "tweet" created.');
        }
    }

    async insertTweets(tweets) {
        console.log(`[Elastic] Insert ${tweets.length} tweets.`);
        const body = [];
        for (const tweet of tweets) {
            body.push({ index: { _index: 'tweet', _type: 'tweet', _id: tweet.id }});
            body.push({ location : tweet.location })
        }
        return this.client.bulk({ body });
    }
}

module.exports = ElasticClient;