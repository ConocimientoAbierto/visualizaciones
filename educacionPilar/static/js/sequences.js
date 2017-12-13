// Dimensions
var col = document.getElementsByClassName('col-md-6')[1]

var svgSize = {
    // 30 padding de las row
    // 100 width de las referencias
    width: col.clientWidth - 30,
    height: col.clientWidth - 30
}

width_trail = "100%",
radius = Math.min(svgSize.width, svgSize.height) / 2

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: col.clientWidth/4.5,
  h: 30,
  s: 3,
  t: 10
};

var sizeTextSequence = "0.1em"

// Mapping of step names to colors.
var universidades = ["UNLU", "UCES","UNIPE","UBA CIENCIAS ECONOMICAS",
                     "UTN","USAL","AUSTRAL"]
var terciarios = ["Instituto Superior de Formación Técnica n° 184",
                  "Instituto Superior de Formación Docente n° 51",
                  "Escuela Municipal Subsecretaría de Deportes",
                  "Instituto María Madre Nuestra",
                  "Instituto Superior Frederic Chopin",
                  "Instituto Superior de Imágenes Médicas",
                  "Instituto Superior de Arte y Creatividad",
                  "Instituto Gastronómico Gato Dumas",
                  "Instituto Superior del Bicentenario","Holos"]
var cbc = ["CBC UBA"]

var colors = {
  "Pública": "#FFCB5B",
  "Privada": "#99CAED",
  "Derecho": "#2400C9",
  "Farmacia y Bioquímica": "#E3552E",
  "Exactas": "#FF0034",
  "Diseño": "#0071A1",
  "Letras": "#25527D",
  "Psicología": "#10424F",
  "Gastronomía": "#006AE5",
  "Económicas ": "#E3552E",
  "Económicas": "#2400C9",
  "Educación ": "#E34615",
  "Educación": "#180089",
  "Ingeniería ": "#FC2315",
  "Ingeniería": "#0049FF",
  "Salud ": "#C74215",
  "Salud": "#2E1CFF",
  "Sociales ": "#AC4200",
  "Sociales": "#090033",
  "Derecho ": "#8C2800",
  "Derecho": "#1F51AF",
  "Agronomía ": "#C9351B",
  "Agronomía": "#2157BC",
  "Artes ": "#FF3800",
  "Artes": "#1B4596",
  "Veterinaria ": "#8C3A12",
  "Veterinaria": "#143470",

}

var publicas = ["UNLU","UNIPE","UBA CIENCIAS ECONOMICAS","CBC UBA","UTN",
		        "Instituto Superior de Formación Técnica n° 184",
                "Instituto Superior de Formación Docente n° 51",
		        "Escuela Municipal Subsecretaría de Deportes"]

var privadas = ["UCES","USAL","AUSTRAL","Instituto María Madre Nuestra",
                "Instituto Superior Frederic Chopin",
                "Instituto Superior de Imágenes Médicas",
                "Instituto Superior de Arte y Creatividad",
                "Instituto Gastronómico Gato Dumas",
                "Instituto Superior del Bicentenario","Holos",]

var instituciones = ["UNLU", "UCES","UNIPE","UBA CIENCIAS ECONOMICAS",
                     "UTN","USAL","AUSTRAL","Instituto Superior de Formación Técnica n° 184",
                     "Instituto Superior de Formación Docente n° 51",
                     "Escuela Municipal Subsecretaría de Deportes",
                     "Instituto María Madre Nuestra",
                     "Instituto Superior Frederic Chopin",
                     "Instituto Superior de Imágenes Médicas",
                     "Instituto Superior de Arte y Creatividad",
                     "Instituto Gastronómico Gato Dumas",
                     "Instituto Superior del Bicentenario","Holos", "CBC UBA" ]

var areas = ["Económicas ", "Económicas", "Salud ", "Salud", "Sociales ",
             "Sociales", "Derecho ","Derecho","Farmacia y Bioquímica",
	         "Exactas", "Veterinaria ","Veterinaria","Agronomía ","Agronomía",
             "Artes ","Artes","Educación ","Educación","Ingeniería ","Ingeniería",
	         "Diseño","Letras","Psicología","Gastronomía"]

