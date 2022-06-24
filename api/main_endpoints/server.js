const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [
    __dirname + '/routes/',
    __dirname + '/routes/User.js'
  ];
  const mainEndpointServer = new SceHttpServer(API_ENDPOINTS, 8080, '/mainendpoints/');
  mainEndpointServer.initializeEndpoints().then(() => {
    mainEndpointServer.openConnection();
  });
}

main();
