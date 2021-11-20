import { LoggingWinston } from "@google-cloud/logging-winston";
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
        }),
      );
    }

    return out;
  })();

  return createLogger({
    format: format.timestamp(),
    level: settings.level,
    transports: loggerTransports,
  });
}
