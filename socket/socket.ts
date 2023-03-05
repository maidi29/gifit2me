import {SOCKET_EVENTS} from "../shared/socketEvents";

interface Player {
    name: string,
    avatar: string,
    isMaster: boolean,
    score: number,
}

module.exports = (io) => {

    io.on('connection', socket => {
        let localRoomId;
        let playerName;

        socket.on(SOCKET_EVENTS.CREATE_ROOM, async (player: Player) => {
            localRoomId = (Math.floor(Math.random() * 900) + 100).toString();
            playerName = player.name;
            await socket.join(localRoomId);
            io.sockets.adapter.rooms.get(localRoomId)["allPlayers"] = [player];
            socket.emit(SOCKET_EVENTS.CREATE_ROOM, localRoomId);
        });

        socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({player, roomId}: {player: Player, roomId: string}) => {
            if (!io.sockets.adapter.rooms.get(roomId)) {
                socket.emit(SOCKET_EVENTS.JOIN_ROOM_ERROR, {
                    error: "notFound",
                    controlName: "gameId",
                });
            } else {
                localRoomId = roomId;
                playerName = player.name;

                const connectedSockets = io.sockets.adapter.rooms.get(roomId);
                const socketRooms = Array.from(socket.rooms.values()).filter(
                    (r) => r !== socket.id
                );

                if (socketRooms.length > 9 || (connectedSockets && connectedSockets.size >= 10 )) {
                    socket.emit(SOCKET_EVENTS.JOIN_ROOM_ERROR, {
                        error: "full",
                        controlName: "gameId",
                    });
                } else {
                    await socket.join(localRoomId);
                    const allPlayers = io.sockets.adapter.rooms.get(localRoomId)["allPlayers"];
                    if (io.sockets.adapter.rooms.get(localRoomId)["started"]) {
                        socket.emit(SOCKET_EVENTS.JOIN_ROOM_ERROR, {
                            error: "started",
                            controlName: "gameId",
                        });
                    } else if (allPlayers.find((pl) => pl.name === player.name)) {
                        socket.emit(SOCKET_EVENTS.JOIN_ROOM_ERROR, {
                            error: "alreadyTaken",
                            controlName: "name",
                        });
                    } else {
                        socket.emit(SOCKET_EVENTS.JOIN_ROOM, {players: allPlayers, roomId: localRoomId});
                        socket.broadcast.to(localRoomId).emit(SOCKET_EVENTS.PLAYER_JOIN, player);
                        io.sockets.adapter.rooms.get(localRoomId)["allPlayers"].push(player);
                    }
                }
            }
        });

        socket.on(SOCKET_EVENTS.SET_ROUND, async ({round}) => {
            io.sockets.adapter.rooms.get(localRoomId)["started"] = true;
            socket.broadcast.to(localRoomId).emit(SOCKET_EVENTS.SET_ROUND, round);
        });

        socket.on(SOCKET_EVENTS.SET_SITUATION, async ({situation}) => {
            socket.broadcast.to(localRoomId).emit(SOCKET_EVENTS.SET_SITUATION, situation);
        });

        socket.on(SOCKET_EVENTS.SEND_ANSWER, async (answer) => {
            socket.broadcast.to(localRoomId).emit(SOCKET_EVENTS.SEND_ANSWER, answer);
        });

        socket.on(SOCKET_EVENTS.FLIP_ANSWER, async (name) => {
            socket.broadcast.to(localRoomId).emit(SOCKET_EVENTS.FLIP_ANSWER, name);
        });

        socket.on(SOCKET_EVENTS.CHOOSE_WINNER, async (name) => {
            socket.broadcast.to(localRoomId).emit(SOCKET_EVENTS.CHOOSE_WINNER, name);
        });

        socket.on(SOCKET_EVENTS.UPDATE_MASTER, async (name) => {
            socket.broadcast.to(localRoomId).emit(SOCKET_EVENTS.UPDATE_MASTER, name);
        });

        socket.on(SOCKET_EVENTS.SET_NUMBER_ROUNDS, async (number) => {
            socket.broadcast.to(localRoomId).emit(SOCKET_EVENTS.SET_NUMBER_ROUNDS, number);
        });

        socket.on(SOCKET_EVENTS.PLAYER_LEFT, async (name) => {
            socket.broadcast.to(localRoomId).emit(SOCKET_EVENTS.PLAYER_LEFT, name);
        })

        socket.on('disconnecting', () => {
            const allPlayers = io.sockets.adapter.rooms.get(localRoomId)?.['allPlayers'];
            if(allPlayers) io.sockets.adapter.rooms.get(localRoomId)['allPlayers'] = allPlayers.filter(obj => obj.playerName !== playerName);
            socket.broadcast.in(localRoomId).emit(SOCKET_EVENTS.PLAYER_LEFT, playerName);
        });
    })


}