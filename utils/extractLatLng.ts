export function extractLatLng(addressUrl?: string) {
  if (!addressUrl) return null;

  // Case 1: Normal google maps URL with @lat,lng
  const match = addressUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2]),
    };
  }

  return null;
}
