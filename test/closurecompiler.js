var fs = require("fs");
var http = require('http');
var querystring = require('querystring');

//module.exports = function(contents,compilation_level){
var t = function(contents,compilation_level){

	if(['WHITESPACE_ONLY','SIMPLE_OPTIMIZATIONS','ADVANCED_OPTIMIZATIONS'].indexOf(compilation_level) === -1)
	{
		compilation_level = 'WHITESPACE_ONLY';
	}



	var requestoptions = {
					'hostname' : 'closure-compiler.appspot.com',
					'port' : 80,
					'path' : '/compile',
					'method' : 'POST',
					'headers' : {
						'Content-Type': 'application/x-www-form-urlencoded'
					}					
				};
	var postparam = {
						'js_code' : contents,
						'compilation_level' : compilation_level,
						'output_format' : 'json',
						'output_info' : 'compiled_code'
					};
	var postdata = querystring.stringify();
	var req = http.request(requestoptions,function(res){
		res.setEncoding('utf8');
	});

	req.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	});

	req.end(postdata);

}


var filecontents = fs.readFileSync('dist/prototype.js',{'encoding':'utf8'});

t(filecontents,'WHITESPACE_ONLY');