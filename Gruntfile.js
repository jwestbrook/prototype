function stripcomments(src,filepath)
{
	var lines = src.split('\n');
	var newlines = [];

	var opencomment = false;
	for( var t = 0 ; t < lines.length ; t++)
	{
		if(lines[t].match(/^\s*\/\*\*/))
		{
			opencomment = true;
		}
		else if(opencomment && lines[t].match(/\*\//))
		{
			lines[t] = "";
			opencomment = false;
		}

		if(opencomment)
		{
			lines[t] = "";
		}

		if(lines[t].match(/^\/\//))
		{
			lines[t] = "";
		}

		if(lines[t].length > 0)
		{
			newlines.push(lines[t]);
		}
	}
	return newlines.join("\n");
}

module.exports = function(grunt) {

	var fs = require('fs');

	function replacevars()
	{
		grunt.task.requires('resolve')

		var options = grunt.config.get('replacevars');

		var contents = fs.readFileSync(options.file,{encoding:'utf8'});

		fs.writeFileSync(options.file,contents.replace(/<%= PROTOTYPE_VERSION %>/g,options.PROTOTYPE_VERSION))

	}

	function closure_compile()
	{
		var done = this.async();
		var options = grunt.config.get('gcc_rest');
		ClosureCompiler.compile(
			[options.source],
			{
				compilation_level: "SIMPLE_OPTIMIZATIONS",
			},
			function(error, result) {
				if (result) {
					fs.writeFile(options.dest,result)
				} else {
					// Display error...
				}
				done();
			}
		);

	}

	function generate_docs()
	{
		var parseObject = require('./test/docparser.js');

		var results = parseObject.parse();

		console.log(results);

	}

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		PROTOTYPE_VERSION : grunt.file.readYAML('src/constants.yml'),
		resolve : {
			files : ['src/prototype.js'],
			dist : 'dist'
		},
		replacevars : {
			file : 'dist/prototype.js',
			PROTOTYPE_VERSION : '<%= PROTOTYPE_VERSION.PROTOTYPE_VERSION %>'
		},
		gcc_rest : {
			source : 'dist/prototype.js',
			dest : 'dist/prototype.min.js'
		},
		concat : {
			options : {
				process : stripcomments,
				banner : "/**\n * @preserve\n * Prototype JavaScript framework, version <%= PROTOTYPE_VERSION.PROTOTYPE_VERSION %>\n *  (c) 2005-2010 Sam Stephenson\n *\n *  Prototype is freely distributable under the terms of an MIT-style license.\n *  For details, see the Prototype web site: http://www.prototypejs.org/\n *\n *--------------------------------------------------------------------------*/\n"
			},
			dist : {
				src : ['dist/prototype.js'],
				dest : 'dist/prototype.js'
			}
		},
		mocha_phantomjs : {
			all : {
				options : {
						'urls'	: [ 'http://localhost:1337/test/ajaxtests.html',
									'http://localhost:1337/test/formtests.html' ]
				},
				src :	['test/index.html',
						 'test/domtests.html',
						 'test/selectortests.html',
						 'test/layouttests.html']
			}
		}
	});

	grunt.loadNpmTasks('grunt-resolve');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-mocha-phantomjs');


	grunt.registerTask('replacevars','Replace Variables in PrototypeJS file',replacevars);
	grunt.registerTask('runwebserver',"Run Test Webserver",function(){
		var done = this.async();
		require('./test/webserver.js').listen(1337, '127.0.0.1',function(){
			grunt.log.writeln('Web server Started on port 1337.');
			done();
		});
	})

	grunt.registerTask('test', ['runwebserver','mocha_phantomjs']);
	grunt.registerTask('dist', ['resolve','replacevars','concat']);

	grunt.registerTask('default',['test','dist'])

};