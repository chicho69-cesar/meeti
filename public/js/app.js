import { OpenStreetMapProvider } from 'leaflet-geosearch'
import './assistance.js'
import './deleteComment.js'

// obtener valores de la base de datos
const lat = document.querySelector('#lat').value || 20.666332695977
const lng = document.querySelector('#lng').value || -103.3921777456999
const direction = document.querySelector('#direction').value || ''
const map = L.map('map').setView([lat, lng], 15)

let markers = new L.FeatureGroup().addTo(map)
let marker

// Utilizar el provider y GeoCoder
const geocodeService = L.esri.Geocoding.geocodeService()

// Colocar el Pin en Edición
if (lat && lng) {
  // agregar el pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true
  })
    .addTo(map)
    .bindPopup(direction)
    .openPopup()

  // asignar al contenedor markers
  markers.addLayer(marker)

  // detectar movimiento del marker
  marker.on('moveend', function (e) {
    marker = e.target
    const position = marker.getLatLng()
    map.panTo(new L.LatLng(position.lat, position.lng))

    // reverse geocoding, cuando el usuario reubica el pin
    geocodeService.reverse().latlng(position, 15).run(function (error, result) {
      fillInputs(result)

      // asigna los valores al popup del marker
      marker.bindPopup(result.address.LongLabel)
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // buscar la dirección
  const searcher = document.querySelector('#formSearcher')
  searcher.addEventListener('input', searchDirection)
})

function searchDirection(e) {
  if (e.target.value.length > 8) {
    // si existe un pin anterior limpiarlo
    markers.clearLayers()

    const provider = new OpenStreetMapProvider()
    provider.search({ query: e.target.value }).then((resultado) => {
      geocodeService.reverse().latlng(resultado[0].bounds[0], 15).run(function (error, result) {
        fillInputs(result)

        // console.log(resultado)
        // mostrar el mapa
        map.setView(resultado[0].bounds[0], 15)

        // agregar el pin
        marker = new L.marker(resultado[0].bounds[0], {
          draggable: true,
          autoPan: true
        })
          .addTo(map)
          .bindPopup(resultado[0].label)
          .openPopup()

        // asignar al contenedor markers
        markers.addLayer(marker)

        // detectar movimiento del marker
        marker.on('moveend', function (e) {
          marker = e.target
          const position = marker.getLatLng()
          map.panTo(new L.LatLng(position.lat, position.lng))

          // reverse geocoding, cuando el usuario reubica el pin
          geocodeService.reverse().latlng(position, 15).run(function (error, result) {
            fillInputs(result)

            // asigna los valores al popup del marker
            marker.bindPopup(result.address.LongLabel)
          })
        })
      })
    })
  }
}

function fillInputs(result) {
  document.querySelector('#direction').value = result.address.Address || ''
  document.querySelector('#city').value = result.address.City || ''
  document.querySelector('#state').value = result.address.Region || ''
  document.querySelector('#country').value = result.address.CountryCode || ''
  document.querySelector('#lat').value = result.latlng.lat || ''
  document.querySelector('#lng').value = result.latlng.lng || ''
}
