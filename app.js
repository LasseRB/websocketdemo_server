"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Express = require('express')();
var Http = require('http').Server(Express);
var io = require('socket.io')(Http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
Http.listen(1234, function () { return console.log('Lytter på 1234/demo'); });
var users = new Map();
io.of('/demo').on('connection', function (socket) {
    console.log('user connected -> ', socket.id);
    socket.on('disconnect', function () {
        users.delete(socket.id);
        socket.broadcast.emit('user_disconnected -> ', socket.id);
    });
    socket.on('new-warrior', function (data) {
        var kriger = JSON.parse(data);
        users.set(kriger.id, kriger);
        // tilbage til afsender
        socket.emit('users', JSON.stringify(Array.from(users.entries())));
        // til alle andre
        socket.broadcast.emit('users', JSON.stringify(Array.from(users.entries())));
    });
    socket.on('mouseMove', function (data) {
        var koordinater = JSON.parse(data);
        var kriger = users.get(koordinater.id);
        if (kriger) {
            kriger.position.x = koordinater.x;
            kriger.position.y = koordinater.y;
            users.set(kriger.id, kriger);
            socket.broadcast.emit('moveMouse', JSON.stringify(kriger));
        }
    });
    socket.on('slideChange', function (data) {
        var slide = JSON.parse(data);
        console.log(data);
        var kriger = users.get(slide.id);
        if (kriger && (slide === null || slide === void 0 ? void 0 : slide.slide)) {
            kriger.slide = slide === null || slide === void 0 ? void 0 : slide.slide;
            users.set(kriger.id, kriger);
        }
        socket.broadcast.emit('user_slideChange', JSON.stringify(slide));
    });
});
