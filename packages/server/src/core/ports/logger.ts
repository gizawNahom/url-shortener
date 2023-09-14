export interface Logger {
  logError(error: Error);
  logInfo(message: string, obj?: object);
}
