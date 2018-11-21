//usage :  node scripts/mocks/./generate-markers.js --nbr=200

var turf = require('@turf/turf');
var fs = require('fs');
var faker = require('faker');
var _ = require('lodash');

var geobase = require("../../geobase.json");
var sampleSectionsFile = './sampleSections.json';
var sampleConsentsFile ='./sampleMarkers.json';;


var statusConsent = {
    DRAFT: 'draft', 
    SUBMITTED : 'submitted',
    REVIEW : 'review',
    REVISE : 'revise',
    REVISED : 'revised',
    REJECTED :'rejected',
    GRANTED : 'granted',
    RETIRED : 'retired',
    CLOSED: 'closed',    
};


var workType = {
    D1: 'D1 - AÉRIENNE - EXISTANT', 
    D2 : 'D2 - AÉRIENNE - NOUVEAU',
    D3 : 'D3 - SOUTERRAINE - EXISTANT',
    D4 : 'D4 - SOUTERRAINE - NOUVEAU'
};

var statusWP = {
    PRESENCE: 'teampresence', 
    BLOCK : 'ongoingblock',
    NOBLOCK: 'removeblock',
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

function getIconType(consent, wp) {
    var type = 'marker-orange';

    if( consent === statusConsent.CLOSED || 
        consent === statusConsent.RETIRED || 
        consent === statusConsent.REJECTED) {        
        type = 'marker-gray';
    } else if (consent === statusConsent.GRANTED && 
        !wp) {
        type = 'marker-green';
    } else if (consent === statusConsent.GRANTED && 
        wp) {
                
        if( wp === statusWP.PRESENCE ) {
            //type = 'wp-presence';
            type = 'marker-black';
        } else if( wp === statusWP.BLOCK ) {
            //type = 'wp-ongoingblock';
            type = 'marker-red';
        } else if( wp === statusWP.NOBLOCK) {
            //type = 'wp-noblock';
            type = 'marker-green';
        } else {
            //type = 'wp-finished';
            type = 'marker-lightgreen';
        }
    }

    return type;
}


/**
 * Genere les proprietes , lorsque l<index est pair, generere un consentmeent approvee avec
 * les infos de la workpresence
 */
function generateProperties(index) {
    var prop = {};
    var work;
    var cmStatus;
    var wpStatus;

    cmStatus  = statusConsent[
        faker.helpers.replaceSymbolWithNumber(
            faker.random.arrayElement(Object.getOwnPropertyNames(statusConsent))
        )
    ];
    work  = workType[
        faker.helpers.replaceSymbolWithNumber(
            faker.random.arrayElement(Object.getOwnPropertyNames(workType))
        )
    ];
    wpStatus = statusWP[
        faker.helpers.replaceSymbolWithNumber(
            faker.random.arrayElement(Object.getOwnPropertyNames(statusWP))
        )
    ];    

    var startDate = faker.date.recent();
    
    cmStatus = index % 2 === 0 ? statusConsent.GRANTED : cmStatus;


    prop = {
        applicationID : faker.random.number(9000),
        statusConsent: cmStatus,
        refApplicant: faker.random.number(10000),
        workType: work,
        startDate: startDate,
        endDate: faker.date.future(1,startDate),
        applicantName: faker.name.findName(),
        iconType: getIconType(cmStatus, wpStatus)
    };

    if(cmStatus === statusConsent.GRANTED) {
        prop['statusWP'] = wpStatus;
        prop['company'] = faker.company.companyName();
        prop['wpLastUpdate'] = faker.date.future(1,startDate);
        //console.log(" ******* statusConsent = "+ cmStatus + '  mtltravail status= ' + wpStatus);
    }

    return prop;

}





generateData(nbrGenerate);

