module.exports = function(grunt) {

	// Configuration
	grunt.initConfig({
		// pkg must come first
		// remaining config in alphabetical order
		pkg: grunt.file.readJSON('package.json'),


		// jshint config
		jshint : {
			options: grunt.file.readJSON('.jshintrc'),
			files: [
				'source/assets/j/*.js',
				'!source/assets/j/fontfaceobserver.js'
			]
		},


		// css comb
		csscomb : {
			options: {
				config: 'csscomb.json'
			},
			dynamic_mappings: {
				expand: true,
				cwd: 'source/assets/c',
				src: ['*.min.css'],
				dest: 'source/assets/c',
				ext: '.min.css'
			}
		},


		// grunt cssmin config
		cssmin: {
			styles : {
				options : {
					advanced : true,
					aggressiveMerging : true,
					compatibility : '*',
					debug : false,
					keepBreaks : true,
					keepSpecialComments : '*',
					mediaMerging : true,
					processImport : true,
					processImportFrom : ['all'],
					roundingPrecision : -1
				},
				files: [{
					expand: true,
					cwd: 'source/assets/c',
					src: ['style.css'],
					dest: 'source/assets/c',
					ext: '.min.css'
				}]
			},
			lte8styles : {
				options : {
					advanced : true,
					aggressiveMerging : true,
					compatibility : 'ie7',
					debug : false,
					keepBreaks : true,
					keepSpecialComments : '*',
					mediaMerging : true,
					processImport : true,
					processImportFrom : ['all'],
					roundingPrecision : -1
				},
				files: [{
					expand: true,
					cwd: 'source/assets/c',
					src: ['style-lte8.css'],
					dest: 'source/assets/c',
					ext: '.min.css'
				}]
			}
		},


		// grunt sass config
		sass: {
			options : {
				indentType : 'tab',
				indentWidth : 1,
				outputStyle : 'expanded',
				sourceMap   : true
			},
			dist: {
				files: {
					'source/assets/c/style.css' : 'source/assets/c/style.scss',
					'source/assets/c/style-lte8.css' : 'source/assets/c/style-lte8.scss'
				}
			}
		},


		// grunt shell config
		shell: {
			patternlabPatternsOnly: {
				command: "php core/builder.php -gp"
			},
			patternlab: {
				command: "php core/builder.php -g"
			},
		},


		// grunt watch config
		watch: {
			html: {
				files: ['source/_patterns/**/*.mustache', 'source/**/*.json'],
				tasks: ['shell:patternlabPatternsOnly'],
				options: {
					spawn: false
				}
			},
			assets : {
				files: ['source/**/*'],
				tasks: ['css', 'shell:patternlab'],
				options: {
					spawn: false
				}
			}
		}
	});

	// Plugins
	grunt.loadNpmTasks('grunt-csscomb');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-sass');

	// Tasks
	grunt.registerTask( 'css', [
		'sass',
		'cssmin',
		'csscomb'
	] );


	grunt.registerTask('build', ['css', 'shell:patternlab']);
	grunt.registerTask('default', ['build','watch']);
	grunt.registerTask('precommit', ['jshint', 'build']);
};