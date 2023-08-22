const Express = require('express')();
const Http = require('http').Server(Express);
const io = require('socket.io')(Http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
import { Kriger } from './lib';

Http.listen(1234, () => console.log('Lytter på 1234/demo'));
let users = new Map<string, Kriger>();

io.of('/demo').on('connection', (socket: any) => {
  console.log('user connected -> ', socket.id);

  socket.on('disconnect', () => {
    users.delete(socket.id);
    socket.broadcast.emit('user_disconnected -> ', socket.id);
  });

  socket.on('new-warrior', (data: any) => {
    const kriger = JSON.parse(data) as Kriger;
    users.set(kriger.id, kriger);
    // tilbage til afsender
    socket.emit('users', JSON.stringify(Array.from(users.entries())));
    // til alle andre
    socket.broadcast.emit('users', JSON.stringify(Array.from(users.entries())));
  });

  socket.on('mouseMove', (data:any) => {
    const koordinater = JSON.parse(data);
    const kriger = users.get(koordinater.id);
    if (kriger) {
      kriger.position.x = koordinater.x;
      kriger.position.y = koordinater.y;
      users.set(kriger.id, kriger);
      socket.broadcast.emit('moveMouse', JSON.stringify(kriger));
    }
  });

  socket.on('slideChange', (data: any) => {
    const slide = JSON.parse(data)
    console.log(data)
    const kriger = users.get(slide.id);
    if (kriger && slide?.slide) {
      kriger.slide = slide?.slide
      users.set(kriger.id, kriger);
    }
    socket.broadcast.emit('user_slideChange', JSON.stringify(slide));
  });

});
