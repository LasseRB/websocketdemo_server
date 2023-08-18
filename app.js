var $l009i$express = require("express");
var $l009i$http = require("http");
var $l009i$socketio = require("socket.io");


const $0f5df648c4a4cd74$var$Express = $l009i$express();

const $0f5df648c4a4cd74$var$Http = $l009i$http.Server($0f5df648c4a4cd74$var$Express);

const $0f5df648c4a4cd74$var$io = $l009i$socketio($0f5df648c4a4cd74$var$Http, {
    cors: {
        origin: "*",
        methods: [
            "GET",
            "POST"
        ]
    }
});
$0f5df648c4a4cd74$var$Http.listen(3000, ()=>console.log("Lytter p\xe5 3000/demo"));
let $0f5df648c4a4cd74$var$users = new Map();
$0f5df648c4a4cd74$var$io.of("/demo").on("connection", (socket)=>{
    console.log("user connected -> ", socket.id);
    socket.on("disconnect", ()=>{
        $0f5df648c4a4cd74$var$users.delete(socket.id);
        socket.broadcast.emit("user_disconnected -> ", socket.id);
    });
    socket.on("new-warrior", (data)=>{
        const kriger = JSON.parse(data);
        $0f5df648c4a4cd74$var$users.set(kriger.id, kriger);
        // tilbage til afsender
        socket.emit("users", JSON.stringify(Array.from($0f5df648c4a4cd74$var$users.entries())));
        // til alle andre
        socket.broadcast.emit("users", JSON.stringify(Array.from($0f5df648c4a4cd74$var$users.entries())));
    });
    socket.on("mouseMove", (data)=>{
        const koordinater = JSON.parse(data);
        const kriger = $0f5df648c4a4cd74$var$users.get(koordinater.id);
        if (kriger) {
            kriger.position.x = koordinater.x;
            kriger.position.y = koordinater.y;
            $0f5df648c4a4cd74$var$users.set(kriger.id, kriger);
            socket.broadcast.emit("moveMouse", JSON.stringify(kriger));
        }
    });
});


//# sourceMappingURL=app.js.map
