"use strict";

var gulp             = require("gulp"),
    gulpif           = require('gulp-if'),
    less             = require('gulp-less'),
    concat           = require('gulp-concat'),
    gutil            = require("gulp-util"),
    webpack          = require("webpack"),
    path             = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    WebpackDevServer = require("webpack-dev-server");

var isProd = process.env.NODE_ENV === "production",
    stylesDirectory = './app/assets/styles',
    cssFiles        = stylesDirectory + '/**/*.less',
    distDirectory   = "./app/dist";

// Build CSS
gulp.task('build:css', function(){
    return gulp.src(cssFiles)
        .pipe(less())
        .pipe(gulpif(isProd, minifyCSS({keepBreaks:true})))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(distDirectory))
});

gulp.task('watch:css', function () {
    gulp.watch(cssFiles, ['build:css']);
});

gulp.task("webpack-dev-server", function(callback) {
    // Start a webpack-dev-server

    var config = {
        devtool:"source-map",
        entry: [
          'webpack-dev-server/client?http://localhost:3000',
          'webpack/hot/only-dev-server',
          './app/index'
        ],
        output: {
          path: path.join(__dirname, 'app/dist/bundlers'),
          filename: 'bundle.js',
          publicPath: '/bundles/'
        },
        plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.ProvidePlugin({
              $: "jquery",
              jQuery: "jquery",
              "window.jQuery": "jquery"
          })
        ],
        resolve: {
          alias: {
            'jquery': __dirname + '/app/dist/vendors/jquery.js',
            'semantic': __dirname + '/app/dist/vendors/semanticui/semantic.min.js',
        },
            extensions: ['', '.js', '.jsx'],
          },
        module: {
          loaders: [{
            test: /\.jsx$/,
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/,
            include: path.join(__dirname, 'app')
          },
          // bundle LESS and CSS into a single CSS file, auto-generating -vendor-prefixes
          {
            test: /\.less$/,
            loader: "style!css!autoprefixer!less"
          },
           { test: /\.css$/, loader: "file-loader??name=assets/styles/[name].[ext]" },
           { test: /\.(png|jpg|gif)$/, loader: 'file-loader?name=assets/images/[name].[ext]' },
           { test: /\.woff$/, loader: 'file-loader?name=assets/fonts/[name].[ext]' }
          ]
        },
        devServer: {
        historyApiFallback: true
      }
    };

    var compiler = webpack(config);

    return new WebpackDevServer(compiler, {
        stats: { 
          assets: true,
          colors: true,
          version: true,
          hash: true,
          timings: true,
          chunks: true,
          chunkModules: true 
        },
        contentBase: "./app/dist/",
        publicPath: '/bundles/',
        hot: true,
        quiet: false,
        noInfo: false,
        historyApiFallback: true
    }).listen(3000, "localhost", function(err) {
        if(err) return console.log(err);
        // Server listening
        console.log('Listening at http://localhost:3000/');
    });
});

gulp.task("default", ["webpack-dev-server"])