var carreras = ["Tecnicatura en Comercio Exterior y Aduanas (con opción a Lic. en Comercio Internacional)",
		"Tecnicatura en Analisis de Sistemas (con opción a Lic. En Sistemas)",
		"Lic. en Nutrición","Lic. en Kinesiología y Fisiatría",
		"Lic. en Marketing","Abogacía","Bioquímica",
		"Ciencias biológicas","Farmacia","Fonoaudiología","Kinesiología",
		"Medicina","Nutrición","Odontología","Veterinaria ","Obstetricia",
		"Enfermería Universitaria","Técnico en podología","Técnico en turismo rural",
		"Técnico para bioterios","Floricultura","Jardineria","Edición","Tec. En prod. de vegetales organicos","Ciencias Ambientales","Prof. de Educación Inicial","Prof. de Educación Primaria","Contador Público","Licenciatura en Economía","Licenciatura en Administración de Empresas",
"Licenciatura en Sistemas de la Información de las Organizaciones","Actuario en Administración","Actuario en Economía","Tecn. Sup. en Mantenimiento Ind.","Tecn. Sup. en Procesos Ind.","Tecn. Sup. en Logística","Abogacía","Actuario","Administración","Agronomía ","Arquitectura","Ciencia Política","Ciencias Ambientales","Comercialización","Comercio Internacional","Comunicación social","Contador Público","Escenografía","Ing en Informática","Ing. Industrial","Interp. de confer. en inglés",
"Lengua Inglesa","Letras ","Lic. En Artes del Teatro","Lic. En Sistemas de Información","Periodismo","Psicología ","Psicopedagogía","Publicidad",
"Recursos Humanos","Relaciones internacionales","Relaciones Públicas","Tecnicatura univ en yoga","Traduc. científico-Literario en ingles","Traductorado publico en inglés","Turismo y Hotelería","Veterinaria ","Abogacía",
"Adm. de Empresas","Agronegocios","Ciencias para la Familia","Ciencias Políticas","Contador Público",
"Lic. en Enfermería","Ing. en Informática","Ingeniería Industrial","Lic. Comumicación Social","Medicina",
"Org. y Gest. educativa","Orientación Familiar","Prof. universitario","Psicología ",
"Relac. Internacionales","Tecn. Superior en Logística","Tecn. Sup. en Higiene y Seguridad en el trabajo","Tecn. Sup. en adm. de RR.HH","Tecn. Sup. en Adm. Gral",
"Prof. de Educación Inicial","Prof. de Educación Primaria","Prof. de Lengua y Literatura","Prof. de Historia",
"Prof. de Biología","Prof. de Geografía","Tramo pedagógico para prof.","Guardavidas",
"Prof. de Inglés","Prof. en Educación Especial","Prof. en Educación Incial","Prof. en Educación Primaria","Tecn. de Motores y Ciegos","Tramo de Formación Docente","Prof. en Educación Inicial",
"Prof. en Educación Primaria","Prof. en Educación Fisica",
"Prof. en Educación Musical","Prof. en Danzas Folcklóricas","Prof. en Expresión Corporal","Técn. Sup. en Salud con Especialidad en Radiología","Técn. Sup. en Salud Especialidad Laboratorio de Análisis Clínicos","Técn. Sup. en Salud con Especialidad en Farmacia Hospitalitaria","Prof. de Artes Visuales",
"Prof. de Teatro","Tecnicatura en Diseño Gráfico","Tecnicatura en Diseño y prod. de indumentaria","Tecn. de realizador de artes Visuales","Tramo de formación pedagógica","Tecnicatura en Gastronomía","Profesional en Gastronomía","Lic. en Gastronomía","Profesional en Pastelería","Sommelier Profesional",
"Gerenciamiento Gastronómico","Crítico Gastronómico","Organizador de Eventos","Seguridad e Higiene","Gestoría","Publicidad","Logística","Recursos Humanos","Counseling"]


function getColor( d ) {
    /*
    Color function
    */
    if (d.ancestors().reverse().length == 1) {
        return 'transparent'
    }

    if (d.ancestors().reverse()[1].data.name == 'Privada'){
        if ( universidades.includes (d.data.name)){
          return "#5983BF"
        }
        if ( terciarios.includes (d.data.name)){
          return "#1FA1F2"
        }
    }

    if (d.ancestors().reverse()[1].data.name == 'Pública'){
        if (universidades.includes (d.data.name)){
          return "#DB872D"
        }
        if (terciarios.includes (d.data.name)){
          return "#FB7706"
        }
    }

    if (cbc.includes(d.data.name)){
        return "#FF8B4C"
    }

    if ( d.data.name in colors ) {
        return colors[d.data.name]
    }
    return "#50514F"
}


function texto ( d ) {
    /*
    Text to show
    */
    var ancestors_len = d.ancestors().reverse().length

    return ancestors_len == 2                               ? "Hay " + d.children.length + " instituciones " + d.data.name + "s de educación superior" :
           ancestors_len == 3 && d.data.children.length > 1 ? d.data.name + " tiene " + d.data.children.length + " áreas de estudio" :
           ancestors_len == 3                               ? d.data.name + " tiene " + d.data.children.length + " área de estudio":
           ancestors_len == 4 && d.data.children.length > 1 ? "El área de " + d.data.name + " en " + d.parent.data.name + " tiene " + d.data.children.length + " carreras":
           ancestors_len == 4                               ? "El área de " + d.data.name + " en " + d.parent.data.name + " tiene " + d.data.children.length + " carrera":
           ancestors_len == 5 && d.data.size.toString().endsWith('.5') ? d.data.name + " Duración: " + Math.trunc(d.data.size) + " años y medio":
                                                            d.data.name + " Duración: " + d.data.size + " años"
}

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", svgSize.width)
    .attr("height", svgSize.height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + svgSize.width / 2 + "," + svgSize.height / 2 + ")");

