let HTMLParser = require('node-html-parser');
let fs = require('fs');


const aquapolis = require('./praias-fluviais-de-portugal-aquapolis.json');
let locationsdata = require('../locations-extra-info.json');

const placemarks = aquapolis.Document.Folder.Placemark;

let indexed_placemarks = {};
let locationsAdditionalInfo = {};




placemarks.forEach( placemark => {
    let parsedDescription; 
    let aquapolis_id = "";
    let aquapolis_url = ""; 
    let aquapolis_summary = ""; 
    try { 
        parsedDescription = HTMLParser.parse( placemark.description ) 
        const regex = /(aquapolis\.com\.pt\/[a-z0-9\-]+[\/]*)(.*)/;
        let contents = parsedDescription.textContent.match(regex);
        
        
        if(contents){
            aquapolis_id = contents[1].split("/")[1];
            aquapolis_url = 'https://' + contents[1];
            aquapolis_summary = contents[2]; 
        } else {
            console.log(parsedDescription.textContent)
        }

    } catch(e) { 
        console.log("didn't parse: '" + placemark.description + "'") ; 
    }

    let extendedData = placemark.ExtendedData;


    indexed_placemarks[ aquapolis_id ] = {
        id: aquapolis_id,
        name: placemark.name,        
        url: aquapolis_url,
        summary: aquapolis_summary,
        description: placemark.description,
        coordinates: placemark.Point.coordinates,
        media_links: ( extendedData ? placemark.ExtendedData.Data.value.split(" ") : [] )
    }
})


//fs.writeFileSync("indexed_placemarks.json",JSON.stringify(indexed_placemarks, null, '\t'));


Object.keys(locationsdata).forEach( locationKey => {
    const location = locationsdata[locationKey];
    console.log(location);
    const placemark = indexed_placemarks [location.id];
    locationsAdditionalInfo[ locationKey ] = {
        id: location.id,
        name: location.name,
    }

    if( placemark ){
        locationsAdditionalInfo[ locationKey ].aquapolis = placemark;
    }
    
});


fs.writeFileSync("../locations-extra-data.json",JSON.stringify(locationsAdditionalInfo, null, '\t'));


/*
placemarks.forEach( placemark => {
    console.log(placemark.name);
    let location = locationsdata[ ( placemark.aquapolis_id ? placemark.aquapolis_id : placemark.name ) ]; 
    let parsedDescription; 
    let aquapolis_url; 
    let aquapolis_summary; 
    
    try { 
        parsedDescription = HTMLParser.parse( placemark.description ) 
        const regex = /(aquapolis\.com\.pt\/[a-z0-9\-]+[\/]*)(.*)/;
        let contents = parsedDescription.textContent.match(regex);
        
        
        if(contents){
            aquapolis_url = contents[1];
            aquapolis_summary = contents[2]; 
        } else {
            console.log(parsedDescription.textContent)
        }

    } catch(e) { 
        console.log("didn't parse: '" + placemark.description + "'") ; 
    }
    

    //console.log( "id: " + aquapolis_url ); //.querySelector("img").getAttribute("src"));
    //console.log( "summary: " + aquapolis_summary );
    console.log();

    if( location ){        
        location.description = placemark.description;

        const extendedData = placemarks.ExtendedData;
        if( extendedData ) { 
            location.medialinks = extendedData.Data.value.split();
        }
        location.url = 'https://' + aquapolis_url;
        location.description = aquapolis_summary;
    }
});

fs.writeFileSync("datamerged.json",JSON.stringify(locationsdata, null, '\t'));

*/