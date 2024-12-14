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
    return smj(hexText, '\n', (line, x) =>
        smj(line, '', (char, i) => {
            const divs = line.length / rainbow.length
            const offset = 3 - x
            const color =
                rainbow[Math.floor((i - offset < 0 ? i : i - offset) / divs) % rainbow.length]
            if (!color) return char
            return fg(color, char)
        })
    )
}

type MapFn<T> = Parameters<Array<T>['map']>['0']

/**
 * ### Split Map Join
 * @param str The string to split
 * @param match The string to split/join by
 * @param map The function to map the split strings
 * @returns the joined mapped string
 */
function smj(str: string, match: string, map: MapFn<string>): string {
    return str.split(match).map(map).join(match)
}
