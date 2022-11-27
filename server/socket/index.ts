interface Player {
    name: string,
    avatar: string,
    isMaster: boolean,
    score: number,
}

module.exports = (io) => {

    io.on('connection', socket => {
        let localRoomId;
        socket.on('disconnect', () => console.log('disconnected'));

        socket.on('createRoom', async (player: Player) => {
            localRoomId = (Math.floor(Math.random() * 900) + 100).toString();
            await socket.join(localRoomId);
            io.sockets.adapter.rooms.get(localRoomId)["allPlayers"] = [player];
            socket.emit('createRoom', localRoomId);
        });

        socket.on('joinRoom', async ({player, roomId}) => {
            if (!io.sockets.adapter.rooms.get(roomId)) {
                socket.emit("joinRoomError", {
                    error: "notFound",
                    controlName: "gameId",
                });
            } else {
                // Todo: limit room size
                localRoomId = roomId;
                await socket.join(localRoomId);
                const allPlayers = io.sockets.adapter.rooms.get(localRoomId)["allPlayers"];
                if (allPlayers.find((pl) => pl.name === player.name)) {
                    socket.emit("join_room_error", {
                        error: "alreadyTaken",
                        controlName: "name",
                    });
                } else {
                    socket.emit('joinRoom', allPlayers);
                    socket.broadcast.to(localRoomId).emit('playerJoin', player);
                    io.sockets.adapter.rooms.get(localRoomId)["allPlayers"].push(player);
                }
            }
        });

        socket.on('setRound', async ({round}) => {
            socket.broadcast.to(localRoomId).emit('setRound', round);
        });

        socket.on('setSituation', async ({situation}) => {
            socket.broadcast.to(localRoomId).emit('setSituation', situation);
        });

        socket.on('sendAnswer', async (answer) => {
            socket.broadcast.to(localRoomId).emit('sendAnswer', answer);
        });

        socket.on('flipAnswer', async (name) => {
            console.log(name, localRoomId);
            socket.broadcast.to(localRoomId).emit('flipAnswer', name);
        });
    })


}