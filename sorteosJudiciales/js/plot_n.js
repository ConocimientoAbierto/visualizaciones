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

// Set the ranges
var xHist = d3.scaleBand()
              .range([0, width])
              .padding(0.1),
    yHist = d3.scaleLinear()
              .range([height, 0]),
    yLine = d3.scaleLinear()
              .range([height, 0]);

// Set the xHist domain
var xDomain = ["Juzgado Federal 1", "Juzgado Federal 2", "Juzgado Federal 3",
               "Juzgado Federal 4", "Juzgado Federal 5", "Juzgado Federal 6",
               "Juzgado Federal 7", "Juzgado Federal 8", "Juzgado Federal 9",
               "Juzgado Federal 10", "Juzgado Federal 11", "Juzgado Federal 12"]
xHist.domain(xDomain)


// Parse the date/time
var parseDate = d3.timeParse("%d/%m/%Y")

// Get the data
var data_
d3.csv('../data/sorteos.csv', function(error, data) {
    // Catch the errors
    if (error) throw error

    // Parse the time
    data.forEach(function( line ) {
        line.fechaAsignacion = parseDate(line.fechaAsignacion)
    })

    data_ = data

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d.dependenciaAsignada })
        .domain(xHist.domain())

    // group the data for the bars
    var bins = histogram(data)

    // Scale the range of the data in the y domain
    yHist.domain([0, d3.max(bins, function(d) { return d.length })])

    console.log(bins)
})
