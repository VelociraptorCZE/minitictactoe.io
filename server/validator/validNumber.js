/**
 * MiniTicTacToe.io
 * Copyright (c) Simon Raichl 2019
 * MIT License
 */

module.exports = getValidNumber = (value, fallbackValue) =>
    typeof value === "number" || (!isNaN(value) && value >= fallbackValue && value <= 50)
        ? +value : value >= 50
        ? 50 : fallbackValue;