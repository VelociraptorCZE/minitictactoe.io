/**
 * MiniTicTacToe.io
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

const coords = require("./coords");

function getWinner (field, requiredLength) {
    for (let rowIndex = 0; rowIndex < field.length; rowIndex++) {
        const row = field[rowIndex];
        for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
            const result = getResults(field, cellIndex, rowIndex, requiredLength);
            if (result) {
                return result;
            }
        }
    }
}

function getResults (field, cellIndex, rowIndex, requiredLength) {
    const currentCell = field[rowIndex][cellIndex];

    for (const { x, y } of coords) {
        let desiredLength = 0;
        for (let i = 0; i < requiredLength; i++) {
            const row = field[getIndex(rowIndex, x, i)];
            if (row && row[getIndex(cellIndex, y, i)] === currentCell) {
                desiredLength++;
            }
            if (desiredLength === requiredLength) {
                return currentCell;
            }
        }
    }

    return false;
}

function getIndex (index, move, i) {
    return move === 0 ? index : index + move * i;
}

module.exports = getWinner;