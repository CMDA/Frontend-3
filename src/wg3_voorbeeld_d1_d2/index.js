/* Created by @wooorm */
var margin = {top: 20, right: 30, bottom: 130, left: 39};
var height = 500 - margin.top - margin.bottom;

['data-1', 'data-2'].forEach(function (group) {
  d3.tsv(group + '.tsv', clean, draw);
});

function clean(d) {
  return {
    no: Number(d.stdnummer),
    mark: parseFloat(d.cijf, 10) || 0,
    group: d.groep
  };
}

function draw(err, data) {
  if (err) throw err;

  var width = data.length * 40;
  var y = d3.scale.linear().range([height, 0]);
  var x = d3.scale.ordinal().rangeRoundBands([0, width], 0);

  var chart = d3.select('body')
    .append('svg')
    .attr('class', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  x.domain(data.map(function (d) { return d.no; }));
  y.domain([0, 10]);

  chart.selectAll('g')
    .data(data)
    .enter().append('g')
    .attr('transform', function (d, i) {
      return 'translate(' + i * x.rangeBand() + ', 0)';
    })
    .append('rect')
    .attr('y', function (d) { return y(d.mark); })
    .attr('height', function (d) { return height - y(d.mark); })
    .attr('width', x.rangeBand() - 1);

  chart.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + height / 10 * 4.5 + ')')
    .call(d3.svg.axis().scale(x).orient('bottom'))
    .selectAll('text')
    .attr('transform', 'translate(0, ' + height + ')')
    .attr('dx', height - margin.bottom)
    .attr('dy', 0)
    .attr('transform', 'rotate(90)');

  chart.append('g')
    .attr('class', 'y axis')
    .call(d3.svg.axis().scale(y).orient('left'))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 12)
    .style('text-anchor', 'end')
    .text('DT1');
}
