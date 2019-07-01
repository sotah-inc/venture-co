import gulp from "gulp";
import concat from "gulp-concat";
import postcss from "gulp-postcss";
import sass from "gulp-sass";

const stylesGlob = "./styles/*.scss";

const sassTask = () => {
  return gulp
    .src(stylesGlob)
    .pipe(sass())
    .pipe(concat("venture-co.min.css"))
    .pipe(postcss())
    .pipe(gulp.dest("./build/styles"));
};

gulp.task("sass", sassTask);

gulp.task("sass:watch", () => gulp.watch(stylesGlob, sassTask));
