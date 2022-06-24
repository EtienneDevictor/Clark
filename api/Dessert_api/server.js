const { SceHttpServer } = require('../util/SceHttpServer');

function main() {
  const API_ENDPOINTS = [
    __dirname + '/routes/Dessert.js',
  ];
  const dessertServer = new SceHttpServer(API_ENDPOINTS, 8088, '/Dessert_api/');
  dessertServer.initializeEndpoints().then(() => {
    dessertServer.openConnection();
  });
}

main();