var overlay;
let map, popup, Popup;


const ICONS_DIR = "./icons/";
const ICONS_BY_TYPE={
  "Supermercado" : ICONS_DIR + "supermarket.png",
  "Minipreço" : ICONS_DIR + "minipreco.png",
  "Pingo Doce" : ICONS_DIR + "pd32x32.png",
  "Casa" : "http://maps.google.com/mapfiles/kml/pal2/icon10.png",
  "Cascata com Piscina Natural": ICONS_DIR + "waterfall.png",
  "Piscina Fluvial": ICONS_DIR + "lake-blue.png",
  "Piscina Natural": ICONS_DIR + "lake-blue.png",
  "Praia Fluvial Selvagem": ICONS_DIR + "wetlands.png",
  "Praia Fluvial com Bar": ICONS_DIR + "riparianhabitat.png",
  "Praia à Beira Rio": ICONS_DIR + "beach-blue.png",
  "Restaurante": ICONS_DIR + "restaurant.png",
  "Zona de Lazer à Beira Rio": ICONS_DIR + "picnic-2.png"
}
//  "Miradouro": ICONS_DIR + "",



function initMap(){
  fetch('./data/locations.json')
    .then(response => response.json())
    .then( locationsData => { 
      fetch('./data/locations-extra-data.json')
        .then(response => response.json())
        .then( locationsExtraInfo => initialize( [ locationsData, locationsExtraInfo ] ));
    });
}

function initialize( locationsFullData ) {
  const LOCATIONS = locationsFullData[0];
  const LOCATIONS_DATA = locationsFullData[1];

  var myLatLng = new google.maps.LatLng(41.640384399999995, -8.368992);
  var myOptions = {
    zoom: 13,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    gestureHandling: "greedy"

  };
  var mapEl = document.getElementById("map");
  map = new google.maps.Map(mapEl, myOptions);



 /**
   * A customized popup on the map.
   */
  class Popup extends google.maps.OverlayView {
    position;
    containerDiv;
//    constructor(position, strContent) {
    constructor(position, content ){
      super();
      this.position = position;



      content.classList.add("popup-bubble");
      // This zero-height div is positioned at the bottom of the bubble.
      const bubbleAnchor = document.createElement("div");
      bubbleAnchor.classList.add("popup-bubble-anchor");
      bubbleAnchor.appendChild(content);
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement("div");
      this.containerDiv.classList.add("popup-container");
      this.containerDiv.appendChild(bubbleAnchor);
      // Optionally stop clicks, etc., from bubbling up to the map.
      Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    /** Called when the popup is added to the map. */
    onAdd() {
      this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    /** Called when the popup is removed from the map. */
    onRemove() {
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    }
    /** Called each frame when the popup needs to draw itself. */
    draw() {
      const divPosition = this.getProjection().fromLatLngToDivPixel(
        this.position
      );
      // Hide the popup when it is far out of view.
      const display =
         Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 && map.getZoom() > 11
          ? "block"
          : "none";

      

      if (display === "block") {
        this.containerDiv.style.left = divPosition.x  + "px";
        this.containerDiv.style.top = divPosition.y + "px";
      }

      if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
      }
    }
  }
  
  LOCATIONS.forEach( location => {
    
    const coords = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    let duration;
    let locationType;
    const tokens = ( location.subtype ? location.subtype.split(",") : [] ) ;
    locationType = ( tokens.length > 0 ? tokens[0] : location.type );

    if(tokens.length === 2){
      duration = tokens[1];
    }

    let markerOptions = {
      position: coords,
      map: map
    }

    const locationIcon = ICONS_BY_TYPE[ locationType ];
    if( locationIcon ){
      markerOptions.icon = locationIcon;
    }


    var marker = new google.maps.Marker(markerOptions);
  
  
    marker.setMap(map);


    //const content = document.createElement("a");
    //content.innerHtml= `<a href="https://maps.google.com/maps?cid=${location.cid}">${location.name}</a>` // a ${ duration !== "-1" ? " a " + duration :""}`;
    //console.log("content.innerHtml:" + content.innerHtml );

    const locationData = LOCATIONS_DATA[ location.name ];
    const locationName = ( locationData ? locationData.name : location.name  ); 
    const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(location.name) + "&destination_place_id=" + location.placeid + "&origin=Quinta%20das%20Laranjairas%20De%20Amares&origin_placeid=vFWZ2oSUS0&travelmode=car";


    //( LOCATIONS_DATA[ location.name ] && LOCATIONS_DATA[ location.name ].directions ? LOCATIONS_DATA[ location.name ].directions : "" );  
    
    
    let locationNameDiv = document.createElement("div");

    let additionalInfoLink = document.createElement("a");
    console.log(locationData);
    additionalInfoLink.href = (locationData ? ( locationData.aquapolis ? locationData.aquapolis.url : "http://slashdot.org" ) : "http://linkedin.com");
    additionalInfoLink.innerText = (locationData ? locationData.name + " ": "" );
    additionalInfoLink.target = "_blank";

    let seeInGoogleMapsLink = document.createElement("a");
    seeInGoogleMapsLink.href = "https://maps.google.com/maps?cid=" + location.cid 
    let gmapsiconImg = document.createElement("img");
    gmapsiconImg.src= ICONS_DIR + "gmaps.svg";
    gmapsiconImg.height = "10";
    seeInGoogleMapsLink.appendChild(gmapsiconImg);
    seeInGoogleMapsLink.target = "_blank";

    let directionsLink = document.createElement("a");
    directionsLink.href = directionsUrl; 
    directionsLink.innerText = ( duration  ?  duration :"" );
    directionsLink.target = "_blank";


    additionalInfoLink

//    locationNameDiv.appendChild(document.createTextNode(locationName + " ")); 
    locationNameDiv.appendChild(additionalInfoLink); 
    locationNameDiv.appendChild(seeInGoogleMapsLink);
    ( duration  ?  locationNameDiv.appendChild(document.createTextNode(" a ") ) :"" ) 
    locationNameDiv.appendChild(directionsLink);


    popup = new Popup(
      coords,
      locationNameDiv
    );
    popup.setMap(map);
  
  });






/*
  function myOverlay(bounds, image, map) {
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;

    this.div_ = null;

    this.setMap(map);
  }

  myOverlay.prototype = new google.maps.OverlayView();

  myOverlay.prototype.onAdd = function () {
    var div = document.createElement('div');
    div.setAttribute('id', 'myDiv');
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '2px;';
    div.style.background = 'none';
    div.style.position = 'absolute';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    //svg.setAttribute('fill','#FFFFFF');
    svg.setAttribute('viewBox', '0 0 400 400');

    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('id', 'myRect');
    rect.setAttribute('height', '181');
    rect.setAttribute('width', '311');
    rect.setAttribute('y', '95.25');
    rect.setAttribute('x', '47.75');
    rect.setAttribute('stroke-width', '5');
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', '#FF0000');
    g.appendChild(rect);
    svg.appendChild(g);
    //var img = this.image_;
    div.appendChild(svg);

    this.div_ = div;

    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);

  };

  myOverlay.prototype.draw = function () {
    var overlayProjection = this.getProjection();
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
  };

  myOverlay.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  };


  overlay = new myOverlay(bounds, imageCode, map);
*/

}



