export interface DefaultLoggingOptions {
  useFile: false;
}

export interface FileLoggingOptions {
  useFile: true;
  filePath: string;
}

export type LoggingOptions = DefaultLoggingOptions | FileLoggingOptions;
