const { Client } = require('elasticsearch');
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

    async createIndice(indice) {
        console.log(`[Elastic] Check if "${indice.index}" index exists.`);
        const indiceExists = await this.client.indices.exists({ index: indice.index });
        if (indiceExists) console.log(`[Elastic] Index "${indice.index}" already exists, skipping creation process.`);
        else {
            console.log(`[Elastic] Index "${indice.index}" does not exist, creating it.`);
            await this.client.indices.create(indice);
            console.log(`[Elastic] Index "${indice.index}" created.`);
        }
    }

    async createIndices(indices) {
        return await Promise.all(
            indices
                .map(indice => this.createIndice(indice))
        )
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