// Log Interfaces
interface Logger {
    debug(message: string, meta?: Record<string, any>): void
    info(message: string, meta?: Record<string, any>): void
    warn(message: string, meta?: Record<string, any>): void
    error(message: string, meta?: Record<string, any>): void
    configure(options: LoggerOptions): void
}

interface LogMessage {
    level: LogLevel
    timestamp: string
    message: string
    meta: Record<string, any> | undefined
}

export interface LogWriter {
    write(log: string): void // Defines how logs are written
}

type LogTimestamp = () => string
type LogFormatter = (log: LogMessage) => string
type LogOutput = {
    output: LogWriter // Writer to output logs
    timestamp?: LogTimestamp // Function to generate timestamps
    formatter?: LogFormatter // Function to format log messages
}

export interface LoggerOptions {
    level: LogLevel // Minimum log level to output
    outputs: LogOutput[]
}

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

class Log implements Logger {
    constructor(private options: LoggerOptions) {}

    private log(
        level: LogLevel,
        message: string,
        meta?: Record<string, any>
    ): void {
        if (this.shouldLog(level)) {
            for (const opt of this.options.outputs) {
                const timestamp = opt.timestamp
                    ? opt.timestamp()
                    : new Date().toISOString()

                const logMessage: LogMessage = {
                    level,
                    timestamp,
                    message,
                    meta,
                }
                const formatted = opt.formatter
                    ? opt.formatter(logMessage)
                    : JSON.stringify(logMessage)

                opt.output.write(formatted)
            }
        }
    }

    debug(message: string, meta?: Record<string, any>): void {
        this.log(LogLevel.DEBUG, message, meta)
    }

    info(message: string, meta?: Record<string, any>): void {
        this.log(LogLevel.INFO, message, meta)
    }

    warn(message: string, meta?: Record<string, any>): void {
        this.log(LogLevel.WARN, message, meta)
    }

    error(message: string, meta?: Record<string, any>): void {
        this.log(LogLevel.ERROR, message, meta)
    }

    configure(options: LoggerOptions): void {
        this.options = { ...this.options, ...options }
    }

    private shouldLog(level: LogLevel): boolean {
        const levels = [
            LogLevel.DEBUG,
            LogLevel.INFO,
            LogLevel.WARN,
            LogLevel.ERROR,
        ]
        return levels.indexOf(level) >= levels.indexOf(this.options.level)
    }
}

export function initLog(config: LoggerOptions): Logger {
    return new Log(config)
}

export function makeLogOutput(output: LogOutput) {
    return output
}
