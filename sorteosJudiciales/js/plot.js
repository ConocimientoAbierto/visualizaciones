/*
    Set the dimensions and margins of the graph
*/
var col = document.getElementById('graph-col')

var containerSize = {
    width: col.clientWidth - 30, // 30px row padding
    height: 500
}

var margin = {top: 20, right: 20, bottom: 90, left: 40},
    width = containerSize.width - margin.left - margin.right,
    height = containerSize.height - margin.top - margin.bottom

var svg = d3.select("#graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")")

/*
    Create the axis
*/
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")

svg.append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Cantidad Causas")

/*
    Set the ranges
*/
var xBar = d3.scaleBand()
             .range([0, width])
             .padding(0.3),
    xHis = d3.scaleTime()
             .range([0, width]),
    yBar = d3.scaleLinear()
             .range([height, 0]),
    yHis = d3.scaleLinear()
             .range([height, 0])

/*
    Initialize tooltip
*/
var toolTip = d3.tip()
                .attr( 'class', 'd3-tip' )
                .offset( [-10, 0] )

svg.call(toolTip)

/*
    General variables
*/
var parseDate = d3.timeParse("%d/%m/%Y"),
    dataCSV,
    dataBins,
    judgesFirstName = ["Servini de Cubria", "Ramos", "Rafecas", "Lijo",
                       "Martinez de Giorgi (5)", "Canicoba Corral", "Casanello",
                       "Martinez de Giorgi (8)", "Rodriguez", "Ercolini",
                       "Bonadio", "Torres"],
    judgesLastName = ["Maria Romilda", "Sebastian Roberto", "Daniel Eduardo",
                      "Ariel Oscar", "Marcelo Pedro", "Rodolfo A.",
                      "Sebastian Norberto", "Marcelo Pedro", "Luis Osvaldo",
                      "Julian Daniel", "Claudio", "Sergio Gabriel"]

/*
    Spinner settings
    This code was take from http://bl.ocks.org/eesur/cf81a5ea738f85732707
    Tanks to Sundar!
*/
var opts = {
    lines: 9, // The number of lines to draw
    length: 9, // The length of each line
    width: 5, // The line thickness
    radius: 14, // The radius of the inner circle
    color: '#EE3124', // #rgb or #rrggbb or array of colors
    speed: 1.9, // Rounds per second
    trail: 40, // Afterglow percentage
    className: 'spinner', // The CSS class to assign to the spinner
}


// Callback function wrapped for loader in 'init' function
function init() {

    // Trigger loader
    var target = document.getElementById('graph')
    var spinner = new Spinner(opts).spin(target)

    // Get the data
    var dataUrl = "https://conocimientoabierto.github.io/visualizaciones/sorteosJudiciales/data/sorteos.csv"
    var dataUrl = './sorteos.csv'
    //var dataUrl = '../data/sorteos.csv'
    d3.csv(dataUrl, function(error, data) {
        // Catch the errors
        if (error) throw error

        // Stop spin.js loader
        spinner.stop()

        // Parse the time
        data.forEach(function( line ) {
            line.fechaAsignacion = parseDate(line.fechaAsignacion)
        })

        dataCSV = data

        dataBins = calculateBins(dataCSV)
        plotBars(dataBins)
        plotBars(dataBins)

        //
        scroll.on('active', function( i ){

            if ( i == 0 ) {
                // todos los sorteos
                plotBars( dataBins )
            }
            if ( i == 1 ) {
                // zoom sorteos
                partial = minMaxBins( dataBins )
                plotBars( partial )
            }
            if (i == 2) {
                // corrupcion
                plotBars( dataBins, corruption=true )
            }
            if (i == 3) {
                // zoom corrupcion
                partial = minMaxBins( dataBins, corrupcion=true )
                plotBars( partial, corrupcion=true )
            }
            if (i == 4) {
                // Historico
                plotHistorical( dataCSV )
            }
            if (i == 5 ) {
                // Filtro
                // Data by date
                var dataM = filterByDate( dataCSV, false, true )
                var dataK = filterByDate( dataCSV, true, false )

                // Bins
                var binsM = calculateBins( dataM )
                var binsK = calculateBins( dataK )

                var m = [],
                    k = [],
                    j = []
                binsM.forEach( function ( d ) {
                    m.push( d.total )
                    j.push( d.judgeFullName )
                })
                binsK.forEach( function ( d ) {
                    k.push( d.total )
                })

                var ddM = []

                for (i=0; i < k.length; i++) {
                    ddM.push({ "values": k[i],
                                "key": 'Kirchnerismo',
                                "judgeFullName": j[i] })
                }

                for (i=0; i < m.length; i++) {
                    ddM.push({ "values": m[i],
                                "key": 'Macrismo',
                                "judgeFullName": j[i] })
                }
                plotBarsFilter( ddM )

                d3.select("#crimeInput").on("input", function() {
                    var input = this.value
                    var partial = []

                    dataCSV.forEach( function ( line ) {
                        if ( line.delitos.includes( input ) == true ) {
                            partial.push( line )
                        }
                    })

                    if (input == 'todos') {
                        partial = dataCSV
                    }

                    // Data by date
                    var dataM = filterByDate( partial, false, true )
                    var dataK = filterByDate( partial, true, false )

                    // Bins
                    var binsM = calculateBins( dataM )
                    var binsK = calculateBins( dataK )

                    var m = [],
                        k = [],
                        j = []
                    binsM.forEach( function ( d ) {
                        m.push( d.total )
                        j.push( d.judgeFullName )
                    })
                    binsK.forEach( function ( d ) {
                        k.push( d.total )
                    })

                    var ddM = []

		            for (i=0; i < k.length; i++) {
                        ddM.push({ "values": k[i],
                                    "key": 'Kirchnerismo',
                                    "judgeFullName": j[i] })
                    }

                    for (i=0; i < m.length; i++) {
                        ddM.push({ "values": m[i],
                                    "key": 'Macrismo',
                                    "judgeFullName": j[i] })
                    }
                    plotBarsFilter( ddM )
                })

            }

            console.log(i + 'th section active')
        })
    })

    // Add the options input
    select = document.getElementById('crimeInput')
    uniqueCrimes.forEach( function ( d ) {
        var opt = document.createElement('option')
        opt.value = d
        opt.innerHTML = d
        select.appendChild(opt)
    })
}


