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

gulp.task('vet', function() {
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

gulp.task('styles', ['clean-styles'], function() {
    log('Autoprefixing CSS');

    return gulp
        .src(config.css)
        .pipe($.plumber())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('fonts', ['clean-fonts'], function() {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function() {
    log('Copying and compressing the images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({
            optimizationLevel: 4
        }))
        .pipe(gulp.dest(config.build + 'img'));
});

gulp.task('clean', function() {
    var delconfig = [].concat(config.build, config.buildServer, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig);
});

gulp.task('clean-fonts', function() {
    clean(config.build + 'fonts/**/*.*');
});

gulp.task('clean-images', function() {
    clean(config.build + 'images/**/*.*');
});

gulp.task('clean-styles', function() {
    clean(config.temp + '**/*.css');
});

gulp.task('clean-code', function() {
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

gulp.task('wiredep', function() {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles'], function() {
    log('Wire up the app css into the html, and call wiredep ');

    var injectVendorJS = gulp.src(['./node_modules/socket.io/node_modules/socket.io-client/socket.io.js', config.themejs], {
        read: false
    });
    var vendorOptionsJS = {
        starttag: '<!-- inject:vendorjs -->',
        addRootSlash: false
    };
    var injectVendorCSS = gulp.src(config.themecss, {
        read: false
    });
    var vendorOptionsCSS = {
        starttag: '<!-- inject:vendorcss -->',
        addRootSlash: false
    };

    return gulp
        .src(config.index)
        .pipe($.inject(injectVendorJS, vendorOptionsJS))
        .pipe($.inject(injectVendorCSS, vendorOptionsCSS))
        .pipe($.inject(gulp.src(config.js)))
        .pipe($.inject(gulp.src(config.tmpcss)))
        .pipe(gulp.dest(config.client));
});

gulp.task('optimize', ['inject', 'fonts', 'images'], function() {
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
gulp.task('bump', function() {
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

gulp.task('serve-build', ['optimize'], function() {
    serve(false /* isDev */ );
});

gulp.task('serve-dev', ['inject'], function() {
    serve(true /* isDev */ );
});

gulp.task('prepare-server-files', function() {
    gulp.src(['package.json*', 'bower.json', '.bowerrc', 'gulpfile.js', 'gulp.config.js'])
        .pipe(gulp.dest(config.buildServer));
    gulp.src(['./src/server/**'], {
            base: './src/'
        })
        .pipe(gulp.dest(config.buildServer));
});
//////////////////////////////
gulp.task('deploy', function() {
    return gulp.src(['app.js', 'package.json*', 'index.html'])
        .pipe($.scp2({
            host: '192.168.1.99',
            username: 'pi',
            password: 'raspberry',
            dest: '/home/pi/homecenter'
        }))
        .on('error', function(err) {
            console.log(err);
        });
});

gulp.task('deployfull', ['optimize', 'prepare-server-files'], function() {
    return gulp.src(['./build/**'])
        .pipe($.scp2({
            host: '192.168.1.99',
            username: 'pi',
            password: 'raspberry',
            dest: '/home/pi/homecenter/'
        }))
        .on('error', function(err) {
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
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };

    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({
                    stream: false
                });
            }, config.browserReloadDelay);
        })
        .on('start', function() {
            log('*** nodemon started');
            startBrowserSync(isDev);
        })
        .on('crash', function() {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function() {
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
            .on('change', function(event) {
                changeEvent(event);
            });
    } else {
        gulp.watch([config.css, config.js, config.html], ['optimize', browserSync.reload])
            .on('change', function(event) {
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
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}