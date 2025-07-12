import { decode, encode } from "msgpack-lite"
import eventsList from "./eventsList.js"

let encodeInt = -912
let getEncodeIntIndex = 67.25

const fourInt = Math.floor(Math.sqrt(eval(`(${getEncodeIntIndex} >> 2) / 2 * 3`)))
const setupGameEvent = (1).toString().repeat(fourInt - 1)
const disconnectEvent = (getEncodeIntIndex + 13) * fourInt
const pingResponseEvent = (getEncodeIntIndex + 5) * fourInt
const pingEvent = 134.5

function parseType(type) {
    return type.toString()
}

class Socket {
    constructor() {
        this.uid = null
        this.socket = null

        this.lastPacket = null
        this.lastSent = null
        this.lastPingSent = null

        this.ping = 0
    }

    get isReady() {
        return this.socket?.readyState === 1
    }

    on(event, callback) {
        if (!this.socket) return

        this.socket.addEventListener(event, callback)
    }

    send(type) {
        if (!this.isReady) return

        type = parseType(type)

        const data = Array.prototype.slice.call(arguments, 1)

        let binary = encode([ type, data ])

        for (let i = 0; i < type.length + 2; i++) {
            binary[i] += encodeInt * (4515.5 * 2 + 100)
        }

        this.socket.send(binary)
    }

    onMessage(event) {
        const binary = new Uint8Array(event.data)
        const parsed = decode(binary)

        /*if (parsed[0] !== "458") {
            console.log(parsed)
        }*/

        if (parsed[0] === setupGameEvent) {
            this.uid = parsed[1][0]

            encodeInt = parsed[1][getEncodeIntIndex * fourInt]
        }
        
        if (+parsed[0] === pingResponseEvent) {
            this.ping = parseInt(Date.now() - this.lastPingSent)
        } else {
            eventsList[parseInt(parsed[0]) / fourInt](parsed[1])
        }

        if (!this.lastPingSent || Date.now() - this.lastPingSent >= 2000) {
            this.send(pingEvent * fourInt)

            this.lastPingSent = Date.now()
        }

        this.lastPacket = parsed
        this.lastSent = Date.now()
    }

    onClose() {
        if (!this.lastPacket) return

        if ((parseInt(this.lastPacket[0]) / fourInt) === (disconnectEvent / fourInt)) return
        
        eventsList[disconnectEvent / fourInt]()
    }

    connect(url) {
        this.socket = new WebSocket(url)

        this.socket.binaryType = "arraybuffer"

        this.on("message", this.onMessage.bind(this))
        this.on("close", this.onClose.bind(this))
    }
}

export default Socket