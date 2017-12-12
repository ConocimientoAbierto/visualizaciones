// Points icons
var icono_uni_pub = L.icon({
        title: 'Universidad Publica',
        iconUrl: 'imgs/uni_publica.png',
        iconSize:     [45, 45], // size of the icon
    }),
    icono_uni_pri = L.icon({
        title: 'Universidad Privada',
        iconUrl: 'imgs/uni_privada.png',
        iconSize:     [45, 45], // size of the icon
    }),
    icono_ter_pub = L.icon({
        title: 'Terciario Publico',
        iconUrl: 'imgs/terciario_publico.png',
        iconSize:     [45, 45], // size of the icon
    }),
    icono_ter_pri = L.icon({
        title: 'Terciario Privado',
        iconUrl: 'imgs/terciario_privado.png',
        iconSize:     [45, 45], // size of the icon
    }),
    icono_cbc = L.icon({
        title: 'CBC UBA',
        iconUrl: 'imgs/cbc.png',
        iconSize:     [45, 45], // size of the icon
    });

var icons = [icono_uni_pub, icono_uni_pri, icono_ter_pub, icono_ter_pri, icono_cbc]

// Data of each institute
var data = [
	{position: [-34.447425,-58.9080447],
	 name: 'UCES',
	 tepy: 'privada',
 	 web: 'https://www.uces.edu.ar/',
	 phone: '15-4165-6354',
 	 icon: icono_uni_pri},
	{position: [-34.4351018,-58.9287861],
	 name: 'USAL',
	 tepy: 'privada',
 	 web: 'http://pilar.usal.edu.ar',
	 phone: '0230-4431260/1/2',
 	 icon: icono_uni_pri},
	 {position: [-34.4350818,-58.9966379],
	 name: 'AUSTRAL',
	 tepy: 'privada',
 	 web: 'http://www.austral.edu.ar/',
	 phone: '(+54 11) 5239-8000-- ',
 	 icon: icono_uni_pri},
	 {position: [-34.4196846,-58.9763719],
	 name: 'UTN',
	 type: 'privada',
 	 web: '',
	 phone: '',
 	 icon: icono_uni_pri},
	 {position: [-34.4372694,-58.8926418],
	 name: 'UBA ECONÓMICAS',
	 type: 'pública',
 	 web: '',
	 phone: '',
	 icon: icono_uni_pub},
	 {position: [-34.437281,-58.89263],
	 name: 'UNIPE',
	 type: 'pública',
 	 web: '',
	 phone: '',
	 icon: icono_uni_pub},
	 {position: [-34.4668489,-58.9083964],
	 name: 'CBC UBA',
	 type: 'pública',
 	 web: '',
	 phone: '',
 	 icon: icono_cbc},
	 {position: [-34.4668829,-58.9136897],
	 name: 'Sede de Universidad de Luján',
	 type: 'pública',
 	 web: '',
	 phone: '',
 	 icon: icono_uni_pub},
	 {position: [-34.4612223,-58.9152685],
	 name: 'CAI',
	 type: 'privada',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pri},
	 {position: [-34.4591304,-58.9144058],
	 name: 'EDDIS',
	 type: 'privada',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pri},
	 {position: [-34.4398272,-58.8780161],
	 name: 'Holos',
	 type: 'privada',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pri},
	 {position: [-34.4541367,-58.9067864],
	 name: 'Instituto Formación Técnica Nº 184',
	 type: '',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pub},
	 {position: [-34.4582771,-58.9130121],
	 name: 'Instituto Formación Docente Nº 51',
	 type: '',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pub},
	 {position: [-34.4585154,-58.9124139],
	 name: 'Escuela Municipal de Guardavidas',
	 type: '',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pub},
	 {position: [-34.4546168,-58.7799685],
	 name: 'Instituto María Madre Nuestra',
	 type: '',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pri},
	 {position: [-34.4521101,-58.9057931],
	 name: 'Instituto Superior Frederic Chopin',
	 type: '',
 	 web: '',
	 phone: '',
  	 icon: icono_ter_pri},
	 {position: [-34.4918426,-58.8400516],
	 name: 'Instituto Superior Imágenes Médicas',
	 type: '',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pri},
	 {position: [-34.4559756,-58.9114561],
	 name: 'Instituto Superior Arte y Creatividad',
	 type: '',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pri},
	 {position: [-34.4463563,-58.8704516],
	 name: 'Gato Dumas - Escuela de Cocina',
	 type: '',
 	 web: '',
	 phone: '',
 	 icon: icono_ter_pri}
]

// Create the map and the legend
var map = L.map('mapid').setView([-34.45,-58.9], 12),
    legend = L.control({position: 'bottomright'})

// Create the tile layer with correct attribution
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    osm = new L.TileLayer(osmUrl, {minZoom: 10, maxZoom: 15, attribution: osmAttrib})

// Add the tile
map.addLayer(osm)

// Add the points
for (var i=0; i<data.length; i++) {
	var marker = L.marker(data[i].position, {icon: data[i].icon}).addTo(map)
    var text = '<h3>' + data [i].name + '</h3>'
	marker.bindPopup(text)

    marker.on('mouseover', function (e) {
            this.openPopup();
    })
    marker.on('mouseout', function (e) {
        this.closePopup();
    })
}

// Fill the legend
legend.onAdd = function (map) {
    // Create the legend div
    var div = L.DomUtil.create('div', 'info legend')
    div.innerHTML += '<ul>'

    // Add each reference
    for (var i = 0; i < icons.length; i++) {
        div.innerHTML +=
            '<li><img src="' + icons[i].options.iconUrl + '">' +
            '<span>' + icons[i].options.title + '</span></li>'
    }

    div.innerHTML += '</ul>'
    return div;
};

// Add the legend
legend.addTo(map)
