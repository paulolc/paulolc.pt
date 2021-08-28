//map

google.maps.event.addDomListener(window, 'load', init);
        
function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 14,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(43.0213051, 44.6675033), // New York

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#c1c1c1"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"},{"saturation":"0"},{"lightness":"48"},{"color":"#1f2124"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#f8f5f2"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"on"},{"color":"#f8c6b9"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#bfe2e8"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#f8f5f2"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#008ca5"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Let's also add a marker while we're at it
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(43.0213051, 44.6675033),
        map: map
    });


    map.addListener("click", () => {



        //$(".wrapper").toggleClass("left-panel-closed");

        if(!$(".wrapper").hasClass("left-panel-closed")){
            $(".wrapper").addClass("left-panel-closed");
            window.localStorage['closedleft'] = "yes";
        }

    });


    marker.addListener("click", () => {
            $(".wrapper").toggleClass("left-panel-closed");
    
            if($(".wrapper").hasClass("left-panel-closed")){
                window.localStorage['closedleft'] = "yes";
            }else{
                window.localStorage['closedleft'] = "no";
            }


    });
}


$(window).on('load', function() {


    /*Cookie*/

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





});
