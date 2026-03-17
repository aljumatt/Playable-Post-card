class CardBack extends Phaser.Scene {
    constructor() {
        super('cardBackScene')
    }


    create() {
        //spawn postcard
        this.cardImg = this.add.sprite(width/2, height/2, 'cardBackImg')
        
        //spawn flip over button
        this.flipButton = this.add.image(width-width/8, height-height/6, 'flipButton')
        this.flipButton.setInteractive()
        this.flipButton.on('pointerdown', () => {
            //do interaction
            this.scene.start('cardFrontScene1')
        })
    }
}