export async function geocodePlace(place: string) {
  if (!place) return null;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      place
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );

  const data = await res.json();

  if (data.status !== "OK") {
    console.warn("Geocode failed:", place);
    return null;
  }

  return data.results[0].geometry.location;
}
