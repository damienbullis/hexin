import { makeEngine } from './lib'
import { otherSystem } from './lib/system'
import { rainbowIntroText } from './lib/utils'

console.log(rainbowIntroText())

const engine = makeEngine()
console.log('system1')
engine.systems.addSystem(['OtherSystem', otherSystem])

console.log('Engine started!', engine)

console.log('Finished!')
// thursday 10am 12pm 4pm
