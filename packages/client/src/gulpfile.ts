import gulp from "gulp";
import concat from "gulp-concat";
import postcss from "gulp-postcss";
import sass from "gulp-sass";

const stylesGlobs = [
  "./node_modules/normalize.css/normalize.css",
  "./node_modules/purecss/build/pure-min.css",
  "./node_modules/@blueprintjs/core/lib/css/blueprint.css",
  "./node_modules/@blueprintjs/select/lib/css/blueprint-select.css",
  "./styles/*.scss",
];

const sassTask = () => {
  return gulp
    .src(stylesGlobs)
    .pipe(sass())
    .pipe(concat("venture-co.min.css"))
    .pipe(postcss())
    .pipe(gulp.dest("./build/styles"));
};

gulp.task("sass", sassTask);
gulp.task("sass:watch", () => gulp.watch(stylesGlobs, sassTask));