function calculateBins( data ) {
    /*
    Calculate the data from each judged
    */
    var partial = []

    // Initialize with empty values
    for (i = 1; i < 13; i++ ) {
        partial.push({
            "judged": "JUZGADO CRIMINAL Y CORRECCIONAL FEDERAL " + i,
            "judgeFisrtName": judgesFirstName[ i - 1],
            "judgeLastName": judgesLastName[ i - 1 ],
            "judgeFullName": judgesFirstName[ i - 1] + ", " + judgesLastName[ i - 1 ],
            "order": i,
            "total": 0,
            "corruption": 0
        })
    }

    // Sum by judged and corruption
    data.map ( function ( line ) {
        var index = +line.dependenciaAsignada.split(' ')[5] - 1

        partial[ index ]['total'] += 1

        if ( line.esCorrupcion == 'True' ) {
            partial[ index ]['corruption'] += 1
        }
    })

    return partial
}


function minMaxBins ( data, corruption=false ) {
    /*
    Return the bins with the max min values
    */

    var partial = []

    if ( corruption == false ) {
        var maxValue = d3.max(data, function( d ) { return d.total }),
            minValue = d3.min(data, function( d ) { return d.total })

        data.forEach( function ( d ) {
            if ( d.total == maxValue ) {
                partial.push(d)
            }

            if ( d.total == minValue ) {
                partial.push(d)
            }
        })
    }
    else {
        var maxValue = d3.max(data, function( d ) { return d.corruption }),
            minValue = d3.min(data, function( d ) { return d.corruption })

        data.forEach( function ( d ) {
            if ( d.corruption == maxValue ) {
                partial.push(d)
            }

            if ( d.corruption == minValue ) {
                partial.push(d)
            }
        })
    }

    return partial
}


function filterByDate( data, kirchnerismo, macrismo ) {
    /*

    */
    dataFilter = []

    // Filter kirchnerismo
    if (kirchnerismo == true) {
        data.map( function ( d ) {
            if ( d.fechaAsignacion < parseDate("10/12/2015") ) {
                dataFilter.push( d)
            }
        })
    }

    // Filter macrismo
    if (macrismo == true) {
        data.map( function ( d ) {
            if ( d.fechaAsignacion >= parseDate("10/12/2015") ) {
                dataFilter.push( d)
            }
        })
    }

    return dataFilter
}


