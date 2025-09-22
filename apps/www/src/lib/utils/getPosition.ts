function getWebPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}

export async function getPosition(): Promise<GeolocationPosition | null> {
  try {
    return await getWebPosition();
  } catch (error) {
    console.error("Error getting position:", error);
    return null;
  }
}
