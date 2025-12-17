export function extractPlaceFromUrl(url?: string) {
  if (!url) return "";

  // Example:
  // https://www.google.com/maps/place/Jumeirah+Beach+Residence+(JBR),+Dubai
  const parts = url.split("/place/");
  if (parts.length < 2) return "";

  return decodeURIComponent(parts[1]).replace(/\+/g, " ");
}
