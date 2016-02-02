# ==============================
# node-v v0.12.3
# ==============================


# 開発ディレクトリ
SRC_DIR = './src'

# 公開ディレクトリ
PUBLISH_DIR = "../htdocs";

gulp = require('gulp');

# gulp-系
$ = require('gulp-load-plugins')();

# browserify
browserify = require('browserify');
source = require('vinyl-source-stream');



# -------------------------------------------------------------------
# coffee
# -------------------------------------------------------------------
gulp.task 'coffee', ->
  browserify({
    entries: [SRC_DIR + '/coffee/Main.coffee']
    extensions: ['.coffee', '.js']})
      .bundle()
      .pipe(source('main.js'))
      .pipe(gulp.dest(PUBLISH_DIR + '/assets/js/'))



# -------------------------------------------------------------------
# connect
# -------------------------------------------------------------------
gulp.task 'connect', ->
  $.connect.server({
    root: PUBLISH_DIR
    port:50000})



# -------------------------------------------------------------------
# watch
# coffee,ejsファイルを監視
# -------------------------------------------------------------------
gulp.task 'watch', ->
  gulp.watch([SRC_DIR + '/**/*.coffee'], ['coffee'])



# -------------------------------------------------------------------
# task設定
# -------------------------------------------------------------------
gulp.task('default', ['coffee', 'watch', 'connect']);






























