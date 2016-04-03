module.exports = function() {
    var client = './src/client/';
    var theme = client + 'lib/adminlte/';
    //var clientApp = client + 'app/';
    var temp = './.tmp/';
    var server = './src/server/';
    var root = './';

    var config = {

        /**
         * Files paths
         */
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        app: [client + 'app/**/*.js', client + 'app/**/*.html'],
        build: './build/client/',
        buildServer: './build/',
        client: client,
        css: client + 'css/app.css',
        fonts: ['./bower_components/font-awesome/fonts/**/*.*','./bower_components/weather-icons/fonts/**/*.*'],
        html: client + '**/*.html',
        images: client + 'img/**/*.*',
        index: client + 'index.html',
        js: client + 'app2.js',
        root: root,
        server: server,
        temp: temp,
        tmpcss: temp + 'app.css',
        themecss: [
            theme + 'css/AdminLTE.css',
            theme + 'css/skins/skin-yellow-light.css'
        ],
        themejs: theme + 'js/app.js',
        
        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        packages: [
            './package.json',
            './bower.json'
        ],
        /**
         * Node settings
         */
        defaultPort: 5000,
        nodeServer: './src/server/app.js'
    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            //bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};