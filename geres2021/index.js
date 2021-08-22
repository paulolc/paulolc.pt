var overlay;


function initMap(){
    function myOverlay(bounds, image, map){
      this.bounds_ = bounds;
      this.image_ = image;
      this.map_ = map;
      
      this.div_=null;
      
      this.setMap(map);
    }

    myOverlay.prototype = new google.maps.OverlayView();
    
    myOverlay.prototype.onAdd = function(){
      var div = document.createElement('div');
      div.setAttribute('id','myDiv');
      div.style.borderStyle = 'solid';
      div.style.borderWidth = '2px;';
      div.style.background = 'none';
      div.style.position = 'absolute';
      
      var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      //svg.setAttribute('fill','#FFFFFF');
      svg.setAttribute('viewBox','0 0 400 400');
      
      var g = document.createElementNS('http://www.w3.org/2000/svg','g');
      
      var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('id','myRect');
      rect.setAttribute('height','181');
      rect.setAttribute('width','311');
      rect.setAttribute('y','95.25');
      rect.setAttribute('x','47.75');
      rect.setAttribute('stroke-width','5');
      rect.setAttribute('fill','none');
      rect.setAttribute('stroke','#FF0000');
      g.appendChild(rect);
      svg.appendChild(g);
      //var img = this.image_;
      div.appendChild(svg);
      
      this.div_ = div;
      
      var panes = this.getPanes();
      panes.overlayLayer.appendChild(div);    
      
    };
    
    myOverlay.prototype.draw = function(){
      var overlayProjection = this.getProjection();
      var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
      var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
      
      var div = this.div_;
      div.style.left = sw.x + 'px';
      div.style.top = ne.y + 'px';
      div.style.width = (ne.x - sw.x) + 'px';
      div.style.height = (sw.y - ne.y) + 'px';
    };
    
    myOverlay.prototype.onRemove = function(){
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    };
    

    var myLatLng = new google.maps.LatLng(51.036551, 1.488292);
    var myOptions = {
        zoom:9,
        center:myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
  			gestureHandling: "greedy"

    };
    var mapEl = document.getElementById("map");
    var map = new google.maps.Map(mapEl,myOptions);
    var marker = new google.maps.Marker({position:myLatLng,map:map});
    marker.setMap(map);
    var swBound = new google.maps.LatLng(51.00, 1.32);
    var neBound = new google.maps.LatLng(51.15, 1.6);
    var bounds = new google.maps.LatLngBounds(swBound,neBound);
    var imageCode = '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" class="svg-editor"><g><rect id="svg_5" height="181" width="311" y="95.25" x="47.75" stroke-width="5" fill="#FF0000"/></g></svg>';
    overlay = new myOverlay(bounds, imageCode, map);
    
}



