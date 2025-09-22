import { useState, useEffect } from "react";
import { googleapi } from "..";

export default function DistanceComponent({ origins, destinations }) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    calculateDistance();
  }, []);

  const calculateDistance = async () => {
    googleapi.importLibrary("routes").then((routes) => {
      var service = new routes.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins,
          destinations,
          travelMode: routes.TravelMode.DRIVING,
        },
        callback
      );

      function callback(response, status) {
        console.log("response :>> status", response,status);
        setResult(status == "OK" ? response : null);
      }
    });
  };
  if (result && result.rows &&result.rows[0].elements) {
    var distance = result.rows[0].elements[0]?.distance?.text;
    // var duration = result.rows[0].elements[0].duration.text;
    var originName = result.originAddresses[0];
    var destinationName = result.destinationAddresses[0];
  }
  return (
    <>
      {distance && (
        <p>
          {originName}
          <br/>
          {distance}  {destinationName}
        </p>
      )}
    </>
  );
}
