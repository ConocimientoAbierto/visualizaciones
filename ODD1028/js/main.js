var chart = d3.select('#chart')
var data
var icons = []

// var chartSize = {width: window.innerWidth, height: window.innerHeight - 80}
var chartSize = {width: window.innerWidth, height: window.innerHeight}
var margin = {top: 30, right: 30, bottom: 30, left: 30}
var svgSize = {width: chartSize.width - margin.left - margin.right,
  height: chartSize.height - margin.top - margin.bottom}

// Letters
var radio = 3
var delta = 3
var yOffset = radio + 5

var color = {'Femenino': 'pink', 'Masculino': 'blue'}

// Append SVG ans set the correct size
var svg = chart
  .append('svg')
    .attr('width', svgSize.width + margin.left + margin.right)
    .attr('height', svgSize.height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Scales
var x = d3.scaleLinear()
    .range([0, svgSize.width])

var y = d3.scaleLinear()
    .range([svgSize.height, 0])

// Axis
var xAxis = d3.axisBottom(x)
var yAxis = d3.axisLeft(y)

var url = 'https://raw.githubusercontent.com/ConocimientoAbierto/visualizaciones/gh-pages/ODD1028/data/inscriptos.csv'
d3.csv(url, function (error, csv) {
  if (error) throw error

  data = csv

  // Parse float
  data.forEach(function (d) {
    d.edad = +d.edad
  })

  calculatePositions()

  // Set domains
  var xMax = d3.max(data, function (d) { return d.step1.x })
  x.domain([0, xMax + delta])
  y.domain(d3.extent(data, function (d) { return d.step1.y })).nice()

  // Append the points
  svg.selectAll('.dot')
      .data(data)
    .enter().append('circle')
      .attr('r', 0)
      .attr('cx', function (d) { return x(d['step0'].x) })
      .attr('cy', function (d) { return y(d['step0'].y) })
      .transition()
      .duration(1000)
      .attr('class', 'dot')
      .attr('r', function (d) { return d.radio })
      .style('fill', function (d) { return color[d.genero] })

  scrollEvents()
})

function plot (stepNumber, duration, delayMax, delayMin) {
  delayMin = typeof delayMin === 'undefined' ? 0 : delayMin

  // Update Y scale and axis
  var yMax = d3.max(data, function (d) { return d['step' + stepNumber].y })
  if (stepNumber == 1) {
    y.domain([-1, yMax + 5])
  } else if (stepNumber == 6) {
    y.domain([-1, 20])
  } else {
    y.domain([-1, yMax])
  }

  svg.select('.y.axis')
    .call(yAxis)

  //
  var circle = svg.selectAll('.dot')
      .data(data)

  // Exit circles
  circle.exit()
      .remove()

  circle.enter().append('circle')
    .merge(circle)
      .transition()
      .duration(duration)
      .attr('class', 'dot')
      .attr('r', function (d) { return d['step' + stepNumber].r })
      .attr('cx', function (d) { return x(d['step' + stepNumber].x) })
      .attr('cy', function (d) { return y(d['step' + stepNumber].y) })
      .style('fill', function (d) { return color[d.genero] })
      .delay(function (d) { return delayMin + Math.random() * delayMax })
      // .ease(d3.easeBounce)

  // Personal labels
  var labels = svg.selectAll('image')
      .data(icons['step' + stepNumber])

  labels.exit()
      .remove()

  labels.enter().append('image')
    .merge(labels)
      .attr('x', function (d) { return x(d.x) })
      .attr('y', function (d) { return y(d.y) })
      .attr('width', 0)
      .attr('height', 0)
      .transition()
      .duration(duration)
      .attr('width', 30)
      .attr('height', 30)
      .attr('xlink:href', function (d) { return d.icon })
}

function calculatePositions () {
  /***********************************
  Step 1
  Los tamanos de las letras estan definidos en funcion de variables
  pero no los limites del for. Deveria mejorarlo
  ***********************************/
  for (var i = 0; i < data.length; i++) {
    data[i].step1 = {x: 0, y: 0, r: 0}
  }

  // Letra O
  for (i = 0; i < 100; i++) {
    var xOffset = (2 * radio + delta + radio) + delta
    var tetha = 2 * Math.PI * i / 100
    data[i].step1 = {x: xOffset + 3 / 2 * radio * Math.cos(tetha),
      y: yOffset + radio * Math.sin(tetha),
      r: 3.5}
  }

  // Palito de la D
  for (i = 0; i < 26; i++) {
    xOffset = 2 * (2 * radio + delta) + delta
    data[100 + i].step1 = {x: xOffset,
      y: yOffset + -radio + 2 * radio * i / 26,
      r: 3.5}
  }

  // Curva de la D
  for (i = 0; i < 74; i++) {
    xOffset = 2 * (2 * radio + delta) + delta
    var sign = i < 37 ? 1 : -1
    var ii = i < 37 ? i : i - 37
    tetha = sign * 1 / 2 * Math.PI * ii / 37
    data[126 + i].step1 = {x: xOffset + 2 * radio * Math.cos(tetha),
      y: yOffset + radio * Math.sin(tetha),
      r: 3.5}
  }

  // Segunda D
  for (i = 0; i < 26; i++) {
    xOffset = 3 * (2 * radio + delta) + delta / 2
    data[200 + i].step1 = {x: xOffset,
      y: yOffset + -radio + 2 * radio * i / 26,
      r: 3.5}
  }

  // Curva de la D
  for (i = 0; i < 74; i++) {
    xOffset = 3 * (2 * radio + delta) + delta / 2
    sign = i < 37 ? 1 : -1
    ii = i < 37 ? i : i - 37
    tetha = sign * 1 / 2 * Math.PI * ii / 37
    data[226 + i].step1 = {x: xOffset + 2 * radio * Math.cos(tetha),
      y: yOffset + radio * Math.sin(tetha),
      r: 3.5}
  }

  // Hast
  for (i = 0; i < 25; i++) {
    xOffset = delta
    data[300 + i].step1 = {x: xOffset + Math.cos(20) * (2 * radio * i / 25),
      y: yOffset - radio + Math.sin(20) * (2 * radio * i / 25),
      r: 3.5}
  }

  for (i = 0; i < 25; i++) {
    xOffset = radio + delta
    data[325 + i].step1 = {x: xOffset + Math.cos(20) * (2 * radio * i / 25),
      y: yOffset - radio + Math.sin(20) * (2 * radio * i / 25),
      r: 3.5}
  }

  for (i = 0; i < 25; i++) {
    xOffset = delta
    data[350 + i].step1 = {x: xOffset + 2 * radio * i / 25,
      y: yOffset + 2 * radio * 1 / 6,
      r: 3.5}
  }

  for (i = 0; i < 25; i++) {
    xOffset = delta
    data[375 + i].step1 = {x: xOffset + 2 * radio * i / 25,
      y: yOffset + -2 * radio * 1 / 6,
      r: 3.5}
  }

  // Icons
  icons.step1 = []

  var maxX = d3.max(data, function (d) { return d.step1.x }) + delta
  var maxY = d3.max(data, function (d) { return d.step1.y })
  /***********************************
  Step 0
  Posicion aleatorio dentro del svg
  ***********************************/
  for (i = 0; i < 400; i++) {
    data[i].step0 = {x: Math.random() * maxX, y: Math.random() * maxY}
    data[i].radio = 3.5
  }

  for (i = 400; i < data.length; i++) {
    data[i].step0 = {x: 0, y: 0, r: 0}
  }

  // Icons
  icons.step0 = []

  /***********************************
  Step 2
  ***********************************/
  for (i = 0; i < data.length; i++) {
    data[i].step2 = {x: 0, y: 0, r: 0}
  }

  calculateBin('2', 'genero', 'Femenino', 7, maxX * 1 / 3)
  calculateBin('2', 'genero', 'Masculino', 7, maxX * 2 / 3)

  // Icons
  icons.step2 = []

  /***********************************
  Step 3
  ***********************************/
  for (i = 0; i < data.length; i++) {
    data[i].step3 = {x: 0, y: 0, r: 0}
  }

  calculateBin('3', 'profesion_gral', 'Abogado', 2, maxX * 1 / 13)
  calculateBin('3', 'profesion_gral', 'Administración', 2, maxX * 2 / 13)
  calculateBin('3', 'profesion_gral', 'Data Science', 2, maxX * 3 / 13)
  calculateBin('3', 'profesion_gral', 'Ingeniería', 2, maxX * 4 / 13)
  calculateBin('3', 'profesion_gral', 'Desarrollador', 2, maxX * 5 / 13)
  calculateBin('3', 'profesion_gral', 'Comunicación y Periodismo', 2, maxX * 6 / 13)
  calculateBin('3', 'profesion_gral', 'Sociales', 2, maxX * 7 / 13)
  calculateBin('3', 'profesion_gral', 'Sistemas', 2, maxX * 8 / 13)
  calculateBin('3', 'profesion_gral', 'Estudiantes', 2, maxX * 9 / 13)
  calculateBin('3', 'profesion_gral', 'Otros', 2, maxX * 10 / 13)
  calculateBin('3', 'profesion_gral', 'Consultor', 2, maxX * 11 / 13)
  calculateBin('3', 'profesion_gral', 'Investigación', 2, maxX * 12 / 13)

  // Icons
  icons.step3 = [
    {x: maxX * 1 / 13 - 0.25, y: 0, icon: 'img/abogados.png'},
    {x: maxX * 2 / 13 - 0.25, y: 0, icon: 'img/administración.png'},
    {x: maxX * 3 / 13 - 0.25, y: 0, icon: 'img/data science.png'},
    {x: maxX * 4 / 13 - 0.25, y: 0, icon: 'img/ingenieros.png'},
    {x: maxX * 5 / 13 - 0.25, y: 0, icon: 'img/desarrollador.png'},
    {x: maxX * 6 / 13 - 0.25, y: 0, icon: 'img/comunicacion y periodismo.png'},
    {x: maxX * 7 / 13 - 0.25, y: 0, icon: 'img/sociales.png'},
    {x: maxX * 8 / 13 - 0.25, y: 0, icon: 'img/sistemas.png'},
    {x: maxX * 9 / 13 - 0.25, y: 0, icon: 'img/estudiante.png'},
    {x: maxX * 10 / 13 - 0.25, y: 0, icon: 'img/otros.png'},
    {x: maxX * 11 / 13 - 0.25, y: 0, icon: 'img/consultor.png'},
    {x: maxX * 12 / 13 - 0.25, y: 0, icon: 'img/investigadores.png'}
  ]
  /***********************************
  Step 4
  ***********************************/
  for (i = 0; i < data.length; i++) {
    data[i].step4 = {x: 0, y: 0, r: 0}
  }

  calculateBin('4', 'profesion_gral', 'Abogado', 2, maxX * 1 / 13)
  calculateBin('4', 'profesion_gral', 'Administración', 2, maxX * 2 / 13)
  calculateBin('4', 'profesion_gral', 'Data Science', 2, maxX * 3 / 13)
  calculateBin('4', 'profesion_gral', 'Ingeniería', 2, maxX * 4 / 13)
  calculateBin('4', 'profesion_gral', 'Desarrollador', 2, maxX * 5 / 13)
  calculateBin('4', 'profesion_gral', 'Comunicación y Periodismo', 2, maxX * 6 / 13)
  calculateBin('4', 'profesion_gral', 'Sociales', 2, maxX * 7 / 13)
  calculateBin('4', 'profesion_gral', 'Sistemas', 2, maxX * 8 / 13)
  calculateBin('4', 'profesion_gral', 'Estudiantes', 2, maxX * 9 / 13)
  calculateBin('4', 'profesion_gral', 'Otros', 2, maxX * 10 / 13)
  calculateBin('4', 'profesion_gral', 'Consultor', 2, maxX * 11 / 13)
  calculateBin('4', 'profesion_gral', 'Investigación', 2, maxX * 12 / 13)

  data.forEach(function (d) {
    d.step4.r = Math.sqrt(d.edad)
  })

  icons.step4 = icons.step3
  /***********************************
  Step 5
  ***********************************/
  for (i = 0; i < data.length; i++) {
    data[i].step5 = {x: 0, y: 0, r: 0}
  }

  calculateBin('5', 'otro_odd', 'Si', 7, maxX * 1 / 3)
  calculateBin('5', 'otro_odd', 'No', 7, maxX * 2 / 3)

  icons.step5 = []

  /***********************************
  Step 6
  ***********************************/
  for (i = 0; i < data.length; i++) {
    data[i].step6 = {x: 0, y: 0, r: 0}
  }

  for (i = 0; i < 400; i++) {
    var position = {x: Math.random() * maxX,
      y: Math.random() * 3,
      r: 3.5}

    data[i].step6 = position
  }

  icons.step6 = []

  /***********************************
  Step 7
  ***********************************/
  data[200].step7 = {x: maxX * 1 / 3, y: 15, r: 10}
}

function calculateBin (stepNumber, key, value, points4level, xOffset) {
  var cnt = 0
  var j = 0
  var k = 0
  data.forEach(function (d) {
    if (d[key] === value) {
      k = cnt % points4level === 0 ? k + 1 : k
      j = cnt % points4level === 0 ? 0 : j + 1
      cnt++

      d['step' + stepNumber] = {x: xOffset + 0.5 * j, y: k * 0.5, r: 3.5}
    }
  })
}

/***********************************
  Scroll events
***********************************/
var currentStep = 0
function scrollEvents () {
  d3.graphScroll()
    .offset(200)
    .graph(d3.selectAll('#chart'))
    .container(d3.select('#container'))
    .sections(d3.selectAll('#sections > .step'))
    .on('active', function (i) {

      if (i === 0 && currentStep !== 0) {
        plot('0', 1000, 2000)
      } else if (i === 1) {
        plot('1', 1000, 2000)
      } else if (i === 2) {
        plot('2', 1000, 2000)
      } else if (i === 3) {
        plot('3', 1000, 2000)
      } else if (i === 4) {
        plot('4', 1000, 2000)
      } else if (i === 5) {
        plot('5', 1000, 2000)
      } else if (i === 6) {
        plot('6', 1000, 2000)

        var maxX = d3.max(data, function (d) { return d.step1.x }) + delta
        data[206].step6 = {x: maxX * 1 / 2, y: 12, r: 10}
        data[201].step6 = {x: maxX * 1 / 2 + 3, y: 12 + 3, r: 10}
        data[205].step6 = {x: maxX * 1 / 2 - 3, y: 12 + 3, r: 10}
        data[5].step6 = {x: maxX * 1 / 2 + 3, y: 12 - 3, r: 10}
        data[2].step6 = {x: maxX * 1 / 2 - 3, y: 12 - 3, r: 10}
        plot('6', '1000', '2000', 3000)
      } else if (i === 7) {
        //plot('7', 1000, 2000)
      }

      currentStep++
    })
}
