var elasticsearch = require("elasticsearch");

var elasticClient = new elasticsearch.Client({
  hosts: ['elastic1:9200', 'elastic2:9200'],
  log: 'error'
});

var pingElastic = function() {
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function initElastic() {
    while (!await pingElastic()) {
      console.log("elastic is not ready");
      await sleep(2000);
    }

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
    }
}
let readyPromise = initElastic();

exports.waitForElasticAsync = function () {
  return readyPromise;
}

exports.insertTweets = function(tweets) {
  let body = [];

  for (t of tweets) {
    body.push({ index:  { _index: 'tweet', _type: 'tweet', _id: t.id } });
    body.push({ location : t.location})
  }

  return elasticClient.bulk({
    "body": body
  });
}