function plotBars( data, corruption=false ) {
    /*

    */
    // Set the tooptip
    toolTip.html(function ( d ) {
        return "<strong>Cantidad de causas: </strong>" + d.values
    })

    // Get all the draws or just the corruption ones
    data.map( function ( d ) {
        if ( corruption == true ) {
            d.values = d.corruption
        }
        else {
            d.values = d.total
        }
    })

    // Set the domains
    xBar.domain( data.map( function ( d ) { return d.judgeFullName }))
    yBar.domain( [0, d3.max( data, function( d ) { return d.values })])

    // Append the rectangles for the bar chart
    var bars = svg.selectAll("rect")
        .data(data)

    bars.exit()
        .transition()
            .duration(800)
        .attr("y", height)
        .attr("height", 0)
        .remove();

    // New data
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function( d ) { return xBar( d.judgeFullName ) })
        .attr("y", height )
        .attr("width", xBar.bandwidth())
        .attr("height", 0)
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide)
        .transition()
		    .duration(800)
            .delay(function (d, i) { return i * 100 })
        .attr("y", function( d ) { return yBar( d.values ) })
		.attr("height", function( d ) { return  height - yBar( d.values ) })

    // Update
    bars
        .attr("x", function( d ) { return xBar( d.judgeFullName ) })
        .attr("y", height )
        .attr("width", xBar.bandwidth())
        .attr("height", 0)
		.transition()
		    .duration(800)
            .delay(function (d, i) { return i * 100 })
        .attr("y", function( d ) { return yBar( d.values ) })
		.attr("height", function( d ) { return  height - yBar( d.values ) })

    // Set X-Axis
    svg.select("g.x")
        .call(d3.axisBottom(xBar))
        .selectAll(".tick text")
        .call(wrap, xBar.bandwidth())

    // Set Y-Axis
    svg.select("g.y")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yBar))
}


function plotHistorical( data ) {
    /*

    */
    //
    toolTip.html(function ( d ) {
        var text = "<strong>Fecha: </strong>" + (d.x0.getMonth() + 1) + "/" +
                   d.x0.getFullYear() + " al " + (d.x1.getMonth() + 1) +
                   '/' + d.x1.getFullYear() +
                   "<br><strong>Cantidad de causas: </strong>" + d.length
        return text
    })

    d3.selectAll("rect").remove()
    d3.selectAll(".legend").remove()

    // Set X-Axis domain
    var dateMax = d3.max( data, function ( d ) { return d.fechaAsignacion }),
        dateMin = d3.min( data, function ( d ) { return d.fechaAsignacion })

    xHis.domain([dateMin, dateMax])

    // Set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function( d ) { return d.fechaAsignacion })
        .domain(xHis.domain())
        .thresholds(xHis.ticks( d3.timeMonth ))

    // group the data for the bars
    var bins = histogram(data)

    // Scale the range of the data in the y domain
    yHis.domain([0, d3.max(bins, function(d) { return d.length; })])

    var bars = svg.selectAll("rect")
        .data(bins)

    // New Data
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {return xHis(d.x0)})
        .attr("width", function(d) { return xHis(d.x1) - xHis(d.x0) -1 })
    	.attr("y", function(d) { return height })
    	.attr("height", 0)
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide)
    	.transition().duration(500)
    	   .delay(function(d, i) {return i * 20 })
        .attr("height", function(d) { return height - yHis(d.length) })
    	.attr("y", function(d) {return yHis(d.length)})

    // Update X-Axis
    svg.select("g.x")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom( xHis ))

    // Update Y-Axis
    svg.select("g.y")
       .call(d3.axisLeft( yHis ))
}

