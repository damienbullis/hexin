import type { LogWriter } from '.'

// Log Outputs
export class ConsoleLog implements LogWriter {
    write(log: string): void {
        console.log(log)
    }
}
// export class FileLog implements LogWriter {
//     constructor(private path: string) {}
//     write(log: string): void {
//         // Write to file
//         throw new Error('Method not implemented.')
//     }
// }
// export class NetworkLog implements LogWriter {
//     constructor(private url: string) {}
//     write(log: string): void {
//         // Send to network
//         throw new Error('Method not implemented.')
//     }
// }

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
