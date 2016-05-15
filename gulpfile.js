var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');

var $ = require('gulp-load-plugins')({
    lazy: true
});
var port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jscs.reporter())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        })
            .pipe($.jshint.reporter('fail')));
});

gulp.task('styles', ['clean-styles'], function () {
    log('Autoprefixing CSS');

    return gulp
        .src(config.css)
        .pipe($.plumber())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function () {
    log('Copying and compressing the images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({
            optimizationLevel: 4
        }))
        .pipe(gulp.dest(config.build + 'img'));
});

gulp.task('angular-app', ['clean-angular-app'], function () {
    log('Copying Angular2 app');

    return gulp
        .src(config.app)
        .pipe(gulp.dest(config.build + 'app'));
});

gulp.task('clean', function () {
    var delconfig = [].concat(config.build, config.buildServer, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig);
});

gulp.task('clean-fonts', function () {
    clean(config.build + 'fonts/**/*.*');
});

gulp.task('clean-images', function () {
    clean(config.build + 'images/**/*.*');
});

gulp.task('clean-angular-app', function () {
    clean(config.build + 'app/**/*.*');
});

gulp.task('clean-styles', function () {
    clean(config.build + 'css/**/*.*');
    clean(config.temp + '**/*.css');
});

gulp.task('clean-code', function () {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files);
});

// gulp.task('less-watcher', function() {
//     gulp.watch([config.less], ['styles']);
// });

gulp.task('angular-js-dev', function () {
    log('Copying Angular2 JS files to lib dev folder');

    return gulp
        .src(['./node_modules/@angular/common/common.umd.js',
            './node_modules/@angular/core/core.umd.js',
            './node_modules/@angular/compiler/compiler.umd.js',
            './node_modules/@angular/http/http.umd.js',
            './node_modules/@angular/platform-browser/platform-browser.umd.js',
            './node_modules/@angular/platform-browser-dynamic/platform-browser-dynamic.umd.js',
            './node_modules/@angular/router/router.umd.js',
            './node_modules/es6-shim/es6-shim.min.js',
            './node_modules/reflect-metadata/Reflect.js',
            './node_modules/systemjs/dist/system.src.js',
            './node_modules/zone.js/dist/zone.js',
            './node_modules/rxjs/bundles/Rx.min.js'
        ])
        .pipe(gulp.dest('./src/client/lib/angular2'));
});

gulp.task('angular-js-prod', function () {
    log('Copying Angular2 JS files to lib prod folder');

    return gulp
        .src([config.client + 'lib/angular2/**/*.js'])
        .pipe(gulp.dest(config.build + 'lib/angular2'));
});

gulp.task('wiredep', function () {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(gulp.dest(config.client));
});

gulp.task('tsc', $.shell.task(['npm run tsc'], { verbose: true }));

gulp.task('inject', ['tsc', 'wiredep', 'styles', 'angular-js-dev'], function () {
    log('Wire up the app css into the html, and call wiredep ');

    var injectVendorJS = gulp.src([
        './node_modules/socket.io-client/socket.io.js',
        config.themejs,
        './src/client/lib/kendo.console/js/kendo.console.js'
    ], {
            read: false
        });
    var vendorOptionsJS = {
        starttag: '<!-- inject:vendorjs -->',
        addRootSlash: false
    };

    var injectAngularJS = gulp.src([
        './lib/angular2/es6-shim.min.js',
        './lib/angular2/Reflect.js',
        './lib/angular2/system.src.js',
        './lib/angular2/zone.js',
        './lib/angular2/Rx.min.js',
        // './lib/angular2/core.umd.js',
        // './lib/angular2/compiler.umd.js',
        // './lib/angular2/common.umd.js',
        // './lib/angular2/http.umd.js',
        // './lib/angular2/platform-browser.umd.js',
        // './lib/angular2/platform-browser-dynamic.umd.js',
        // './lib/angular2/router.umd.js'
    ], {
            read: false,
            cwd: './src/client',
        });
    var angularOptionsJS = {
        starttag: '<!-- inject:angularjs -->',
        addRootSlash: false,
        ignorePath: 'src/client/',
        relative: true
    };

    var injectVendorCSS = gulp.src([].concat(config.themecss,
        './src/client/lib/kendo.console/css/kendo.console.css',
        '/bower_components/PACE/themes/black/pace-theme-minimal.css'), {
            read: false
        });
    var vendorOptionsCSS = {
        starttag: '<!-- inject:vendorcss -->',
        addRootSlash: false
    };

    return gulp
        .src(config.index)
        .pipe($.inject(injectVendorJS, vendorOptionsJS))
        .pipe($.inject(injectAngularJS, angularOptionsJS))
        .pipe($.inject(injectVendorCSS, vendorOptionsCSS))
        .pipe($.inject(gulp.src(config.js)))
        .pipe($.inject(gulp.src(config.tmpcss)))
        .pipe(gulp.dest(config.client));
});

