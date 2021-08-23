var overlay;
let map, popup, Popup;


const ICONS_BY_TYPE={
  "Supermercado" : "./icons/supermarket.png",
  "Casa" : "http://maps.google.com/mapfiles/kml/pal2/icon10.png"
}

const LOCATIONS_DATA={
  "Praia Fluvial Garrafas, Coucieiro" : { 
    name: "Praia Fluvial de Garrafas"
  },
  "Praia Fluvial De Monsul" : {
    name: "Praia Fluvial De Monsul",
    directions: "https://www.google.com/maps/dir/Quinta+das+Laranjairas+De+Amares,+Rua+Monte+de+Cima,+Lugar+do+Souto/Praia+Fluvial+De+Monsul,+Monsul/@41.628764,-8.3760754,13z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0xd2502441d1471ef:0x2d51126a6756f1fa!2m2!1d-8.3691095!2d41.6403535!1m5!1m1!1s0xd2503d8e6e837b3:0x356cc476c79f47ea!2m2!1d-8.3186369!2d41.6265784!3e0", 
  }


}

function initMap(){
  fetch('./locations.json')
    .then(response => response.json())
    .then(data => initialize( data ));
}




function initialize( locations ) {
  const LOCATIONS = locations;
  var myLatLng = new google.maps.LatLng(41.640384399999995, -8.368992);
  var myOptions = {
    zoom: 13,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    gestureHandling: "greedy"

  };
  var mapEl = document.getElementById("map");
  map = new google.maps.Map(mapEl, myOptions);





  /*
  var swBound = new google.maps.LatLng(41.630, -8.4);
  var neBound = new google.maps.LatLng(41.649, -8.3);
  var bounds = new google.maps.LatLngBounds(swBound, neBound);
  var imageCode = '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" class="svg-editor"><g><rect id="svg_5" height="181" width="311" y="95.25" x="47.75" stroke-width="5" fill="#FF0000"/></g></svg>';
*/

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
    console.log("location.subtype:" + location.subtype);
    console.log("tokens:" + tokens);
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

    const locationName = ( LOCATIONS_DATA[ location.name ] ? LOCATIONS_DATA[ location.name ].name : location.name  ); 
    const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(location.name) + "&destination_place_id=" + location.placeid + "&origin=Quinta%20das%20Laranjairas%20De%20Amares&origin_placeid=vFWZ2oSUS0&travelmode=car";


    //( LOCATIONS_DATA[ location.name ] && LOCATIONS_DATA[ location.name ].directions ? LOCATIONS_DATA[ location.name ].directions : "" );  
    
    
    let locationNameDiv = document.createElement("div");

    let seeInGoogleMapsLink = document.createElement("a");
    seeInGoogleMapsLink.href = "https://maps.google.com/maps?cid=" + location.cid 
    seeInGoogleMapsLink.innerText = locationName

    let directionsLink = document.createElement("a");
    directionsLink.href = directionsUrl; 
    directionsLink.innerText = ( duration  ?  duration :"" );


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



