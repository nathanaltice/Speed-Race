// Nathan Altice
// Phaser 3 gamepad example inspired by Taito's Speed Race (1974)
// Portions of code adapted from official Phaser 3 gamepad examples w/ new comments added
// 3/28/23
// car sprites adapted from tokka's Top Down Cars Sprite Pack 1.0: https://tokka.itch.io/top-down-car
// road bg adapted from Alucard's 2D Top Down Highway Background: https://opengameart.org/content/2d-top-down-highway-background
// car horn sfx from hasunier10 https://pixabay.com/sound-effects/car-horn-beepsmp3-14659/

// prevent speeding 🚘
"use strict";

var config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.WEBGL,
    width: 480,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    input: {
        gamepad: true       // let's use gamepads
    },
    scene: [ Play ]
};

// 🌎
let game = new Phaser.Game(config);

let debugText;

const centerX = game.config.width / 2;
const centerY = game.config.height / 2;

let scrollSpeed = 0;
const maxScrollSpeed = 48;
const maxCarVelocity = 250;
const carAcceleration = 750;

let score = 0;