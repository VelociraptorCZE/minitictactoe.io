/**
 * MiniTicTacToe.io
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

module.exports = generateField = size => {
    const row = Array(size).fill("");
    for (let i = 0; i < size; i++) {
        row[i] = Array(size).fill("");
    }
    return row;
};