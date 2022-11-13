interface Player {
    name: string,
    avatar: string,
    isMaster: boolean,
    score: number,
}

module.exports = (io) => {

    io.on('connection', socket => {
        let roomId;
        socket.on('disconnect', () => console.log('disconnected'));

        socket.on('createRoom', async (player: Player) => {
            roomId = (Math.floor(Math.random() * 900) + 100).toString();
            await socket.join(roomId);
            io.sockets.adapter.rooms.get(roomId)["allPlayers"] = [player];
            socket.emit('createRoom', roomId);
        });

        socket.on('joinRoom', async ({player, roomId}) => {
            await socket.join(roomId);
            const allPlayers = io.sockets.adapter.rooms.get(roomId)["allPlayers"];
            if (allPlayers.find((pl)=>pl.name === player.name)) {
                socket.emit("join_room_error", {
                    error: "playerNameAlreadyTaken",
                });
            } else {
                socket.emit('joinRoom', allPlayers);
                socket.broadcast.to(roomId).emit('playerJoin', player);
                io.sockets.adapter.rooms.get(roomId)["allPlayers"].push(player);
            }
        });

        socket.on('setRound', async ({round}) => {
            socket.broadcast.to(roomId).emit('setRound', round);
        });

        socket.on('setSituation', async ({situation}) => {
            socket.broadcast.to(roomId).emit('setSituation', situation);
        })
    })


}