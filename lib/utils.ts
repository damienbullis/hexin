/**
 * Asserts that the condition is true, otherwise throws an error with the message
 * @param condition If the condition is false, an error will be thrown with the message
 * @param message The message to throw if the condition is false
 */
export function assert<T>(
    condition: unknown,
    message: string
): asserts condition is T {
    if (!condition) {
        throw new Error(message)
    }
}

export function assertNever(x: never): never {
    throw new Error('Unexpected object: ' + x)
}

/**
 * Warning this function will dangerously cast the type of the value to the type T
 * @param _ The value to assert
 */
export function assertType<T>(_: unknown): asserts _ is T {}

export const fg = (color: string, text: string) =>
    `\x1b[38;2;${Bun.color(color, 'ansi')}${text}\x1b[0m`

export function rainbowIntroText() {
    const rainbow = [
        'lightcoral', // red
        'lightsalmon', // orange
        'palegoldenrod', // yellow
        'lightgreen', // green
        'lightskyblue', // blue
        'mediumpurple', // indigo
        'violet', // violet
    ]
    const hexText = `
    __  _________  __ _____   __
   / / / / ____/ |/ //  _/ | / /
  / /_/ / __/  |   / / //  |/ / 
 / __  / /___ /   |_/ // /|  /  
/_/ /_/_____//_/|_/___/_/ |_/   
`

    return hexText
        .split('\n')
        .map((line, x) =>
            line
                .split('')
                .map((char, i) => {
                    const divs = line.length / rainbow.length
                    const offset = 3 - x
                    const color =
                        rainbow[
                            Math.floor(
                                (i - offset < 0 ? i : i - offset) / divs
                            ) % rainbow.length
                        ]
                    assert<string>(color, 'Color should exist')
                    return fg(color, char)
                })
                .join('')
        )
        .join('\n')
}
