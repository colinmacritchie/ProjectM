module.exports = function (grunt) {
    // Project configuration.
    var bowerPath = 'public/workbox/assets/lib/';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['server.js', 'db-assets/*.js', 'db-assets/**/*.js', 'public/app/*.js']
        },
        watch: {
            js: {
                files: ['<%= jshint.all %>', 'Gruntfile.js'],
                tasks: ['jshint'],
                options: { livereload: true }
            }
        },
        concat: {
            options: {
                sourceMap: true,
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                src: [bowerPath+'angular/angular.min.js', bowerPath + 'angular/angular.min.js'],
                dest: 'dist/built.js',
            },
        },
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    // Default task(s)
    grunt.registerTask('default', ['watch']);
};