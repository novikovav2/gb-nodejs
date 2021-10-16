const socket = require('socket.io')
const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((request, response) => {
    const indexPath = path.join(__dirname, 'index.html')
    const readStream = fs.createReadStream(indexPath)

    readStream.pipe(response)
})

const messages = []
let clientCount = 0

const io = socket(server)
io.on('connection', client => {
    const notificationToAll = (msg) => {
        payload = {
            msg: msg,
            clientCount: clientCount
        }
        client.broadcast.emit('notification-to-all', payload)
    }

    clientCount++
    notificationToAll(`Client ${client.id} connected`)

    client.emit('initial-state', {messages: messages, clientCount: clientCount})

    client.on('client-msg', ({ message }) => {
        const data = {
            client: client.id,
            message: message
        }
        messages.push(data)
        client.broadcast.emit('new-message', messages)
        client.emit('new-message', messages)
    })

    client.on("disconnect", (reason) => {
        clientCount--
        notificationToAll(`Client ${client.id} disconnected. Reason: ${reason}`)
    })
})

server.listen(3000)
