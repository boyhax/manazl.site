"use strict";
exports.__esModule = true;
var url_1 = require("url");
console.log('playground :>> ');
function parseGeoParam(geoParam) {
    var decodedGeoParam = decodeURIComponent(geoParam);
    var geoValues = decodedGeoParam.split(',');
    if (geoValues.length === 2) {
        var lat = parseFloat(geoValues[0]);
        var lng = parseFloat(geoValues[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
            return [lat, lng];
        }
    }
    return null; // Return null if parsing fails
}
// Example usage
var url = "http://localhost:3000/home/search?type=villa&geo=23.58412603264412%2C58.40778350830079";
var geoParam = new url_1.URL(url).searchParams.get('geo');
// const geoParam = "23.58412603264412%2C58.40778350830079"; // assuming this is received from the URL
var geoArray = geoParam && parseGeoParam(geoParam);
if (geoArray !== null) {
    var latitude = geoArray[0], longitude = geoArray[1];
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
}
else {
    console.error("Invalid geo parameter");
}
//  console.log('res :>> ', res);
