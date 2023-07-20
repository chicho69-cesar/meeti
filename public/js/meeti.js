document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#location-meeti')) {
    showMap()
  }
})

function showMap() {
  // obtener los valores
  const lat = document.querySelector('#lat').value
  const lng = document.querySelector('#lng').value
  const direction = document.querySelector('#direction').value

  var map = L.map('location-meeti').setView([lat, lng], 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  L.marker([lat, lng]).addTo(map)
    .bindPopup(direction)
    .openPopup()
}
