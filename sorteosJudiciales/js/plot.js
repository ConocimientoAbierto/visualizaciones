/*
    Make the plots

    TODO:
    * Read the data from a csv file
    * svg height is not responsible, change
*/

/*
    Data to make the plots
*/
var data = [
    { "judged": "Juzgado Federal 1", "total": 2712, "corruption": 9},
    { "judged": "Juzgado Federal 2", "total": 2562, "corruption": 34},
    { "judged": "Juzgado Federal 3", "total": 2443, "corruption": 18},
    { "judged": "Juzgado Federal 4", "total": 2367, "corruption": 23},
    { "judged": "Juzgado Federal 5", "total": 2453, "corruption": 16},
    { "judged": "Juzgado Federal 6", "total": 2680, "corruption": 19},
    { "judged": "Juzgado Federal 7", "total": 2713, "corruption": 26},
    { "judged": "Juzgado Federal 8", "total": 2864, "corruption": 26},
    { "judged": "Juzgado Federal 9", "total": 3013, "corruption": 32},
    { "judged": "Juzgado Federal 10", "total": 3008, "corruption": 20},
    { "judged": "Juzgado Federal 11", "total": 2998, "corruption": 55},
    { "judged": "Juzgado Federal 12", "total": 2925, "corruption": 28}
]

var columns = [ "judged", "total", "corruption" ]
data.columns = columns

dataGeneral = []
data.forEach(function ( d ) {
    dataGeneral.push({ "judged": d.judged, "value":d.total })
})

dataCorruption = []
data.forEach(function ( d ) {
    dataCorruption.push({ "judged": d.judged, "value":d.corruption })
})

/*
    Set the dimensions and margins of the graph
*/
var col = document.getElementById('graph-col')

var containerSize = {
    // 30 row paddinf
    width: col.clientWidth - 30,
    height: 500
}

var margin = {top: 20, right: 20, bottom: 90, left: 40},
    width = containerSize.width - margin.left - margin.right,
    height = containerSize.height - margin.top - margin.bottom;

var svg = d3.select("#graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

// Set the ranges and the x-axis domain
var xBar = d3.scaleBand()
             .range([0, width])
             .padding(0.1),
    yBar = d3.scaleLinear()
             .range([height, 0]),
    yLine = d3.scaleLinear()
              .range([height, 0]);

xBar.domain( data.map( function( d ) { return d.judged }))

// Create the axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xBar))
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-65)");

svg.append("g")
    .attr("class", "y axis")

// Setup the tool tip
var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html( function( d ) {
        return "Cantidad Sorteos: " + d.value
    })
svg.call(tool_tip)


function updateBarPlot(data) {
    /*
    Create the bar plot

    Parameters
    ----------
    data.judged
    data.value
    */

    // Scale the range of the data in the domains
    yBar.domain( [0, d3.max( data, function( d ) {
        return d.value
    })])

    // append the rectangles for the bar chart
    var bars = svg.selectAll("rect")
        .data(data)

    // Enter
    bars.enter()
        .append("svg:rect")
        .attr("class", "bar")
        .attr("x", function( d ) {
            return xBar( d.judged )
        })
        .attr("y", function (d, i) {
            return height;
        })
        .attr("width", xBar.bandwidth())
        .attr("height", 0)
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide)

    bars
        .attr("y", height)
		.attr("height", 0)
		.transition()
		.duration(500)
        .delay(function (d, i) {
    	       return i * 100;
    	})
        .attr("y", function( d ) {
            return yBar( d.value )
        })
		.attr("height", function( d ) {
            return  height - yBar( d.value )
        })

    // Set the y Axis
    svg.select("g.y")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yBar));
}

function updateLines(data) {
    /*

    */
    // Scale the range of the data in the domains
    yLine.domain( [0, d3.max( data, function( d ) {
        return d.value
    })])

    var pointMin = d3.min( data, function( d ) { return d.value }),
        pointMax = d3.max( data, function( d ) { return d.value })

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
