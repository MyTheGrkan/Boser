import { Server } from 'socket.io';

export default function (req, res) {
  if (!res.socket.server.io) {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);

    io.on('connection', socket => {
      console.log('Yeni kullanıcı bağlandı');
      
      socket.on('join', ({ username, room }) => {
        socket.join(room);
        socket.emit('message', {
          user: 'Sistem',
          text: `${username}, ${room} odasına hoş geldiniz!`
        });
      });

      socket.on('sendMessage', ({ message, room }) => {
        io.to(room).emit('message', {
          user: socket.id,
          text: message
        });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}