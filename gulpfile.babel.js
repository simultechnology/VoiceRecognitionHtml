import gulp from 'gulp'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import flexBugsFixes from 'postcss-flexbugs-fixes'
import cssWring from 'csswring'
import ejs from 'gulp-ejs'
import htmlmin from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminMozjpeg from 'imagemin-mozjpeg'
import fs from 'fs'
import browserSync from 'browser-sync'
import webpackStream from 'webpack-stream'
import webpack from 'webpack'

const autoprefixerOption = {
  grid: true
}
const postcssOption = [
  flexBugsFixes,
  autoprefixer(autoprefixerOption),
  cssWring
]

gulp.task('sass', (done) => {
  return gulp.src('./src/sass/**')
    .pipe(sass())
    .pipe(postcss(postcssOption))
    .pipe(gulp.dest('./dist/css/'))
})

const imageminOption = [
  imageminPngquant({ quality: '65-80' }),
  imageminMozjpeg({ quality: 80 }),
  imagemin.gifsicle(),
  imagemin.jpegtran(),
  imagemin.optipng(),
  imagemin.svgo()
]

gulp.task('imagemin', () => {
  return gulp
    .src('./src/images/*')
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('./dist/images'))
})

const configJsonData = fs.readFileSync('./src/ejs/config.json')
const configObj = JSON.parse(configJsonData)
// ejsのデータ読み込み設定
const ejsDataOption = {
  config: configObj
}

// ejsのコンパイル設定用のオブジェクト
const ejsSettingOption = {
  ext: '.html'
}

// htmlminの設定
const htmlminOption = {
  collapseWhitespace: true
}

// ejsをコンパイルするタスク
gulp.task('ejs', () => {
  return gulp
    .src('./src/html/*.ejs')
    .pipe(ejs(ejsDataOption, {}, ejsSettingOption))
    .pipe(htmlmin(htmlminOption))
    .pipe(gulp.dest('./dist'))
})

const browserSyncOption = {
  server: './dist',
  port: 30000,
  directory: true
}

gulp.task('serve', (done) => {
  browserSync.init(browserSyncOption)
  done()
})

gulp.task('watch', (done) => {
  gulp.watch('./src/sass/**/*.scss', gulp.series('sass'))
  gulp.watch('./src/html/**/*.ejs', gulp.series('ejs'))
  gulp.watch('./src/images/**/**', gulp.series('imagemin'))
  const browserReload = (done) => {
    console.log('reload!')
    browserSync.reload()
    done()
  }
  gulp.watch('./dist/**/*', browserReload)
})

// webpackの設定ファイルの読み込み
const webpackConfig = require('./webpack.config')

gulp.task('webpack', () => {
  return webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest('dist/js'))
})

gulp.task('default', gulp.parallel(
  'imagemin',
  'webpack',
  gulp.series(
    gulp.parallel('sass', 'ejs'),
    'serve', 'watch')))
