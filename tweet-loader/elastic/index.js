const { Client } = require('elasticsearch');

class ElasticClient {
    constructor() {
        this.client = new Client({
            hosts: ['elastic_first:9200', 'elastic_second:9200'],
            log: 'error'
        })
    }

    async pingElastic() {
        return new Promise(function(resolve, reject) {
            elasticClient.ping({
                requestTimeout: 30000,
            }, function (error) {
                if (error) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        })
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async initElastic() {
        while (!await pingElastic()) {
            console.log("elastic is not ready");
            await sleep(2000);
        }
        console.log('init OK');
        const indiceExists = await elasticClient.indices.exists({ index: 'tweet' });
    
        if (!indiceExists) {
            console.log("Index does not exist, creating it.");
            await elasticClient.indices.create({
                index: 'tweet',
                body: {
                    mappings: {
                        "tweet" : {
                            "properties" : {
                                "location" : {
                                    "type": "geo_shape"
                                }
                            }
                        }
                    }
                }
            })
        } else console.log('index already exists');
    }

    async insertTweets(tweets) {
        const body = [];
        for (const tweet of tweets) {
            body.push({ index:    { _index: 'tweet', _type: 'tweet', _id: tweet.id } });
            body.push({ location : tweet.location})
        }
        return this.client.bulk({ body });
    }
}

module.exports = ElasticClient;