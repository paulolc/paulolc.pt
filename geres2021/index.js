let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.6403, lng: -8.3689 },
    zoom: 8,
  });
}
