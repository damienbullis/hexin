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

interface LogOutput {
    write(log: string): void // Defines how logs are written
}

export interface LoggerOptions {
    level: LogLevel // Minimum log level to output
    outputs: LogOutput[] // List of log output handlers
    timestampProvider?: () => string // Custom timestamp generator
    format?: (log: LogMessage) => string // Custom log formatter
}

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

// Log Outputs
export class ConsoleLog implements LogOutput {
    write(log: string): void {
        console.log(log)
    }
}
export class FileLog implements LogOutput {
    constructor(private path: string) {}
    write(log: string): void {
        // Write to file
        throw new Error('Method not implemented.')
    }
}
export class NetworkLog implements LogOutput {
    constructor(private url: string) {}
    write(log: string): void {
        // Send to network
        throw new Error('Method not implemented.')
    }
}

// MemoryOutput will modify the logs string passed in.
export class MemoryLog implements LogOutput {
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
            const timestamp = this.options.timestampProvider
                ? this.options.timestampProvider()
                : new Date().toISOString()

            const logMessage: LogMessage = { level, timestamp, message, meta }
            const formatted = this.options.format
                ? this.options.format(logMessage)
                : JSON.stringify(logMessage)

            for (const output of this.options.outputs) {
                output.write(formatted)
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

const defaultOptions: LoggerOptions = {
    level: LogLevel.DEBUG,
    outputs: [new ConsoleLog()],
}

export function initLog(config: Partial<HexinConfig> = {}): Logger {
    if (!config.log_options) {
        config.log_options = defaultOptions
    }
    return new Log(config.log_options)
}
