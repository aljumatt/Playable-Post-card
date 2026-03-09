class CardBack extends Phaser.Scene {
    constructor() {
        super('cardBackScene')
    }


    create() {
        this.cardImg = this.add.sprite(width/2, height/2, 'cardBackImg')
    }
}