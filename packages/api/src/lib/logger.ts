import { LoggingWinston } from "@google-cloud/logging-winston";
import { UnixTimestamp } from "@sotah-inc/core";
import { TransformableInfo } from "logform";
import tripleBeam from "triple-beam";
import { format, createLogger, Logger, transports } from "winston";
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
  fields: Record<string, unknown>;
  name: string;
  timestamp: UnixTimestamp;
  level: string;
  message: string;
}

const fieldBlacklist = [
  "message",
  "level",
  tripleBeam.LEVEL,
  tripleBeam.MESSAGE,
  tripleBeam.SPLAT,
];

const transform = format(
  (info: TransformableInfo): TransformableInfo => {
    // eslint-disable-next-line no-console
    console.log("transform() info", { info, infoType: typeof info });

    const result: ILogMessage = {
      name: "sotah-api",
      timestamp: new Date().getTime() / 1000,
      level: info.level,
      message: info.message,
      fields: Object.keys(info)
        .filter(v => !fieldBlacklist.includes(v))
        .reduce((fieldsResult, v) => {
          return {
            ...fieldsResult,
            [v]: info[v],
          };
        }, {}),
    };
    // eslint-disable-next-line no-console
    console.log("transform() result", { result });

    return result;
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
    out.push(new transports.Console({ level }));

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
        }),
      );
    }

    return out;
  })();

  return createLogger({
    format: format.combine(
      format.json(),
      transform(),
    ),
    level: settings.level,
    transports: loggerTransports,
  });
}
