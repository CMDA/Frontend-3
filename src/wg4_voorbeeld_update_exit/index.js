/* Created by @wooorm */
var margin = {top: 20, right: 30, bottom: 130, left: 39};
var height = 500 - margin.top - margin.bottom;

d3.tsv('index.tsv', clean, draw);

function clean(d) {
  return {
    no: Number(d.no),
    mark: Number(d.mark) || 0,
    group: d.group
  };
}

function draw(err, data) {
  if (err) throw err;

  var $input = document.getElementsByTagName('input')[0];
  var $output = document.getElementsByTagName('output')[0];
  var width = data.length * 40;
  var y = d3.scale.linear().range([height, 0]);
  var x = d3.scale.ordinal().rangeRoundBands([0, width], 0);

  var chart = d3.select('svg')
    .attr('class', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(data.map(function (d) { return d.no; }));
  y.domain([0, 10]);

  chart.append('g')
    .attr('class', 'y axis')
    .call(d3.svg.axis().scale(y).orient('left'));

  update();

  $input.addEventListener('input', function () {
    $output.value = $input.value;
    update();
  });

  function update() {
    var min = Number($input.value);
    var subset = data.filter(function (d) {
      return d.mark >= min;
    });

    var bars = chart.selectAll('rect').data(subset);

    bars.enter().append('rect');
    bars.exit().remove()

    bars
      .attr('width', x.rangeBand() - 1)
      .attr('x', function (d, i) { return i * x.rangeBand() })
      .attr('y', function (d) { return y(d.mark); })
      .attr('height', function (d) { return height - y(d.mark); })
  }
}
