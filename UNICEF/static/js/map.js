/*
  General configuration values
*/
var origin_lat = -36
var origin_lon = -38

var cameraIcon = L.icon({
    iconUrl: 'static/imgs/camera_icon_white.png',
    iconSize:     [40, 40] // size of the icon
});

var videoIcon = L.icon({
    iconUrl: 'static/imgs/video_icon_white.png',
    iconSize:     [40, 40] // size of the icon
});

var centers = {
  'Santa Fe': {'coordinate': { lat: -30.752158806156256, lng: -60.959973235807766 },
   'icon': videoIcon},
  'Jujuy': {'coordinate': { lat: -22.8, lng: -66 },
   'icon': videoIcon},
  'Salta': {'coordinate': { lat: -25.3, lng: -64.8 },
   'icon': videoIcon},
  'Tucuman': {'coordinate': { lat: -27, lng: -65.3 },
   'icon': videoIcon},
  'Provincia de Buenos Aires': {'coordinate': { lat: -36.71419287155791, lng: -60.56809303977275 },
   'icon': videoIcon},
  'Misiones': {'coordinate': { lat: -26.7, lng: -54.5 },
   'icon': cameraIcon}
}

var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var attribution = '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'

var box_base = `
<div class="info-box">
  <h2 class="info-title">Proyecto "Llaves para la Autonomía"
  <br />UNICEF y DONCEL</h2>

  <div id="box-imgs">
  </div><!--/box-imgs -->

  <div class="info-text in">
    <p>El proyecto apunta al desarrollo y fortalecimiento de políticas y prácticas institucionales que
       acompañen el egreso de los jóvenes de los Hogares del sistema de protección para la vida
       independiente.</p>

    <h3 class="info-title">El proyecto en números (2016-2017)</h3>
    <ul>
      <li><i class="fa fa-check" aria-hidden="true"></i>7 provincias (Buenos Aires, Jujuy, Misiones, Salta, Santa Fe, Santiago del Estero y Tucumán).</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>1966 participantes.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>371 adolescentes y jóvenes.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>88 actividades de capacitación realizadas.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>Más de 60 hogares alcanzados.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>3 Casas de Pre-Egreso en funcionamiento.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>1 Comité de Pre-Egreso constituido.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>11 adolescentes formados y capacitados.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>3 jóvenes accedieron a un empleo formal.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>73 empresas participaron de la iniciativa.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>Gestión de gabinetes tecnológicos.</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>Adquisición y distribución de 48 equipos de computación para hogares.</li>
    </ul>

    <h3 class="info-footer">Tocá alguna de las provincias habilitadas para más información</h3>
  </div><!--/info-text -->

</div><!--/info-box -->
`;

/*
  Styles
*/
function getColor(d) {
    return d == "Jujuy"        ? '#e6ab02' :
           d == "Santa Fe"     ? '#66a61e' :
           d == "Misiones"     ? '#e7298a' :
           d == "Tucuman"      ? '#7570b3' :
           d == "Salta"        ? '#d95f02' :
                                 '#1b9e77';
}

function defaultStyle(feature) {
  return {
      color: "#2262CC",
      weight: 3,
      opacity: 0.6,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.name),
      className: 'enableProvince'
  }
}

var disabledStyle = {
    color: "grey",
    weight: 0,
    opacity: 0,
    fillOpacity: 0.1,
    fillColor: "#2262CC",
    className: 'disabledProvince'
}

var highlightStyle = {
    color: '#2262CC',
    weight: 5,
    opacity: 0.6,
    fillOpacity: 0.65,
    fillColor: '#2262CC'
};

// Initialice the map
var map = L.map('map').setView([origin_lat, origin_lon], 5)
// Div info
var info = L.control()

// Add the tile
L.tileLayer(tileUrl, {
    attribution: attribution,
    maxZoom: 18
}).addTo(map)

// Load the provinces
var provincesLayer = new L.GeoJSON.AJAX("./data/provincias.geojson", {
    style: setStyle,
    onEachFeature: onEachFeature
})

// Personal button
L.easyButton('<img class="icon-info" src="static/imgs/110_UNICEF_ICON_REPORTING_CYAN.png">', function(){
  info._div.innerHTML = box_base
}).addTo(map);

/*
  Info div methods
*/
info.onAdd = function ( map ) {
    // create a div with a class "info"
    this._div = L.DomUtil.create( 'div', 'container info' )
    this._div.innerHTML = box_base
    return this._div
}

info.update = function ( e ) {
    //this.getElement().classList.add('active')
    // Method that we will use to update the control based on feature properties passed
    var properties = e.target.feature.properties

    if ( properties.isEnabled ) {
      div = document.getElementsByClassName('info-text')[0]
      div.classList.remove('in')
      div.innerHTML = properties.html_texto
      div.className += ' in'

      // add the imgs
      div = document.getElementById('box-imgs')
      div.innerHTML = properties.html_media

      lightGallery(document.getElementById('lightgallery'))
      lightGallery(document.getElementById('video-gallery'))
    }
}

// Add to map
provincesLayer.addTo( map )
info.addTo( map )

/*

 */
function setStyle ( feature ) {
    // Set the style
    if ( feature.properties.isEnabled ) {
	     return defaultStyle(feature)
    }
    else {
	     return disabledStyle
    }
}

function onEachFeature ( feature, layer ) {
    // Set the event over each province
    layer.on({
    	mouseover: highlightFeature,
    	mouseout: resetHighlight,
    	click: info.update
    });

    // Add the icons
    if (feature.properties.isEnabled) {
      var point = centers[feature.properties.name]
      L.marker(point.coordinate, { icon: point.icon })
       .addTo(map)
       .on('click', function(){
         map._layers[layer._leaflet_id].fire('click')
       })
    }
}

function highlightFeature( e ) {
    // When the mouse put over a province, change the style
    var layer = e.target
    var properties = e.target.feature.properties

    if ( properties.isEnabled ) {
	     layer.setStyle( highlightStyle )
    }
}

function resetHighlight( e ) {
    // When the mouse go out a provice, reset the style
    provincesLayer.resetStyle( e.target )
}
