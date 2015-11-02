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


		// grunt sass config
		sass: {
			options : {
				sourceMap: true
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
				tasks: ['sass', 'shell:patternlab'],
				options: {
					spawn: false
				}
			}
		}
	});

	// Plugins
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-sass');

	// Tasks
	grunt.registerTask('build', ['sass', 'shell:patternlab']);
	grunt.registerTask('default', ['build','watch']);
	grunt.registerTask('precommit', ['jshint', 'build']);
};