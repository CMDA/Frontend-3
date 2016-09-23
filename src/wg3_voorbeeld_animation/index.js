var $node = d3.select('#a');

$node.style({
	width: '300px',
	height: '300px',
	'text-align': 'center',
	'line-height': '300px',
	background: 'rgb(255, 95, 86)'
})

$node.style('transform', 'translate(0px, 0)');

$node.text('Hallo');

//=========================================================

$node
	.transition()
	.ease('bounce')
	.delay(1000)
	.duration(1000)
	.style('transform', 'translate(400px, 0)')
	.transition()
	.ease('back')
	.style('color', 'white')
	.style('background', 'hotpink')
