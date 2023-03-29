// Nathan Altice
// Gamepad example
// Code adapted from official Phaser 3 Gamepad examples
// 3/28/23
// car sprites adapted from tokka's Top Down Cars Sprite Pack 1.0: https://tokka.itch.io/top-down-car
// road bg adapted from Alucard's 2D Top Down Highway Background: https://opengameart.org/content/2d-top-down-highway-background

var config = {
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
        gamepad: true
    },
    scene: [ Play ]
};


let game = new Phaser.Game(config);

let text;

const centerX = game.config.width / 2;
const centerY = game.config.height / 2;

const baseScrollSpeed = 0;
const maxScrollSpeed = 48;
let scrollSpeed = 0;
const maxCarVelocity = 250;
const carAcceleration = 750;