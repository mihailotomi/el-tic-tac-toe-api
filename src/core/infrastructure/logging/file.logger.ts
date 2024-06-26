import { LoggerService } from "@nestjs/common";
import * as fs from "fs";

export class FileLogger implements LoggerService {
  private readonly stream: fs.WriteStream;

  constructor(private readonly logFile?: string) {
    if (this.logFile) {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      this.stream = fs.createWriteStream(this.logFile, { flags: "a" });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: any, context?: string) {
    this.writeLog("LOG", message, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: any, trace?: string, context?: string) {
    this.writeLog("ERROR", message, context, trace);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: any, context?: string) {
    this.writeLog("WARN", message, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: any, context?: string) {
    this.writeLog("DEBUG", message, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verbose(message: any, context?: string) {
    this.writeLog("VERBOSE", message, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private writeLog(level: string, message: any, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level}]${context ? ` [${context}]` : ""}: ${message}\n`;
    if (this.stream) {
      this.stream.write(logMessage);

      // If there's a trace, also write it to the log
      if (trace) {
        this.stream.write(`${timestamp} [${level}]${context ? ` [${context}]` : ""}: ${trace}\n`);
      }
    } else {
      // If stream is not available, log to console
      console.log(logMessage);
      if (trace) {
        console.log(`${timestamp} [${level}]${context ? ` [${context}]` : ""}: ${trace}\n`);
      }
    }
  }

  onClose() {
    if (this.stream) {
      this.stream.close();
    }
  }
}
