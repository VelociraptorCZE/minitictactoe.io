/**
 * MiniTicTacToe.io
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

import MiniComponent from "minicomponent";
import MenuForm from "./MenuForm";
import socket from "../socket/io";

export default class Playfield extends MiniComponent {
    constructor (userData) {
        super(document.body, {
            field: [],
            currentPlayer: 'o',
            userData: userData
        });

        this.menuForm = new MenuForm(userData);
        this.socketListeners();
    }

    socketListeners () {
        socket.on("updateField", data => {
            try {
                const { winner, field } = data;
                const fieldAsString = field.join("").replace(/,/g, "");
                if (winner || fieldAsString.length === Math.pow(field.length, 2)) {
                    setTimeout(() => {
                        alert(winner ? `Player ${winner} has won!` : "Game is tied!");
                        this.gameOver();
                    }, 50);
                }
                this.setState(data);
            }
            catch {}
        });

        socket.on("opponentLeft", () => {
            alert("Your opponent left this game.");
            this.gameOver();
        });
    }

    gameOver () {
        const { menuForm, state: { roomId } } = this;
        socket.emit("removeRoom", roomId);
        history.replaceState({}, document.title, "/");
        menuForm.setState(menuForm.initialState);
    }

    updateField () {
        const { field, currentPlayer, roomId } = this.state;

        socket.emit("updateField", {
            field: field,
            currentPlayer: currentPlayer,
            roomId: roomId
        });
    }

    pickCell ({ target }) {
        const { field, currentPlayer, activePlayer, winner, userData: { name } } = this.state;

        if (activePlayer !== name || winner) {
            return false;
        }

        try {
            const [x, y] = target.dataset.coords.split(",").map(Number);
            if (field[x][y] === "") {
                field[x][y] = currentPlayer;
            }
        }
        catch {
            return false;
        }

        this.updateField();
        this.setState({ field: field });
    }

    pickCellOnEnter (e) {
        if (e.key === "Enter") {
            this.pickCell(e);
        }
    }

    render ({ field }) {
        return `
        <div class="field-area">
            ${field.length ? field.map((row, rowIndex) => `
            <div>
                ${row.map((cell, cellIndex) => `
                    <div class="field-cell"
                         tabindex="1"
                         onkeydown="pickCellOnEnter"
                         onclick="pickCell"
                         data-coords="${rowIndex},${cellIndex}">
                         
                        ${cell !== "" ?
                        `<div class="field-cell__mark">
                            ${cell}
                        </div>`
                        : ""}
                    </div>
                `).join("")}
            </div>
        `).join("") : "Loading..."}
        </div>
        `;
    }
}
