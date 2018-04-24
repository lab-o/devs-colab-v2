var elasticsearch = require("elasticsearch");

var elasticClient = new elasticsearch.Client({
  host: 'elastic:9200',
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

var initElastic = async function(){
  while (!await pingElastic()) {
    console.log("elastic is not ready");
    await sleep(2000);
  }
  //elasticClient.
  //TODO : initialiser les indexs si première initialisation
  //TODO : faire un point d'entrée pour attendre la fin de l'initialisation à partir de l'extérieur
}
initElastic();
