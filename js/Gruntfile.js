module.exports = function(grunt) {

    'use strict';


    var releaseVersion = '1.0.1';

    // Configuration de Grunt
    grunt.initConfig({
        /*----------------------------------( PACKAGE )----------------------------------*/
        /**
         * The `package.json` file belongs in the root directory of your project,
         * next to the `Gruntfile`, and should be committed with your project
         * source. Running `npm install` in the same folder as a `package.json`
         * file will install the correct version of each dependency listed therein.
         *
         * Install project dependencies with `npm install` (or `npm update`).
         *
         * @see http://gruntjs.com/getting-started#package.json
         * @see https://npmjs.org/doc/json.html
         * @see http://package.json.nodejitsu.com/
         * @see http://stackoverflow.com/a/10065754/922323
         */

        pkg : grunt.file.readJSON('package.json'),

        cssmin: {
            combine: {
                files: {
                    'build/css/app.min.css': ['css/app.css', 'css/jquery-jvectormap-1.2.2.css', 'css/cloudChart.css', 'css/horizontalBarChart.css']
                    /*, 
                    'build/css/jquery-jvectormap-1.2.2.min.css': ['css/jquery-jvectormap-1.2.2.css'],
                    'build/css/cloudChart.min.css': ['css/cloudChart.css'],
                    'build/css/horinzontalBarChart.min.css': ['css/horizontalBarChart.css']*/
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    'build/js/app.min.js': ['js/**/*.js']
                }
            }
        },
        /*----------------------------------( JSHINT )----------------------------------*/

        /**
         * Validate files with JSHint.
         *
         * @see https://github.com/gruntjs/grunt-contrib-jshint
         * @see http://www.jshint.com/docs/
         */

        jshint : {

            options : {

                jshintrc : '.jshintrc' // Defined options and globals.

            },

            init : [

                'js/controllers/projectvisualizationCtrl.js'
            ]

        },
        /*----------------------------------( ENV )----------------------------------*/

        /**
         * Grunt task to automate environment configuration for future tasks.
         *
         * @see https://github.com/onehealth/grunt-env
         */
        env : {

            dev : {

                NODE_ENV : 'DEVELOPMENT'

            },

            prod : {

                NODE_ENV : 'PRODUCTION'

            }

        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        /*----------------------------------( PREPROCESS )----------------------------------*/

        /**
         * Grunt task around preprocess npm module.
         *
         * @see https://github.com/onehealth/grunt-preprocess
         * @see https://github.com/onehealth/preprocess
         * @see http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
         */

        preprocess : {

            dev : {

                src : './templates/index.html',
                dest : 'build/index.html'

            },

            prod : {

                src : './templates/index.html',
                dest : 'build/index.html'

            }

        },
        /*----------------------------------( CLEAN )----------------------------------*/

        /**
         * Clean files and folders.
         *
         * @see https://github.com/gruntjs/grunt-contrib-clean
         */

        clean : {

            options : {

                force : true // Allows for deletion of folders outside current working dir (CWD). Use with caution.

            },

            dev : [

                'build/**/*'

            ],

            prod : [

                'build/**/*'

            ]

        },
        // copy non changed files (images, vendor scripts, html...)
        copy: {
            dev : {


                files: [
                    //include js files
                    {expand: true, src: ['js/**'], dest: 'build/'},
                    // includes images
                    {expand: true, src: ['images/**'], dest: 'build/'},
                    // includes vendor scripts
                    {expand: true, src: ['vendor/**'], dest: 'build/'},
                    //including vendor css
                    {expand: true, src: ['css/*.min.css'], dest: 'build/'},
                    {expand: true, src: ['css/**'], dest: 'build/'},
                    // including fonts files
                    {expand: true, src: ['fonts/*'], dest: 'build/'},
                    // including html files
                    {expand: true, src: ['pages/**'], dest: 'build/'},
                    // including config files
                    {expand: true, src: ['config.js'], dest: 'build/'}
                ]


            },

            prod : {


                files: [
                    //include js files
                    {expand: true, src: ['js/**'], dest: 'build/'},
                    // includes images
                    {expand: true, src: ['images/**'], dest: 'build/'},
                    // includes vendor scripts
                    {expand: true, src: ['vendor/**'], dest: 'build/'},
                    //including vendor css
                    {expand: true, src: ['css/*.min.css'], dest: 'build/'},
                    // including fonts files
                    {expand: true, src: ['fonts/*'], dest: 'build/'},
                    // including html files
                    {expand: true, src: ['pages/**'], dest: 'build/'},
                    // including config files
                    {expand: true, src: ['config.js'], dest: 'build/'}
                ]


            }

        },
        watch: {
            files: ['js/**/*.js', 'js/*.js', 'pages/*'],
            tasks: ['dev']
        },
        // make a zipfile
        compress: {
            main: {
                options: {
                    archive: 'gqd-gui.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**']
            }
        },
        nexusDeployer: {
            snapshot: {
                options: {
                    groupId: 'com.orange.gqd',
                    artifactId: 'gqd-gui',
                    version: releaseVersion+'-SNAPSHOT',
                    packaging: 'zip',
                    classifier: 'dev',

                    auth: {
                        username:'gqd_team',
                        password:'W4nn4P14y'
                    },
                    url: 'http://maven2.rd.francetelecom.fr/proxy/content/repositories/inhouse.snapshot/',
                    artifact: 'gqd-gui.zip'
                }
            },
            'release': {
                options: {
                    groupId: 'com.orange.gqd',
                    artifactId: 'gqd-gui',
                    version: grunt.option('versionRelease'),
                    packaging: 'zip',
                    auth: {
                        username:'gqd_team',
                        password:'W4nn4P14y'
                    },
                    url: 'http://maven2.rd.francetelecom.fr/proxy/content/repositories/inhouse/',
                    artifact: 'gqd-gui.zip'
                }
            }
        }
    });

    /*----------------------------------( TASKS )----------------------------------*/
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-nexus-deployer');    

    grunt.registerTask('default', ['dev']);

    grunt.registerTask('dist', ['scripts:dist']);
    grunt.registerTask('build', ['unit', 'scripts:dev', 'scripts:dist']);


    grunt.registerTask('unit', ['karma:unit']);
    grunt.registerTask('css:dev', ['cssmin:combine']);
    grunt.registerTask('compression', ['compress:main']);


    grunt.registerTask('release', ['karma:unit', 'copy:prod', 'preprocess:prod', 'cssmin:combine', 'compression']);

    grunt.registerTask('verifyParam', 'Verification des params lies a environnement', function(){
        if(!grunt.option('versionRelease')){
            grunt.fail.warn('Le parametre --versionRelease est obligatoire');
        } 
    }) ;

    grunt.registerTask('deployOnNexus', ['verifyParam','prod', 'nexusDeployer:release']);

    grunt.registerTask('init', ['jshint']);

    grunt.registerTask('dev', ['env:dev', 'clean:dev', 'karma:unit', 'preprocess:dev', 'copy:dev']);

    grunt.registerTask('cibuild', ['dev']);

    grunt.registerTask('prod', ['env:prod', 'clean:prod', 'release']);
}


