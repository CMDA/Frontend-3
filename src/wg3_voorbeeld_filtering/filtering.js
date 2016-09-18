// Maak een SVG, stel de marges in, bereken de dimensies van de grafiek en maak wat hulpvariabelen
var svg = d3.select('main').append('svg').attr('width', 800).attr('height', 600),
	margin = {top:20, right:20, bottom:70, left:40},
	g = svg.append('g').attr('transform', 'translate('+margin.left+', '+margin.top+')'),
	width = +svg.attr('width') - margin.left - margin.right,
	height = +svg.attr('height') - margin.top - margin.bottom;

d3.json('https://spreadsheets.google.com/feeds/list/1kSvyHeiYbjXbDZIvX-rmXzQi-SQY4z4MSA-R4QVpI0Y/od6/public/values?alt=json', function(data){
	
	// Eerst schoonmaken
	data = cleanGoogleSheetsJSON(data);
	data = convertValueToNumber(data, 'waarde');

	// Dan nesten op de waarden die we willen plotten
	var nest = d3.nest()
		.key(function(d){return d.perioden;})
		.key(function(d){return d.onderwijssoort;})
		.entries(data);

	// even checken hoe het er precies uit ziet
	nest.map(function(d){ console.log(d.values[0].values[1].waarde); })

	// maak een xSchaal op basis van de buitenste nest functie (perioden)
	var xScale = d3.scale.ordinal()
			.domain(nest.map(function(d) {return d.key;}))
			.rangeBands([0, width]);

	// maak een ySchaal op basis van het maximum aantal diploma's
	var yScale = d3.scale.linear()
			.domain([0, d3.max(nest.map(function(d){return d.values[0].values[1].waarde;}))])
			.range([height, 0]);

	// maak een xAs op basis van de xSchaal
	var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('bottom');

	// maak een yAs op basis van de ySchaal
	var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left')
			.ticks(11);

	// teken de bars
	g.selectAll('.bar')
		.data(nest)
		.enter().append('rect')
			.attr('class', 'bar')
			.attr('x', function(d) {return xScale(d.key)+5;})
			.attr('y', function(d) {return yScale(d.values[0].values[1].waarde); })
			.attr('width', xScale.rangeBand()-10)
			.attr('height', function(d) {return height-yScale(d.values[0].values[1].waarde);});
	
	// teken de xAs
	g.append('g')
		.attr('class', 'axis xAxis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis)
	  .selectAll('text')
		.attr('y', 0)
    	.attr('x', 9)
    	.attr('dy', '.35em')
		.attr('transform', 'rotate(90)')
		.style('text-anchor', 'start');

	// teken de yAs
	g.append('g')
		.attr('class', 'axis yAxis')
		.attr('transform', 'translate(0,100)');
});


function convertValueToNumber(data, keyToConvert) {
	return data.map(function(entry){
		entry[keyToConvert] = entry[keyToConvert]=="-"?0:Number(entry[keyToConvert]);
		return entry;
	});
}

/**
 * [cleanGoogleSheetsJSON is a function that cleans JSON data imported from google sheets using the publish to web as json method described by https://ctrlq.org/code/20004-google-spreadsheets-json]
 * @param  {[type]} data [the JSON data to be cleaned]
 * @return {[type]}      [the cleaned JSON data]
 */
function cleanGoogleSheetsJSON(data) {
	return data.feed.entry.map(function(entry){
		// Remove these keys
		['category', 'content', 'id', 'link', 'title', 'updated'].forEach(function(key){
			delete entry[key];
		});
		// Rename the remaining keys and hook the value directly instead of in a new object
		Object.keys(entry).map(function(key){
			entry[key.substring(4,key.length)] = entry[key].$t;
			delete entry[key];
		});
		return entry;
	});
}