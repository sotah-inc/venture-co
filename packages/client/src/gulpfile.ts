import gulp from "gulp";
import concat from "gulp-concat";
import postcss from "gulp-postcss";
import sass from "gulp-sass";

const stylesGlob = "./styles/*.scss";

const sassTask = () => {
  return gulp
    .src([
      stylesGlob,
      "./node_modules/@blueprintjs/core/lib/css/blueprint.css",
      "./node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css",
      "./node_modules/@blueprintjs/select/lib/css/blueprint-select.css",
    ])
    .pipe(sass())
    .pipe(concat("venture-co.min.css"))
    .pipe(postcss())
    .pipe(gulp.dest("./build/styles"));
};

gulp.task("sass", sassTask);
gulp.task("sass:watch", () => gulp.watch(stylesGlob, sassTask));
