document.addEventListener('DOMContentLoaded', function() {
  elems = document.querySelectorAll('.sidenav');
  instances = M.Sidenav.init(elems, {});
});




var overlay;
let map, popup, Popup;


const ICONS_DIR = "./icons/";
const ICONS_BY_TYPE={
  "Supermercado" : ICONS_DIR + "supermarket.png",
  "Minipreço" : ICONS_DIR + "minipreco.png",
  "Pingo Doce" : ICONS_DIR + "pd32x32.png",
  "Casa" : ICONS_DIR + "home-2.png",  
  "Cascata com Piscina Natural": ICONS_DIR + "waterfall-2.png",
  "Piscina Fluvial": ICONS_DIR + "lake-blue.png",
  "Piscina Natural": ICONS_DIR + "lake-blue.png",
  "Praia Fluvial Selvagem": ICONS_DIR + "wetlands.png",
  "Praia Fluvial com Bar": ICONS_DIR + "beach_icon-green.png",
  "Praia Fluvial": ICONS_DIR + "riparianhabitat.png",
  "Praia à Beira Rio": ICONS_DIR + "beach_icon.png",
  "Restaurante": ICONS_DIR + "restaurant.png",
  "Zona de Lazer à Beira Rio": ICONS_DIR + "picnic-2.png",
  "Praia Fluvial boa para saltos": ICONS_DIR + "anchorpier.png",
  "Miradouro": ICONS_DIR + "binoculars.png"
}


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

  var myLatLng = new google.maps.LatLng(41.717998, -8.273189);
  var myOptions = {
    zoom: 12,
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
  
  map.addListener("click", () => {

    if(!$(".wrapper").hasClass("left-panel-closed")){
        $(".wrapper").addClass("left-panel-closed");
        window.localStorage['closedleft'] = "yes";
    }

});



  //for( let i = 0 ; i < LOCATIONS.length ; i++){

  LOCATIONS.forEach( location => {
    const locationData = LOCATIONS_DATA[ location.name ];
    const locationName = ( locationData && locationData.name ? locationData.name : location.name  ) + " ";     
    const coords = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
    const extraInfo = locationData.aquapolis;
    const summary = (extraInfo && extraInfo.summary ? extraInfo.summary : "INSERT SUMMARY HERE!");
    const mediaLinks = (extraInfo && extraInfo.media_links ? extraInfo.media_links : [] );
    const headerImgSrc = (mediaLinks[0] ? mediaLinks[0] : "https://maps.gstatic.com/tactile/pane/default_geocode-2x.png" );


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

    const sidePanelElem = document.getElementById("sidepanel"); 

    var marker = new google.maps.Marker(markerOptions);  
    marker.addListener("click", () => {

      /*Insert location information panel*/

      // search with querySelectorAll https://developer.mozilla.org/pt-BR/docs/Web/API/Document/querySelectorAll
      // add with innerHTML

      console.log(`${location.name}: Adding click handler`);


      const selectedInfoPanelElem = document.querySelector(".selected-infopanel");
      if( selectedInfoPanelElem ) { 
        if( selectedInfoPanelElem.getAttribute('id') != location.name ){
            selectedInfoPanelElem.classList.add('hidden-infopanel');
            selectedInfoPanelElem.classList.remove('selected-infopanel')
        } 
      } 

      const infopanel = document.getElementById(location.name);
      if( infopanel ){
        infopanel.classList.remove('hidden-infopanel');
        infopanel.classList.add('selected-infopanel');
        sidePanelElem.scrollTo(0,0);
      } else {
        const  infopaneldiv = document.createElement('div');
        infopaneldiv.setAttribute('id',location.name);
        let infopanelhtml = `
          <div class="card">
            <div class="card-image">
              <img id="header-image" src="${headerImgSrc}"/>
              <span id="title" class="card-title">${locationName}</span>
            </div>
            <div class="card-content">
              <p id="summary">${summary}</p>
            </div>
        ` 

        if( mediaLinks ){
          for(let i = 1 ; i < mediaLinks.length ; i++){
            infopanelhtml = `${infopanelhtml}
            <img src="${mediaLinks[i]}" />`  ;
          }
        }

        

        infopaneldiv.innerHTML = infopanelhtml + '</div>';
        infopaneldiv.classList.add('selected-infopanel');
        sidePanelElem.appendChild( infopaneldiv );

      

/*

      if( window.localStorage['location.name'] !== location.name ){

        document.getElementById("title").innerText = location.name;
        document.getElementById("header-image").setAttribute("src","");

        if( extraInfo ){
          document.getElementById("summary").innerText = extraInfo.summary;
          document.getElementById("header-image").setAttribute("src",extraInfo.media_links[0]);
          for(let i=1; i<9; i++){
            const imglink = extraInfo.media_links[i];
            if( imglink ){
              document.getElementById("img"+i).setAttribute("src",imglink);
            }
          }

        }

        window.localStorage['location.name'] = location.name
*/

      }


      
      if($(".wrapper").hasClass("left-panel-closed")){
        $(".wrapper").toggleClass("left-panel-closed");
        window.localStorage['closedleft'] = "no";
      }
    });
    
    marker.setMap(map);

    const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(location.name) + "&destination_place_id=" + location.placeid + "&origin=Quinta%20das%20Laranjairas%20De%20Amares&origin_placeid=vFWZ2oSUS0&travelmode=car";
    const locationGoogleMapsUrl = "https://maps.google.com/maps?cid=" + location.cid;
    
    let locationNameDiv = document.createElement("div");
    let seeInGoogleMapsLink = document.createElement("a");
    let gmapsiconImg = document.createElement("img");
    let directionsLink = document.createElement("a");

    let additionalInfoElem;

    additionalInfoElem = document.createElement("a");
    additionalInfoElem.href = (locationData && locationData.aquapolis && locationData.aquapolis.url ? locationData.aquapolis.url : locationGoogleMapsUrl );
    additionalInfoElem.innerText = locationName;
    additionalInfoElem.target = "_blank";

    locationNameDiv.appendChild(additionalInfoElem); 

    gmapsiconImg.src= ICONS_DIR + "gmaps.svg";
    gmapsiconImg.height = "10";
    seeInGoogleMapsLink.appendChild(gmapsiconImg);
    seeInGoogleMapsLink.href =  locationGoogleMapsUrl;
    seeInGoogleMapsLink.target = "_blank";

    directionsLink.href = directionsUrl; 
    directionsLink.innerText = ( duration  ?  duration :"" );
    directionsLink.target = "_blank";

    locationNameDiv.appendChild(seeInGoogleMapsLink);
    ( duration  ?  locationNameDiv.appendChild(document.createTextNode(" a ") ) :"" ) 
    locationNameDiv.appendChild(directionsLink);


    popup = new Popup(
      coords,
      locationNameDiv
    );
    popup.setMap(map);
  
  });

}

$(window).on('load', function() {


  $(".wrapper").addClass("left-panel-closed");

/*
  
  var closedleft = window.localStorage['closedleft'];

  if(closedleft=="yes"){
      $(".wrapper").addClass("left-panel-closed");
  }else{
      $(".wrapper").removeClass("left-panel-closed");
  }





  $(".left-panel .close-btn").click(function(){
      $(".wrapper").toggleClass("left-panel-closed");

      if($(".wrapper").hasClass("left-panel-closed")){
          window.localStorage['closedleft'] = "yes";
      }else{
          window.localStorage['closedleft'] = "no";
      }
  });

*/



});

