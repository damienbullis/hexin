import type { HexinConfig } from './types'

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
    meta?: Record<string, any>
}

interface LogWriter {
    write(log: string): void // Defines how logs are written
}

type LogTimestamp = () => string
type LogFormatter = (log: LogMessage) => string

export interface LoggerOptions {
    level: LogLevel // Minimum log level to output
    outputs: {
        output: LogWriter // List of log output handlers
        timestamp?: LogTimestamp // Function to generate timestamps
        formatter?: LogFormatter // Function to format log messages
    }[]
}

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

// Log Outputs
export class ConsoleLog implements LogWriter {
    write(log: string): void {
        console.log(log)
    }
}
export class FileLog implements LogWriter {
    constructor(private path: string) {}
    write(log: string): void {
        // Write to file
        throw new Error('Method not implemented.')
    }
}
export class NetworkLog implements LogWriter {
    constructor(private url: string) {}
    write(log: string): void {
        // Send to network
        throw new Error('Method not implemented.')
    }
}

// MemoryOutput will modify the logs string passed in.
export class MemoryLog implements LogWriter {
    constructor(private logs: string = '') {}
    write(log: string): void {
        this.logs += log + '\n'
    }
    print(): string {
        return this.logs
    }
}

class Log implements Logger {
    constructor(private options: LoggerOptions) {}

    private log(
        level: LogLevel,
        message: string,
        meta: Record<string, any> = {}
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

const defaultOutput = makeLogOutput({
    output: { write: (log: string) => void console.log(log) },
    timestamp: () => 'time',
    formatter: (log: LogMessage) => {
        return `${log.timestamp} [${log.level}] ${log.message} ${JSON.stringify(
            log.meta
        )}`
    },
})

const defaultOptions: LoggerOptions = {
    level: LogLevel.DEBUG,
    outputs: [defaultOutput],
}

export function initLog(config: Partial<HexinConfig> = {}): Logger {
    if (!config.log_options) {
        config.log_options = defaultOptions
    }
    return new Log(config.log_options)
}

type LoggerOutput = LoggerOptions['outputs'][number]
export function makeLogOutput(output: LoggerOutput) {
    return output
}
