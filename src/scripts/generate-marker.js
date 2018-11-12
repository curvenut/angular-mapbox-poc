
// node src/scripts/generate-marker.js --nbr=200

var request = require("request");
var turf = require('@turf/turf');
var fs = require('fs');
var faker = require('faker');
var _ = require('lodash');

var geobase = require("./geobase.json");
var sampleSectionsFile = './sampleSections.json';
var sampleConsentsFile ='./sampleMarkers.json';;


var statusConsent = {
    DRAFT: 'draft', 
    SUBMITTED : 'submitted',
    ANALYSED : 'analyse',
    REVISE : 'revise',
    REVISED : 'revised',
    REJECTED :'rejected',
    CLOSED: 'closed',
    RETIRED : 'retired',
    APPROVED : 'approved'
};

var workType = {
    D1: 'D1', 
    D2 : 'D2',
    D3 : 'D3',
    D4 : 'D4'
};

var statusWP = {
    PRESENCE: 'presence', 
    ACTIVE : 'active',
    CLOSED : 'closed',
    FINISHED : 'finished'
};

const argv = require('minimist')(process.argv.slice(2));
var nbrGenerate = parseInt(argv['nbr']);



if(isNaN(nbrGenerate)) {
    console.error('missing argument -nbr to specify number of point to generate');
    process.exit(1);
}


console.log('Number of point to generate = '+ nbrGenerate);


function  generateData(nbrGenerate) {
    var temp ;
    var sampleSections;
    var sampleMarkersFC;

    sampleSections = generateSampleFC(nbrGenerate);
    sampleMarkersFC = createMarkersFC(sampleSections);


    for (let index = 0; index < nbrGenerate; index++) {
        temp = {

        }
    }


}


function generateSampleFC(nbrGenerate) {
    var sample;
    
    sample = turf.sample(geobase, nbrGenerate);
    fs.writeFileSync(sampleSectionsFile, JSON.stringify(sample), function(err){
        if(err) {
            return console.log(err);
        }
        console.log('Sampling '+ nbrGenerate + 'sections from geobase');
    });

    return sample;
}

/**
 * pour chacun des troncons generer un objet reduit du consentement sous forme geojson
 * de type point
 * 
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -73.60050201416016,
          45.52438983143154
        ]
      }
    }
 * @param {*} sampleSections  les troncons selectionnes de la geobase
 */
function createMarkersFC(sampleSections) {

    var features = [];
    var fc;
    var centroid;
    var feature;
    var prop;

    for (let index = 0; index <  sampleSections.features.length; index++) {
        const elem = sampleSections.features[index];

        prop = generateProperties(index);
        centroid = turf.centroid(elem);
        feature = turf.feature(centroid.geometry, prop);
        features.push(feature);

    }
 

    fc = turf.featureCollection(features);

    fs.writeFileSync(sampleConsentsFile, JSON.stringify(fc), function(err){
        if(err) {
            return console.log(err);
        }
        console.log('Creating  '+  fc.features.length + 'markers');
    });
}

/**
 * Genere les proprietes , lorsque l<index est pair, generere un consentmeent approvee avec
 * les infos de la workpresence
 */
function generateProperties(index) {
    var prop;
    var work;
    var consent;
    var wp;

    consent  = statusConsent[
        faker.helpers.replaceSymbolWithNumber(
            faker.random.arrayElement(Object.getOwnPropertyNames(statusConsent))
        )
    ];
    work  = workType[
        faker.helpers.replaceSymbolWithNumber(
            faker.random.arrayElement(Object.getOwnPropertyNames(workType))
        )
    ];
    wp = statusWP[
        faker.helpers.replaceSymbolWithNumber(
            faker.random.arrayElement(Object.getOwnPropertyNames(statusWP))
        )
    ];    

    var startDate = faker.date.recent();
    
    consent = index % 2 === 0 ? 'approved' : consent;

    prop = {
        applicationID : faker.random.number(10000),
        statusConsent: consent,
        refApplicant: faker.random.number(10000),
        workType: work,
        startDate: startDate,
        endDate: faker.date.future(1,startDate),
        applicantName: faker.name.findName()
    };


    if(prop.statusConsent === 'approved') {
        prop['statusWP'] = wp;
        prop['company'] = faker.company.companyName();
        prop['wpLastUpdate'] = faker.date.future(1,startDate);
        console.log(" ******* statusConsent = "+ consent);
        console.log("prop  = %o", prop);

    }

    return prop;

}


generateData(nbrGenerate);







