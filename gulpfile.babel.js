import gulp from 'gulp'
// import sass from 'gulp-sass'
const sass = require('gulp-sass')(require('sass'));
import autoprefixer from 'gulp-autoprefixer'
import sourcemaps from 'gulp-sourcemaps'
import gulpif from 'gulp-if'
import yargs from 'yargs'
const argv = yargs.argv
import browserSync from 'browser-sync'
import webpack from 'webpack-stream'
import del from 'del'

const paths = {

  root: './build',

  html: { 
    src:'./src/**/*.html',
    dest:'./build'
  },

  styles: { 
    main: './src/index.scss',
    dest: './build'
  },

  scripts: { 
    main: './src/index.js',
    dest: './build'
  },

  images: {
    src: './src/images/**',
    dest: './build/images'
  },

  fonts: { 
    src: './src/fonts/**',
    dest: './build/fonts'
  },

  delete: { 
    dest: './build/*'
  }

}

let isDev = false; 
let lan = false; 
if (argv.dev) isDev = true; 
if (argv.lan) lan = true; 

let webConfig = {
    output: {
      filename: 'index.js'
    },
    module: {
      rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
    },
    mode: isDev ? 'development' : 'production', 
    // devtool: isDev ? 'eval-source-map' : 'none' // На devel режим запускает сурсмапу, на production ничего
};


export function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

export function styles() { 
  return gulp.src(paths.styles.main)
    .pipe(gulpif(argv.dev, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
            cascade: false
        }))
    .pipe(gulpif(argv.dev,sourcemaps.write('.'))) 
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

export function scripts() {
  return gulp.src(paths.scripts.main)
    .pipe(webpack(webConfig))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

export function images() { 
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

export function fonts() { 
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browserSync.stream());
}

export function clean() { 
  return del([paths.delete.dest]);
}

export function _watch() {
  browserSync.init({ 
    server: {
      baseDir: "./build" 
    },
    tunnel: lan
  });

  gulp.watch('./src/**/*.html', html); 
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/scss/**/*.scss', styles);
  gulp.watch('./src/images/**', images);
  // gulp.watch('./src/fonts/**', fonts);
  gulp.watch('./build/**/*.html', browserSync.reload); 

}

export const build =  gulp.series(clean, html, gulp.parallel(styles, scripts, images, fonts))
export const watch = gulp.series(clean, html, gulp.parallel(styles, scripts, images, fonts), _watch)
