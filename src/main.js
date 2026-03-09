
//create game object
let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: false,
        roundPixels: false
    },
    width: 640,
    height: 480,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    scene: [CardFront, CardBack]
}

let game = new Phaser.Game(config)

let { width, height } = game.config

