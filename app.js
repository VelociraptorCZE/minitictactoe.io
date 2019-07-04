/**
 * MiniTicTacToe.io
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

const compression = require("compression");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const generateField = require("./server/field/fieldGenerator");
const getWinner = require("./server/field/checkWinner");
const getValidNumber = require("./server/validator/validNumber");

const getFieldByRoomId = roomId => fields.get(roomId);
const setFieldByRoomId = (roomId, newField) => fields.set(roomId, newField);
const fields = new Map;
const players = {};

app.use(compression());
app.use(express.static(`${__dirname}/public`));

const appPage = (_, resource) => {
    resource.sendFile(`${__dirname}/app.html`);
};

app.get("/", appPage);
app.get("/game/:id", appPage);
app.get("*", (_, resource) => {
    resource.sendFile(`${__dirname}/404.html`);
});

io.on("connection", socket => {
    const removeRoomCallback = roomId => {
        socket.leave(roomId);
        fields.delete(roomId);
        delete players[roomId];
    };

    const joinRoomCallback = ({ roomId, firstPlayer, secondPlayer }) => {
        socket.join(roomId);

        socket.on("disconnect", () => {
            socket.broadcast.in(roomId).emit("opponentLeft");
            removeRoomCallback(roomId);
        });

        if (firstPlayer) {
            players[roomId] = { x: firstPlayer };
        }

        if (secondPlayer && players[roomId] && !players[roomId].o) {
            players[roomId].o = secondPlayer;
        }

        io.to(roomId).emit("updateField", {
            field: getFieldByRoomId(roomId),
            activePlayer: firstPlayer || secondPlayer,
            roomId: roomId
        });
    };

    socket.on("createRoom", ({ roomId, fieldSize, initialPlayer }) => {
        fields.set(roomId, generateField(getValidNumber(fieldSize, 3)));
        joinRoomCallback({ roomId: roomId, firstPlayer: initialPlayer });
    });

    socket.on("joinRoom", joinRoomCallback);

    socket.on("updateField", ({ field, currentPlayer, roomId }) => {
        setFieldByRoomId(roomId, field);
        field = getFieldByRoomId(roomId);
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        const playersInRoom = players[roomId];

        io.to(roomId).emit("updateField", {
            field: field,
            currentPlayer: currentPlayer,
            winner: getWinner(field, field.length < 5 ? field.length : 5),
            activePlayer: playersInRoom && playersInRoom[currentPlayer]
        });
    });

    socket.on("removeRoom", removeRoomCallback);
});

http.listen(process.env.PORT || 3333);