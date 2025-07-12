import express from "express"
import path from "path"
import { WebSocketServer } from "ws"
import { socketsManager } from "./server/constants.js"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = 3000
const wss = new WebSocketServer({ noServer: true })

wss.on("connection", (ws, request) => {
    socketsManager.add(ws, request)
})

const server = app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`)
})

server.on("upgrade", (request, socket, head) => {
    if (socketsManager.sockets.size >= 60) {
        socket.close && socket.close()

        return
    }

    if (request.url === "/ws") {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request)
        })
    } else {
        // console.log(request)
    }
})

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/docs/versions.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "/dist/docs/versions.html"))
})

app.get("/docs/info.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "/dist/docs/info.html"))
})

app.get("/docs/privacy.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "/dist/docs/privacy.html"))
})

app.get("/bundle.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/dist/js/bundle.js"))
})

app.use(express.json())