gulp.task('optimize', ['inject', 'fonts', 'images', 'angular-app', 'angular-js-prod'], function () {
    log('Optimizing the javascript, css, html');

    var cssFilter = $.filter('**/*.css', {
        restore: true
    });
    var jsLibFilter = $.filter('**/' + config.optimized.lib, {
        restore: true
    });
    var jsAppFilter = $.filter('**/' + config.optimized.app, {
        restore: true
    });

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.useref({
            searchPath: './'
        }))
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe(jsLibFilter)
        .pipe($.uglify())
        .pipe(jsLibFilter.restore)
        .pipe(jsAppFilter)
        .pipe($.uglify())
        .pipe(jsAppFilter.restore)
        .pipe($.if('*.js', $.rev())) //ne renomme que les fichiers js
        .pipe($.if('*.css', $.rev())) //ne renomme que les fichiers css
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build));
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function () {
    var msg = 'Bumping versions';
    var type = args.type;
    var version = args.version;
    var options = {};
    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe($.print())
        .pipe($.bump(options))
        .pipe(gulp.dest(config.root));
});

gulp.task('replace-socketio-url-prod', function () {
    gulp.src(config.client + 'js/app.js')
        .pipe($.injectString.replace('var url = "http://localhost:3000";', 'var url;'))
        .pipe(gulp.dest(config.client + 'js/'));
});

gulp.task('serve-prod', ['replace-socketio-url-prod', 'optimize'], function () {
    serve(false);
});

gulp.task('replace-socketio-url-dev', function () {
    gulp.src(config.client + 'js/app.js')
        .pipe($.injectString.replace('var url;', 'var url = "http://localhost:5000";'))
        .pipe(gulp.dest(config.client + 'js/'));
});

gulp.task('serve-dev', ['replace-socketio-url-dev', 'inject'], function () {
    serve(true);
});

gulp.task('prepare-server-files', function () {
    gulp.src(['package.json*', /*'bower.json', '.bowerrc', */ 'gulpfile.js', 'gulp.config.js'])
        .pipe(gulp.dest(config.buildServer));
    gulp.src(['./src/server/**'], {
        base: './src/'
    })
        .pipe(gulp.dest(config.buildServer));
});
//////////////////////////////
gulp.task('deploy', function () {
    return gulp.src(['app.js', 'package.json*', 'index.html'])
        .pipe($.scp2({
            host: '192.168.1.99',
            username: 'pi',
            password: 'raspberry',
            dest: '/home/pi/homecenter/'
        }))
        .on('error', function (err) {
            console.log(err);
        });
});

gulp.task('deployfull', ['replace-socketio-url-prod', 'optimize', 'prepare-server-files'], function () {
    return gulp.src(['./build/**'])
        .pipe($.scp2({
            host: '192.168.1.99',
            username: 'pi',
            password: 'raspberry',
            dest: '/home/pi/homecenter/'
        }))
        .on('error', function (err) {
            console.log(err);
        });
});

////////////////////////
function serve(isDev) {
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'prod'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', function (ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function () {
                browserSync.notify('reloading now ...');
                browserSync.reload({
                    stream: false
                });
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync(isDev);
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync(isDev) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);

    // TODO change less
    if (isDev) {
        gulp.watch([config.css], ['styles'])
            .on('change', function (event) {
                changeEvent(event);
            });
        gulp.watch([config.client + '**/*.ts'], ['tsc'])
            .on('change', function (event) {
                changeEvent(event);
            });
    } else {
        gulp.watch([config.css, config.js, config.html], ['optimize', browserSync.reload])
            .on('change', function (event) {
                changeEvent(event);
            });
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 3000,
        files: isDev ? [
            config.client + '**/*.*',
            config.temp + '**/*.css'
        ] : [],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'BrowserSync',
        notify: true,
        reloadDelay: 0 //1000
    };

    browserSync(options);
}

function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    return del(path);
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}