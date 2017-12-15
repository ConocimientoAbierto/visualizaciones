/*
    Set the dimensions and margins of the graph
*/
var col = document.getElementById('graph-col')

var containerSize = {
    width: col.clientWidth - 30, // 30px row paddinf
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
             .range([height, 0]),
    yLine = d3.scaleLinear()
              .range([height, 0])

/*
    General variables
*/
var parseDate = d3.timeParse("%d/%m/%Y"),
    dataCSV,
    dataBins

/*
    Loader settings

    The spinner code was take from this link
    http://bl.ocks.org/eesur/cf81a5ea738f85732707

    tanks to Sundar!
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

            if (i == 0) {
                removeLine()
                plotBars(dataBins)
            }
            if (i == 1) {
                plotLines(dataBins)
            }
            if (i == 2) {
                removeLine()
                plotBars(dataBins, corruption=true)
            }
            if (i == 3) {
                plotLines(dataBins, corruption=true)
            }
            if (i == 4) {
                removeLine()
                plotHistorical(dataCSV)
            }

            console.log(i + 'th section active')
        })
    })
}


function filterData( kirchnerismo, macrismo ) {
    /*

    */
    dataFilter = []

    // Filter kirchnerismo
    if (kirchnerismo == true) {
        dataCSV.map( function ( d ) {
            if ( d.fechaAsignacion < parseDate("21/08/2016") ) {
                dataFilter.push( d)
            }
        })
    }

    // Filter macrismo
    if (macrismo == true) {
        dataCSV.map( function ( d ) {
            if ( d.fechaAsignacion > parseDate("21/08/2016") ) {
                dataFilter.push( d)
            }
        })
    }

    return dataFilter
}


function calculateBins( data ) {
    /*

    */
    var partial = []

    // Initialize with empty values
    for (i = 1; i < 13; i++ ) {
        partial.push({
            "judged": "JUZGADO CRIMINAL Y CORRECCIONAL FEDERAL " + i,
            "judge_name": "",
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


function plotBars( data, corruption=false ) {
    /*

    */
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
    xBar.domain( data.map( function ( d ) { return d.judged }))
    yBar.domain( [0, d3.max( data, function( d ) { return d.values })])

    // Append the rectangles for the bar chart
    var bars = svg.selectAll("rect")
        .data(data)

    // Enter
    bars.enter()
        .append("svg:rect")
        .attr("class", "bar")
        .attr("x", function( d ) { return xBar( d.judged ) })
        .attr("y", function(d ) { return height })
        .attr("width", xBar.bandwidth())
        .attr("height", 0)
        //.on('mouseover', tool_tip.show)
        //.on('mouseout', tool_tip.hide)

    bars
        .attr("y", height)
		.attr("height", 0)
		.transition()
		.duration(500)
        .delay(function (d, i) { return i * 100 })
        .attr("y", function( d ) { return yBar( d.values ) })
		.attr("height", function( d ) { return  height - yBar( d.values ) })

    // Set the Axis
    svg.select("g.x")
        .call(d3.axisBottom(xBar))
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-65)")

    svg.select("g.y")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yBar));
}


function plotLines( data, corruption=false ) {
    /*

    */
    // Get all the draws or just the corruption ones
    data.map( function ( d ) {
        if ( corruption == true ) {
            d.values = d.corruption
        }
        else {
            d.values = d.total
        }
    })

    // Scale the range of the data in the domains
    yLine.domain( [0, d3.max( data, function( d ) {
        return d.values
    })])

    var pointMin = d3.min( data, function( d ) { return d.values }),
        pointMax = d3.max( data, function( d ) { return d.values })

	var lineMin = d3.line()
			.x( function( d ) { return xBar( d.judged ) + xBar.bandwidth()/2 })
			.y( function( d ) { return yLine( pointMin ) })

    var lineMax = d3.line()
			.x( function( d ) { return xBar( d.judged ) + xBar.bandwidth()/2 })
			.y( function( d ) { return yLine( pointMax ) })

    var pathMax = svg.append("path")
       .attr("class", "min-max-line")
       .attr("d", lineMax( data ))

    var pathMin = svg.append("path")
        .attr("class", "min-max-line")
        .attr("d", lineMin( data ))

    var totalLength = pathMin.node().getTotalLength()

    pathMax
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    pathMin
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
}


function removeLine() {
    d3.selectAll(".min-max-line").remove()
}


function plotHistorical( data ) {
    /*

    */
    d3.selectAll(".bar").remove()

    var dateMax = d3.max( data, function ( d ) { return d.fechaAsignacion }),
        dateMin = d3.min( data, function ( d ) { return d.fechaAsignacion })

    xHis.domain([dateMin, dateMax])

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function( d ) { return d.fechaAsignacion })
        .domain(xHis.domain())
        .thresholds(xHis.ticks( d3.timeMonth ))

    // group the data for the bars
    var bins = histogram(data)

    // Scale the range of the data in the y domain
    yHis.domain([0, d3.max(bins, function(d) { return d.length; })])

    svg.selectAll("rect")
      .data(bins)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function(d) {
		  return "translate(" + xHis(d.x0) + "," + yHis(d.length) + ")"; })
      .attr("width", function(d) { return xHis(d.x1) - xHis(d.x0) -1 ; })
      .attr("height", function(d) { return height - yHis(d.length); })


  svg.select("g.x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom( xHis ))

  svg.select("g.y")
      .call(d3.axisLeft( yHis ))
}