var partition = d3.partition()
    .size([2 * Math.PI, radius * radius]);

var arc = d3.arc()
    .startAngle(function(d) { return d.x0; })
    .endAngle(function(d) { return d.x1; })
    .innerRadius(function(d) { return Math.sqrt(d.y0); })
    .outerRadius(function(d) { return Math.sqrt(d.y1); });

// Use d3.text and d3.csvParseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text("data/datos.csv", function(text) {
    var csv = d3.csvParseRows(text);
    var json = buildHierarchy(csv);
    createVisualization(json);
});

function createVisualization(json) {
    /*
    Main function to draw and set up the visualization, once we have the data.
    */
    // Basic setup of page elements.
    initializeBreadcrumbTrail();
    d3.select("#togglelegend").on("click", toggleLegend);

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    vis.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);

    // Turn the data into a d3 hierarchy and calculate the sums.
    var root = d3.hierarchy(json)
        .sum(function(d) { return d.size; })

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition(root).descendants()
        .filter(function(d) {
            return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
        });

    var path = vis.data([json]).selectAll("path")
        .data(nodes)
        .enter().append("svg:path")
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .style("fill", function(d) { return getColor(d); })
        .style("opacity", 1)
        .on("mouseover", mouseover);

    // Set the explanation size
    var firstPath = d3.selectAll('path')._groups[0][0]
    var explanationWith = firstPath.getBoundingClientRect().width
    setExplanation(explanationWith)

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = path.datum().value;
};

function setExplanation(width_c) {
    var explanationSize = {
        width: width_c/Math.sqrt(2),
        height: width_c/Math.sqrt(2),
        //top: svgSize.width/2 - width/2 + (svgSize.width - width)/2,
        //left: svgSize.height/2 - width/2 + (svgSize.width - width)/2
        top: svgSize.width/2 - (width_c/Math.sqrt(2))/2,
        left: svgSize.width/2 - (width_c/Math.sqrt(2))/2
    }

    var explanation = document.getElementById('explanation')
    explanation.style.width = explanationSize.width + "px"
    explanation.style.height = explanationSize.height + "px"
    explanation.style.top = explanationSize.top + "px"
    explanation.style.left = explanationSize.left + "px"
}

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {
    var percentageString = texto(d)

    d3.select("#percentage")
        .text(percentageString);

    d3.select("#explanation")
        .style("visibility", "");

    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift(); // remove root node from the array
    updateBreadcrumbs(sequenceArray, '');

    // Fade all the segments.
    d3.selectAll("path")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll("path")
        .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {
    // Hide the breadcrumb trail
    d3.select("#trail")
        .style("visibility", "hidden");

    // Deactivate all segments during transition.
    d3.selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .on("end", function() {
            d3.select(this).on("mouseover", mouseover);
        });

    d3.select("#explanation")
        .style("visibility", "hidden");
}

function initializeBreadcrumbTrail() {
    // Add the svg area.
    var trail = d3.select("#sequence").append("svg:svg")
        .attr("width", width_trail)
        .attr("height", 50)
        .attr("id", "trail");
    // Add the label at the end, for the percentage.
    trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var trail = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.data.name + d.depth; });

  // Remove exiting nodes.
  trail.exit().remove();

  // Add breadcrumb and label for entering nodes.
  var entering = trail.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return getColor(d); });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", sizeTextSequence)
      .attr("text-anchor", "middle")
      .text(function(d) { return d.data.name; });

  // Merge enter and update selections; set position for all nodes.
  entering.merge(trail).attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", sizeTextSequence)
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
       	var foundChild = false;
       	for (var k = 0; k < children.length; k++) {
       	  if (children[k]["name"] == nodeName) {
       	    childNode = children[k];
       	    foundChild = true;
       	    break;
       	  }
       	}
        // If we don't already have a child node for this branch, create it.
       	if (!foundChild) {
       	  childNode = {"name": nodeName, "children": []};
       	  children.push(childNode);
       	}
       	currentNode = childNode;
      }
      else {
       	// Reached the end of the sequence; create a leaf node.
       	childNode = {"name": nodeName, "size": size};
       	children.push(childNode);
      }
    }
  }
  return root;
};

/*
  Funciones de busqueda
*/

function search(area_search) {
  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  d3.selectAll("path")
      .filter(function(node) {
                return (node.data.name == area_search);
              })
      .style("opacity", 1);
  }

var search_list = []
areas.forEach(function ( ele ) {
  search_list.push(ele.replace(/ /g,''))
})

var input = document.getElementById("myinput");
new Awesomplete(input, {
  list: Array.from(new Set(search_list))
});

document.getElementById('myinput').addEventListener('awesomplete-selectcomplete', function(){
    search(this.value)
});
