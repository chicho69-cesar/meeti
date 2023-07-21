export const calculateDistance = (latRef, lngRef, latToCompare, lngToCompare) => {
  const earthRadiusKm = 6371 // Earth's radius in kilometers

  const distanceLat = ((latToCompare - latRef) * Math.PI) / 180
  const distanceLng = ((lngToCompare - lngRef) * Math.PI) / 180

  const a =
    Math.sin(distanceLat / 2) * Math.sin(distanceLat / 2) +
    Math.cos((latRef * Math.PI) / 180) *
    Math.cos((latToCompare * Math.PI) / 180) *
    Math.sin(distanceLng / 2) *
    Math.sin(distanceLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = earthRadiusKm * c
  return distance
}
