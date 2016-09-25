var fs = require('fs');
var path = require('path');
var rehype = require('rehype');
var document = require('rehype-document');
var h = require('hastscript');

var dirnames = [];
var root = 'src';

var tree = h('header', [
  h('h1', 'Front-end 3 data'),
  h('p', [
    'Links naar de oefeningen uit de werkgroep, voor verdere informatie kijk je op de ',
    h('a', {href: 'https://moodle.cmd.hva.nl/course/view.php?id=181'}, 'vakpagina op Moodle'),
    '.'
  ]),
  h('nav', h('ul', fs.readdirSync(root)
    .filter(function (basename) {
      var stats;

      try {
        stats = fs.statSync(path.join(root, basename));
      } catch (err) {
        return false;
      }

      return stats.isDirectory() && basename !== 'data';
    })
    .map(function (basename) {
      return h('li', [
        h('a', {href: basename}, basename),
        {type: 'text', value: '\n'}
      ]);
    }))
  )
])

var proc = rehype().use(document, {
  title: 'Frontend 3 oefeningen',
  language: 'nl',
  css: 'main.css'
});

var doc = proc.stringify(proc.run(tree))
var out = path.join(root, 'index.html');

fs.writeFileSync(out, doc);

console.log('✓ ' + out);
