export function getEmbedMapUrl(addressUrl?: string) {
  if (!addressUrl) return "";

  // If already embed URL
  if (addressUrl.includes("/maps/embed")) {
    return addressUrl;
  }

  // Convert normal maps URL → embed URL
  return addressUrl.replace(
    "https://www.google.com/maps/",
    "https://www.google.com/maps/embed/"
  );
}
