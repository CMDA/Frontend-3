/* Created by @wooorm, modified by ju5tu5 */
var margin = {top: 10, right: 10, bottom: 10, left: 25};

d3.tsv('index.tsv', cleanBarchart, drawBarchart);
d3.csv('data.csv', cleanPiechart, drawPiechart);

function cleanBarchart(d) {
  return {
    no: Number(d.no),
    mark: Number(d.mark) || 0,
    group: d.group
  };
}

function drawBarchart(err, data) {
  if (err) throw err;

  // Select the container element for sizes fyi: getBBox() is GOLD!!
  var rect = document.querySelector('#top2').getBBox();

  var yScale = d3.scale.linear()
    .range([rect.height - margin.top - margin.bottom, 0])
    .domain([0, 10]);

  var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, rect.width - margin.left - margin.right], 0)
    .domain(data.map(function (d) { return d.no; }));

  var svg = d3.select('svg')
    .append('g')
      .attr('class', 'barchart')
      .attr('transform', 'translate(' + (rect.x + margin.left) + ',' + (rect.y + margin.top) + ')');

  svg.append('g')
    .attr('class', 'y axis')
    .call(d3.svg.axis().scale(yScale).orient('left'));

  svg.append('g')
    .attr('class', 'chart')
    .attr('transform', 'translate(0,' + -(margin.top + margin.bottom) + ')');

  update();

  // Add this if you want :D
  // $input.addEventListener('input', function () {
  //   $output.value = $input.value;
  //   update();
  // });

  function update() {
    // var min = Number($input.value);
    var min = 0;
    var subset = data.filter(function (d) {
      return d.mark >= min;
    });

    var bars = d3.select('.barchart .chart').selectAll('rect').data(data);

    bars.enter().append('rect');
    bars.exit().remove();

    bars
      .attr('width', xScale.rangeBand() - 1)
      .attr('x', function (d, i) { return i * xScale.rangeBand() })
      .attr('y', function (d) { return yScale(d.mark); })
      .attr('height', function (d) { return rect.height - yScale(d.mark); });
  }
}

function cleanPiechart(d) {
  return {
    age: d.age,
    population: Number(d.population) || 0
  };
}

function drawPiechart (err, data) {
  if (err) throw err;

  // Select the container element for sizes fyi: getBBox() is GOLD!!
  var rect = document.querySelector('#center2').getBBox();
  rect.radius = Math.min(rect.width, rect.height) / 2; // add radius

  var colorScale = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var arc = d3.svg.arc()
    .outerRadius(rect.radius - 10)
    .innerRadius(0);

  var labelArc = d3.svg.arc()
    .outerRadius(rect.radius - 40)
    .innerRadius(rect.radius - 40);

  var pieLayout = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

  var svg = d3.select('svg')
    .append('g')
      .attr('class', 'piechart')
      .attr('transform', 'translate(' + (rect.x + rect.width/2) + ',' + (rect.y + rect.height/2) + ')');

  update();

  function update() {
    var pie = d3.select('.piechart').selectAll('.arc').data(pieLayout(data));

    pie.enter().append("g").attr("class", "arc");

    pie.append("path")
        .attr("d", arc) // line 81!
        .style("fill", function(d) { return colorScale(d.data.age); });

  pie.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.age; });
  }
}
