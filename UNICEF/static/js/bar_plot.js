var data = {
  "Jujuy": [
    {"label":"Cant. de Localidades", "value":2},
    {"label":"Cant. de Hogares", "value":3},
    {"label":"Participacion Joven", "value":35},
    {"label":"Participacion Capacitacion Equipos Tecnicos", "value":175},
    {"label":"Redes Socio Laborales", "value":1},
    {"label":"Jovenes Actividad Inclusion Laboral", "value":14},
    {"label":"Jovenes Empleo Formal", "value":2}
  ],
  "Santa Fe": [
    {"label":"Cant. de Localidades", "value":12},
    {"label":"Cant. de Hogares", "value":26},
    {"label":"Participacion Joven", "value":172},
    {"label":"Participacion Capacitacion Equipos Tecnicos", "value":406},
    {"label":"Redes Socio Laborales", "value":1},
    {"label":"Jovenes Actividad Inclusion Laboral", "value":53},
    {"label":"Jovenes Empleo Formal", "value":0}
  ],
  "Misiones": [
    {"label":"Cant. de Localidades", "value":5},
    {"label":"Cant. de Hogares", "value":6},
    {"label":"Participacion Joven", "value":67},
    {"label":"Participacion Capacitacion Equipos Tecnicos", "value":183},
    {"label":"Redes Socio Laborales", "value":0},
    {"label":"Jovenes Actividad Inclusion Laboral", "value":2},
    {"label":"Jovenes Empleo Formal", "value":0}
  ],
  "Salta": [
    {"label":"Cant. de Localidades", "value":0},
    {"label":"Cant. de Hogares", "value":26},
    {"label":"Participacion Joven", "value":14},
    {"label":"Participacion Capacitacion Equipos Tecnicos", "value":123},
    {"label":"Redes Socio Laborales", "value":0},
    {"label":"Jovenes Actividad Inclusion Laboral", "value":0},
    {"label":"Jovenes Empleo Formal", "value":0}
  ],
  "Tucuman": [
    {"label":"Cant. de Localidades", "value":3},
    {"label":"Cant. de Hogares", "value":11},
    {"label":"Participacion Joven", "value":70},
    {"label":"Participacion Capacitacion Equipos Tecnicos", "value":225},
    {"label":"Redes Socio Laborales", "value":1},
    {"label":"Jovenes Actividad Inclusion Laboral", "value":21},
    {"label":"Jovenes Empleo Formal", "value":1}
  ]
}

var data_length = 7

var axisMargin = 20,
    margin = 40,
    valueMargin = 4,
    width = parseInt(d3.select('#info-graph').style('width'), 10),
    height = parseInt(d3.select('#info-graph').style('height'), 10),
    barHeight = (height-axisMargin-margin*2)* 0.6/data_length,
    barPadding = (height-axisMargin-margin*2)*0.4/data_length,
    data, bar, scale, xAxis, labelWidth = 0;

var svg = d3.select('svg')
            .attr("width", width)
            .attr("height", height);

function plot(data) {
    // Remove the previus plot
    svg.selectAll("*").remove();

    max = d3.max(data, function(d) { return d.value; });

    bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

    bar.attr("class", "bar")
            .attr("cx",0)
            .attr("transform", function(d, i) {
                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
            });

    bar.append("text")
            .attr("class", "label")
            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle
            .text(function(d){
                return d.label;
            }).each(function() {
        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
    });

    scale = d3.scale.linear()
            .domain([0, max])
            .range([0, width - margin*2 - labelWidth]);

    xAxis = d3.svg.axis()
            .scale(scale)
            .tickSize(-height + 2*margin + axisMargin)
            .orient("bottom");

    bar.append("rect")
            .attr("transform", "translate("+labelWidth+", 0)")
            .attr("height", barHeight)
						.attr("width", 0)
						.transition()
						.duration(1500)
						.delay(function(d,i){ return i*250})
            .attr("width", function(d){
                return scale(d.value);
            });

    bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("dx", -valueMargin + labelWidth) //margin right
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "end")
            .text(function(d){
                return (d.value);
            })
            .attr("x", function(d){
                var width = this.getBBox().width;
                return Math.max(width + valueMargin, scale(d.value));
            });

    svg.insert("g",":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
            .call(xAxis);
}
