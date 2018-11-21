// node scripts/mocks/geobase.js

var request = require("request");
var fs = require('fs');

let geobaseUrl = "http://donnees.ville.montreal.qc.ca/dataset/984f7a68-ab34-4092-9204-4bdfcca767c5/resource/9d3d60d8-4e7f-493e-8d6a-dcd040319d8d/download/geobase.json"

console.log('Sauvegarde geobase');


 request.get(geobaseUrl, (error, response, body) => {
    if(error) {
        return console.error(error);
    }

    fs.writeFile('./geobase.json', body, function (err) {
        if (err) throw err;
        console.error('Géobase sauvegardé');
    });
});