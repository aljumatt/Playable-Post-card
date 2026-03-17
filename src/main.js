
//create game object
let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: false,
        roundPixels: false
    },
    width: 640,
    height: 480,
    backgroundColor: '#ffffff',
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
    scene: [LoaderScene, CardFront1, CardFront2, CardBack]
}

let game = new Phaser.Game(config)

let { width, height } = game.config

