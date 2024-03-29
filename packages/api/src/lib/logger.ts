import { LoggingWinston } from "@google-cloud/logging-winston";
import logfmt from "logfmt";
import { TransformableInfo } from "logform";
import tripleBeam from "triple-beam";
import { createLogger, format, Logger, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

interface ILoggerOptions {
  level: string;
  isGceEnv: boolean;
  logsDir: string | null;
}

const defaultLoggerOptions: ILoggerOptions = {
  level: "warn",
  isGceEnv: false,
  logsDir: null,
};

interface ILogMessage {
  // required by winston
  level: string;
  [tripleBeam.LEVEL]: string;
  message: string;
  [tripleBeam.MESSAGE]: string;

  // etc
  [key: string]: unknown;
}

const fieldBlacklist = ["level", tripleBeam.LEVEL, "message", tripleBeam.MESSAGE];

const transform = format(
  (info: TransformableInfo): TransformableInfo => {
    const result: ILogMessage = {
      // required by winston
      message: info.message,
      [tripleBeam.MESSAGE]: info.message,
      level: info.level,
      [tripleBeam.LEVEL]: info.level,

      // etc
      ...Object.keys(info)
        .filter(v => !fieldBlacklist.includes(v))
        .reduce((fieldsResult, v) => {
          return {
            ...fieldsResult,
            [v]: info[v],
          };
        }, {}),
    };

    return {
      ...info,
      [tripleBeam.MESSAGE]: logfmt.stringify(result),
    };
  },
);

export function getLogger(opts?: ILoggerOptions): Logger {
  const settings: ILoggerOptions = (() => {
    if (typeof opts === "undefined") {
      return { ...defaultLoggerOptions };
    }

    return { ...defaultLoggerOptions, ...opts };
  })();
  const { level, isGceEnv, logsDir } = settings;

  const loggerTransports = (() => {
    const out = [];
    out.push(new transports.Console({ level, format: format.json() }));

    if (isGceEnv) {
      out.push(new LoggingWinston({ level }));
    }

    if (logsDir) {
      out.push(
        new DailyRotateFile({
          level,
          filename: `${logsDir}/app-%DATE%.log`,
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          createSymlink: true,
          format: transform(),
        }),
      );
    }

    return out;
  })();

  return createLogger({
    level: settings.level,
    transports: loggerTransports,
  });
}
