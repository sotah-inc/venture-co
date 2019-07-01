import gulp from "gulp";
import sass from "gulp-sass";

const stylesGlob = "./styles/*.scss";

const sassTask = () => {
  return gulp
    .src(stylesGlob)
    .pipe(sass())
    .pipe(gulp.dest("./build/styles"));
};

gulp.task("sass", sassTask);

gulp.task("sass:watch", () => gulp.watch(stylesGlob, sassTask));
