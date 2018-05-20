module.exports = {
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
}