function plotBarsFilter(data) {
    console.log('Data')
    console.log(data)

    d3.selectAll("rect").remove()



    // Set the domains
    xBar.domain( data.map( function ( d ) { return d.judgeFullName }))
    yBar.domain( [0, d3.max( data, function( d ) { return d.values })])

    var x0 = d3.scaleBand()
	.rangeRound([0,xBar.bandwidth()])
	.paddingInner(0.1)
	.domain(['Kirchnerismo', 'Macrismo'])

    var z = d3.scaleOrdinal()
	.domain(['Kirchnerismo', 'Macrismo'])
	.range(["steelblue", "#ffcb0d"])

    // Append the rectangles for the bar chart
    var bars = svg.selectAll("rect")
        .data(data)

    bars.exit()
        .transition()
            .duration(800)
        .attr("y", height)
        .attr("height", 0)
        .remove();

    // New data
    bars.enter()
        .append("rect")
        //.attr("class", "bar")
        .attr("x", function( d ) { return xBar( d.judgeFullName ) })
        .attr("y", height )
        .attr("width", xBar.bandwidth() / 2)
        .attr("height", 0)
	.attr("fill", function(d) { return z(d.key); })
        .attr("transform", function(d) { return "translate(" + x0(d.key) + ",0)"; })
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide)
        .transition()
		    .duration(800)
            .delay(function (d, i) { return i * 50 })
        .attr("y", function( d ) { return yBar( d.values ) })
		.attr("height", function( d ) { return  height - yBar( d.values ) })

    // Update
    bars
        .attr("x", function( d ) { return xBar( d.judgeFullName ) })
        .attr("y", height )
        .attr("width", xBar.bandwidth() / 2)
        .attr("height", 0)
	.transition()
	.duration(800)
        .delay(function (d, i) { return i * 100 })
        .attr("y", function( d ) { return yBar( d.values ) })
	.attr("height", function( d ) { return  height - yBar( d.values ) })


    // Set X-Axis
    svg.select("g.x")
        .call(d3.axisBottom(xBar))
        .selectAll(".tick text")
        .call(wrap, xBar.bandwidth())

    // Set Y-Axis
    svg.select("g.y")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yBar))

var legend = svg.append("g")
    .attr("class", "legend")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(['Kirchnerismo', 'Macrismo'])
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

}


function wrap(text, width) {
    /*
    Break long label in multiple lines.
    This code was take from https://bl.ocks.org/mbostock/7555321
    Thanks to Mike Bostock!
    */
    text.each( function() {
        var text = d3.select( this ),
            words = text.text( ).split( /\s+/ ).reverse( ),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr( "y" ),
            dy = parseFloat( text.attr( "dy" )),
            tspan = text.text( null )
                        .append( "tspan" )
                        .attr( "x", 0 )
                        .attr( "y", y )
                        .attr( "dy", dy + "em" )

        while ( word = words.pop() ) {
            line.push( word )
            tspan.text( line.join( " " ))
            if ( tspan.node().getComputedTextLength() > width) {
                line.pop()
                tspan.text(line.join( " " ))
                line = [word]
                tspan = text.append("tspan")
                            .attr("x", 0)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word)
            }
        }
    })
}


var uniqueCrimes = ['Delitos contra las personas',
       'Delitos contra la propiedad',
       'Delitos contra el estado civil', 'Delitos contra la fé pública',
       'Ley de Estupefacientes', 'Delitos contra la seguridad pública',
       'Delitos contra la libertad', 'Ley de Abastecimiento',
       'Delitos contra la Administración Pública',
       'Ley de Marcas y Designaciones', 'Ley Antidiscriminatoria',
       'Ley de Servicios de Comunicaciones Móviles',
       'Ley Penal Tributaria', 'Delitos contra el orden público',
       'Modificación de la ley de Identidad Personal',
       'Delitos contra la integridad sexual', 'Ley de Migraciones',
       'Ley de Residuos Peligrosos', 'Delitos contra la libertad ',
       'Ley de patentes de invención y modelos de utilidad',
       'Régimen legal de la propiedad intelectual',
       'Conservación de la fauna',
       'Delitos contra los poderes públicos y el orden constitucional',
       'Ley de profilaxis',
       'Delitos contra el orden económico y financiero',
       'Protección del patrimonio arqueológico y paleontológico',
       'Régimen penal aduanero', 'Delitos contra el honor',
       'Código Electoral Nacional', 'Servicio de comunicaciones móviles',
       'Delitos contra la seguridad de la Nación', 'Extradición',
       'Riesgos del trabajo', 'Espionaje, sabotaje y traición',
       'Régimen penal cambiario', 'Régimen penal tributario',
       'Impedimento de contacto', 'Ley de Sangre',
       'Ley de trabajo a domicilio',
       'Ley de Seguridad Nacional - Subversión económica y otras',
       'Ley de defensa nacional', 'Ley de espionaje, sabotaje y traición',
       'Ley de defensa de la competencia (abrogada)',
       'Ley de defensa del consumidor', 'Ley del deporte',
       'Ley de procedimientos fiscales',
       'Ley de protección integral a las mujeres',
       'Incumplimiento de deberes de asistencia familiar',
       'Ley de protección integral de las niñas, niños y adolescentes']
