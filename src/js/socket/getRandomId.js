/**
 * MiniTicTacToe.io
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

export default function getRandomId () {
    const minCharCode = 65, maxCharCode = 90;
    let id = "";
    for (let i = 0; i < 11; i++) {
        const generateRandomNumber = !!Math.round(Math.random());
        if (generateRandomNumber) {
            id += Math.round(Math.random() * 9)
        }
        else {
            const randomCharId = minCharCode + Math.round(Math.random() * (maxCharCode - minCharCode));
            id += String.fromCharCode(randomCharId);
        }
    }
    return id;
}