import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4040 });

// let usercount = 0;
// let allsocket: WebSocket[] = [];

// wss.on("connection", (socket) => {
//   console.log(`User connected number: ${usercount}`);
//   usercount = usercount + 1;
//   allsocket.push(socket);

//   socket.on("message", (msg) => {
//     console.log("Message received" + msg.toString());
//     // TODO: this send only to that user who send the message
//     // socket.send(msg.toString() + " sent from server");

//     // TODO: to all (1)
//     // for (let i = 0; i < allsocket.length; i++) {
//     //   const s = allsocket[i];
//     //   s.send(msg.toString() + " sent from server");
//     // }
//     allsocket.forEach((s) => {
//       s.send(msg.toString() + " sent from server");
//     });

//     socket.on("disconnect", () => {
//       usercount = usercount - 1;
//       allsocket = allsocket.filter((s) => s !== socket);
//     });
//   });
// });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  socket.on("message", (msg) => {
    // convert string inot object as websocket send only string
    const data = JSON.parse(msg as unknown as string);
    if (data.type === "join") {
      allSockets.push({
        socket,
        room: data.payload.roomId,
      });
    }

    if (data.type === "chat") {
      const currentUserRoom = allSockets.find((s) => s.socket === socket);
      if (currentUserRoom) {
        const sameRoomUser = allSockets.filter(
          (u) => u.room === currentUserRoom.room
        );
        sameRoomUser.forEach((s) => {
          s.socket.send(data.payload.message);
        });
      }
    }
  });
});
