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
        })

        socket.on('joinRoom', async ({player, roomId}) => {
            await socket.join(roomId);
            const allPlayers = io.sockets.adapter.rooms.get(roomId)["allPlayers"];
            socket.emit('joinRoom', allPlayers);
            io.sockets.adapter.rooms.get(roomId)["allPlayers"].push(player);
        })
    })


}