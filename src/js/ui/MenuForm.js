/**
 * MiniTicTacToe.io
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

import MiniComponent from "minicomponent";
import getRandomId from "../socket/getRandomId";
import socket from "../socket/io";

export default class MenuForm extends MiniComponent {
    constructor (userData) {
        const initialState = {
            createRoomForm: false,
            joinRoomForm: false
        };
        super(document.body, initialState);
        this.initialState = initialState;
        this.setUserData(userData);
        this.joinGameFromLink();
    }

    setUserData (userData) {
        userData.name = getRandomId();
        this.userData = userData;
    }

    joinGameFromLink () {
        const roomId = location.pathname.match(/(?!\/game\/)\w+$/);
        if (roomId) {
            this.joinRoomOnServer(roomId.toString());
        }
    }

    selectInput ({ target }) {
        target.select();
        document.execCommand("copy");
        const linkCopied = document.getElementById("linkCopied");
        linkCopied.style.display = "block";
        setTimeout(() => {
            linkCopied.style.display = "none";
        }, 2000);
    }

    createRoomOnServer (roomId, fieldSize) {
        socket.emit("createRoom", {
            roomId: roomId,
            fieldSize: fieldSize,
            initialPlayer: this.userData.name
        });
    }

    joinRoomOnServer (roomId) {
        socket.emit("joinRoom", {
            roomId: roomId,
            secondPlayer: this.userData.name
        });
    }

    getGameUrl (roomId = this.roomId) {
        return `${location.origin}/game/${roomId}`;
    }

    setLinkForCurrentGame (roomId = this.roomId) {
        history.replaceState({}, document.title, this.getGameUrl(roomId));
    }

    showCreateRoomForm () {
        this.setState({
            createRoomForm: true,
            joinRoomForm: false
        });
    }

    showJoinRoomForm () {
        this.setState({
            createRoomForm: false,
            joinRoomForm: true
        });
    }

    createRoom () {
        const { value } = document.getElementById("fieldSize");
        this.createRoomOnServer(this.roomId, value);
        this.setLinkForCurrentGame();
    }

    joinRoom () {
        const { value } = document.getElementById("roomId");
        this.setLinkForCurrentGame(value);
        this.joinGameFromLink();
    }

    get menuFormAsHTML () {
        return `
            <div class="menu-container">
                <h2 class="mt0">MiniTicTacToe.io</h2>
                <!--<label for="userNameInput">Name:</label>
                <input type="text" id="userNameInput" class="ui-input">
                <br>-->
                <button onclick="showCreateRoomForm" class="ui-button">Create room</button>
                <button onclick="showJoinRoomForm" class="ui-button">Join room</button>
                <br><br>
                <small>Made with Socket.io, Express and MiniComponent. Simon Raichl &copy; 2019, MIT.</small>
            </div>
        `;
    }

    get createRoomForm () {
        this.roomId = getRandomId();
        return `
            <div class="menu-container">
                <h2 class="mt0">Create room</h2>
                <div>Room ID: <strong>${this.roomId}</strong></div>
                <div>
                    Alternatively you can send link to your friend:
                    <input type="text" onclick="selectInput" class="ui-input" readonly value="${this.getGameUrl()}">
                    <small id="linkCopied">Link copied to clipboard!</small>
                </div>
                <br>
                <label for="fieldSize">Field size (from 3 to 50): </label>
                <input type="number" min="3" max="50" id="fieldSize" class="ui-input" value="3">
                <!--<br><br>
                <label for="requiredLength">Required length to win: </label>
                <input type="number" id="requiredLength" class="ui-input" value="3">-->
                <br>
                <button onclick="createRoom" class="ui-button">Play</button>
            </div>
        `;
    }

    get joinRoomForm () {
        return `
            <div class="menu-container">
                <h2 class="mt0">Join room</h2>
                <label for="userNameInput">Please type in Room ID:</label>
                <input type="text" id="roomId" class="ui-input">
                <br>
                <button onclick="joinRoom" class="ui-button">Play</button>
            </div>
        `;
    }

    render ({ createRoomForm, joinRoomForm }) {
        return createRoomForm
            ? this.createRoomForm : joinRoomForm
            ? this.joinRoomForm : this.menuFormAsHTML;
    }
}