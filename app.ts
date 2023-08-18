const Express = require("express")();
const Http = require("http").Server(Express);
const io = require("socket.io")(Http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
import { Kriger } from '../lib'

Http.listen(3000, () => console.log('Lytter på 3000/demo'))
let users= new Map<string, Kriger>()

io.of('/demo').on("connection", (socket) => {
    console.log('user connected -> ', socket.id)

    socket.on('disconnect', () => {
        users.delete(socket.id)
        socket.broadcast.emit("user_disconnected -> ", socket.id)
    })

    socket.on('new-warrior', (data) => {
        const kriger = JSON.parse(data) as Kriger
        users.set(kriger.id , kriger);
        // tilbage til afsender
        socket.emit('users', JSON.stringify(Array.from(users.entries())))
        // til alle andre
        socket.broadcast.emit('users', JSON.stringify(Array.from(users.entries())))
    })

    socket.on('mouseMove', (data) => {
        const koordinater = JSON.parse(data);
        const kriger = users.get(koordinater.id)
        if (kriger) {
            kriger.position.x = koordinater.x
            kriger.position.y = koordinater.y
            users.set(kriger.id, kriger)
            socket.broadcast.emit('moveMouse', JSON.stringify(kriger));
        }
    })
});
