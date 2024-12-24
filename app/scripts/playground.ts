import { URL } from "url";

console.log('playground :>> ', );

function parseGeoParam(geoParam: string): [number, number] | null {
    const decodedGeoParam = decodeURIComponent(geoParam);
    const geoValues = decodedGeoParam.split(',');
    if (geoValues.length === 2) {
        const lat = parseFloat(geoValues[0]);
        const lng = parseFloat(geoValues[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
            return [lat, lng];
        }
    }
    return null; // Return null if parsing fails
}

// Example usage
const url ="http://localhost:3000/home/search?type=villa&geo=23.58412603264412%2C58.40778350830079"
const geoParam = new URL(url).searchParams.get('geo')
// const geoParam = "23.58412603264412%2C58.40778350830079"; // assuming this is received from the URL

const geoArray = geoParam && parseGeoParam(geoParam);
if (geoArray !== null) {
    const [latitude, longitude] = geoArray;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
} else {
    console.error("Invalid geo parameter");
}
//  console.log('res :>> ', res);
