/**
 * MiniTicTacToe.io
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

import Playfield from "./ui/Playfield";

const userData = {
    name: ""
};

addEventListener("DOMContentLoaded", () => {
    new Playfield(userData);
});