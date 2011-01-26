var hobbes = require('./hobbes');
var src = "package wildbore; class Wurst { float foo = 5, bar = 6, baz; int fop = 7; int main ( int bar ) { 5; } }";

console.log(hobbes.compiler.parser.parse(src).toString());
console.log(hobbes.compiler.parser.parse(src).compile());
hobbes.compiler.run(src);
